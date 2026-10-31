from rest_framework.routers import DefaultRouter
from .views import SubscriptionViewSet

app_name = "subscriptions"

router = DefaultRouter()
router.register(r"", SubscriptionViewSet, basename="subscription")

urlpatterns = router.urls
