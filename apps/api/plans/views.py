from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Plan
from .serializers import PlanSerializer
from common.permissions import IsStaffOrReadOnly


class PlanViewSet(viewsets.ModelViewSet):
    """
    Plan management API.
    Publicly listable and retrievable. Modifications restricted to Staff/Admin.
    """
    queryset = Plan.objects.filter(is_active=True).order_by("display_order", "price")
    serializer_class = PlanSerializer
    permission_classes = [permissions.AllowAny, IsStaffOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["tier", "billing_frequency", "is_active"]
    search_fields = ["name", "code", "description"]
    ordering_fields = ["price", "display_order", "created_at"]

    def get_queryset(self):
        user = self.request.user
        if user and user.is_authenticated and (user.is_staff or user.is_superuser):
            return Plan.objects.all().order_by("display_order", "price")
        return Plan.objects.filter(is_active=True).order_by("display_order", "price")
