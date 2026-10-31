from django.db import models
from common.models import TimeStampedModel


class Subscription(TimeStampedModel):
    class Status(models.TextChoices):
        TRIALING = "trialing", "Trialing"
        ACTIVE = "active", "Active"
        PAST_DUE = "past_due", "Past Due"
        CANCELED = "canceled", "Canceled"
        PAUSED = "paused", "Paused"

    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.CASCADE,
        related_name="subscriptions",
        db_index=True,
    )
    plan = models.ForeignKey(
        "plans.Plan",
        on_delete=models.PROTECT,
        related_name="subscriptions",
        db_index=True,
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
        db_index=True,
    )
    start_date = models.DateField()
    current_period_start = models.DateField(db_index=True)
    current_period_end = models.DateField(db_index=True)
    trial_end = models.DateField(null=True, blank=True)
    cancel_at_period_end = models.BooleanField(default=False)
    canceled_at = models.DateTimeField(null=True, blank=True)
    paused_at = models.DateTimeField(null=True, blank=True)
    metadata = models.JSONField(blank=True, default=dict)
    payment_term = models.ForeignKey(
        "catalog.PaymentTerm",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="subscriptions",
    )

    class Meta:
        verbose_name = "Subscription"
        verbose_name_plural = "Subscriptions"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["customer", "status"]),
            models.Index(fields=["status", "current_period_end"]),
            models.Index(fields=["current_period_end"]),
        ]

    def __str__(self):
        return f"{self.customer.company_name} - {self.plan.name} ({self.status})"


class SubscriptionLine(TimeStampedModel):
    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.CASCADE,
        related_name="lines",
    )
    product = models.ForeignKey(
        "catalog.Product",
        on_delete=models.PROTECT,
        related_name="subscription_lines",
    )
    variant = models.ForeignKey(
        "catalog.ProductVariant",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="subscription_lines",
    )
    quantity = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=1.00,
    )
    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="Snapshot unit price including any variant extra price.",
    )
    taxes = models.ManyToManyField(
        "catalog.Tax",
        blank=True,
        related_name="subscription_lines",
    )

    class Meta:
        verbose_name = "Subscription Line"
        verbose_name_plural = "Subscription Lines"

    def __str__(self):
        return f"{self.product.name} ({self.quantity}) on {self.subscription.id}"


class SubscriptionEvent(TimeStampedModel):
    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.CASCADE,
        related_name="events",
    )
    from_status = models.CharField(max_length=20, blank=True, default="")
    to_status = models.CharField(max_length=20)
    actor = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="subscription_events",
    )
    reason = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        verbose_name = "Subscription Event"
        verbose_name_plural = "Subscription Events"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Sub #{self.subscription_id}: {self.from_status} -> {self.to_status} ({self.reason})"
