from django.db import models
from django.conf import settings
from common.models import TimeStampedModel
from common.money import CURRENCY_INR


class Customer(TimeStampedModel):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        SUSPENDED = "suspended", "Suspended"
        CHURNED = "churned", "Churned"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="customer_profile",
    )
    company_name = models.CharField(max_length=255, db_index=True)
    email = models.EmailField(max_length=255, db_index=True)
    phone = models.CharField(max_length=30, blank=True, default="")
    billing_address = models.TextField(blank=True, default="")
    city = models.CharField(max_length=100, blank=True, default="Bengaluru")
    state = models.CharField(max_length=100, blank=True, default="Karnataka")
    postal_code = models.CharField(max_length=20, blank=True, default="560001")
    country = models.CharField(max_length=100, blank=True, default="India")
    tax_id = models.CharField(
        max_length=50,
        blank=True,
        default="",
        verbose_name="GSTIN / Tax ID",
        help_text="Goods and Services Tax Identification Number for Indian billing.",
    )
    currency = models.CharField(max_length=10, default=CURRENCY_INR)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
        db_index=True,
    )
    metadata = models.JSONField(blank=True, default=dict)

    class Meta:
        verbose_name = "Customer"
        verbose_name_plural = "Customers"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["email", "status"]),
            models.Index(fields=["company_name", "status"]),
        ]

    def __str__(self):
        return f"{self.company_name} ({self.email})"
