from datetime import date, timedelta
from django.utils import timezone
from django.db import transaction
from .models import Subscription
from plans.models import Plan
from common.exceptions import InvalidStateTransitionError, BusinessLogicError


class SubscriptionService:
    @staticmethod
    def calculate_period_end(start_date: date, billing_frequency: str) -> date:
        if billing_frequency == Plan.BillingFrequency.YEARLY:
            # Approximate 365 days or 1 calendar year
            try:
                return start_date.replace(year=start_date.year + 1)
            except ValueError:
                # Leap year handling (Feb 29)
                return start_date + timedelta(days=365)
        else:
            # Monthly: approximate 30 days
            return start_date + timedelta(days=30)

    @classmethod
    @transaction.atomic
    def create_subscription(
        cls,
        customer,
        plan: Plan,
        start_date: date = None,
        is_trial: bool = False,
    ) -> Subscription:
        if start_date is None:
            start_date = timezone.now().date()

        period_end = cls.calculate_period_end(start_date, plan.billing_frequency)
        trial_end = None
        status = Subscription.Status.ACTIVE

        if is_trial and plan.trial_period_days > 0:
            status = Subscription.Status.TRIALING
            trial_end = start_date + timedelta(days=plan.trial_period_days)

        subscription = Subscription.objects.create(
            customer=customer,
            plan=plan,
            status=status,
            start_date=start_date,
            current_period_start=start_date,
            current_period_end=period_end,
            trial_end=trial_end,
        )
        return subscription

    @classmethod
    @transaction.atomic
    def cancel_subscription(cls, subscription: Subscription, immediate: bool = False) -> Subscription:
        if subscription.status == Subscription.Status.CANCELED:
            raise InvalidStateTransitionError("Subscription is already canceled.")

        now = timezone.now()
        if immediate:
            subscription.status = Subscription.Status.CANCELED
            subscription.canceled_at = now
            subscription.cancel_at_period_end = False
        else:
            subscription.cancel_at_period_end = True

        subscription.save()
        return subscription

    @classmethod
    @transaction.atomic
    def pause_subscription(cls, subscription: Subscription) -> Subscription:
        if subscription.status != Subscription.Status.ACTIVE:
            raise InvalidStateTransitionError(
                f"Cannot pause subscription with status '{subscription.status}'. Only active subscriptions can be paused."
            )

        subscription.status = Subscription.Status.PAUSED
        subscription.paused_at = timezone.now()
        subscription.save()
        return subscription

    @classmethod
    @transaction.atomic
    def resume_subscription(cls, subscription: Subscription) -> Subscription:
        if subscription.status != Subscription.Status.PAUSED:
            raise InvalidStateTransitionError(
                f"Cannot resume subscription with status '{subscription.status}'. Only paused subscriptions can be resumed."
            )

        subscription.status = Subscription.Status.ACTIVE
        subscription.paused_at = None
        subscription.save()
        return subscription

    @classmethod
    @transaction.atomic
    def change_plan(cls, subscription: Subscription, new_plan: Plan) -> Subscription:
        if subscription.status == Subscription.Status.CANCELED:
            raise InvalidStateTransitionError("Cannot change plan on a canceled subscription.")

        if subscription.plan_id == new_plan.id:
            raise BusinessLogicError("Subscription is already on the specified plan.")

        subscription.plan = new_plan
        subscription.save()
        return subscription
