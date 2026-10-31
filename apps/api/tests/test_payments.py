from decimal import Decimal
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User
from customers.models import Customer
from invoices.models import Invoice
from invoices.services import InvoiceService
from payments.models import Payment
from payments.services import PaymentService
from common.exceptions import BusinessLogicError, InvalidStateTransitionError


class PaymentTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="payer@brightloop.io",
            password="Password123!",
            full_name="Payment Manager",
        )
        self.customer = Customer.objects.create(
            user=self.user,
            company_name="Payment Customer Inc",
            email="payer@brightloop.io",
        )
        self.client.force_authenticate(user=self.user)

        self.invoice = InvoiceService.create_invoice(
            customer=self.customer,
            line_items_data=[{"description": "SaaS Platform", "quantity": 1, "unit_price": Decimal("1000.00")}],
            tax_rate=Decimal("0.18"),
        )
        # Total: 1180.00 (1000 + 180 GST)

    def test_partial_and_full_payment_balance_updates(self):
        """Recording partial then full payments updates balance_due and marks status PAID."""
        # Partial payment of 500
        p1 = PaymentService.record_payment(
            invoice=self.invoice,
            amount=Decimal("500.00"),
            payment_method=Payment.PaymentMethod.UPI,
            transaction_reference="UPI/2026/8392019",
        )
        self.invoice.refresh_from_db()
        self.assertEqual(self.invoice.amount_paid, Decimal("500.00"))
        self.assertEqual(self.invoice.balance_due, Decimal("680.00"))
        self.assertEqual(self.invoice.status, Invoice.Status.OPEN)

        # Full settlement payment of 680
        p2 = PaymentService.record_payment(
            invoice=self.invoice,
            amount=Decimal("680.00"),
            payment_method=Payment.PaymentMethod.CARD,
        )
        self.invoice.refresh_from_db()
        self.assertEqual(self.invoice.amount_paid, Decimal("1180.00"))
        self.assertEqual(self.invoice.balance_due, Decimal("0.00"))
        self.assertEqual(self.invoice.status, Invoice.Status.PAID)

    def test_overpayment_rejected(self):
        """Attempting to pay an amount greater than balance_due must be rejected with BusinessLogicError."""
        with self.assertRaises(BusinessLogicError):
            PaymentService.record_payment(
                invoice=self.invoice,
                amount=Decimal("1500.00"),  # Balance is 1180.00
            )

    def test_payment_on_void_invoice_rejected(self):
        """Paying a void invoice must raise InvalidStateTransitionError."""
        self.invoice.status = Invoice.Status.VOID
        self.invoice.save()

        with self.assertRaises(InvalidStateTransitionError):
            PaymentService.record_payment(
                invoice=self.invoice,
                amount=Decimal("100.00"),
            )

    def test_process_refund_full(self):
        """Full refund updates payment status to REFUNDED, resets invoice balance, and sets status back to OPEN."""
        payment = PaymentService.record_payment(
            invoice=self.invoice,
            amount=Decimal("1180.00"),
            payment_method=Payment.PaymentMethod.UPI,
        )
        self.invoice.refresh_from_db()
        self.assertEqual(self.invoice.status, Invoice.Status.PAID)
        self.assertEqual(self.invoice.balance_due, Decimal("0.00"))

        refunded = PaymentService.process_refund(
            payment=payment,
            reason="Customer dissatisfaction",
        )
        self.assertEqual(refunded.status, Payment.Status.REFUNDED)
        self.invoice.refresh_from_db()
        self.assertEqual(self.invoice.amount_paid, Decimal("0.00"))
        self.assertEqual(self.invoice.balance_due, Decimal("1180.00"))
        self.assertEqual(self.invoice.status, Invoice.Status.OPEN)

    def test_process_refund_partial(self):
        """Partial refund deducts from amount_paid and increases balance_due proportionally."""
        payment = PaymentService.record_payment(
            invoice=self.invoice,
            amount=Decimal("1180.00"),
            payment_method=Payment.PaymentMethod.CARD,
        )
        PaymentService.process_refund(
            payment=payment,
            refund_amount=Decimal("300.00"),
            reason="Partial credit adjustment",
        )
        self.invoice.refresh_from_db()
        self.assertEqual(self.invoice.amount_paid, Decimal("880.00"))
        self.assertEqual(self.invoice.balance_due, Decimal("300.00"))
        self.assertEqual(self.invoice.status, Invoice.Status.OPEN)

    def test_refund_exceeding_payment_rejected(self):
        """Refund amount greater than the original payment amount must raise BusinessLogicError."""
        payment = PaymentService.record_payment(
            invoice=self.invoice,
            amount=Decimal("500.00"),
            payment_method=Payment.PaymentMethod.BANK_TRANSFER,
        )
        with self.assertRaises(BusinessLogicError):
            PaymentService.process_refund(
                payment=payment,
                refund_amount=Decimal("600.00"),
            )

    def test_refund_api_staff_permission(self):
        """Only staff members can initiate refunds via the API endpoint."""
        payment = PaymentService.record_payment(
            invoice=self.invoice,
            amount=Decimal("500.00"),
            payment_method=Payment.PaymentMethod.UPI,
        )
        refund_url = reverse("payments:payment-refund", kwargs={"pk": payment.id})

        # Regular customer user -> 403 Forbidden
        res_forbidden = self.client.post(refund_url, {"refund_amount": "500.00"})
        self.assertEqual(res_forbidden.status_code, status.HTTP_403_FORBIDDEN)

        # Staff user -> 200 OK
        staff_user = User.objects.create_superuser(
            email="admin@brightloop.io",
            password="AdminPassword123!",
            full_name="Admin User",
        )
        self.client.force_authenticate(user=staff_user)
        res_ok = self.client.post(refund_url, {"refund_amount": "500.00", "reason": "Authorized refund"})
        self.assertEqual(res_ok.status_code, status.HTTP_200_OK)
        self.assertEqual(res_ok.data["status"], Payment.Status.REFUNDED)
