from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User
from customers.models import Customer
from plans.models import Plan
from subscriptions.models import Subscription
from subscriptions.services import SubscriptionService


class CustomerIsolationTests(TestCase):
    def setUp(self):
        self.client_a = APIClient()
        self.user_a = User.objects.create_user(
            email="tenant_a@brightloop.io",
            password="Password123!",
            full_name="Tenant A Admin",
        )
        self.customer_a = Customer.objects.create(
            user=self.user_a,
            company_name="Tenant A Corp",
            email="tenant_a@brightloop.io",
        )
        self.client_a.force_authenticate(user=self.user_a)

        self.client_b = APIClient()
        self.user_b = User.objects.create_user(
            email="tenant_b@brightloop.io",
            password="Password123!",
            full_name="Tenant B Admin",
        )
        self.customer_b = Customer.objects.create(
            user=self.user_b,
            company_name="Tenant B Corp",
            email="tenant_b@brightloop.io",
        )
        self.client_b.force_authenticate(user=self.user_b)

        self.staff_client = APIClient()
        self.staff_user = User.objects.create_superuser(
            email="staff@brightloop.io",
            password="AdminPassword123!",
            full_name="PlanLedger Staff Lead",
        )
        self.staff_client.force_authenticate(user=self.staff_user)

        self.plan = Plan.objects.create(
            name="Growth Monthly",
            code="growth-monthly",
            price=2999.00,
            billing_frequency=Plan.BillingFrequency.MONTHLY,
        )

        self.sub_a = SubscriptionService.create_subscription(customer=self.customer_a, plan=self.plan)
        self.sub_b = SubscriptionService.create_subscription(customer=self.customer_b, plan=self.plan)

    def test_customer_cannot_see_other_tenants_in_list(self):
        """Customer A should only see Customer A's record in listing."""
        url = reverse("customers:customer-list")
        response = self.client_a.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["id"], self.customer_a.id)

    def test_customer_accessing_other_tenant_detail_returns_404(self):
        """Cross-tenant direct lookup must return HTTP 404 (not 403)."""
        url = reverse("customers:customer-detail", kwargs={"pk": self.customer_b.id})
        response = self.client_a.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_customer_cannot_access_other_tenants_subscriptions(self):
        """Customer A querying Customer B's subscription must return 404."""
        url = reverse("subscriptions:subscription-detail", kwargs={"pk": self.sub_b.id})
        response = self.client_a.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_staff_can_view_all_tenants(self):
        """Staff/Superuser should have global visibility across all tenants."""
        url = reverse("customers:customer-list")
        response = self.staff_client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 2)
