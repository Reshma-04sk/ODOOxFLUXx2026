from rest_framework import serializers
from .models import Discount

class DiscountSerializer(serializers.ModelSerializer):
    is_valid_now = serializers.BooleanField(read_only=True)

    class Meta:
        model = Discount
        fields = [
            "id",
            "code",
            "description",
            "discount_type",
            "value",
            "min_subtotal",
            "max_redemptions",
            "times_redeemed",
            "valid_from",
            "valid_until",
            "is_active",
            "is_valid_now",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "times_redeemed", "is_valid_now", "created_at", "updated_at"]


class ValidateDiscountSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=50)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2)


class DiscountValidationResponseSerializer(serializers.Serializer):
    code = serializers.CharField()
    discount_type = serializers.CharField()
    value = serializers.DecimalField(max_digits=12, decimal_places=2)
    discount_amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    new_subtotal = serializers.DecimalField(max_digits=12, decimal_places=2)
