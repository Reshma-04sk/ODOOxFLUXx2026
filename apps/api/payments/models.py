from django.db import models
from django.utils import timezone
from common.models import TimeStampedModel
from common.money import round_money, CURRENCY_INR


class Payment(TimeStampedModel):
    class PaymentMethod(models.TextChoices):
        UPI = "upi", "Unified Payments Interface (UPI)"
        CARD = "card", "Credit / Debit Card"
        NETBANKING = "netbanking", "Net Banking"
        BANK_TRANSFER = "bank_transfer", "NEFT / RTGS Bank Transfer"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SUCCEEDED = "succeeded", "Succeeded"
        FAILED = "failed", "Failed"
        REFUNDED = "refunded", "Refunded"

    payment_number = models.CharField(
        max_length=64,
        unique=True,
        db_index=True,
        help_text="Unique transaction ID, e.g. PAY-2026-000001",
    )
    invoice = models.ForeignKey(
        "invoices.Invoice",
        on_delete=models.PROTECT,
        related_name="payments",
        db_index=True,
    )
    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.CASCADE,
        related_name="payments",
        db_index=True,
    )
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="Payment amount in INR",
    )
    currency = models.CharField(max_length=10, default=CURRENCY_INR)
    payment_method = models.CharField(
        max_length=30,
        choices=PaymentMethod.choices,
        default=PaymentMethod.UPI,
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SUCCEEDED,
        db_index=True,
    )
    transaction_reference = models.CharField(
        max_length=100,
        blank=True,
        default="",
        help_text="Bank/Gateway UTR or reference number.",
    )
    processed_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        verbose_name = "Payment"
        verbose_name_plural = "Payments"
        ordering = ["-processed_at", "-id"]
        indexes = [
            models.Index(fields=["customer", "status"]),
            models.Index(fields=["invoice", "status"]),
            models.Index(fields=["processed_at"]),
        ]

    def save(self, *args, **kwargs):
        if self.amount is not None:
            self.amount = round_money(self.amount)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.payment_number} - ₹{self.amount} ({self.status}) for {self.invoice.invoice_number}"
