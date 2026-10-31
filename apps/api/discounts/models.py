from django.db import models
from django.utils import timezone
from common.models import TimeStampedModel
from common.money import round_money


class Discount(TimeStampedModel):
    class DiscountType(models.TextChoices):
        PERCENTAGE = "percentage", "Percentage (%)"
        FIXED_AMOUNT = "fixed_amount", "Fixed Amount (INR)"

    code = models.CharField(max_length=50, unique=True, db_index=True)
    description = models.CharField(max_length=255, blank=True, default="")
    discount_type = models.CharField(
        max_length=20,
        choices=DiscountType.choices,
        default=DiscountType.PERCENTAGE,
    )
    value = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="Percentage (e.g. 20.00 for 20%) or Flat INR Amount (e.g. 500.00)",
    )
    min_subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00,
        help_text="Minimum invoice subtotal required to redeem coupon.",
    )
    max_redemptions = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Total allowed redemptions across all customers. Null for unlimited.",
    )
    times_redeemed = models.PositiveIntegerField(default=0)
    valid_from = models.DateTimeField(default=timezone.now, db_index=True)
    valid_until = models.DateTimeField(db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        verbose_name = "Discount"
        verbose_name_plural = "Discounts"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["code", "is_active"]),
            models.Index(fields=["valid_from", "valid_until"]),
        ]

    def clean(self):
        super().clean()
        if self.code:
            self.code = self.code.upper().strip()

    def save(self, *args, **kwargs):
        if self.code:
            self.code = self.code.upper().strip()
        if self.value is not None:
            self.value = round_money(self.value)
        if self.min_subtotal is not None:
            self.min_subtotal = round_money(self.min_subtotal)
        super().save(*args, **kwargs)

    def is_valid_now(self) -> bool:
        now = timezone.now()
        if not self.is_active:
            return False
        if now < self.valid_from or now > self.valid_until:
            return False
        if self.max_redemptions is not None and self.times_redeemed >= self.max_redemptions:
            return False
        return True

    def __str__(self):
        val_str = f"{self.value}%" if self.discount_type == self.DiscountType.PERCENTAGE else f"₹{self.value}"
        return f"{self.code} ({val_str} off)"


class DiscountRedemption(TimeStampedModel):
    discount = models.ForeignKey(Discount, on_delete=models.CASCADE, related_name="redemptions")
    customer = models.ForeignKey("customers.Customer", on_delete=models.CASCADE, related_name="discount_redemptions")
    invoice = models.ForeignKey(
        "invoices.Invoice",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="discount_redemptions",
    )
    discount_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    redeemed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Discount Redemption"
        verbose_name_plural = "Discount Redemptions"
        constraints = [
            models.UniqueConstraint(
                fields=["discount", "customer", "invoice"],
                name="unique_discount_customer_invoice",
                condition=models.Q(invoice__isnull=False),
            )
        ]

    def __str__(self):
        return f"{self.customer.company_name} redeemed {self.discount.code} (-₹{self.discount_amount})"
