from django.http import HttpResponse
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
from common.money import format_inr


class InvoiceViewSet(viewsets.ModelViewSet):
    """
    Invoice management API.
    Provides invoice listing, detail with line items, manual creation, voiding, and printable receipts.
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

    @extend_schema(request=None, responses={200: InvoiceDetailSerializer})
    @action(detail=True, methods=["get"])
    def receipt(self, request, pk=None):
        """
        Renders a printable GST Tax Invoice receipt.
        Accepts ?export=html for raw printable HTML or default JSON receipt details.
        """
        invoice = self.get_object()
        if request.query_params.get("export") == "html" or request.query_params.get("view") == "html":
            lines_html = "".join([
                f"<tr><td>{item.description}</td><td>{item.quantity}</td><td>₹{item.unit_price}</td><td>₹{item.total_price}</td></tr>"
                for item in invoice.line_items.all()
            ])
            html_content = f"""<!DOCTYPE html>
<html>
<head>
    <title>Tax Invoice {invoice.invoice_number}</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; }}
        .header {{ display: flex; justify-content: space-between; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; }}
        .title {{ font-size: 24px; font-weight: bold; color: #0f172a; }}
        table {{ width: 100%; border-collapse: collapse; margin-top: 30px; }}
        th, td {{ padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: left; }}
        th {{ background: #f8fafc; font-size: 12px; text-transform: uppercase; }}
        .total-box {{ margin-top: 30px; text-align: right; }}
        .badge {{ display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: bold; background: #dcfce7; color: #15803d; }}
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="title">PlanLedger Tax Invoice</div>
            <div>Brightloop Software Technologies Pvt Ltd</div>
            <div>GSTIN: 29AAAAA0000A1Z5</div>
        </div>
        <div style="text-align: right;">
            <div><strong>Invoice:</strong> {invoice.invoice_number}</div>
            <div><strong>Date:</strong> {invoice.issue_date}</div>
            <div><span class="badge">{invoice.status.upper()}</span></div>
        </div>
    </div>
    <div style="margin-top: 20px;">
        <strong>Billed To:</strong><br/>
        {invoice.customer.company_name}<br/>
        Email: {invoice.customer.email}<br/>
        GSTIN: {invoice.customer.tax_id or 'Unregistered'}
    </div>
    <table>
        <thead>
            <tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr>
        </thead>
        <tbody>
            {lines_html}
        </tbody>
    </table>
    <div class="total-box">
        <div>Subtotal: ₹{invoice.subtotal}</div>
        <div>Discount: -₹{invoice.discount_amount}</div>
        <div>GST (18%): ₹{invoice.tax_amount}</div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 8px;">Total: ₹{invoice.total_amount}</div>
        <div style="color: #64748b;">Amount Paid: ₹{invoice.amount_paid} | Balance Due: ₹{invoice.balance_due}</div>
    </div>
</body>
</html>"""
            return HttpResponse(html_content, content_type="text/html")

        return Response(InvoiceDetailSerializer(invoice).data)
