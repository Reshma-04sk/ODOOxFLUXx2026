from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema

from .models import Subscription
from .services import SubscriptionService
from .serializers import (
    SubscriptionSerializer,
    CreateSubscriptionSerializer,
    CancelSubscriptionSerializer,
    ChangePlanSerializer,
)
from customers.models import Customer
from plans.models import Plan
from common.permissions import IsCustomerOrStaff


class SubscriptionViewSet(viewsets.ModelViewSet):
    """
    Subscription lifecycle management API.
    Provides endpoints for creating, retrieving, canceling, pausing, resuming, and upgrading subscriptions.
    """
    queryset = Subscription.objects.select_related("customer", "plan").all().order_by("-created_at")
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated, IsCustomerOrStaff]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "plan__tier", "plan__billing_frequency", "customer"]
    search_fields = ["customer__company_name", "customer__email", "plan__name"]
    ordering_fields = ["current_period_end", "created_at", "status"]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Subscription.objects.none()
        if user.is_staff or user.is_superuser:
            return Subscription.objects.select_related("customer", "plan").all().order_by("-created_at")
        
        customer = getattr(user, "customer_profile", None)
        if not customer:
            return Subscription.objects.none()
        return Subscription.objects.select_related("customer", "plan").filter(customer=customer).order_by("-created_at")

    def get_object(self):
        try:
            return super().get_object()
        except Exception:
            raise NotFound(detail="Subscription not found.")

    def create(self, request, *args, **kwargs):
        serializer = CreateSubscriptionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = request.user
        customer = None
        if user.is_staff or user.is_superuser:
            customer_id = data.get("customer_id")
            if customer_id:
                try:
                    customer = Customer.objects.get(id=customer_id)
                except Customer.DoesNotExist:
                    raise NotFound(detail="Specified customer does not exist.")
            else:
                customer = getattr(user, "customer_profile", None)
        else:
            customer = getattr(user, "customer_profile", None)

        if not customer:
            raise NotFound(detail="Customer profile is required to create a subscription.")

        plan = Plan.objects.get(id=data["plan_id"])
        subscription = SubscriptionService.create_subscription(
            customer=customer,
            plan=plan,
            start_date=data.get("start_date"),
            is_trial=data.get("is_trial", False),
        )

        return Response(SubscriptionSerializer(subscription).data, status=status.HTTP_201_CREATED)

    @extend_schema(request=CancelSubscriptionSerializer, responses={200: SubscriptionSerializer})
    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        subscription = self.get_object()
        serializer = CancelSubscriptionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        updated = SubscriptionService.cancel_subscription(
            subscription=subscription,
            immediate=serializer.validated_data.get("immediate", False),
        )
        return Response(SubscriptionSerializer(updated).data)

    @extend_schema(request=None, responses={200: SubscriptionSerializer})
    @action(detail=True, methods=["post"])
    def pause(self, request, pk=None):
        subscription = self.get_object()
        updated = SubscriptionService.pause_subscription(subscription)
        return Response(SubscriptionSerializer(updated).data)

    @extend_schema(request=None, responses={200: SubscriptionSerializer})
    @action(detail=True, methods=["post"])
    def resume(self, request, pk=None):
        subscription = self.get_object()
        updated = SubscriptionService.resume_subscription(subscription)
        return Response(SubscriptionSerializer(updated).data)

    @extend_schema(request=ChangePlanSerializer, responses={200: SubscriptionSerializer})
    @action(detail=True, methods=["post"])
    def change_plan(self, request, pk=None):
        subscription = self.get_object()
        serializer = ChangePlanSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_plan = Plan.objects.get(id=serializer.validated_data["new_plan_id"])
        updated = SubscriptionService.change_plan(subscription, new_plan)
        return Response(SubscriptionSerializer(updated).data)
