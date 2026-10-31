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

    def test_receipt_endpoint_json_and_html(self):
        """Receipt endpoint returns full invoice JSON by default or formatted HTML with ?format=html."""
        invoice = InvoiceService.create_invoice(
            customer=self.customer,
            line_items_data=[{"description": "Pro Tier Monthly", "quantity": 1, "unit_price": Decimal("2499.00")}],
            tax_rate=Decimal("0.18"),
        )
        receipt_url = reverse("invoices:invoice-receipt", kwargs={"pk": invoice.id})

        # JSON response
        res_json = self.client.get(receipt_url)
        self.assertEqual(res_json.status_code, status.HTTP_200_OK)
        self.assertEqual(res_json.data["invoice_number"], invoice.invoice_number)
        self.assertEqual(len(res_json.data["line_items"]), 1)

        # HTML response
        res_html = self.client.get(f"{receipt_url}?export=html")
        self.assertEqual(res_html.status_code, status.HTTP_200_OK)
        self.assertIn("text/html", res_html.headers["Content-Type"])
        self.assertIn(invoice.invoice_number, res_html.content.decode())
        self.assertIn("Brightloop Software Technologies Pvt Ltd", res_html.content.decode())
