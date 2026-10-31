from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BillingExecutionViewSet, TriggerBillingView

app_name = "billing"

router = DefaultRouter()
router.register(r"records", BillingExecutionViewSet, basename="billing-record")

urlpatterns = [
    path("trigger/", TriggerBillingView.as_view(), name="trigger-billing"),
    path("", include(router.urls)),
]
