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
