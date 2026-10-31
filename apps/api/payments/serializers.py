from rest_framework import serializers
from .models import Payment
from invoices.models import Invoice


class PaymentSerializer(serializers.ModelSerializer):
    invoice_number = serializers.CharField(source="invoice.invoice_number", read_only=True)
    customer_name = serializers.CharField(source="customer.company_name", read_only=True)

    class Meta:
        model = Payment
        fields = [
            "id",
            "payment_number",
            "invoice",
            "invoice_number",
            "customer",
            "customer_name",
            "amount",
            "currency",
            "payment_method",
            "status",
            "transaction_reference",
            "processed_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "payment_number",
            "invoice_number",
            "customer_name",
            "status",
            "processed_at",
            "created_at",
            "updated_at",
        ]


class RecordPaymentSerializer(serializers.Serializer):
    invoice_id = serializers.IntegerField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    payment_method = serializers.ChoiceField(
        choices=Payment.PaymentMethod.choices,
        default=Payment.PaymentMethod.UPI,
    )
    transaction_reference = serializers.CharField(
        max_length=100,
        required=False,
        allow_blank=True,
        default="",
    )

    def validate_invoice_id(self, value):
        if not Invoice.objects.filter(id=value).exists():
            raise serializers.ValidationError("Invoice with this ID does not exist.")
        return value
