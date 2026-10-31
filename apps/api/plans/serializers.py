from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
from .models import Plan

class PlanSerializer(serializers.ModelSerializer):
    price_formatted = serializers.SerializerMethodField()

    class Meta:
        model = Plan
        fields = [
            "id",
            "name",
            "code",
            "description",
            "tier",
            "billing_frequency",
            "price",
            "price_formatted",
            "currency",
            "trial_period_days",
            "features",
            "is_active",
            "display_order",
            "interval_count",
            "min_qty",
            "start_date",
            "end_date",
            "auto_close",
            "closable",
            "pausable",
            "renewable",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "price_formatted", "created_at", "updated_at"]

    @extend_schema_field(serializers.CharField())
    def get_price_formatted(self, obj) -> str:
        return f"₹{obj.price:,.2f}"
