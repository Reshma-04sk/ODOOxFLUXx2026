import time
from decimal import Decimal
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User
from customers.models import Customer
from plans.models import Plan
from subscriptions.models import Subscription


class PaginationAndPerformanceTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.staff_user = User.objects.create_superuser(
            email="perflead@brightloop.io",
            password="Password123!",
            full_name="Perf Tester",
        )
        self.client.force_authenticate(user=self.staff_user)

        self.plan = Plan.objects.create(
            name="Starter Plan",
            code="starter-test",
            price=Decimal("999.00"),
        )

        # Create bulk test customers and subscriptions to verify pagination
        customers_to_create = [
            Customer(
                company_name=f"Bulk Company {i:03d}",
                email=f"bulk{i:03d}@brightloop.io",
                status=Customer.Status.ACTIVE,
            )
            for i in range(45)
        ]
        created_customers = Customer.objects.bulk_create(customers_to_create)

        today = timezone_now = timezone = __import__("django.utils.timezone", fromlist=["now"]).now().date()
        subs_to_create = [
            Subscription(
                customer=cust,
                plan=self.plan,
                status=Subscription.Status.ACTIVE,
                start_date=today,
                current_period_start=today,
                current_period_end=today,
            )
            for cust in created_customers
        ]
        Subscription.objects.bulk_create(subs_to_create)

    def test_pagination_envelope_structure(self):
        """API list endpoints must return standard paginated envelope."""
        url = reverse("customers:customer-list")
        response = self.client.get(f"{url}?page=1&page_size=20")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("count", response.data)
        self.assertIn("next", response.data)
        self.assertIn("previous", response.data)
        self.assertIn("page", response.data)
        self.assertIn("total_pages", response.data)
        self.assertIn("results", response.data)
        self.assertEqual(len(response.data["results"]), 20)
        self.assertEqual(response.data["total_pages"], 3)  # 45 items / 20 = 3 pages

    def test_api_latency_under_threshold(self):
        """Important API queries must return well under the 2.0 second latency threshold."""
        url = reverse("subscriptions:subscription-list")
        t0 = time.time()
        response = self.client.get(f"{url}?status=active&page_size=20")
        latency = time.time() - t0
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertLess(latency, 2.0, f"API took {latency:.3f}s, expected < 2.0s")
