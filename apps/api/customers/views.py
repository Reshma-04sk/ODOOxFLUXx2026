from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import NotFound
from .models import Customer
from .serializers import CustomerSerializer, CustomerDetailSerializer
from common.permissions import IsCustomerOrStaff


class CustomerViewSet(viewsets.ModelViewSet):
    """
    CRUD API for Customer entities with strict tenant isolation.
    """
    queryset = Customer.objects.all().order_by("-created_at")
    permission_classes = [permissions.IsAuthenticated, IsCustomerOrStaff]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "currency", "country", "state"]
    search_fields = ["company_name", "email", "phone", "tax_id"]
    ordering_fields = ["company_name", "created_at", "status"]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Customer.objects.none()
        if user.is_staff or user.is_superuser:
            return Customer.objects.all().order_by("-created_at")
        
        # Enforce tenant isolation: customers only see their own customer profile
        customer = getattr(user, "customer_profile", None)
        if not customer:
            return Customer.objects.none()
        return Customer.objects.filter(id=customer.id)

    def get_object(self):
        try:
            return super().get_object()
        except Exception:
            raise NotFound(detail="Customer not found.")

    def get_serializer_class(self):
        if self.action == "retrieve":
            return CustomerDetailSerializer
        return CustomerSerializer
