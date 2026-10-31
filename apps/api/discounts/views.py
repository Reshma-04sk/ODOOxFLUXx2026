from rest_framework import viewsets, permissions, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema

from .models import Discount
from .services import DiscountService
from .serializers import (
    DiscountSerializer,
    ValidateDiscountSerializer,
    DiscountValidationResponseSerializer,
)
from common.permissions import IsStaffOrReadOnly


class DiscountViewSet(viewsets.ModelViewSet):
    """
    Discount codes and promotional coupons management.
    """
    queryset = Discount.objects.all().order_by("-created_at")
    serializer_class = DiscountSerializer
    permission_classes = [permissions.IsAuthenticated, IsStaffOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["discount_type", "is_active"]
    search_fields = ["code", "description"]
    ordering_fields = ["valid_until", "times_redeemed", "created_at"]


class ValidateDiscountView(APIView):
    """
    Validates a discount coupon code against a subtotal and customer account.
    """
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        request=ValidateDiscountSerializer,
        responses={200: DiscountValidationResponseSerializer},
    )
    def post(self, request):
        serializer = ValidateDiscountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        code = serializer.validated_data["code"]
        subtotal = serializer.validated_data["subtotal"]

        customer = getattr(request.user, "customer_profile", None)
        discount, discount_amount = DiscountService.validate_discount(code, customer, subtotal)

        new_subtotal = max(subtotal - discount_amount, 0)
        return Response({
            "code": discount.code,
            "discount_type": discount.discount_type,
            "value": discount.value,
            "discount_amount": discount_amount,
            "new_subtotal": new_subtotal,
        })
