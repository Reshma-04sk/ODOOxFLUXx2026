from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from .models import BillingExecutionRecord
from .services import BillingEngine
from .serializers import BillingExecutionRecordSerializer, TriggerBillingSerializer


class BillingExecutionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Billing execution history records (Staff only).
    """
    queryset = BillingExecutionRecord.objects.all().order_by("-executed_at")
    serializer_class = BillingExecutionRecordSerializer
    permission_classes = [permissions.IsAdminUser]


class TriggerBillingView(APIView):
    """
    Manual billing execution trigger endpoint for live demos or ad-hoc runs (Staff only).
    """
    permission_classes = [permissions.IsAdminUser]

    @extend_schema(
        request=TriggerBillingSerializer,
        responses={200: BillingExecutionRecordSerializer},
    )
    def post(self, request):
        serializer = TriggerBillingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        record = BillingEngine.run_billing(
            target_date=data.get("target_date"),
            dry_run=data.get("dry_run", False),
        )
        return Response(BillingExecutionRecordSerializer(record).data, status=status.HTTP_200_OK)
