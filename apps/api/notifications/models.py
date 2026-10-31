from django.db import models
from django.utils import timezone
from common.models import TimeStampedModel


class Notification(TimeStampedModel):
    class NotificationType(models.TextChoices):
        INVOICE_CREATED = "invoice_created", "Invoice Created"
        PAYMENT_RECEIVED = "payment_received", "Payment Received"
        SUBSCRIPTION_CANCELED = "subscription_canceled", "Subscription Canceled"
        BILLING_FAILED = "billing_failed", "Billing Failed"
        GENERAL = "general", "General Notification"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SENT = "sent", "Sent"
        FAILED = "failed", "Failed"

    recipient_email = models.EmailField(db_index=True)
    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="notifications",
        db_index=True,
    )
    subject = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(
        max_length=30,
        choices=NotificationType.choices,
        default=NotificationType.GENERAL,
        db_index=True,
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True,
    )
    sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["customer", "status"]),
        ]

    def __str__(self):
        return f"[{self.notification_type}] to {self.recipient_email}: {self.subject}"
