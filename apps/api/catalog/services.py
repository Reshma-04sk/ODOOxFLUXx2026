from decimal import Decimal
from datetime import timedelta
from django.utils import timezone
from django.db import transaction
from .models import Quotation, QuotationLine, QuotationTemplate
from subscriptions.models import Subscription, SubscriptionLine, SubscriptionEvent
from subscriptions.services import SubscriptionService
from common.money import round_money
from common.exceptions import BusinessLogicError


class QuotationService:
    @classmethod
    def generate_quotation_number(cls) -> str:
        year = timezone.now().year
        last_quo = Quotation.objects.filter(quotation_number__startswith=f"QUO-{year}-").order_by("-id").first()
        if last_quo:
            try:
                seq = int(last_quo.quotation_number.split("-")[-1]) + 1
            except (ValueError, IndexError):
                seq = Quotation.objects.count() + 1
        else:
            seq = 1
        return f"QUO-{year}-{seq:06d}"

    @classmethod
    @transaction.atomic
    def create_from_template(cls, template: QuotationTemplate, customer) -> Quotation:
        """
        Builds a new Quotation from a QuotationTemplate,
        populating the plan, validity date, payment term, and lines with computed prices and line taxes.
        """
        quotation_number = cls.generate_quotation_number()
        today = timezone.now().date()
        validity_date = today + timedelta(days=template.validity_days)

        quotation = Quotation.objects.create(
            quotation_number=quotation_number,
            customer=customer,
            template=template,
            plan=template.plan,
            payment_term=template.payment_term,
            status=Quotation.Status.DRAFT,
            order_date=today,
            validity_date=validity_date,
            notes=template.notes,
        )

        subtotal = Decimal("0.00")
        total_tax = Decimal("0.00")

        for tmpl_line in template.lines.select_related("product", "variant").all():
            product = tmpl_line.product
            variant = tmpl_line.variant
            qty = tmpl_line.quantity
            unit_price = tmpl_line.get_unit_price()
            line_subtotal = round_money(qty * unit_price)

            # Calculate per-line tax
            line_tax = Decimal("0.00")
            product_taxes = list(product.taxes.filter(is_active=True))
            for tax in product_taxes:
                tax_amt = tax.compute_tax(line_subtotal, qty)
                line_tax += tax_amt

            line_tax = round_money(line_tax)
            line_total = round_money(line_subtotal + line_tax)

            q_line = QuotationLine.objects.create(
                quotation=quotation,
                product=product,
                variant=variant,
                description=f"{product.name} ({variant.sku if variant and variant.sku else 'Standard'})",
                quantity=qty,
                unit_price=unit_price,
                subtotal=line_subtotal,
                tax_amount=line_tax,
                total_price=line_total,
            )
            if product_taxes:
                q_line.taxes.set(product_taxes)

            subtotal += line_subtotal
            total_tax += line_tax

        quotation.subtotal = round_money(subtotal)
        quotation.tax_amount = round_money(total_tax)
        quotation.total_amount = round_money(subtotal + total_tax)
        quotation.save(update_fields=["subtotal", "tax_amount", "total_amount"])

        return quotation

    @classmethod
    @transaction.atomic
    def confirm_to_subscription(cls, quotation: Quotation, actor=None) -> Subscription:
        """
        Converts a Quotation into an active Subscription.
        Populates SubscriptionLine items and records a SubscriptionEvent.
        """
        if quotation.subscription_id:
            raise BusinessLogicError("Subscription has already been created from this quotation.")
        if quotation.status == Quotation.Status.CANCELED:
            raise BusinessLogicError("Cannot convert a canceled quotation to a subscription.")
        if not quotation.plan:
            raise BusinessLogicError("Quotation must be associated with a subscription Plan.")

        # Create subscription
        subscription = SubscriptionService.create_subscription(
            customer=quotation.customer,
            plan=quotation.plan,
            payment_term=quotation.payment_term,
            actor=actor,
        )

        # Populate subscription lines
        for q_line in quotation.lines.select_related("product", "variant").prefetch_related("taxes").all():
            sub_line = SubscriptionLine.objects.create(
                subscription=subscription,
                product=q_line.product,
                variant=q_line.variant,
                quantity=q_line.quantity,
                unit_price=q_line.unit_price,
            )
            sub_line.taxes.set(q_line.taxes.all())

        # Record event
        SubscriptionEvent.objects.create(
            subscription=subscription,
            from_status="",
            to_status=subscription.status,
            actor=actor,
            reason=f"Created from Quotation {quotation.quotation_number}",
        )

        # Update quotation
        quotation.status = Quotation.Status.CONFIRMED
        quotation.subscription = subscription
        quotation.save(update_fields=["status", "subscription", "updated_at"])

        return subscription
