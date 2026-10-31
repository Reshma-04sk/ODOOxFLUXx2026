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
                product = item.get("product")
                variant = item.get("variant")

                # If variant extra price is present and unit_price not overridden, compute effective price
                if "unit_price" in item and item["unit_price"] is not None:
                    unit_price = round_money(item["unit_price"])
                elif variant:
                    unit_price = variant.effective_price
                elif product:
                    unit_price = product.sales_price
                else:
                    unit_price = Decimal("0.00")

                line_subtotal = round_money(Decimal(qty) * unit_price)
                subtotal += line_subtotal

                # Resolve taxes
                taxes = item.get("taxes")
                if taxes is None and product and hasattr(product, "taxes"):
                    taxes = list(product.taxes.filter(is_active=True))

                items_to_create.append({
                    "description": desc,
                    "quantity": qty,
                    "unit_price": unit_price,
                    "total_price": line_subtotal,
                    "product": product,
                    "variant": variant,
                    "taxes": taxes,
                })
        elif subscription:
            # Check if subscription has custom SubscriptionLine items
            if hasattr(subscription, "lines") and subscription.lines.exists():
                for sub_line in subscription.lines.select_related("product", "variant").prefetch_related("taxes").all():
                    qty = sub_line.quantity
                    unit_price = sub_line.unit_price
                    line_subtotal = round_money(Decimal(qty) * unit_price)
                    subtotal += line_subtotal
                    items_to_create.append({
                        "description": f"{sub_line.product.name} ({sub_line.variant.sku if sub_line.variant else 'Standard'})",
                        "quantity": int(qty),
                        "unit_price": unit_price,
                        "total_price": line_subtotal,
                        "product": sub_line.product,
                        "variant": sub_line.variant,
                        "taxes": list(sub_line.taxes.filter(is_active=True)),
                    })
            else:
                unit_price = round_money(subscription.plan.price)
                subtotal = unit_price
                items_to_create.append({
                    "description": f"{subscription.plan.name} Subscription ({subscription.plan.get_billing_frequency_display()})",
                    "quantity": 1,
                    "unit_price": unit_price,
                    "total_price": unit_price,
                    "product": None,
                    "variant": None,
                    "taxes": None,
                })

        subtotal = round_money(subtotal)
        discount_amount = Decimal("0.00")
        if discount:
            discount_amount = DiscountService.calculate_discount(discount, subtotal)

        # Compute per-line taxes with ROUND_HALF_UP
        total_tax = Decimal("0.00")
        line_tax_records = []  # list of tuples: (item_dict, line_tax_amount, list_of_tax_snapshots)

        for item in items_to_create:
            line_subtotal = item["total_price"]
            applied_taxes = item.get("taxes")
            line_tax_total = Decimal("0.00")
            snapshots = []

            if applied_taxes:
                for tax_obj in applied_taxes:
                    t_amt = tax_obj.compute_tax(line_subtotal, Decimal(item["quantity"]))
                    line_tax_total += t_amt
                    snapshots.append({
                        "tax": tax_obj,
                        "name": tax_obj.name,
                        "rate": tax_obj.rate,
                        "amount": t_amt,
                    })
            else:
                # Fallback to tax_rate (default 18% GST)
                t_amt = round_money(line_subtotal * (tax_rate if tax_rate is not None else cls.DEFAULT_TAX_RATE))
                line_tax_total = t_amt
                snapshots.append({
                    "tax": None,
                    "name": f"GST {int((tax_rate or cls.DEFAULT_TAX_RATE) * 100)}%",
                    "rate": (tax_rate or cls.DEFAULT_TAX_RATE),
                    "amount": t_amt,
                })

            line_tax_records.append((item, line_tax_total, snapshots))
            total_tax += line_tax_total

        total_tax = round_money(total_tax)
        total_amount = round_money(max(subtotal - discount_amount, Decimal("0.00")) + total_tax)
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
            tax_amount=total_tax,
            total_amount=total_amount,
            amount_paid=Decimal("0.00"),
            balance_due=balance_due,
            discount=discount,
            notes=notes,
        )

        from .models import InvoiceLineTax
        for item, line_tax_amt, snapshots in line_tax_records:
            line_obj = InvoiceLineItem.objects.create(
                invoice=invoice,
                product=item.get("product"),
                variant=item.get("variant"),
                description=item["description"],
                quantity=item["quantity"],
                unit_price=item["unit_price"],
                tax_amount=line_tax_amt,
                total_price=item["total_price"],
            )
            for snap in snapshots:
                InvoiceLineTax.objects.create(
                    line_item=line_obj,
                    tax=snap["tax"],
                    name=snap["name"],
                    rate=snap["rate"],
                    amount=snap["amount"],
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
