from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema

from .models import Invoice
from .services import InvoiceService
from .serializers import (
    InvoiceSerializer,
    InvoiceDetailSerializer,
    CreateInvoiceSerializer,
)
from customers.models import Customer
from subscriptions.models import Subscription
from discounts.models import Discount
from common.permissions import IsCustomerOrStaff


class InvoiceViewSet(viewsets.ModelViewSet):
    """
    Invoice management API.
    Provides invoice listing, detail with line items, manual creation, and voiding.
    """
    queryset = Invoice.objects.select_related("customer", "subscription", "subscription__plan").prefetch_related("line_items").all()
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsCustomerOrStaff]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "customer", "subscription", "currency"]
    search_fields = ["invoice_number", "customer__company_name", "customer__email"]
    ordering_fields = ["issue_date", "due_date", "total_amount", "created_at"]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Invoice.objects.none()
        if user.is_staff or user.is_superuser:
            return Invoice.objects.select_related("customer", "subscription", "subscription__plan").prefetch_related("line_items").all().order_by("-issue_date", "-id")

        customer = getattr(user, "customer_profile", None)
        if not customer:
            return Invoice.objects.none()
        return Invoice.objects.select_related("customer", "subscription", "subscription__plan").prefetch_related("line_items").filter(customer=customer).order_by("-issue_date", "-id")

    def get_object(self):
        try:
            return super().get_object()
        except Exception:
            raise NotFound(detail="Invoice not found.")

    def get_serializer_class(self):
        if self.action in ["retrieve", "create"]:
            return InvoiceDetailSerializer
        return InvoiceSerializer

    def create(self, request, *args, **kwargs):
        serializer = CreateInvoiceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = request.user
        customer = None
        if user.is_staff or user.is_superuser:
            customer_id = data.get("customer_id")
            if customer_id:
                try:
                    customer = Customer.objects.get(id=customer_id)
                except Customer.DoesNotExist:
                    raise NotFound(detail="Specified customer does not exist.")
            else:
                customer = getattr(user, "customer_profile", None)
        else:
            customer = getattr(user, "customer_profile", None)

        if not customer:
            raise NotFound(detail="Customer profile is required to generate an invoice.")

        subscription = None
        if data.get("subscription_id"):
            try:
                subscription = Subscription.objects.get(id=data["subscription_id"], customer=customer)
            except Subscription.DoesNotExist:
                raise NotFound(detail="Specified subscription not found for this customer.")

        discount = None
        if data.get("discount_code"):
            try:
                discount = Discount.objects.get(code=data["discount_code"].upper().strip())
            except Discount.DoesNotExist:
                pass

        invoice = InvoiceService.create_invoice(
            customer=customer,
            subscription=subscription,
            line_items_data=data.get("line_items"),
            discount=discount,
            notes=data.get("notes", ""),
        )

        return Response(InvoiceDetailSerializer(invoice).data, status=status.HTTP_201_CREATED)

    @extend_schema(request=None, responses={200: InvoiceDetailSerializer})
    @action(detail=True, methods=["post"])
    def void(self, request, pk=None):
        invoice = self.get_object()
        updated = InvoiceService.void_invoice(invoice)
        return Response(InvoiceDetailSerializer(updated).data)
