from django.urls import path
from .views import AnalyticsOverviewView, RevenueTrendsView, PlanDistributionView

app_name = "analytics"

urlpatterns = [
    path("overview/", AnalyticsOverviewView.as_view(), name="analytics-overview"),
    path("trends/", RevenueTrendsView.as_view(), name="analytics-trends"),
    path("distribution/", PlanDistributionView.as_view(), name="analytics-distribution"),
]
