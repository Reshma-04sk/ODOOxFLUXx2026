from datetime import date, timedelta
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User
from customers.models import Customer
from plans.models import Plan
from subscriptions.models import Subscription


class SubscriptionLifecycleTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="subtenant@brightloop.io",
            password="Password123!",
            full_name="Subscriber Lead",
        )
        self.customer = Customer.objects.create(
            user=self.user,
            company_name="Cloudscale Technologies",
            email="subtenant@brightloop.io",
        )
        self.client.force_authenticate(user=self.user)

        self.starter_plan = Plan.objects.create(
            name="Starter Monthly",
            code="starter-monthly",
            price=999.00,
            billing_frequency=Plan.BillingFrequency.MONTHLY,
            trial_period_days=14,
        )

        self.enterprise_plan = Plan.objects.create(
            name="Enterprise Monthly",
            code="enterprise-monthly",
            price=9999.00,
            billing_frequency=Plan.BillingFrequency.MONTHLY,
        )

    def test_create_subscription_with_trial(self):
        """Creating a subscription with trial should set TRIALING status and period dates."""
        url = reverse("subscriptions:subscription-list")
        payload = {
            "plan_id": self.starter_plan.id,
            "is_trial": True,
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], Subscription.Status.TRIALING)
        self.assertIsNotNone(response.data["trial_end"])

    def test_cancel_subscription_at_period_end(self):
        """Canceling without immediate=True marks cancel_at_period_end without changing active status."""
        url = reverse("subscriptions:subscription-list")
        create_resp = self.client.post(url, {"plan_id": self.starter_plan.id}, format="json")
        sub_id = create_resp.data["id"]

        cancel_url = reverse("subscriptions:subscription-cancel", kwargs={"pk": sub_id})
        response = self.client.post(cancel_url, {"immediate": False}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["cancel_at_period_end"])
        self.assertEqual(response.data["status"], Subscription.Status.ACTIVE)

    def test_cancel_subscription_immediately(self):
        """Canceling with immediate=True marks status as CANCELED."""
        url = reverse("subscriptions:subscription-list")
        create_resp = self.client.post(url, {"plan_id": self.starter_plan.id}, format="json")
        sub_id = create_resp.data["id"]

        cancel_url = reverse("subscriptions:subscription-cancel", kwargs={"pk": sub_id})
        response = self.client.post(cancel_url, {"immediate": True}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], Subscription.Status.CANCELED)
        self.assertIsNotNone(response.data["canceled_at"])

    def test_invalid_state_transition_canceling_already_canceled_returns_400(self):
        """Attempting to cancel an already canceled subscription must return HTTP 400."""
        url = reverse("subscriptions:subscription-list")
        create_resp = self.client.post(url, {"plan_id": self.starter_plan.id}, format="json")
        sub_id = create_resp.data["id"]

        cancel_url = reverse("subscriptions:subscription-cancel", kwargs={"pk": sub_id})
        self.client.post(cancel_url, {"immediate": True}, format="json")

        # Second cancel should fail with 400
        second_resp = self.client.post(cancel_url, {"immediate": True}, format="json")
        self.assertEqual(second_resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(second_resp.data["error"]["code"], "invalid_state_transition")

    def test_pause_and_resume_subscription(self):
        """Pausing an active subscription sets status to PAUSED, resuming returns to ACTIVE."""
        url = reverse("subscriptions:subscription-list")
        create_resp = self.client.post(url, {"plan_id": self.starter_plan.id}, format="json")
        sub_id = create_resp.data["id"]

        # Pause
        pause_url = reverse("subscriptions:subscription-pause", kwargs={"pk": sub_id})
        pause_resp = self.client.post(pause_url)
        self.assertEqual(pause_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(pause_resp.data["status"], Subscription.Status.PAUSED)

        # Invalid transition: pausing already paused subscription returns 400
        double_pause = self.client.post(pause_url)
        self.assertEqual(double_pause.status_code, status.HTTP_400_BAD_REQUEST)

        # Resume
        resume_url = reverse("subscriptions:subscription-resume", kwargs={"pk": sub_id})
        resume_resp = self.client.post(resume_url)
        self.assertEqual(resume_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resume_resp.data["status"], Subscription.Status.ACTIVE)

    def test_upgrade_plan(self):
        """Upgrading plan switches to the new plan."""
        url = reverse("subscriptions:subscription-list")
        create_resp = self.client.post(url, {"plan_id": self.starter_plan.id}, format="json")
        sub_id = create_resp.data["id"]

        change_url = reverse("subscriptions:subscription-change-plan", kwargs={"pk": sub_id})
        change_resp = self.client.post(change_url, {"new_plan_id": self.enterprise_plan.id}, format="json")
        self.assertEqual(change_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(change_resp.data["plan"]["id"], self.enterprise_plan.id)
