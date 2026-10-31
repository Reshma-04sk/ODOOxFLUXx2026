from decimal import Decimal
from django.utils import timezone
from django.db import transaction
from .models import Payment
from invoices.models import Invoice
from notifications.services import EmailService
from notifications.models import Notification
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

        # Send payment receipt notification
        try:
            EmailService.send_notification(
                recipient_email=invoice.customer.email,
                customer=invoice.customer,
                subject=f"Payment Receipt: ₹{amount_dec:,.2f} for {invoice.invoice_number}",
                message=(
                    f"Dear {invoice.customer.company_name},\n\n"
                    f"We have successfully received your payment of ₹{amount_dec:,.2f} "
                    f"via {payment.get_payment_method_display()}.\n"
                    f"Invoice Reference: {invoice.invoice_number}\n"
                    f"Transaction ID: {payment.payment_number}\n"
                    f"Remaining Balance: ₹{invoice.balance_due:,.2f}\n\n"
                    f"Thank you for choosing Brightloop!"
                ),
                notification_type=Notification.NotificationType.PAYMENT_RECEIVED,
            )
        except Exception:
            pass

        return payment

    @classmethod
    @transaction.atomic
    def process_refund(
        cls,
        payment: Payment,
        refund_amount: Decimal = None,
        reason: str = "Customer requested refund",
    ) -> Payment:
        """
        Processes a partial or full refund on a previously succeeded payment.
        Adjusts the linked invoice balances and re-opens invoice if balance becomes due.
        """
        if payment.status != Payment.Status.SUCCEEDED:
            raise InvalidStateTransitionError(
                f"Cannot refund a payment with status '{payment.status}'. Only succeeded payments can be refunded."
            )

        if refund_amount is None:
            refund_amount = payment.amount
        else:
            refund_amount = round_money(refund_amount)

        if refund_amount <= Decimal("0.00"):
            raise BusinessLogicError("Refund amount must be greater than zero.")

        if refund_amount > payment.amount:
            raise BusinessLogicError(
                f"Refund amount ₹{refund_amount:,.2f} cannot exceed original payment amount ₹{payment.amount:,.2f}."
            )

        # Update payment status
        payment.status = Payment.Status.REFUNDED
        payment.save(update_fields=["status", "updated_at"])

        # Adjust invoice amounts
        invoice = payment.invoice
        invoice.amount_paid = round_money(max(invoice.amount_paid - refund_amount, Decimal("0.00")))
        invoice.balance_due = round_money(invoice.balance_due + refund_amount)

        if invoice.balance_due > Decimal("0.00") and invoice.status == Invoice.Status.PAID:
            invoice.status = Invoice.Status.OPEN

        invoice.save(update_fields=["amount_paid", "balance_due", "status", "updated_at"])

        # Send notification
        try:
            EmailService.send_notification(
                recipient_email=invoice.customer.email,
                customer=invoice.customer,
                subject=f"Refund Processed: ₹{refund_amount:,.2f} for {invoice.invoice_number}",
                message=(
                    f"Dear {invoice.customer.company_name},\n\n"
                    f"A refund of ₹{refund_amount:,.2f} has been processed for payment {payment.payment_number}.\n"
                    f"Reason: {reason}\n"
                    f"Updated Invoice Balance: ₹{invoice.balance_due:,.2f}\n\n"
                    f"Brightloop Accounts Team"
                ),
                notification_type=Notification.NotificationType.GENERAL,
            )
        except Exception:
            pass

        return payment
