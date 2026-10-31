from rest_framework import serializers
from .models import BillingExecutionRecord

class BillingExecutionRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillingExecutionRecord
        fields = [
            "id",
            "executed_at",
            "target_date",
            "subscriptions_evaluated",
            "invoices_generated",
            "total_amount_invoiced",
            "status",
            "error_message",
            "duration_ms",
            "created_at",
        ]
        read_only_fields = fields


class TriggerBillingSerializer(serializers.Serializer):
    target_date = serializers.DateField(required=False)
    dry_run = serializers.BooleanField(required=False, default=False)
