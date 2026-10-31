from decimal import Decimal
from django.db import models
from django.utils import timezone
from common.models import TimeStampedModel
from common.money import round_money


class BillingExecutionRecord(TimeStampedModel):
    class Status(models.TextChoices):
        RUNNING = "running", "Running"
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"

    executed_at = models.DateTimeField(default=timezone.now, db_index=True)
    target_date = models.DateField(db_index=True)
    subscriptions_evaluated = models.PositiveIntegerField(default=0)
    invoices_generated = models.PositiveIntegerField(default=0)
    total_amount_invoiced = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=Decimal("0.00"),
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.RUNNING,
        db_index=True,
    )
    error_message = models.TextField(blank=True, default="")
    duration_ms = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Billing Execution Record"
        verbose_name_plural = "Billing Execution Records"
        ordering = ["-executed_at"]

    def save(self, *args, **kwargs):
        if self.total_amount_invoiced is not None:
            self.total_amount_invoiced = round_money(self.total_amount_invoiced)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Billing Run {self.target_date} - {self.invoices_generated} invoices (₹{self.total_amount_invoiced}) [{self.status}]"
