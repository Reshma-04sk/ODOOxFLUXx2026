from rest_framework import serializers
from .models import Invoice, InvoiceLineItem


class InvoiceLineItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceLineItem
        fields = ["id", "description", "quantity", "unit_price", "total_price"]
        read_only_fields = ["id", "total_price"]


class InvoiceSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source="customer.company_name", read_only=True)
    customer_email = serializers.CharField(source="customer.email", read_only=True)
    plan_name = serializers.CharField(source="subscription.plan.name", default=None, read_only=True)

    class Meta:
        model = Invoice
        fields = [
            "id",
            "invoice_number",
            "customer",
            "customer_name",
            "customer_email",
            "subscription",
            "plan_name",
            "status",
            "issue_date",
            "due_date",
            "period_start",
            "period_end",
            "subtotal",
            "discount_amount",
            "tax_amount",
            "total_amount",
            "amount_paid",
            "balance_due",
            "currency",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "invoice_number",
            "customer_name",
            "customer_email",
            "plan_name",
            "amount_paid",
            "balance_due",
            "created_at",
            "updated_at",
        ]


class InvoiceDetailSerializer(InvoiceSerializer):
    line_items = InvoiceLineItemSerializer(many=True, read_only=True)

    class Meta(InvoiceSerializer.Meta):
        fields = InvoiceSerializer.Meta.fields + ["line_items"]


class CreateInvoiceSerializer(serializers.Serializer):
    customer_id = serializers.IntegerField(required=False)
    subscription_id = serializers.IntegerField(required=False, allow_null=True)
    discount_code = serializers.CharField(required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    line_items = serializers.ListField(
        child=serializers.DictField(),
        required=False,
    )
