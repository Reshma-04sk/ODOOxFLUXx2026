import time
from decimal import Decimal
from datetime import date
from django.utils import timezone
from django.db import transaction
from .models import BillingExecutionRecord
from subscriptions.models import Subscription
from subscriptions.services import SubscriptionService
from invoices.models import Invoice
from invoices.services import InvoiceService
from common.money import round_money


class BillingEngine:
    @classmethod
    def run_billing(cls, target_date: date = None, dry_run: bool = False) -> BillingExecutionRecord:
        start_time = time.time()
        if target_date is None:
            target_date = timezone.now().date()

        record = BillingExecutionRecord.objects.create(
            target_date=target_date,
            status=BillingExecutionRecord.Status.RUNNING,
        )

        evaluated_count = 0
        invoices_generated = 0
        total_invoiced = Decimal("0.00")

        try:
            # Query subscriptions due for billing on or before target_date
            due_subscriptions = (
                Subscription.objects.select_related("customer", "plan")
                .filter(
                    status__in=[Subscription.Status.ACTIVE, Subscription.Status.TRIALING],
                    current_period_end__lte=target_date,
                )
                .order_by("id")
            )

            for sub in due_subscriptions:
                evaluated_count += 1
                period_start = sub.current_period_end
                period_end = SubscriptionService.calculate_period_end(
                    period_start,
                    sub.plan.billing_frequency,
                )

                if dry_run:
                    # In dry run mode, check idempotency and sum potential invoices
                    already_billed = Invoice.objects.filter(
                        subscription=sub,
                        period_start=period_start,
                        period_end=period_end,
                    ).exists()
                    if not already_billed:
                        invoices_generated += 1
                        total_invoiced += sub.plan.price
                    continue

                # Idempotent database transaction per subscription renewal
                with transaction.atomic():
                    # Idempotency check: verify invoice has not already been created
                    already_billed = Invoice.objects.filter(
                        subscription=sub,
                        period_start=period_start,
                        period_end=period_end,
                    ).exists()

                    if already_billed:
                        continue

                    # If subscription is set to cancel at period end, or plan is non-renewable or auto_close
                    if sub.cancel_at_period_end or sub.plan.auto_close or not sub.plan.renewable:
                        from subscriptions.models import SubscriptionEvent
                        old_status = sub.status
                        sub.status = Subscription.Status.CANCELED
                        sub.canceled_at = timezone.now()
                        sub.save(update_fields=["status", "canceled_at", "updated_at"])
                        reason = "Auto-closed at period end" if sub.plan.auto_close else (
                            "Plan does not permit renewal" if not sub.plan.renewable else "Canceled at period end"
                        )
                        SubscriptionEvent.objects.create(
                            subscription=sub,
                            from_status=old_status,
                            to_status=Subscription.Status.CANCELED,
                            reason=reason,
                        )
                        continue

                    # Generate renewal invoice with line items
                    invoice = InvoiceService.create_invoice(
                        customer=sub.customer,
                        subscription=sub,
                        issue_date=period_start,
                        due_date=period_start,
                        period_start=period_start,
                        period_end=period_end,
                    )

                    # Transition from trial to active upon first invoice if needed
                    if sub.status == Subscription.Status.TRIALING:
                        sub.status = Subscription.Status.ACTIVE

                    # Advance subscription period
                    sub.current_period_start = period_start
                    sub.current_period_end = period_end
                    sub.save(update_fields=["status", "current_period_start", "current_period_end", "updated_at"])

                    invoices_generated += 1
                    total_invoiced += invoice.total_amount

            elapsed_ms = int((time.time() - start_time) * 1000)
            record.subscriptions_evaluated = evaluated_count
            record.invoices_generated = invoices_generated
            record.total_amount_invoiced = round_money(total_invoiced)
            record.status = BillingExecutionRecord.Status.COMPLETED
            record.duration_ms = elapsed_ms
            record.save()
            return record

        except Exception as exc:
            elapsed_ms = int((time.time() - start_time) * 1000)
            record.status = BillingExecutionRecord.Status.FAILED
            record.error_message = str(exc)
            record.duration_ms = elapsed_ms
            record.save()
            raise exc
