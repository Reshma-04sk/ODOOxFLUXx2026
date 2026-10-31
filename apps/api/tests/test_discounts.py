from decimal import Decimal
from datetime import timedelta
from django.test import TestCase
from django.utils import timezone
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User
from customers.models import Customer
from discounts.models import Discount
from discounts.services import DiscountService
from common.exceptions import BusinessLogicError


class DiscountTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="couponuser@brightloop.io",
            password="Password123!",
            full_name="Coupon Tester",
        )
        self.customer = Customer.objects.create(
            user=self.user,
            company_name="Coupon Org",
            email="couponuser@brightloop.io",
        )
        self.client.force_authenticate(user=self.user)

        now = timezone.now()
        self.pct_discount = Discount.objects.create(
            code="SAVE20",
            discount_type=Discount.DiscountType.PERCENTAGE,
            value=Decimal("20.00"),
            min_subtotal=Decimal("1000.00"),
            valid_from=now - timedelta(days=1),
            valid_until=now + timedelta(days=30),
            max_redemptions=5,
        )

        self.expired_discount = Discount.objects.create(
            code="EXPIRED50",
            discount_type=Discount.DiscountType.PERCENTAGE,
            value=Decimal("50.00"),
            valid_from=now - timedelta(days=30),
            valid_until=now - timedelta(days=1),
        )

        self.limited_discount = Discount.objects.create(
            code="ONELEFT",
            discount_type=Discount.DiscountType.FIXED_AMOUNT,
            value=Decimal("300.00"),
            valid_from=now - timedelta(days=1),
            valid_until=now + timedelta(days=30),
            max_redemptions=1,
            times_redeemed=1,
        )

    def test_percentage_discount_calculation(self):
        """20% discount on ₹2000 subtotal should be ₹400."""
        discount, amount = DiscountService.validate_discount("SAVE20", self.customer, Decimal("2000.00"))
        self.assertEqual(amount, Decimal("400.00"))

    def test_min_subtotal_enforcement(self):
        """Applying SAVE20 on ₹800 subtotal (below ₹1000 min) should raise BusinessLogicError."""
        with self.assertRaises(BusinessLogicError):
            DiscountService.validate_discount("SAVE20", self.customer, Decimal("800.00"))

    def test_expired_discount_rejection(self):
        """Expired discount codes must be rejected."""
        with self.assertRaises(BusinessLogicError):
            DiscountService.validate_discount("EXPIRED50", self.customer, Decimal("2000.00"))

    def test_max_redemptions_exhausted_rejection(self):
        """Discounts exceeding max_redemptions must be rejected."""
        with self.assertRaises(BusinessLogicError):
            DiscountService.validate_discount("ONELEFT", self.customer, Decimal("2000.00"))

    def test_validate_discount_api_endpoint(self):
        """API endpoint /api/v1/discounts/validate/ should return computed discount details."""
        url = reverse("discounts:validate-discount")
        payload = {
            "code": "SAVE20",
            "subtotal": 2500.00,
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["code"], "SAVE20")
        self.assertEqual(Decimal(str(response.data["discount_amount"])), Decimal("500.00"))
        self.assertEqual(Decimal(str(response.data["new_subtotal"])), Decimal("2000.00"))
