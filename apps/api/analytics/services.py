from decimal import Decimal
from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum, Count, Q
from subscriptions.models import Subscription
from plans.models import Plan
from invoices.models import Invoice
from payments.models import Payment
from common.money import round_money


class AnalyticsService:
    @classmethod
    def get_kpis(cls, customer=None) -> dict:
        subs_qs = Subscription.objects.all()
        invoices_qs = Invoice.objects.all()
        payments_qs = Payment.objects.filter(status=Payment.Status.SUCCEEDED)

        if customer:
            subs_qs = subs_qs.filter(customer=customer)
            invoices_qs = invoices_qs.filter(customer=customer)
            payments_qs = payments_qs.filter(customer=customer)

        total_subs = subs_qs.count()
        active_subs = subs_qs.filter(status=Subscription.Status.ACTIVE).count()
        trialing_subs = subs_qs.filter(status=Subscription.Status.TRIALING).count()
        canceled_subs = subs_qs.filter(status=Subscription.Status.CANCELED).count()

        # MRR calculation
        # Monthly plans contribute their price.
        # Yearly plans contribute price / 12.
        mrr = Decimal("0.00")
        active_subscriptions = subs_qs.filter(status=Subscription.Status.ACTIVE).select_related("plan")
        for sub in active_subscriptions:
            if sub.plan.billing_frequency == Plan.BillingFrequency.YEARLY:
                mrr += sub.plan.price / Decimal("12.0")
            else:
                mrr += sub.plan.price

        mrr = round_money(mrr)
        arr = round_money(mrr * Decimal("12.0"))

        # Churn rate
        churn_rate = 0.0
        if total_subs > 0:
            churn_rate = round((canceled_subs / total_subs) * 100, 2)

        # Total revenue collected
        total_revenue = payments_qs.aggregate(total=Sum("amount"))["total"] or Decimal("0.00")
        total_revenue = round_money(total_revenue)

        # Total outstanding receivables
        total_outstanding = invoices_qs.filter(status=Invoice.Status.OPEN).aggregate(total=Sum("balance_due"))["total"] or Decimal("0.00")
        total_outstanding = round_money(total_outstanding)

        # ARPU (Average Revenue Per User)
        arpu = Decimal("0.00")
        if active_subs > 0:
            arpu = round_money(mrr / Decimal(active_subs))

        return {
            "mrr": str(mrr),
            "arr": str(arr),
            "active_subscriptions": active_subs,
            "trialing_subscriptions": trialing_subs,
            "canceled_subscriptions": canceled_subs,
            "total_subscriptions": total_subs,
            "churn_rate": churn_rate,
            "total_revenue": str(total_revenue),
            "total_outstanding": str(total_outstanding),
            "arpu": str(arpu),
            "currency": "INR",
        }

    @classmethod
    def get_revenue_trends(cls, customer=None, months: int = 6) -> list[dict]:
        now = timezone.now()
        trends = []

        for i in range(months - 1, -1, -1):
            # Calculate month start and end
            year = now.year
            month = now.month - i
            while month <= 0:
                month += 12
                year -= 1

            start_date = timezone.datetime(year, month, 1).date()
            if month == 12:
                end_date = timezone.datetime(year + 1, 1, 1).date()
            else:
                end_date = timezone.datetime(year, month + 1, 1).date()

            invoices_qs = Invoice.objects.filter(issue_date__gte=start_date, issue_date__lt=end_date)
            payments_qs = Payment.objects.filter(
                status=Payment.Status.SUCCEEDED,
                processed_at__date__gte=start_date,
                processed_at__date__lt=end_date,
            )

            if customer:
                invoices_qs = invoices_qs.filter(customer=customer)
                payments_qs = payments_qs.filter(customer=customer)

            invoiced = invoices_qs.aggregate(total=Sum("total_amount"))["total"] or Decimal("0.00")
            collected = payments_qs.aggregate(total=Sum("amount"))["total"] or Decimal("0.00")

            month_name = start_date.strftime("%b %Y")
            trends.append({
                "month": month_name,
                "invoiced": float(round_money(invoiced)),
                "collected": float(round_money(collected)),
            })

        return trends

    @classmethod
    def get_plan_distribution(cls, customer=None) -> list[dict]:
        subs_qs = Subscription.objects.filter(status=Subscription.Status.ACTIVE)
        if customer:
            subs_qs = subs_qs.filter(customer=customer)

        distribution = (
            subs_qs.values("plan__name", "plan__tier")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        return [
            {
                "plan_name": item["plan__name"],
                "tier": item["plan__tier"],
                "subscribers": item["count"],
            }
            for item in distribution
        ]
