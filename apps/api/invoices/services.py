from decimal import Decimal
from datetime import date, timedelta
from django.utils import timezone
from django.db import transaction
from .models import Invoice, InvoiceLineItem
from discounts.models import Discount
from discounts.services import DiscountService
from common.money import round_money
from common.exceptions import InvalidStateTransitionError, BusinessLogicError


class InvoiceService:
    DEFAULT_TAX_RATE = Decimal("0.18")  # 18% GST (Standard Indian B2B SaaS tax rate)

    @classmethod
    def generate_invoice_number(cls) -> str:
        year = timezone.now().year
        last_invoice = Invoice.objects.filter(invoice_number__startswith=f"INV-{year}-").order_by("-id").first()
        if last_invoice:
            try:
                seq = int(last_invoice.invoice_number.split("-")[-1]) + 1
            except (ValueError, IndexError):
                seq = Invoice.objects.count() + 1
        else:
            seq = 1
        return f"INV-{year}-{seq:06d}"

    @classmethod
    @transaction.atomic
    def create_invoice(
        cls,
        customer,
        subscription=None,
        line_items_data: list[dict] = None,
        issue_date: date = None,
        due_date: date = None,
        period_start: date = None,
        period_end: date = None,
        discount: Discount = None,
        tax_rate: Decimal = DEFAULT_TAX_RATE,
        notes: str = "",
    ) -> Invoice:
        if issue_date is None:
            issue_date = timezone.now().date()
        if due_date is None:
            due_date = issue_date + timedelta(days=15)  # Net 15 terms

        # Prevent duplicate billing if subscription period invoice already exists
        if subscription and period_start and period_end:
            existing = Invoice.objects.filter(
                subscription=subscription,
                period_start=period_start,
                period_end=period_end,
            ).first()
            if existing:
                return existing

        invoice_number = cls.generate_invoice_number()

        # Calculate initial totals
        subtotal = Decimal("0.00")
        items_to_create = []

        if line_items_data:
            for item in line_items_data:
                desc = item.get("description", "Subscription Fee")
                qty = item.get("quantity", 1)
                unit_price = round_money(item.get("unit_price", 0))
                total_price = round_money(Decimal(qty) * unit_price)
                subtotal += total_price
                items_to_create.append({
                    "description": desc,
                    "quantity": qty,
                    "unit_price": unit_price,
                    "total_price": total_price,
                })
        elif subscription:
            unit_price = round_money(subscription.plan.price)
            subtotal = unit_price
            items_to_create.append({
                "description": f"{subscription.plan.name} Subscription ({subscription.plan.get_billing_frequency_display()})",
                "quantity": 1,
                "unit_price": unit_price,
                "total_price": unit_price,
            })

        subtotal = round_money(subtotal)
        discount_amount = Decimal("0.00")
        if discount:
            discount_amount = DiscountService.calculate_discount(discount, subtotal)

        taxable_amount = max(subtotal - discount_amount, Decimal("0.00"))
        tax_amount = round_money(taxable_amount * tax_rate)
        total_amount = round_money(taxable_amount + tax_amount)
        balance_due = total_amount

        invoice = Invoice.objects.create(
            invoice_number=invoice_number,
            customer=customer,
            subscription=subscription,
            status=Invoice.Status.OPEN,
            issue_date=issue_date,
            due_date=due_date,
            period_start=period_start,
            period_end=period_end,
            subtotal=subtotal,
            discount_amount=discount_amount,
            tax_amount=tax_amount,
            total_amount=total_amount,
            amount_paid=Decimal("0.00"),
            balance_due=balance_due,
            discount=discount,
            notes=notes,
        )

        for item in items_to_create:
            InvoiceLineItem.objects.create(
                invoice=invoice,
                description=item["description"],
                quantity=item["quantity"],
                unit_price=item["unit_price"],
                total_price=item["total_price"],
            )

        if discount:
            DiscountService.record_redemption(discount, customer, invoice, discount_amount)

        return invoice

    @classmethod
    @transaction.atomic
    def void_invoice(cls, invoice: Invoice) -> Invoice:
        if invoice.status == Invoice.Status.PAID:
            raise InvalidStateTransitionError("Cannot void an already paid invoice. Please process a refund instead.")
        if invoice.status == Invoice.Status.VOID:
            raise InvalidStateTransitionError("Invoice is already void.")

        invoice.status = Invoice.Status.VOID
        invoice.balance_due = Decimal("0.00")
        invoice.save()
        return invoice
