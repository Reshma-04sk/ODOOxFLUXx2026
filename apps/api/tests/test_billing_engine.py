from datetime import date, timedelta
from decimal import Decimal
from io import StringIO
from django.test import TestCase
from django.core.management import call_command
from accounts.models import User
from customers.models import Customer
from plans.models import Plan
from subscriptions.models import Subscription
from subscriptions.services import SubscriptionService
from invoices.models import Invoice
from billing.models import BillingExecutionRecord
from billing.services import BillingEngine


class BillingEngineTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="billingtester@brightloop.io",
            password="Password123!",
            full_name="Billing Lead",
        )
        self.customer = Customer.objects.create(
            user=self.user,
            company_name="Idempotent Cloud Systems",
            email="billingtester@brightloop.io",
        )

        self.plan = Plan.objects.create(
            name="Pro Monthly",
            code="pro-monthly",
            price=Decimal("4999.00"),
            billing_frequency=Plan.BillingFrequency.MONTHLY,
        )

        # Set up a subscription whose current period ends today
        self.today = date.today()
        self.past_start = self.today - timedelta(days=30)
        self.subscription = Subscription.objects.create(
            customer=self.customer,
            plan=self.plan,
            status=Subscription.Status.ACTIVE,
            start_date=self.past_start,
            current_period_start=self.past_start,
            current_period_end=self.today,
        )

    def test_idempotent_billing_execution(self):
        """
        Billing run generates renewal invoice and advances period.
        Executing billing a SECOND time on the same target date MUST be strictly idempotent
        (0 new invoices generated, 0 duplicate invoices).
        """
        # Run 1: live execution
        record1 = BillingEngine.run_billing(target_date=self.today, dry_run=False)
        self.assertEqual(record1.status, BillingExecutionRecord.Status.COMPLETED)
        self.assertEqual(record1.invoices_generated, 1)

        self.subscription.refresh_from_db()
        self.assertEqual(self.subscription.current_period_start, self.today)
        self.assertTrue(self.subscription.current_period_end > self.today)

        initial_invoice_count = Invoice.objects.filter(subscription=self.subscription).count()
        self.assertEqual(initial_invoice_count, 1)

        # Run 2: idempotent re-execution for the same target date
        record2 = BillingEngine.run_billing(target_date=self.today, dry_run=False)
        self.assertEqual(record2.status, BillingExecutionRecord.Status.COMPLETED)
        self.assertEqual(record2.invoices_generated, 0)

        # Verify no duplicate invoice was generated
        final_invoice_count = Invoice.objects.filter(subscription=self.subscription).count()
        self.assertEqual(final_invoice_count, 1)

    def test_cancel_at_period_end_transition(self):
        """A subscription flagged to cancel at period end should become CANCELED upon period expiry."""
        self.subscription.cancel_at_period_end = True
        self.subscription.save()

        record = BillingEngine.run_billing(target_date=self.today, dry_run=False)
        self.assertEqual(record.status, BillingExecutionRecord.Status.COMPLETED)
        self.assertEqual(record.invoices_generated, 0)

        self.subscription.refresh_from_db()
        self.assertEqual(self.subscription.status, Subscription.Status.CANCELED)
        self.assertIsNotNone(self.subscription.canceled_at)

    def test_run_billing_management_command(self):
        """Verify python manage.py run_billing command output."""
        out = StringIO()
        call_command("run_billing", f"--date={self.today.isoformat()}", stdout=out)
        output = out.getvalue()
        self.assertIn("Completed successfully", output)
