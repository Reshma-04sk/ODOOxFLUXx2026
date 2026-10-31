from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User
from customers.models import Customer


class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="testuser@brightloop.io",
            password="StrongPassword123!",
            full_name="Test Developer",
            role=User.Role.CUSTOMER,
        )

    def test_argon2_password_hashing(self):
        """Verify that passwords are stored using the Argon2 hasher."""
        self.assertTrue(self.user.password.startswith("argon2"))
        self.assertTrue(self.user.check_password("StrongPassword123!"))
        self.assertFalse(self.user.check_password("WrongPassword"))

    def test_case_insensitive_unique_email(self):
        """Email should be normalized and case-insensitive unique."""
        with self.assertRaises(Exception):
            User.objects.create_user(
                email="TESTUSER@brightloop.io",
                password="AnotherPassword123!",
            )

    def test_csrf_token_endpoint(self):
        """CSRF token endpoint should return token and set cookie."""
        url = reverse("accounts:csrf")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("csrfToken", response.data)
        self.assertTrue(len(response.data["csrfToken"]) > 10)

    def test_user_registration(self):
        """Registration should create user, provision Customer entity, and start session."""
        url = reverse("accounts:register")
        payload = {
            "email": "newtenant@brightloop.io",
            "password": "SecurePassword987!",
            "full_name": "New Tenant Founder",
            "company_name": "Apex Cloud Systems",
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["email"], "newtenant@brightloop.io")

        # Verify Customer entity was created
        customer = Customer.objects.get(email="newtenant@brightloop.io")
        self.assertEqual(customer.company_name, "Apex Cloud Systems")
        self.assertEqual(response.data["customer_id"], customer.id)

    def test_login_and_current_user_me(self):
        """Login should authenticate with session and allow querying /me/."""
        login_url = reverse("accounts:login")
        payload = {
            "email": "testuser@brightloop.io",
            "password": "StrongPassword123!",
        }
        login_resp = self.client.post(login_url, payload, format="json")
        self.assertEqual(login_resp.status_code, status.HTTP_200_OK)

        me_url = reverse("accounts:me")
        me_resp = self.client.get(me_url)
        self.assertEqual(me_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(me_resp.data["email"], "testuser@brightloop.io")

    def test_login_invalid_credentials(self):
        """Invalid credentials should return 400 Bad Request."""
        login_url = reverse("accounts:login")
        payload = {
            "email": "testuser@brightloop.io",
            "password": "IncorrectPassword!",
        }
        resp = self.client.post(login_url, payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logout(self):
        """Logout flushes session and revokes access to /me/."""
        self.client.login(email="testuser@brightloop.io", password="StrongPassword123!")
        logout_url = reverse("accounts:logout")
        logout_resp = self.client.post(logout_url)
        self.assertEqual(logout_resp.status_code, status.HTTP_200_OK)

        me_url = reverse("accounts:me")
        me_resp = self.client.get(me_url)
        self.assertEqual(me_resp.status_code, status.HTTP_403_FORBIDDEN)
