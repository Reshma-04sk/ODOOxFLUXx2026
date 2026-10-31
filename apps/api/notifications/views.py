from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Notification
from .serializers import NotificationSerializer
from common.permissions import IsCustomerOrStaff


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List and retrieve system notifications and email dispatch logs.
    """
    queryset = Notification.objects.all().order_by("-created_at")
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsCustomerOrStaff]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["notification_type", "status", "customer"]
    search_fields = ["recipient_email", "subject", "message"]
    ordering_fields = ["sent_at", "created_at"]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Notification.objects.none()
        if user.is_staff or user.is_superuser:
            return Notification.objects.all().order_by("-created_at")

        customer = getattr(user, "customer_profile", None)
        if not customer:
            return Notification.objects.none()
        return Notification.objects.filter(customer=customer).order_by("-created_at")
