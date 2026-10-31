from rest_framework import serializers
from django.contrib.auth import authenticate
from drf_spectacular.utils import extend_schema_field
from .models import User

class UserSerializer(serializers.ModelSerializer):
    customer_id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "full_name",
            "role",
            "is_staff",
            "is_superuser",
            "is_active",
            "date_joined",
            "customer_id",
        ]
        read_only_fields = ["id", "is_staff", "is_superuser", "date_joined", "customer_id"]

    @extend_schema_field(serializers.IntegerField(allow_null=True))
    def get_customer_id(self, obj) -> int | None:
        customer = getattr(obj, "customer_profile", None)
        return customer.id if customer else None


class UserRegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    full_name = serializers.CharField(max_length=255)
    company_name = serializers.CharField(max_length=255, required=False, default="")

    def validate_email(self, value):
        normalized = value.lower().strip()
        if User.objects.filter(email=normalized).exists():
            raise serializers.ValidationError("A user with this email address already exists.")
        return normalized

    def create(self, validated_data):
        from customers.models import Customer
        password = validated_data.pop("password")
        company_name = validated_data.pop("company_name", "") or validated_data["full_name"] + " Co."
        
        user = User.objects.create_user(
            email=validated_data["email"],
            password=password,
            full_name=validated_data["full_name"],
            role=User.Role.CUSTOMER,
        )
        
        # Automatically provision initial Customer entity for the user
        Customer.objects.create(
            user=user,
            company_name=company_name,
            email=user.email,
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email", "").lower().strip()
        password = attrs.get("password")

        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError("Invalid email or password.")
        if not user.is_active:
            raise serializers.ValidationError("This account is currently disabled.")

        attrs["user"] = user
        return attrs
