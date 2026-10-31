from decimal import Decimal
from datetime import timedelta
from django.test import TestCase
from django.utils import timezone
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from accounts.models import User
from customers.models import Customer
from plans.models import Plan
from subscriptions.models import Subscription, SubscriptionLine, SubscriptionEvent
from subscriptions.services import SubscriptionService
from billing.services import BillingEngine
from invoices.models import Invoice, InvoiceLineItem, InvoiceLineTax
from invoices.services import InvoiceService
from catalog.models import (
    Tax,
    PaymentTerm,
    Attribute,
    AttributeValue,
    Product,
    ProductVariant,
    QuotationTemplate,
    QuotationTemplateLine,
    Quotation,
    QuotationLine,
)
from catalog.services import QuotationService
from common.exceptions import BusinessLogicError


class CatalogAndLifecycleTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Admin user
        self.admin_user = User.objects.create_superuser(
            email="admin@brightloop.io",
            password="AdminPassword123!",
            full_name="System Admin",
        )

        # Staff user
        self.staff_user = User.objects.create_user(
            email="staff@brightloop.io",
            password="StaffPassword123!",
            full_name="Staff Operator",
            is_staff=True,
            role=User.Role.STAFF,
        )

        # Customer user
        self.customer_user = User.objects.create_user(
            email="client@acme.com",
            password="CustomerPassword123!",
            full_name="Acme Billing",
            role=User.Role.CUSTOMER,
        )
        self.customer = Customer.objects.create(
            user=self.customer_user,
            company_name="Acme Solutions Pvt Ltd",
            email="client@acme.com",
            tax_id="29ABCDE1234F1Z5",
        )

        # Taxes
        self.tax_gst18 = Tax.objects.create(
            name="GST 18%",
            rate=Decimal("0.1800"),
            kind=Tax.Kind.PERCENT,
        )
        self.tax_cess = Tax.objects.create(
            name="Swachh Bharat Cess",
            rate=Decimal("50.00"),
            kind=Tax.Kind.FIXED,
        )

        # Payment Term
        self.net30 = PaymentTerm.objects.create(
            name="Net 30 Days",
            due_days=30,
        )

        # Product, Attribute, AttributeValue, Variant
        self.brand_attr = Attribute.objects.create(name="Brand")
        self.odoo_val = AttributeValue.objects.create(
            attribute=self.brand_attr,
            name="Odoo",
            extra_price=Decimal("560.00"),
        )
        self.base_product = Product.objects.create(
            name="ERP Connector Module",
            type=Product.ProductType.SERVICE,
            sales_price=Decimal("2000.00"),
            cost_price=Decimal("800.00"),
        )
        self.base_product.taxes.add(self.tax_gst18)

        self.odoo_variant = ProductVariant.objects.create(
            product=self.base_product,
            sku="ERP-CONN-ODOO",
        )
        self.odoo_variant.attribute_values.add(self.odoo_val)

        # Plan
        self.saas_plan = Plan.objects.create(
            name="Business Pro Tier",
            code="business-pro",
            price=Decimal("4999.00"),
            billing_frequency=Plan.BillingFrequency.MONTHLY,
            interval_count=1,
            min_qty=1,
            auto_close=False,
            closable=True,
            pausable=True,
            renewable=True,
        )

    def test_product_variant_extra_price_addition(self):
        """Variant with extra_price (Brand=Odoo +560) correctly calculates extra_price and effective_price."""
        self.assertEqual(self.odoo_variant.extra_price, Decimal("560.00"))
        # 2000 base + 560 extra = 2560.00
        self.assertEqual(self.odoo_variant.effective_price, Decimal("2560.00"))

    def test_tax_computation_percent_and_fixed(self):
        """Tax compute_tax handles percentage (18%) and fixed amounts accurately with ROUND_HALF_UP."""
        # 18% of 1000 = 180.00
        tax_amt = self.tax_gst18.compute_tax(Decimal("1000.00"))
        self.assertEqual(tax_amt, Decimal("180.00"))

        # Fixed cess of 50.00 x 2 qty = 100.00
        fixed_amt = self.tax_cess.compute_tax(Decimal("1000.00"), quantity=Decimal("2.00"))
        self.assertEqual(fixed_amt, Decimal("100.00"))

    def test_quotation_template_and_create_quotation_endpoint(self):
        """Quotation created from template inherits plan, payment_term, validity_days, and line prices with taxes."""
        template = QuotationTemplate.objects.create(
            name="Standard Odoo Onboarding Pack",
            plan=self.saas_plan,
            validity_days=25,
            payment_term=self.net30,
        )
        QuotationTemplateLine.objects.create(
            template=template,
            product=self.base_product,
            variant=self.odoo_variant,
            quantity=Decimal("2.00"),
        )

        self.client.force_authenticate(user=self.admin_user)
        url = reverse("catalog:quotation-create-from-template")
        res = self.client.post(url, {"template_id": template.id, "customer_id": self.customer.id}, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        data = res.data

        # 2 qty * 2560.00 (2000 + 560 extra) = 5120.00 subtotal
        # 18% GST on 5120 = 921.60
        # Total = 6041.60
        self.assertEqual(Decimal(str(data["subtotal"])), Decimal("5120.00"))
        self.assertEqual(Decimal(str(data["tax_amount"])), Decimal("921.60"))
        self.assertEqual(Decimal(str(data["total_amount"])), Decimal("6041.60"))
        self.assertEqual(data["payment_term"], self.net30.id)

        today = timezone.now().date()
        expected_validity = (today + timedelta(days=25)).isoformat()
        self.assertEqual(data["validity_date"], expected_validity)

    def test_confirm_quotation_creates_subscription_lines_and_events(self):
        """Confirming a quotation provisions a Subscription with SubscriptionLine items and a SubscriptionEvent."""
        template = QuotationTemplate.objects.create(
            name="Starter Package Template",
            plan=self.saas_plan,
            validity_days=30,
            payment_term=self.net30,
        )
        QuotationTemplateLine.objects.create(
            template=template,
            product=self.base_product,
            variant=self.odoo_variant,
            quantity=Decimal("1.00"),
        )
        quotation = QuotationService.create_from_template(template, self.customer)

        self.client.force_authenticate(user=self.admin_user)
        confirm_url = reverse("catalog:quotation-confirm-subscription", kwargs={"pk": quotation.id})
        res = self.client.post(confirm_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        quotation.refresh_from_db()
        self.assertEqual(quotation.status, Quotation.Status.CONFIRMED)
        self.assertIsNotNone(quotation.subscription)

        subscription = quotation.subscription
        self.assertEqual(subscription.customer, self.customer)
        self.assertEqual(subscription.plan, self.saas_plan)
        self.assertEqual(subscription.payment_term, self.net30)

        # Check SubscriptionLines
        self.assertEqual(subscription.lines.count(), 1)
        sub_line = subscription.lines.first()
        self.assertEqual(sub_line.product, self.base_product)
        self.assertEqual(sub_line.variant, self.odoo_variant)
        self.assertEqual(sub_line.unit_price, Decimal("2560.00"))

        # Check SubscriptionEvent
        self.assertTrue(subscription.events.filter(to_status=Subscription.Status.ACTIVE).exists())

    def test_admin_only_writes_staff_read_only_permissions(self):
        """Staff members have read-only access (GET); write access (POST/PATCH/DELETE) requires Admin/Superuser."""
        url = reverse("catalog:product-list")

        # 1. Staff user can GET list
        self.client.force_authenticate(user=self.staff_user)
        get_res = self.client.get(url)
        self.assertEqual(get_res.status_code, status.HTTP_200_OK)

        # 2. Staff user CANNOT write (POST) -> 403 Forbidden
        post_res = self.client.post(url, {
            "name": "Staff Added Product",
            "sales_price": "500.00",
            "type": "service",
        })
        self.assertEqual(post_res.status_code, status.HTTP_403_FORBIDDEN)

        # 3. Admin user CAN write (POST) -> 201 Created
        self.client.force_authenticate(user=self.admin_user)
        admin_res = self.client.post(url, {
            "name": "Admin Authorized Product",
            "sales_price": "750.00",
            "type": "service",
        })
        self.assertEqual(admin_res.status_code, status.HTTP_201_CREATED)

    def test_plan_lifecycle_flags_enforcement(self):
        """Pausable, closable, and active date flags on Plan are strictly enforced."""
        # Non-pausable plan
        unpausable_plan = Plan.objects.create(
            name="Unpausable Annual",
            code="unpausable-annual",
            price=Decimal("12000.00"),
            billing_frequency=Plan.BillingFrequency.YEARLY,
            pausable=False,
            closable=True,
        )
        sub = SubscriptionService.create_subscription(self.customer, unpausable_plan)
        with self.assertRaises(BusinessLogicError) as ctx:
            SubscriptionService.pause_subscription(sub)
        self.assertIn("does not permit pausing", str(ctx.exception))

        # Non-closable plan
        unclosable_plan = Plan.objects.create(
            name="Unclosable 3-Year Lock",
            code="unclosable-lock",
            price=Decimal("30000.00"),
            billing_frequency=Plan.BillingFrequency.YEARLY,
            pausable=True,
            closable=False,
        )
        sub_locked = SubscriptionService.create_subscription(self.customer, unclosable_plan)
        with self.assertRaises(BusinessLogicError) as ctx:
            SubscriptionService.cancel_subscription(sub_locked, immediate=True)
        self.assertIn("cannot be closed", str(ctx.exception))

        # Expired plan by end_date
        expired_plan = Plan.objects.create(
            name="Legacy 2025 Plan",
            code="legacy-2025",
            price=Decimal("1000.00"),
            billing_frequency=Plan.BillingFrequency.MONTHLY,
            end_date=timezone.now().date() - timedelta(days=10),
        )
        with self.assertRaises(BusinessLogicError) as ctx:
            SubscriptionService.create_subscription(self.customer, expired_plan)
        self.assertIn("has discontinued", str(ctx.exception))

    def test_billing_engine_auto_close_and_renewable_enforcement(self):
        """Subscription on plan with auto_close=True or renewable=False closes at period end instead of renewing."""
        auto_close_plan = Plan.objects.create(
            name="Auto Close Pilot",
            code="auto-close-pilot",
            price=Decimal("1000.00"),
            billing_frequency=Plan.BillingFrequency.MONTHLY,
            auto_close=True,
            renewable=False,
        )
        yesterday = timezone.now().date() - timedelta(days=1)
        sub = Subscription.objects.create(
            customer=self.customer,
            plan=auto_close_plan,
            status=Subscription.Status.ACTIVE,
            start_date=yesterday - timedelta(days=30),
            current_period_start=yesterday - timedelta(days=30),
            current_period_end=yesterday,
        )

        record = BillingEngine.run_billing(target_date=timezone.now().date())
        sub.refresh_from_db()
        self.assertEqual(sub.status, Subscription.Status.CANCELED)
        self.assertIsNotNone(sub.canceled_at)
        self.assertTrue(sub.events.filter(to_status=Subscription.Status.CANCELED).exists())
        # No renewal invoice generated
        self.assertFalse(Invoice.objects.filter(subscription=sub, period_start=yesterday).exists())

    def test_invoice_line_tax_snapshots_and_variant_price(self):
        """Invoices calculate per-line taxes and create immutable InvoiceLineTax snapshots."""
        line_items = [
            {
                "description": "Custom Line with Variant",
                "quantity": 2,
                "product": self.base_product,
                "variant": self.odoo_variant,  # 2000 + 560 = 2560.00
                "taxes": [self.tax_gst18, self.tax_cess],
            }
        ]
        # Line subtotal = 2 * 2560 = 5120.00
        # GST 18% = 921.60
        # Cess = 50 * 2 = 100.00
        # Tax total = 1021.60
        # Total = 6141.60
        invoice = InvoiceService.create_invoice(
            customer=self.customer,
            line_items_data=line_items,
        )
        self.assertEqual(invoice.subtotal, Decimal("5120.00"))
        self.assertEqual(invoice.tax_amount, Decimal("1021.60"))
        self.assertEqual(invoice.total_amount, Decimal("6141.60"))

        line_item = invoice.line_items.first()
        self.assertEqual(line_item.taxes.count(), 2)

        gst_snapshot = line_item.taxes.filter(name="GST 18%").first()
        self.assertIsNotNone(gst_snapshot)
        self.assertEqual(gst_snapshot.amount, Decimal("921.60"))

        cess_snapshot = line_item.taxes.filter(name="Swachh Bharat Cess").first()
        self.assertIsNotNone(cess_snapshot)
        self.assertEqual(cess_snapshot.amount, Decimal("100.00"))
