import logging
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from .models import Notification

logger = logging.getLogger(__name__)


class EmailService:
    @classmethod
    def send_notification(
        cls,
        recipient_email: str,
        subject: str,
        message: str,
        notification_type: str = Notification.NotificationType.GENERAL,
        customer=None,
    ) -> Notification:
        notification = Notification.objects.create(
            recipient_email=recipient_email,
            customer=customer,
            subject=subject,
            message=message,
            notification_type=notification_type,
            status=Notification.Status.PENDING,
        )

        try:
            from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "notifications@brightloop.io")
            send_mail(
                subject=f"[PlanLedger] {subject}",
                message=message,
                from_email=from_email,
                recipient_list=[recipient_email],
                fail_silently=False,
            )
            notification.status = Notification.Status.SENT
            notification.sent_at = timezone.now()
            notification.save()
            logger.info(f"Dispatched email notification {notification.id} to {recipient_email}")
        except Exception as exc:
            notification.status = Notification.Status.FAILED
            notification.save()
            logger.error(f"Failed to dispatch email notification {notification.id} to {recipient_email}: {exc}")

        return notification
