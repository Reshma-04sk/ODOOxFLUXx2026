from django.contrib.auth import login, logout
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework import status, permissions, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, inline_serializer

from .models import User
from .serializers import UserSerializer, UserRegistrationSerializer, LoginSerializer


class CSRFResponseSerializer(serializers.Serializer):
    csrfToken = serializers.CharField()


class LogoutResponseSerializer(serializers.Serializer):
    message = serializers.CharField()


class CSRFTokenView(APIView):
    """
    Returns CSRF cookie and token. Useful for SPAs to initialize session and double-submit cookie protection.
    """
    permission_classes = [permissions.AllowAny]

    @extend_schema(responses={200: CSRFResponseSerializer})
    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        token = get_token(request)
        return Response({"csrfToken": token})


class RegisterView(APIView):
    """
    Registers a new customer account, provisions tenant customer record, and returns user data.
    """
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=UserRegistrationSerializer,
        responses={201: UserSerializer},
    )
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        login(request, user)
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """
    Session-based login with email and password.
    """
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=LoginSerializer,
        responses={200: UserSerializer},
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        login(request, user)
        return Response(UserSerializer(user).data)


class LogoutView(APIView):
    """
    Logs out the authenticated user and flushes their session.
    """
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(request=None, responses={200: LogoutResponseSerializer})
    def post(self, request):
        logout(request)
        return Response({"message": "Successfully logged out."})


class CurrentUserView(APIView):
    """
    Retrieves the currently authenticated user's profile and tenant customer information.
    """
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(responses={200: UserSerializer})
    def get(self, request):
        return Response(UserSerializer(request.user).data)
