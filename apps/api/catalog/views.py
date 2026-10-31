from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema

from .models import (
    Tax,
    PaymentTerm,
    Attribute,
    AttributeValue,
    Product,
    ProductVariant,
    QuotationTemplate,
    QuotationTemplateLine,
    Quotation,
    QuotationLine,
)
from .serializers import (
    TaxSerializer,
    PaymentTermSerializer,
    AttributeSerializer,
    AttributeValueSerializer,
    ProductSerializer,
    ProductVariantSerializer,
    QuotationTemplateSerializer,
    QuotationTemplateLineSerializer,
    QuotationSerializer,
    CreateQuotationFromTemplateSerializer,
)
from .services import QuotationService
from subscriptions.serializers import SubscriptionSerializer
from common.permissions import IsAdminOrStaffReadOnly, IsCustomerOrStaff
from customers.models import Customer


class TaxViewSet(viewsets.ModelViewSet):
    """
    Tax rates and GST classifications (Admin writes only, Staff read-only).
    """
    queryset = Tax.objects.all().order_by("name")
    serializer_class = TaxSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrStaffReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["kind", "is_active"]
    search_fields = ["name"]


class PaymentTermViewSet(viewsets.ModelViewSet):
    """
    Payment terms and due day intervals (Admin writes only, Staff read-only).
    """
    queryset = PaymentTerm.objects.all().order_by("due_days")
    serializer_class = PaymentTermSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrStaffReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]


class AttributeViewSet(viewsets.ModelViewSet):
    """
    Product variant attributes (e.g. Brand, Storage, Seats).
    """
    queryset = Attribute.objects.prefetch_related("values").all().order_by("name")
    serializer_class = AttributeSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrStaffReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]


class AttributeValueViewSet(viewsets.ModelViewSet):
    """
    Attribute values with pricing surcharges (e.g. Brand=Odoo +560.00).
    """
    queryset = AttributeValue.objects.select_related("attribute").all().order_by("attribute__name", "name")
    serializer_class = AttributeValueSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrStaffReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["attribute"]
    search_fields = ["name", "attribute__name"]


class ProductVariantViewSet(viewsets.ModelViewSet):
    """
    Configured product variants.
    """
    queryset = ProductVariant.objects.select_related("product").prefetch_related("attribute_values").all()
    serializer_class = ProductVariantSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrStaffReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["product"]
    search_fields = ["sku", "product__name"]


class ProductViewSet(viewsets.ModelViewSet):
    """
    Products and services catalog (Admin writes only, Staff read-only).
    """
    queryset = Product.objects.prefetch_related("taxes", "attributes", "variants__attribute_values").all().order_by("name")
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrStaffReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["type", "is_active"]
    search_fields = ["name", "notes"]
    ordering_fields = ["sales_price", "name", "created_at"]


class QuotationTemplateViewSet(viewsets.ModelViewSet):
    """
    Pre-configured quotation templates for subscription packages.
    """
    queryset = QuotationTemplate.objects.select_related("plan", "payment_term").prefetch_related(
        "lines__product", "lines__variant"
    ).all().order_by("name")
    serializer_class = QuotationTemplateSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrStaffReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "plan__name"]


class QuotationViewSet(viewsets.ModelViewSet):
    """
    Quotation management, template instantiations, and subscription conversions.
    """
    queryset = Quotation.objects.select_related(
        "customer", "template", "plan", "payment_term", "subscription"
    ).prefetch_related("lines__taxes", "lines__product", "lines__variant").all().order_by("-created_at")
    serializer_class = QuotationSerializer
    permission_classes = [permissions.IsAuthenticated, IsCustomerOrStaff]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "customer", "plan"]
    search_fields = ["quotation_number", "customer__company_name"]
    ordering_fields = ["created_at", "total_amount", "validity_date"]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Quotation.objects.none()
        if user.is_staff or user.is_superuser:
            return self.queryset
        customer = getattr(user, "customer_profile", None)
        if not customer:
            return Quotation.objects.none()
        return self.queryset.filter(customer=customer)

    @extend_schema(request=CreateQuotationFromTemplateSerializer, responses={201: QuotationSerializer})
    @action(detail=False, methods=["post"])
    def create_from_template(self, request):
        """
        Creates a new draft Quotation from a QuotationTemplate.
        """
        serializer = CreateQuotationFromTemplateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        template_id = serializer.validated_data["template_id"]
        customer_id = serializer.validated_data.get("customer_id")

        try:
            template = QuotationTemplate.objects.get(id=template_id)
        except QuotationTemplate.DoesNotExist:
            raise NotFound(detail="Quotation template not found.")

        user = request.user
        if user.is_staff or user.is_superuser:
            if not customer_id:
                raise NotFound(detail="customer_id is required when creating quotation as staff.")
            try:
                customer = Customer.objects.get(id=customer_id)
            except Customer.DoesNotExist:
                raise NotFound(detail="Customer not found.")
        else:
            customer = getattr(user, "customer_profile", None)
            if not customer:
                raise NotFound(detail="Customer profile not found.")

        quotation = QuotationService.create_from_template(template=template, customer=customer)
        return Response(QuotationSerializer(quotation).data, status=status.HTTP_201_CREATED)

    @extend_schema(request=None, responses={200: SubscriptionSerializer})
    @action(detail=True, methods=["post"])
    def confirm_subscription(self, request, pk=None):
        """
        Confirms a Quotation and provisions an active Subscription with lines and event audit history.
        """
        quotation = self.get_object()
        subscription = QuotationService.confirm_to_subscription(quotation=quotation, actor=request.user)
        return Response(SubscriptionSerializer(subscription).data, status=status.HTTP_200_OK)
