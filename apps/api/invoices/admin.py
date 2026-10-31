from django.contrib import admin
from .models import Invoice, InvoiceLineItem, InvoiceLineTax


class InvoiceLineTaxInline(admin.TabularInline):
    model = InvoiceLineTax
    extra = 0
    readonly_fields = ["name", "rate", "amount"]


class InvoiceLineItemInline(admin.TabularInline):
    model = InvoiceLineItem
    extra = 0
    readonly_fields = ["total_price", "tax_amount"]


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ["invoice_number", "customer", "status", "issue_date", "due_date", "subtotal", "tax_amount", "total_amount", "balance_due"]
    list_filter = ["status", "issue_date"]
    search_fields = ["invoice_number", "customer__company_name"]
    inlines = [InvoiceLineItemInline]


@admin.register(InvoiceLineItem)
class InvoiceLineItemAdmin(admin.ModelAdmin):
    list_display = ["invoice", "description", "quantity", "unit_price", "tax_amount", "total_price"]
    inlines = [InvoiceLineTaxInline]


@admin.register(InvoiceLineTax)
class InvoiceLineTaxAdmin(admin.ModelAdmin):
    list_display = ["line_item", "name", "rate", "amount", "created_at"]
