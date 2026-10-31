from rest_framework import serializers
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
from subscriptions.serializers import SubscriptionSerializer


class TaxSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tax
        fields = ["id", "name", "rate", "kind", "is_active", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class PaymentTermSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentTerm
        fields = ["id", "name", "due_days", "notes", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class AttributeValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttributeValue
        fields = ["id", "attribute", "name", "extra_price", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class AttributeSerializer(serializers.ModelSerializer):
    values = AttributeValueSerializer(many=True, read_only=True)

    class Meta:
        model = Attribute
        fields = ["id", "name", "values", "created_at", "updated_at"]
        read_only_fields = ["id", "values", "created_at", "updated_at"]


class ProductVariantSerializer(serializers.ModelSerializer):
    extra_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    effective_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    attribute_value_details = AttributeValueSerializer(source="attribute_values", many=True, read_only=True)

    class Meta:
        model = ProductVariant
        fields = [
            "id",
            "product",
            "sku",
            "attribute_values",
            "attribute_value_details",
            "extra_price",
            "effective_price",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "extra_price", "effective_price", "created_at", "updated_at"]


class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)
    taxes_details = TaxSerializer(source="taxes", many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "type",
            "sales_price",
            "cost_price",
            "notes",
            "is_active",
            "taxes",
            "taxes_details",
            "attributes",
            "variants",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "variants", "taxes_details", "created_at", "updated_at"]


class QuotationTemplateLineSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    variant_sku = serializers.CharField(source="variant.sku", default=None, read_only=True)

    class Meta:
        model = QuotationTemplateLine
        fields = [
            "id",
            "template",
            "product",
            "product_name",
            "variant",
            "variant_sku",
            "quantity",
            "unit_price",
        ]
        read_only_fields = ["id", "product_name", "variant_sku"]


class QuotationTemplateSerializer(serializers.ModelSerializer):
    lines = QuotationTemplateLineSerializer(many=True, read_only=True)
    plan_name = serializers.CharField(source="plan.name", default=None, read_only=True)
    payment_term_name = serializers.CharField(source="payment_term.name", default=None, read_only=True)

    class Meta:
        model = QuotationTemplate
        fields = [
            "id",
            "name",
            "plan",
            "plan_name",
            "validity_days",
            "payment_term",
            "payment_term_name",
            "notes",
            "lines",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "lines", "plan_name", "payment_term_name", "created_at", "updated_at"]


class QuotationLineSerializer(serializers.ModelSerializer):
    taxes_details = TaxSerializer(source="taxes", many=True, read_only=True)

    class Meta:
        model = QuotationLine
        fields = [
            "id",
            "product",
            "variant",
            "description",
            "quantity",
            "unit_price",
            "subtotal",
            "tax_amount",
            "total_price",
            "taxes",
            "taxes_details",
        ]
        read_only_fields = ["id", "subtotal", "tax_amount", "total_price", "taxes_details"]


class QuotationSerializer(serializers.ModelSerializer):
    lines = QuotationLineSerializer(many=True, read_only=True)
    customer_company = serializers.CharField(source="customer.company_name", read_only=True)
    plan_name = serializers.CharField(source="plan.name", default=None, read_only=True)

    class Meta:
        model = Quotation
        fields = [
            "id",
            "quotation_number",
            "customer",
            "customer_company",
            "template",
            "plan",
            "plan_name",
            "payment_term",
            "status",
            "order_date",
            "validity_date",
            "subtotal",
            "tax_amount",
            "total_amount",
            "notes",
            "subscription",
            "lines",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "quotation_number",
            "customer_company",
            "plan_name",
            "subtotal",
            "tax_amount",
            "total_amount",
            "subscription",
            "lines",
            "created_at",
            "updated_at",
        ]


class CreateQuotationFromTemplateSerializer(serializers.Serializer):
    template_id = serializers.IntegerField()
    customer_id = serializers.IntegerField(required=False)

    def validate_template_id(self, value):
        if not QuotationTemplate.objects.filter(id=value).exists():
            raise serializers.ValidationError("Quotation template does not exist.")
        return value
