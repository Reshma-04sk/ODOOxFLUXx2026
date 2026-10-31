from decimal import Decimal
from django.db import models
from django.utils import timezone
from common.models import TimeStampedModel
from common.money import round_money, CURRENCY_INR


class Tax(TimeStampedModel):
    class Kind(models.TextChoices):
        PERCENT = "percent", "Percentage"
        FIXED = "fixed", "Fixed Amount"

    name = models.CharField(max_length=100)
    rate = models.DecimalField(
        max_digits=6,
        decimal_places=4,
        help_text="Tax rate. E.g. 0.1800 for 18% GST or 18.0000",
    )
    kind = models.CharField(
        max_length=20,
        choices=Kind.choices,
        default=Kind.PERCENT,
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Tax"
        verbose_name_plural = "Taxes"
        ordering = ["name"]

    def compute_tax(self, amount: Decimal, quantity: Decimal = Decimal("1.00")) -> Decimal:
        """Computes tax with exact ROUND_HALF_UP precision."""
        if self.kind == self.Kind.PERCENT:
            factor = self.rate / Decimal("100.00") if self.rate > Decimal("1.00") else self.rate
            return round_money(amount * factor)
        return round_money(self.rate * quantity)

    def __str__(self):
        suffix = "%" if self.kind == self.Kind.PERCENT else " ₹"
        rate_display = f"{self.rate * 100:.1f}" if self.rate <= 1 and self.kind == self.Kind.PERCENT else f"{self.rate:.2f}"
        return f"{self.name} ({rate_display}{suffix})"


class PaymentTerm(TimeStampedModel):
    name = models.CharField(max_length=100, unique=True)
    due_days = models.PositiveIntegerField(
        default=15,
        help_text="Number of days until payment is due after invoice issuance.",
    )
    notes = models.TextField(blank=True, default="")

    class Meta:
        verbose_name = "Payment Term"
        verbose_name_plural = "Payment Terms"
        ordering = ["due_days", "name"]

    def __str__(self):
        return f"{self.name} ({self.due_days} days)"


class Attribute(TimeStampedModel):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Product Attribute"
        verbose_name_plural = "Product Attributes"
        ordering = ["name"]

    def __str__(self):
        return self.name


class AttributeValue(TimeStampedModel):
    attribute = models.ForeignKey(
        Attribute,
        on_delete=models.CASCADE,
        related_name="values",
    )
    name = models.CharField(max_length=100)
    extra_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
        help_text="Additional price surcharge for this variant attribute (e.g. Brand=Odoo +560.00)",
    )

    class Meta:
        verbose_name = "Attribute Value"
        verbose_name_plural = "Attribute Values"
        unique_together = ("attribute", "name")
        ordering = ["attribute", "name"]

    def save(self, *args, **kwargs):
        if self.extra_price is not None:
            self.extra_price = round_money(self.extra_price)
        super().save(*args, **kwargs)

    def __str__(self):
        extra = f" (+₹{self.extra_price})" if self.extra_price else ""
        return f"{self.attribute.name}: {self.name}{extra}"


class Product(TimeStampedModel):
    class ProductType(models.TextChoices):
        SERVICE = "service", "Service"
        CONSU = "consu", "Consumable"
        PRODUCT = "product", "Storable Product"

    name = models.CharField(max_length=255)
    type = models.CharField(
        max_length=50,
        choices=ProductType.choices,
        default=ProductType.SERVICE,
    )
    sales_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
        help_text="Base sales price in INR",
    )
    cost_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
        help_text="Cost price in INR",
    )
    notes = models.TextField(blank=True, default="")
    is_active = models.BooleanField(default=True)
    taxes = models.ManyToManyField(
        Tax,
        blank=True,
        related_name="products",
    )
    attributes = models.ManyToManyField(
        Attribute,
        blank=True,
        related_name="products",
    )

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if self.sales_price is not None:
            self.sales_price = round_money(self.sales_price)
        if self.cost_price is not None:
            self.cost_price = round_money(self.cost_price)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - ₹{self.sales_price:,.2f}"


