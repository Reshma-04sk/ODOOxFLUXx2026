from rest_framework.routers import DefaultRouter
from .views import PlanViewSet

app_name = "plans"

router = DefaultRouter()
router.register(r"", PlanViewSet, basename="plan")

urlpatterns = router.urls
