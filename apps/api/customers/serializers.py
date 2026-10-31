from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
from .models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            "id",
            "company_name",
            "email",
            "phone",
            "billing_address",
            "city",
            "state",
            "postal_code",
            "country",
            "tax_id",
            "currency",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class CustomerDetailSerializer(CustomerSerializer):
    active_subscriptions_count = serializers.SerializerMethodField()
    total_invoiced = serializers.SerializerMethodField()

    class Meta(CustomerSerializer.Meta):
        fields = CustomerSerializer.Meta.fields + [
            "active_subscriptions_count",
            "total_invoiced",
            "metadata",
        ]

    @extend_schema_field(serializers.IntegerField())
    def get_active_subscriptions_count(self, obj) -> int:
        return obj.subscriptions.filter(status="active").count() if hasattr(obj, "subscriptions") else 0

    @extend_schema_field(serializers.CharField())
    def get_total_invoiced(self, obj) -> str:
        from django.db.models import Sum
        total = obj.invoices.aggregate(total=Sum("total_amount"))["total"] if hasattr(obj, "invoices") else None
        return str(total or "0.00")
