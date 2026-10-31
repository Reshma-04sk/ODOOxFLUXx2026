from datetime import date, timedelta
from decimal import Decimal
from django.utils import timezone
from django.db import transaction
from .models import Subscription
from plans.models import Plan
from notifications.services import EmailService
from notifications.models import Notification
from common.exceptions import InvalidStateTransitionError, BusinessLogicError
from common.money import round_money


class SubscriptionService:
    @staticmethod
    def calculate_period_end(start_date: date, billing_frequency: str) -> date:
        if billing_frequency == Plan.BillingFrequency.YEARLY:
            try:
                return start_date.replace(year=start_date.year + 1)
            except ValueError:
                return start_date + timedelta(days=365)
        else:
            return start_date + timedelta(days=30)

    @classmethod
    @transaction.atomic
    def create_subscription(
        cls,
        customer,
        plan: Plan,
        start_date: date = None,
        is_trial: bool = False,
        payment_term=None,
        actor=None,
    ) -> Subscription:
        if start_date is None:
            start_date = timezone.now().date()

        # Enforce plan date availability
        if plan.start_date and start_date < plan.start_date:
            raise BusinessLogicError(f"Plan '{plan.name}' is not yet available (valid from {plan.start_date}).")
        if plan.end_date and start_date > plan.end_date:
            raise BusinessLogicError(f"Plan '{plan.name}' has discontinued as of {plan.end_date}.")
        if not plan.is_active:
            raise BusinessLogicError(f"Plan '{plan.name}' is inactive.")

        period_end = cls.calculate_period_end(start_date, plan.billing_frequency)
        trial_end = None
        status = Subscription.Status.ACTIVE

        if is_trial and plan.trial_period_days > 0:
            status = Subscription.Status.TRIALING
            trial_end = start_date + timedelta(days=plan.trial_period_days)

        subscription = Subscription.objects.create(
            customer=customer,
            plan=plan,
            payment_term=payment_term,
            status=status,
            start_date=start_date,
            current_period_start=start_date,
            current_period_end=period_end,
            trial_end=trial_end,
        )

        from .models import SubscriptionEvent
        SubscriptionEvent.objects.create(
            subscription=subscription,
            from_status="",
            to_status=status,
            actor=actor,
            reason="Subscription initiated",
        )

        try:
            EmailService.send_notification(
                recipient_email=customer.email,
                customer=customer,
                subject=f"Welcome to {plan.name}!",
                message=(
                    f"Dear {customer.company_name},\n\n"
                    f"Your subscription to {plan.name} has been activated.\n"
                    f"Status: {status.upper()}\n"
                    f"Current Period: {start_date} to {period_end}\n\n"
                    f"PlanLedger Team"
                ),
                notification_type=Notification.NotificationType.GENERAL,
            )
        except Exception:
            pass

        return subscription

    @classmethod
    @transaction.atomic
    def cancel_subscription(
        cls,
        subscription: Subscription,
        immediate: bool = False,
        actor=None,
        reason: str = "",
    ) -> Subscription:
        if subscription.status == Subscription.Status.CANCELED:
            raise InvalidStateTransitionError("Subscription is already canceled.")

        # Enforce plan closable flag
        if not subscription.plan.closable:
            raise BusinessLogicError(f"Plan '{subscription.plan.name}' cannot be closed or canceled.")

        now = timezone.now()
        old_status = subscription.status
        if immediate:
            subscription.status = Subscription.Status.CANCELED
            subscription.canceled_at = now
            subscription.cancel_at_period_end = False
        else:
            subscription.cancel_at_period_end = True

        subscription.save()

        from .models import SubscriptionEvent
        SubscriptionEvent.objects.create(
            subscription=subscription,
            from_status=old_status,
            to_status=subscription.status,
            actor=actor,
            reason=reason or ("Immediate cancellation" if immediate else "Canceled at period end"),
        )

        try:
            EmailService.send_notification(
                recipient_email=subscription.customer.email,
                customer=subscription.customer,
                subject=f"Subscription Canceled: {subscription.plan.name}",
                message=(
                    f"Dear {subscription.customer.company_name},\n\n"
                    f"Your subscription to {subscription.plan.name} has been marked for cancellation.\n"
                    f"Effective: {'Immediately' if immediate else f'At period end ({subscription.current_period_end})'}\n\n"
                    f"PlanLedger Support"
                ),
                notification_type=Notification.NotificationType.SUBSCRIPTION_CANCELED,
            )
        except Exception:
            pass

        return subscription

    @classmethod
    @transaction.atomic
    def pause_subscription(cls, subscription: Subscription, actor=None, reason: str = "") -> Subscription:
        if subscription.status != Subscription.Status.ACTIVE:
            raise InvalidStateTransitionError(
                f"Cannot pause subscription with status '{subscription.status}'. Only active subscriptions can be paused."
            )

        # Enforce plan pausable flag
        if not subscription.plan.pausable:
            raise BusinessLogicError(f"Plan '{subscription.plan.name}' does not permit pausing.")

        old_status = subscription.status
        subscription.status = Subscription.Status.PAUSED
        subscription.paused_at = timezone.now()
        subscription.save()

        from .models import SubscriptionEvent
        SubscriptionEvent.objects.create(
            subscription=subscription,
            from_status=old_status,
            to_status=Subscription.Status.PAUSED,
            actor=actor,
            reason=reason or "Subscription paused",
        )
        return subscription

    @classmethod
    @transaction.atomic
    def resume_subscription(cls, subscription: Subscription, actor=None) -> Subscription:
        if subscription.status != Subscription.Status.PAUSED:
            raise InvalidStateTransitionError(
                f"Cannot resume subscription with status '{subscription.status}'. Only paused subscriptions can be resumed."
            )

        old_status = subscription.status
        subscription.status = Subscription.Status.ACTIVE
        subscription.paused_at = None
        subscription.save()

        from .models import SubscriptionEvent
        SubscriptionEvent.objects.create(
            subscription=subscription,
            from_status=old_status,
            to_status=Subscription.Status.ACTIVE,
            actor=actor,
            reason="Subscription resumed",
        )
        return subscription

    @classmethod
    @transaction.atomic
    def change_plan(cls, subscription: Subscription, new_plan: Plan, actor=None) -> Subscription:
        if subscription.status == Subscription.Status.CANCELED:
            raise InvalidStateTransitionError("Cannot change plan on a canceled subscription.")

        if subscription.plan_id == new_plan.id:
            raise BusinessLogicError("Subscription is already on the specified plan.")

        old_plan_name = subscription.plan.name
        subscription.plan = new_plan
        subscription.save()

        from .models import SubscriptionEvent
        SubscriptionEvent.objects.create(
            subscription=subscription,
            from_status=subscription.status,
            to_status=subscription.status,
            actor=actor,
            reason=f"Plan upgraded/switched from {old_plan_name} to {new_plan.name}",
        )

        try:
            EmailService.send_notification(
                recipient_email=subscription.customer.email,
                customer=subscription.customer,
                subject=f"Subscription Upgraded to {new_plan.name}",
                message=(
                    f"Dear {subscription.customer.company_name},\n\n"
                    f"Your subscription has been switched from {old_plan_name} to {new_plan.name}.\n"
                    f"New Recurring Fee: ₹{new_plan.price:,.2f} ({new_plan.get_billing_frequency_display()})\n\n"
                    f"PlanLedger Support"
                ),
                notification_type=Notification.NotificationType.GENERAL,
            )
        except Exception:
            pass

        return subscription

