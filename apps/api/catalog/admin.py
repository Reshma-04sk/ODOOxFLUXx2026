from django.contrib import admin
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


@admin.register(Tax)
class TaxAdmin(admin.ModelAdmin):
    list_display = ["name", "rate", "kind", "is_active", "created_at"]
    list_filter = ["kind", "is_active"]
    search_fields = ["name"]


@admin.register(PaymentTerm)
class PaymentTermAdmin(admin.ModelAdmin):
    list_display = ["name", "due_days", "created_at"]
    search_fields = ["name"]


class AttributeValueInline(admin.TabularInline):
    model = AttributeValue
    extra = 1


@admin.register(Attribute)
class AttributeAdmin(admin.ModelAdmin):
    list_display = ["name", "created_at"]
    search_fields = ["name"]
    inlines = [AttributeValueInline]


@admin.register(AttributeValue)
class AttributeValueAdmin(admin.ModelAdmin):
    list_display = ["attribute", "name", "extra_price"]
    list_filter = ["attribute"]
    search_fields = ["name", "attribute__name"]


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "type", "sales_price", "cost_price", "is_active"]
    list_filter = ["type", "is_active"]
    search_fields = ["name", "notes"]
    filter_horizontal = ["taxes", "attributes"]
    inlines = [ProductVariantInline]


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ["product", "sku", "extra_price", "effective_price"]
    search_fields = ["sku", "product__name"]
    filter_horizontal = ["attribute_values"]


class QuotationTemplateLineInline(admin.TabularInline):
    model = QuotationTemplateLine
    extra = 1


@admin.register(QuotationTemplate)
class QuotationTemplateAdmin(admin.ModelAdmin):
    list_display = ["name", "plan", "validity_days", "payment_term"]
    list_filter = ["plan", "payment_term"]
    search_fields = ["name"]
    inlines = [QuotationTemplateLineInline]


class QuotationLineInline(admin.TabularInline):
    model = QuotationLine
    extra = 0
    readonly_fields = ["subtotal", "tax_amount", "total_price"]


@admin.register(Quotation)
class QuotationAdmin(admin.ModelAdmin):
    list_display = ["quotation_number", "customer", "plan", "status", "order_date", "validity_date", "total_amount"]
    list_filter = ["status", "plan"]
    search_fields = ["quotation_number", "customer__company_name"]
    inlines = [QuotationLineInline]
