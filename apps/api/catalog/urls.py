from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TaxViewSet,
    PaymentTermViewSet,
    AttributeViewSet,
    AttributeValueViewSet,
    ProductViewSet,
    ProductVariantViewSet,
    QuotationTemplateViewSet,
    QuotationViewSet,
)

app_name = "catalog"

router = DefaultRouter()
router.register("taxes", TaxViewSet, basename="tax")
router.register("payment-terms", PaymentTermViewSet, basename="payment-term")
router.register("attributes", AttributeViewSet, basename="attribute")
router.register("attribute-values", AttributeValueViewSet, basename="attribute-value")
router.register("variants", ProductVariantViewSet, basename="variant")
router.register("products", ProductViewSet, basename="product")
router.register("templates", QuotationTemplateViewSet, basename="template")
router.register("quotations", QuotationViewSet, basename="quotation")

urlpatterns = [
    path("", include(router.urls)),
]
