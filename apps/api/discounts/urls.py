from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DiscountViewSet, ValidateDiscountView

app_name = "discounts"

router = DefaultRouter()
router.register(r"", DiscountViewSet, basename="discount")

urlpatterns = [
    path("validate/", ValidateDiscountView.as_view(), name="validate-discount"),
    path("", include(router.urls)),
]
