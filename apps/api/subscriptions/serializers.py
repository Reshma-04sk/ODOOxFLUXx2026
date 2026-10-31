from rest_framework import serializers
from .models import Subscription
from plans.serializers import PlanSerializer
from customers.serializers import CustomerSerializer
from plans.models import Plan
from customers.models import Customer


class SubscriptionSerializer(serializers.ModelSerializer):
    plan = PlanSerializer(read_only=True)
    customer_company = serializers.CharField(source="customer.company_name", read_only=True)
    customer_email = serializers.CharField(source="customer.email", read_only=True)

    class Meta:
        model = Subscription
        fields = [
            "id",
            "customer",
            "customer_company",
            "customer_email",
            "plan",
            "status",
            "start_date",
            "current_period_start",
            "current_period_end",
            "trial_end",
            "cancel_at_period_end",
            "canceled_at",
            "paused_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "customer_company",
            "customer_email",
            "status",
            "current_period_start",
            "current_period_end",
            "trial_end",
            "canceled_at",
            "paused_at",
            "created_at",
            "updated_at",
        ]


class CreateSubscriptionSerializer(serializers.Serializer):
    customer_id = serializers.IntegerField(required=False)
    plan_id = serializers.IntegerField()
    start_date = serializers.DateField(required=False)
    is_trial = serializers.BooleanField(required=False, default=False)

    def validate_plan_id(self, value):
        if not Plan.objects.filter(id=value, is_active=True).exists():
            raise serializers.ValidationError("Active plan with this ID does not exist.")
        return value


class CancelSubscriptionSerializer(serializers.Serializer):
    immediate = serializers.BooleanField(default=False)


class ChangePlanSerializer(serializers.Serializer):
    new_plan_id = serializers.IntegerField()

    def validate_new_plan_id(self, value):
        if not Plan.objects.filter(id=value, is_active=True).exists():
            raise serializers.ValidationError("Active plan with this ID does not exist.")
        return value
