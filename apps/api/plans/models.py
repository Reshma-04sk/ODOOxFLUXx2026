from django.db import models
from common.models import TimeStampedModel
from common.money import round_money, CURRENCY_INR


class Plan(TimeStampedModel):
    class Tier(models.TextChoices):
        STARTER = "starter", "Starter"
        GROWTH = "growth", "Growth"
        ENTERPRISE = "enterprise", "Enterprise"

    class BillingFrequency(models.TextChoices):
        MONTHLY = "monthly", "Monthly"
        YEARLY = "yearly", "Yearly"

    name = models.CharField(max_length=100)
    code = models.SlugField(max_length=100, unique=True, db_index=True)
    description = models.TextField(blank=True, default="")
    tier = models.CharField(max_length=20, choices=Tier.choices, default=Tier.STARTER, db_index=True)
    billing_frequency = models.CharField(
        max_length=20,
        choices=BillingFrequency.choices,
        default=BillingFrequency.MONTHLY,
        db_index=True,
    )
    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="Price in INR",
    )
    currency = models.CharField(max_length=10, default=CURRENCY_INR)
    trial_period_days = models.PositiveIntegerField(default=14)
    features = models.JSONField(
        default=list,
        blank=True,
        help_text="List of feature strings included in this plan.",
    )
    is_active = models.BooleanField(default=True, db_index=True)
    display_order = models.PositiveIntegerField(default=0)

    # Advanced subscription lifecycle rules & constraints
    interval_count = models.PositiveIntegerField(
        default=1,
        help_text="Number of billing intervals, e.g. 1 month, 3 months, 1 year.",
    )
    min_qty = models.PositiveIntegerField(
        default=1,
        help_text="Minimum subscriber seat or item quantity required.",
    )
    start_date = models.DateField(
        null=True,
        blank=True,
        help_text="Date from which plan is active.",
    )
    end_date = models.DateField(
        null=True,
        blank=True,
        help_text="Date until which plan remains available for new subscribers.",
    )
    auto_close = models.BooleanField(
        default=False,
        help_text="Automatically close subscription at the end of the billing period without renewal.",
    )
    closable = models.BooleanField(
        default=True,
        help_text="Allow subscription to be canceled/closed by subscriber or staff.",
    )
    pausable = models.BooleanField(
        default=True,
        help_text="Allow subscription on this plan to be paused.",
    )
    renewable = models.BooleanField(
        default=True,
        help_text="Allow subscription on this plan to be renewed.",
    )

    class Meta:
        verbose_name = "Plan"
        verbose_name_plural = "Plans"
        ordering = ["display_order", "price"]
        indexes = [
            models.Index(fields=["tier", "billing_frequency", "is_active"]),
        ]

    def save(self, *args, **kwargs):
        if self.price is not None:
            self.price = round_money(self.price)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.get_billing_frequency_display()}) - ₹{self.price}"