class ProductVariant(TimeStampedModel):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="variants",
    )
    sku = models.CharField(max_length=100, unique=True, null=True, blank=True)
    attribute_values = models.ManyToManyField(
        AttributeValue,
        related_name="variants",
        blank=True,
    )

    class Meta:
        verbose_name = "Product Variant"
        verbose_name_plural = "Product Variants"

    @property
    def extra_price(self) -> Decimal:
        """Sum of surcharges for all attached attribute values."""
        return round_money(sum((v.extra_price for v in self.attribute_values.all()), Decimal("0.00")))

    @property
    def effective_price(self) -> Decimal:
        """Product base sales price + variant extra surcharges."""
        return round_money(self.product.sales_price + self.extra_price)

    def __str__(self):
        attrs = ", ".join([v.name for v in self.attribute_values.all()])
        return f"{self.product.name} ({attrs or 'Default'}) - ₹{self.effective_price:,.2f}"


class QuotationTemplate(TimeStampedModel):
    name = models.CharField(max_length=255)
    plan = models.ForeignKey(
        "plans.Plan",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="quotation_templates",
    )
    validity_days = models.PositiveIntegerField(
        default=30,
        help_text="Validity of quotation in days from issue.",
    )
    payment_term = models.ForeignKey(
        PaymentTerm,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="quotation_templates",
    )
    notes = models.TextField(blank=True, default="")

    class Meta:
        verbose_name = "Quotation Template"
        verbose_name_plural = "Quotation Templates"
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.validity_days} days validity)"


class QuotationTemplateLine(TimeStampedModel):
    template = models.ForeignKey(
        QuotationTemplate,
        on_delete=models.CASCADE,
        related_name="lines",
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="template_lines",
    )
    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="template_lines",
    )
    quantity = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("1.00"),
    )
    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Override price. If null, automatically computes variant effective price.",
    )

    class Meta:
        verbose_name = "Quotation Template Line"
        verbose_name_plural = "Quotation Template Lines"

    def get_unit_price(self) -> Decimal:
        if self.unit_price is not None:
            return round_money(self.unit_price)
        if self.variant:
            return self.variant.effective_price
        return self.product.sales_price

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"


class Quotation(TimeStampedModel):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        SENT = "sent", "Sent"
        CONFIRMED = "confirmed", "Confirmed"
        CANCELED = "canceled", "Canceled"

    quotation_number = models.CharField(
        max_length=64,
        unique=True,
        db_index=True,
        help_text="Sequential quotation identifier, e.g. QUO-2026-000001",
    )
    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.CASCADE,
        related_name="quotations",
    )
    template = models.ForeignKey(
        QuotationTemplate,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="quotations",
    )
    plan = models.ForeignKey(
        "plans.Plan",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="quotations",
    )
    payment_term = models.ForeignKey(
        PaymentTerm,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="quotations",
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
        db_index=True,
    )
    order_date = models.DateField(default=timezone.now)
    validity_date = models.DateField()

    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    notes = models.TextField(blank=True, default="")

    subscription = models.OneToOneField(
        "subscriptions.Subscription",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="origin_quotation",
    )

    class Meta:
        verbose_name = "Quotation"
        verbose_name_plural = "Quotations"
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        for field in ["subtotal", "tax_amount", "total_amount"]:
            val = getattr(self, field)
            if val is not None:
                setattr(self, field, round_money(val))
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quotation_number} - {self.customer.company_name} (₹{self.total_amount})"


class QuotationLine(TimeStampedModel):
    quotation = models.ForeignKey(
        Quotation,
        on_delete=models.CASCADE,
        related_name="lines",
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="quotation_lines",
    )
    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="quotation_lines",
    )
    description = models.CharField(max_length=255)
    quantity = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("1.00"),
    )
    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="Snapshot unit price inclusive of variant extra charges.",
    )
    taxes = models.ManyToManyField(
        Tax,
        blank=True,
        related_name="quotation_lines",
    )
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    total_price = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))

    class Meta:
        verbose_name = "Quotation Line"
        verbose_name_plural = "Quotation Lines"

    def save(self, *args, **kwargs):
        if self.unit_price is not None:
            self.unit_price = round_money(self.unit_price)
        if self.quantity and self.unit_price:
            self.subtotal = round_money(self.quantity * self.unit_price)
            self.total_price = round_money(self.subtotal + self.tax_amount)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.description} x {self.quantity} = ₹{self.total_price}"
