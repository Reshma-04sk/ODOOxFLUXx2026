from decimal import Decimal
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User
from customers.models import Customer
from invoices.models import Invoice
from invoices.services import InvoiceService
from common.exceptions import InvalidStateTransitionError


class InvoiceTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="invoiceuser@brightloop.io",
            password="Password123!",
            full_name="Invoice Manager",
        )
        self.customer = Customer.objects.create(
            user=self.user,
            company_name="Invoice Customer LLP",
            email="invoiceuser@brightloop.io",
        )
        self.client.force_authenticate(user=self.user)

    def test_invoice_creation_with_tax_and_balance(self):
        """Invoice creation should calculate 18% GST tax and set total balance."""
        items = [
            {"description": "Cloud Core License", "quantity": 2, "unit_price": Decimal("1000.00")},
            {"description": "Dedicated IP", "quantity": 1, "unit_price": Decimal("500.00")},
        ]
        # Subtotal: 2000 + 500 = 2500
        # Tax (18%): 450
        # Total: 2950.00
        invoice = InvoiceService.create_invoice(customer=self.customer, line_items_data=items)
        self.assertEqual(invoice.subtotal, Decimal("2500.00"))
        self.assertEqual(invoice.tax_amount, Decimal("450.00"))
        self.assertEqual(invoice.total_amount, Decimal("2950.00"))
        self.assertEqual(invoice.balance_due, Decimal("2950.00"))
        self.assertEqual(invoice.amount_paid, Decimal("0.00"))
        self.assertTrue(invoice.invoice_number.startswith("INV-"))

    def test_void_invoice(self):
        """Voiding an open invoice sets status to VOID and balance_due to 0."""
        invoice = InvoiceService.create_invoice(
            customer=self.customer,
            line_items_data=[{"description": "Service", "quantity": 1, "unit_price": Decimal("1000.00")}],
        )
        void_url = reverse("invoices:invoice-void", kwargs={"pk": invoice.id})
        response = self.client.post(void_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], Invoice.Status.VOID)
        self.assertEqual(Decimal(str(response.data["balance_due"])), Decimal("0.00"))

    def test_cannot_void_paid_invoice(self):
        """Voiding an already paid invoice must raise InvalidStateTransitionError (HTTP 400)."""
        invoice = InvoiceService.create_invoice(
            customer=self.customer,
            line_items_data=[{"description": "Service", "quantity": 1, "unit_price": Decimal("1000.00")}],
        )
        invoice.status = Invoice.Status.PAID
        invoice.balance_due = Decimal("0.00")
        invoice.save()

        with self.assertRaises(InvalidStateTransitionError):
            InvoiceService.void_invoice(invoice)
