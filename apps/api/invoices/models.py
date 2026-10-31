from decimal import Decimal
from django.db import models
from common.models import TimeStampedModel
from common.money import round_money, CURRENCY_INR


class Invoice(TimeStampedModel):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        OPEN = "open", "Open"
        PAID = "paid", "Paid"
        VOID = "void", "Void"
        UNCOLLECTIBLE = "uncollectible", "Uncollectible"

    invoice_number = models.CharField(
        max_length=64,
        unique=True,
        db_index=True,
        help_text="Unique sequential invoice number, e.g. INV-2026-000001",
    )
    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.CASCADE,
        related_name="invoices",
        db_index=True,
    )
    subscription = models.ForeignKey(
        "subscriptions.Subscription",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="invoices",
        db_index=True,
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.OPEN,
        db_index=True,
    )
    issue_date = models.DateField(db_index=True)
    due_date = models.DateField(db_index=True)
    period_start = models.DateField(null=True, blank=True)
    period_end = models.DateField(null=True, blank=True)

    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    discount_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    amount_paid = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    balance_due = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))

    currency = models.CharField(max_length=10, default=CURRENCY_INR)
    discount = models.ForeignKey(
        "discounts.Discount",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="invoices",
    )
    notes = models.TextField(blank=True, default="")

    class Meta:
        verbose_name = "Invoice"
        verbose_name_plural = "Invoices"
        ordering = ["-issue_date", "-id"]
        constraints = [
            # Billing idempotency constraint: prevent duplicate invoice for same subscription & period
            models.UniqueConstraint(
                fields=["subscription", "period_start", "period_end"],
                name="unique_subscription_billing_period_invoice",
                condition=models.Q(subscription__isnull=False),
            )
        ]
        indexes = [
            models.Index(fields=["customer", "status"]),
            models.Index(fields=["status", "due_date"]),
            models.Index(fields=["issue_date"]),
        ]

    def save(self, *args, **kwargs):
        for field in ["subtotal", "discount_amount", "tax_amount", "total_amount", "amount_paid", "balance_due"]:
            val = getattr(self, field)
            if val is not None:
                setattr(self, field, round_money(val))
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.invoice_number} - {self.customer.company_name} - ₹{self.total_amount} ({self.status})"


class InvoiceLineItem(TimeStampedModel):
    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
        related_name="line_items",
    )
    description = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        verbose_name = "Invoice Line Item"
        verbose_name_plural = "Invoice Line Items"

    def save(self, *args, **kwargs):
        if self.unit_price is not None:
            self.unit_price = round_money(self.unit_price)
        if self.quantity and self.unit_price:
            self.total_price = round_money(Decimal(self.quantity) * self.unit_price)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.description} x {self.quantity} = ₹{self.total_price}"
