import time
from django.db import connection
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers


class HealthCheckView(APIView):
    """
    Production health check endpoint for monitoring uptime,
    database connectivity, and service readiness.
    """
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=None,
        responses={
            200: inline_serializer(
                name="HealthCheckSuccessResponse",
                fields={
                    "status": serializers.CharField(default="ok"),
                    "service": serializers.CharField(default="planledger-api"),
                    "database": serializers.CharField(default="connected"),
                    "version": serializers.CharField(default="1.0.0"),
                    "latency_ms": serializers.FloatField(default=1.2),
                },
            ),
            503: inline_serializer(
                name="HealthCheckErrorResponse",
                fields={
                    "status": serializers.CharField(default="degraded"),
                    "service": serializers.CharField(default="planledger-api"),
                    "database": serializers.CharField(default="error"),
                    "error": serializers.CharField(),
                },
            ),
        },
    )
    def get(self, request):
        start_time = time.time()
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1;")
                cursor.fetchone()
            db_status = "connected"
            status_code = status.HTTP_200_OK
            overall_status = "ok"
            err_msg = None
        except Exception as exc:
            db_status = "error"
            status_code = status.HTTP_503_SERVICE_UNAVAILABLE
            overall_status = "degraded"
            err_msg = str(exc)

        latency_ms = round((time.time() - start_time) * 1000, 2)
        payload = {
            "status": overall_status,
            "service": "planledger-api",
            "database": db_status,
            "version": "1.0.0",
            "latency_ms": latency_ms,
        }
        if err_msg:
            payload["error"] = err_msg

        return Response(payload, status=status_code)
