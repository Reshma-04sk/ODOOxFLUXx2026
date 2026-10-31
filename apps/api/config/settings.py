"""
PlanLedger Django Configuration
Brightloop Software Subscription Management System
"""

import os
from pathlib import Path
from urllib.parse import urlparse
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables
load_dotenv(BASE_DIR / ".env")
load_dotenv(BASE_DIR.parent.parent / ".env")

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "django-insecure-planledger-brightloop-dev-secret-key-2026-production-ready"
)

DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")

ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1,0.0.0.0,.onrender.com").split(",")
    if host.strip()
]

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party packages
    "corsheaders",
    "rest_framework",
    "django_filters",
    "drf_spectacular",

    # PlanLedger Domain Apps
    "common.apps.CommonConfig",
    "accounts.apps.AccountsConfig",
    "customers.apps.CustomersConfig",
    "plans.apps.PlansConfig",
    "catalog.apps.CatalogConfig",
    "subscriptions.apps.SubscriptionsConfig",
    "discounts.apps.DiscountsConfig",
    "invoices.apps.InvoicesConfig",
    "payments.apps.PaymentsConfig",
    "billing.apps.BillingConfig",
    "analytics.apps.AnalyticsConfig",
    "notifications.apps.NotificationsConfig",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

# Database Configuration: PostgreSQL 17 via psycopg 3 (with SQLite fallback for instant zero-dependency testing)
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()

if DATABASE_URL:
    url = urlparse(DATABASE_URL)
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": url.path.lstrip("/"),
            "USER": url.username,
            "PASSWORD": url.password,
            "HOST": url.hostname,
            "PORT": url.port or 5432,
            "OPTIONS": {
                "sslmode": "require" if "neon.tech" in (url.hostname or "") else "prefer",
            },
            "CONN_MAX_AGE": 600,
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# Argon2 Password Hashing (as specified)
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
]

# Custom User Model
AUTH_USER_MODEL = "accounts.User"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator", "OPTIONS": {"min_length": 8}},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"  # IST timezone
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Default primary key field type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Django REST Framework Settings
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ),
    "DEFAULT_PAGINATION_CLASS": "common.pagination.StandardResultsSetPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "EXCEPTION_HANDLER": "common.exceptions.custom_exception_handler",
    "DATE_FORMAT": "%Y-%m-%d",
    "DATETIME_FORMAT": "%Y-%m-%dT%H:%M:%SZ",
}

# OpenAPI / Swagger Specification via drf-spectacular
SPECTACULAR_SETTINGS = {
    "TITLE": "PlanLedger API",
    "DESCRIPTION": "Brightloop Software Subscription Management & Billing Engine API",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "COMPONENT_SPLIT_REQUEST": True,
    "SCHEMA_PATH_PREFIX": "/api/v1/",
}

# CORS & CSRF Configuration
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
    if origin.strip()
]
CSRF_TRUSTED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CSRF_TRUSTED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
    if origin.strip()
]
CSRF_COOKIE_HTTPONLY = False  # Allows frontend Javascript to read the CSRF cookie for X-CSRFToken header
CSRF_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_SAMESITE = "Lax"

# Email Configuration (Console locally, Brevo SMTP relay in production)
EMAIL_BACKEND_TYPE = os.getenv("EMAIL_BACKEND_TYPE", "console").lower()
if EMAIL_BACKEND_TYPE == "smtp":
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    EMAIL_HOST = os.getenv("BREVO_SMTP_HOST", "smtp-relay.brevo.com")
    EMAIL_PORT = int(os.getenv("BREVO_SMTP_PORT", 587))
    EMAIL_USE_TLS = True
    EMAIL_HOST_USER = os.getenv("BREVO_SMTP_LOGIN", "")
    EMAIL_HOST_PASSWORD = os.getenv("BREVO_SMTP_PASSWORD", "")
else:
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "notifications@brightloop.io")
