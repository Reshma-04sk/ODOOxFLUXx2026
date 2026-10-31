from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


class HealthCheckTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_health_check_endpoint(self):
        """GET /api/health/ returns HTTP 200 with database connected and latency metrics."""
        response = self.client.get(reverse("health-check"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "ok")
        self.assertEqual(response.data["service"], "planledger-api")
        self.assertEqual(response.data["database"], "connected")
        self.assertEqual(response.data["version"], "1.0.0")
        self.assertIn("latency_ms", response.data)

    def test_healthz_endpoint(self):
        """GET /healthz alias returns HTTP 200."""
        response = self.client.get("/healthz")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "ok")
