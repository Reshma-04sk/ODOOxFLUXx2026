from django.contrib import admin
from .models import Subscription, SubscriptionLine, SubscriptionEvent


class SubscriptionLineInline(admin.TabularInline):
    model = SubscriptionLine
    extra = 0


class SubscriptionEventInline(admin.TabularInline):
    model = SubscriptionEvent
    extra = 0
    readonly_fields = ["from_status", "to_status", "actor", "reason", "created_at"]


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ["customer", "plan", "status", "start_date", "current_period_end", "payment_term"]
    list_filter = ["status", "plan", "payment_term"]
    search_fields = ["customer__company_name", "plan__name"]
    inlines = [SubscriptionLineInline, SubscriptionEventInline]


@admin.register(SubscriptionLine)
class SubscriptionLineAdmin(admin.ModelAdmin):
    list_display = ["subscription", "product", "variant", "quantity", "unit_price"]
    list_filter = ["product"]


@admin.register(SubscriptionEvent)
class SubscriptionEventAdmin(admin.ModelAdmin):
    list_display = ["subscription", "from_status", "to_status", "actor", "reason", "created_at"]
    list_filter = ["to_status"]
    readonly_fields = ["created_at"]
