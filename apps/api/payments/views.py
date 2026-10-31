from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema

from .models import Payment
from .services import PaymentService
from .serializers import PaymentSerializer, RecordPaymentSerializer, RefundPaymentSerializer
from invoices.models import Invoice
from common.permissions import IsCustomerOrStaff


class PaymentViewSet(viewsets.ModelViewSet):
    """
    Payment recording, refunds, and transaction tracking API.
    """
    queryset = Payment.objects.select_related("invoice", "customer").all().order_by("-processed_at")
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated, IsCustomerOrStaff]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "payment_method", "customer", "invoice"]
    search_fields = ["payment_number", "transaction_reference", "invoice__invoice_number", "customer__company_name"]
    ordering_fields = ["amount", "processed_at", "created_at"]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Payment.objects.none()
        if user.is_staff or user.is_superuser:
            return Payment.objects.select_related("invoice", "customer").all().order_by("-processed_at")

        customer = getattr(user, "customer_profile", None)
        if not customer:
            return Payment.objects.none()
        return Payment.objects.select_related("invoice", "customer").filter(customer=customer).order_by("-processed_at")

    def get_object(self):
        try:
            return super().get_object()
        except Exception:
            raise NotFound(detail="Payment transaction not found.")

    def create(self, request, *args, **kwargs):
        serializer = RecordPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = request.user
        invoice = Invoice.objects.get(id=data["invoice_id"])

        if not (user.is_staff or user.is_superuser):
            customer = getattr(user, "customer_profile", None)
            if not customer or invoice.customer_id != customer.id:
                raise NotFound(detail="Invoice not found.")

        payment = PaymentService.record_payment(
            invoice=invoice,
            amount=data["amount"],
            payment_method=data.get("payment_method", Payment.PaymentMethod.UPI),
            transaction_reference=data.get("transaction_reference", ""),
        )

        return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)

    @extend_schema(request=RefundPaymentSerializer, responses={200: PaymentSerializer})
    @action(detail=True, methods=["post"])
    def refund(self, request, pk=None):
        """
        Process a partial or full refund on a succeeded payment (Staff only).
        """
        user = request.user
        if not (user.is_staff or user.is_superuser):
            raise PermissionDenied("Only staff members can process refunds.")

        payment = self.get_object()
        serializer = RefundPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        refunded_payment = PaymentService.process_refund(
            payment=payment,
            refund_amount=serializer.validated_data.get("refund_amount"),
            reason=serializer.validated_data.get("reason", "Customer requested refund"),
        )
        return Response(PaymentSerializer(refunded_payment).data, status=status.HTTP_200_OK)
