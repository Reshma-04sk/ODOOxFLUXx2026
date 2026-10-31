from datetime import datetime
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from billing.services import BillingEngine


class Command(BaseCommand):
    help = "Executes the PlanLedger idempotent subscription billing engine."

    def add_arguments(self, parser):
        parser.add_argument(
            "--date",
            type=str,
            help="Target billing date in YYYY-MM-DD format (defaults to current date)",
            default=None,
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Simulate billing evaluation without committing database changes",
            default=False,
        )

    def handle(self, *args, **options):
        date_str = options.get("date")
        dry_run = options.get("dry_run", False)

        if date_str:
            try:
                target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
            except ValueError:
                raise CommandError(f"Invalid date format '{date_str}'. Expected YYYY-MM-DD.")
        else:
            target_date = timezone.now().date()

        self.stdout.write(
            self.style.NOTICE(
                f"[PlanLedger Billing] Starting billing run for target date: {target_date} (dry_run={dry_run})..."
            )
        )

        try:
            record = BillingEngine.run_billing(target_date=target_date, dry_run=dry_run)
            self.stdout.write(
                self.style.SUCCESS(
                    f"[PlanLedger Billing] Completed successfully in {record.duration_ms}ms!\n"
                    f" - Subscriptions Evaluated: {record.subscriptions_evaluated}\n"
                    f" - Invoices Generated: {record.invoices_generated}\n"
                    f" - Total Amount Invoiced: ₹{record.total_amount_invoiced:,.2f}\n"
                    f" - Execution Status: {record.status}"
                )
            )
        except Exception as exc:
            self.stderr.write(self.style.ERROR(f"[PlanLedger Billing] Error executing billing engine: {exc}"))
            raise CommandError(str(exc))
