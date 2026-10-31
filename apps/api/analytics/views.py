from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, serializers
from drf_spectacular.utils import extend_schema
from .services import AnalyticsService


class AnalyticsOverviewSerializer(serializers.Serializer):
    mrr = serializers.CharField()
    arr = serializers.CharField()
    active_subscriptions = serializers.IntegerField()
    trialing_subscriptions = serializers.IntegerField()
    canceled_subscriptions = serializers.IntegerField()
    total_subscriptions = serializers.IntegerField()
    churn_rate = serializers.FloatField()
    total_revenue = serializers.CharField()
    total_outstanding = serializers.CharField()
    arpu = serializers.CharField()
    currency = serializers.CharField()


class RevenueTrendItemSerializer(serializers.Serializer):
    month = serializers.CharField()
    invoiced = serializers.FloatField()
    collected = serializers.FloatField()


class PlanDistributionItemSerializer(serializers.Serializer):
    plan_name = serializers.CharField()
    tier = serializers.CharField()
    subscribers = serializers.IntegerField()


class AnalyticsOverviewView(APIView):
    """
    Overview KPIs: MRR, ARR, Active Subscribers, Churn Rate, Outstanding balance.
    """
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(responses={200: AnalyticsOverviewSerializer})
    def get(self, request):
        user = request.user
        customer = None if (user.is_staff or user.is_superuser) else getattr(user, "customer_profile", None)
        kpis = AnalyticsService.get_kpis(customer=customer)
        return Response(kpis)


class RevenueTrendsView(APIView):
    """
    Historical monthly trends of invoiced vs collected revenue.
    """
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(responses={200: RevenueTrendItemSerializer(many=True)})
    def get(self, request):
        user = request.user
        customer = None if (user.is_staff or user.is_superuser) else getattr(user, "customer_profile", None)
        months = int(request.query_params.get("months", 6))
        trends = AnalyticsService.get_revenue_trends(customer=customer, months=months)
        return Response(trends)


class PlanDistributionView(APIView):
    """
    Active subscriber distribution by plan tier.
    """
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(responses={200: PlanDistributionItemSerializer(many=True)})
    def get(self, request):
        user = request.user
        customer = None if (user.is_staff or user.is_superuser) else getattr(user, "customer_profile", None)
        distribution = AnalyticsService.get_plan_distribution(customer=customer)
        return Response(distribution)
