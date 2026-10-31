from decimal import Decimal
from django.utils import timezone
from django.db import transaction
from .models import Payment
from invoices.models import Invoice
from common.money import round_money
from common.exceptions import InvalidStateTransitionError, BusinessLogicError


class PaymentService:
    @classmethod
    def generate_payment_number(cls) -> str:
        year = timezone.now().year
        last_payment = Payment.objects.filter(payment_number__startswith=f"PAY-{year}-").order_by("-id").first()
        if last_payment:
            try:
                seq = int(last_payment.payment_number.split("-")[-1]) + 1
            except (ValueError, IndexError):
                seq = Payment.objects.count() + 1
        else:
            seq = 1
        return f"PAY-{year}-{seq:06d}"

    @classmethod
    @transaction.atomic
    def record_payment(
        cls,
        invoice: Invoice,
        amount: Decimal,
        payment_method: str = Payment.PaymentMethod.UPI,
        transaction_reference: str = "",
    ) -> Payment:
        if invoice.status in [Invoice.Status.VOID, Invoice.Status.UNCOLLECTIBLE]:
            raise InvalidStateTransitionError(
                f"Cannot record payment for an invoice with status '{invoice.status}'."
            )

        if invoice.status == Invoice.Status.PAID and invoice.balance_due <= Decimal("0.00"):
            raise BusinessLogicError("Invoice is already fully paid.")

        amount_dec = round_money(amount)
        if amount_dec <= Decimal("0.00"):
            raise BusinessLogicError("Payment amount must be greater than zero.")

        # Enforce overpayment rejection constraint
        if amount_dec > invoice.balance_due:
            raise BusinessLogicError(
                f"Overpayment rejected. Payment amount ₹{amount_dec:,.2f} exceeds remaining invoice balance due ₹{invoice.balance_due:,.2f}."
            )

        payment_number = cls.generate_payment_number()
        payment = Payment.objects.create(
            payment_number=payment_number,
            invoice=invoice,
            customer=invoice.customer,
            amount=amount_dec,
            payment_method=payment_method,
            status=Payment.Status.SUCCEEDED,
            transaction_reference=transaction_reference,
            processed_at=timezone.now(),
        )

        # Update invoice balance and status
        invoice.amount_paid = round_money(invoice.amount_paid + amount_dec)
        invoice.balance_due = round_money(invoice.balance_due - amount_dec)

        if invoice.balance_due <= Decimal("0.00"):
            invoice.status = Invoice.Status.PAID
            invoice.balance_due = Decimal("0.00")

        invoice.save()
        return payment
