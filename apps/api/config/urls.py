"""
PlanLedger Main URL Configuration
"""

from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from common.views import HealthCheckView

urlpatterns = [
    path("admin/", admin.site.urls),

    # Health Check endpoints (for Render, Docker, monitoring)
    path("api/health/", HealthCheckView.as_view(), name="health-check"),
    path("healthz", HealthCheckView.as_view(), name="healthz"),

    # OpenAPI Schema & Interactive API Documentation
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),

    # PlanLedger Domain REST APIs (v1)
    path("api/v1/accounts/", include("accounts.urls", namespace="accounts")),
    path("api/v1/customers/", include("customers.urls", namespace="customers")),
    path("api/v1/plans/", include("plans.urls", namespace="plans")),
    path("api/v1/subscriptions/", include("subscriptions.urls", namespace="subscriptions")),
    path("api/v1/discounts/", include("discounts.urls", namespace="discounts")),
    path("api/v1/invoices/", include("invoices.urls", namespace="invoices")),
    path("api/v1/payments/", include("payments.urls", namespace="payments")),
    path("api/v1/billing/", include("billing.urls", namespace="billing")),
    path("api/v1/analytics/", include("analytics.urls", namespace="analytics")),
    path("api/v1/notifications/", include("notifications.urls", namespace="notifications")),
]
