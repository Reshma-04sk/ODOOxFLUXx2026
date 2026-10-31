"""
PlanLedger High-Performance Seed Data Generator
Generates realistic SaaS subscription data, plans, coupons, customers,
and supports scaling up to 5,000 subscriptions and 20,000 invoices with payments
using optimized bulk database operations.
"""

import os
import sys
import time
import random
from decimal import Decimal
from datetime import date, timedelta
from pathlib import Path

# Setup Django environment
BASE_DIR = Path(__file__).resolve().parent.parent.parent / "apps" / "api"
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django
django.setup()

from django.db import transaction
from django.utils import timezone
from accounts.models import User
from customers.models import Customer
from plans.models import Plan
from subscriptions.models import Subscription
from discounts.models import Discount
from invoices.models import Invoice, InvoiceLineItem
from payments.models import Payment
from common.money import round_money


def seed_database(subscriptions_count: int = 5000, invoices_count: int = 20000):
    print("==================================================================")
    print(f" PlanLedger Seed Generator: {subscriptions_count} subs / {invoices_count} invoices")
    print("==================================================================")
    start_time = time.time()

    # 1. Ensure Superuser & Staff
    admin_user, _ = User.objects.get_or_create(
        email="admin@brightloop.io",
        defaults={
            "full_name": "Reshma Shaik",
            "role": User.Role.ADMIN,
            "is_staff": True,
            "is_superuser": True,
        },
    )
    admin_user.set_password("Admin@12345")
    admin_user.save()

    lead_dev, _ = User.objects.get_or_create(
        email="gayathri@brightloop.io",
        defaults={
            "full_name": "Gayathri Devi G",
            "role": User.Role.ADMIN,
            "is_staff": True,
            "is_superuser": True,
        },
    )
    lead_dev.set_password("Dev@12345")
    lead_dev.save()

    print("[1/5] Verified administrative accounts (Reshma Shaik, Gayathri Devi G).")

    # 2. Standard Plans
    plans_data = [
        {
            "name": "Starter Monthly",
            "code": "starter-monthly",
            "tier": Plan.Tier.STARTER,
            "billing_frequency": Plan.BillingFrequency.MONTHLY,
            "price": Decimal("999.00"),
            "trial_period_days": 14,
            "features": ["Up to 5 Users", "Basic Analytics", "Standard Email Support", "5GB Storage"],
            "display_order": 1,
        },
        {
            "name": "Starter Yearly",
            "code": "starter-yearly",
            "tier": Plan.Tier.STARTER,
            "billing_frequency": Plan.BillingFrequency.YEARLY,
            "price": Decimal("9990.00"),
            "trial_period_days": 14,
            "features": ["Up to 5 Users", "Basic Analytics", "Standard Email Support", "10GB Storage", "2 Months Free"],
            "display_order": 2,
        },
        {
            "name": "Growth Monthly",
            "code": "growth-monthly",
            "tier": Plan.Tier.GROWTH,
            "billing_frequency": Plan.BillingFrequency.MONTHLY,
            "price": Decimal("2999.00"),
            "trial_period_days": 14,
            "features": ["Up to 25 Users", "Advanced Analytics & Cohorts", "Priority Support", "50GB Storage", "Custom Invoicing"],
            "display_order": 3,
        },
        {
            "name": "Growth Yearly",
            "code": "growth-yearly",
            "tier": Plan.Tier.GROWTH,
            "billing_frequency": Plan.BillingFrequency.YEARLY,
            "price": Decimal("29990.00"),
            "trial_period_days": 14,
            "features": ["Up to 25 Users", "Advanced Analytics & Cohorts", "Priority Support", "100GB Storage", "Custom Invoicing", "2 Months Free"],
            "display_order": 4,
        },
        {
            "name": "Enterprise Monthly",
            "code": "enterprise-monthly",
            "tier": Plan.Tier.ENTERPRISE,
            "billing_frequency": Plan.BillingFrequency.MONTHLY,
            "price": Decimal("9999.00"),
            "trial_period_days": 30,
            "features": ["Unlimited Users", "Custom Workflows", "Dedicated Account Manager", "Unlimited Storage", "SLA Guarantee 99.99%", "Custom Integrations"],
            "display_order": 5,
        },
        {
            "name": "Enterprise Yearly",
            "code": "enterprise-yearly",
            "tier": Plan.Tier.ENTERPRISE,
            "billing_frequency": Plan.BillingFrequency.YEARLY,
            "price": Decimal("99990.00"),
            "trial_period_days": 30,
            "features": ["Unlimited Users", "Custom Workflows", "Dedicated Account Manager", "Unlimited Storage", "SLA Guarantee 99.99%", "Custom Integrations", "Audit Logs"],
            "display_order": 6,
        },
    ]

    created_plans = []
    for pdata in plans_data:
        plan, _ = Plan.objects.get_or_create(code=pdata["code"], defaults=pdata)
        created_plans.append(plan)

    print(f"[2/5] Verified {len(created_plans)} subscription plans.")

    # 3. Discounts / Promo Coupons
    now = timezone.now()
    discounts_data = [
        {
            "code": "WELCOME2026",
            "description": "New Customer Welcome Discount 20% Off",
            "discount_type": Discount.DiscountType.PERCENTAGE,
            "value": Decimal("20.00"),
            "min_subtotal": Decimal("500.00"),
            "valid_from": now - timedelta(days=30),
            "valid_until": now + timedelta(days=365),
            "max_redemptions": 10000,
        },
        {
            "code": "STARTUP500",
            "description": "Startup Flat INR 500 Discount",
            "discount_type": Discount.DiscountType.FIXED_AMOUNT,
            "value": Decimal("500.00"),
            "min_subtotal": Decimal("1500.00"),
            "valid_from": now - timedelta(days=30),
            "valid_until": now + timedelta(days=180),
            "max_redemptions": 5000,
        },
        {
            "code": "ANNUAL50",
            "description": "Special Annual Upgrade 50% Off",
            "discount_type": Discount.DiscountType.PERCENTAGE,
            "value": Decimal("50.00"),
            "min_subtotal": Decimal("5000.00"),
            "valid_from": now - timedelta(days=15),
            "valid_until": now + timedelta(days=90),
            "max_redemptions": 2000,
        },
    ]

    for ddata in discounts_data:
        Discount.objects.get_or_create(code=ddata["code"], defaults=ddata)

    print("[3/5] Verified standard promotional discount codes.")

    # 4. Generate Customers & Subscriptions
    existing_subs_count = Subscription.objects.count()
    subs_needed = max(0, subscriptions_count - existing_subs_count)

    cities = ["Bengaluru", "Mumbai", "Hyderabad", "Pune", "Chennai", "Delhi NCR"]
    states = ["Karnataka", "Maharashtra", "Telangana", "Maharashtra", "Tamil Nadu", "Delhi"]
    prefixes = ["Apex", "Zenith", "Cloud", "Pulse", "Nexus", "Vertex", "Hyper", "Spectra", "Optima", "Nova"]
    suffixes = ["Technologies", "Labs", "Systems", "Solutions", "Dynamics", "Infra", "Global", "Enterprises"]

    today = date.today()

    if subs_needed > 0:
        print(f"[4/5] Generating {subs_needed} customers and subscriptions in batches...")
        batch_size = 1000
        for b_start in range(0, subs_needed, batch_size):
            b_count = min(batch_size, subs_needed - b_start)
            idx_offset = existing_subs_count + b_start + 1

            customers_batch = []
            for i in range(b_count):
                idx = idx_offset + i
                city_idx = idx % len(cities)
                company = f"{random.choice(prefixes)} {random.choice(suffixes)} #{idx:05d}"
                customers_batch.append(
                    Customer(
                        company_name=company,
                        email=f"billing.client{idx:05d}@brightloop.io",
                        phone=f"+91 98{idx % 100000000:08d}",
                        city=cities[city_idx],
                        state=states[city_idx],
                        tax_id=f"29AAAAA{idx % 10000:04d}A1Z5",
                        status=Customer.Status.ACTIVE,
                    )
                )

            created_customers = Customer.objects.bulk_create(customers_batch)

            subs_batch = []
            for cust in created_customers:
                plan = random.choice(created_plans)
                # Randomize duration in past
                days_active = random.randint(1, 180)
                start_date = today - timedelta(days=days_active)
                period_start = today - timedelta(days=random.randint(0, 25))
                period_end = period_start + timedelta(days=30 if plan.billing_frequency == "monthly" else 365)
                
                status_choice = random.choices(
                    [Subscription.Status.ACTIVE, Subscription.Status.TRIALING, Subscription.Status.PAST_DUE, Subscription.Status.CANCELED],
                    weights=[0.85, 0.08, 0.04, 0.03],
                )[0]

                subs_batch.append(
                    Subscription(
                        customer=cust,
                        plan=plan,
                        status=status_choice,
                        start_date=start_date,
                        current_period_start=period_start,
                        current_period_end=period_end,
                    )
                )
            Subscription.objects.bulk_create(subs_batch)
            print(f"      Seeded {b_start + b_count}/{subs_needed} subscriptions...")

    # 5. Generate Invoices & Payments up to target count
    existing_invoices_count = Invoice.objects.count()
    invoices_needed = max(0, invoices_count - existing_invoices_count)

    if invoices_needed > 0:
        print(f"[5/5] Generating {invoices_needed} invoices and payments in batches...")
        all_subs = list(Subscription.objects.select_related("customer", "plan")[:5000])
        sub_count = len(all_subs)

        inv_batch_size = 2000
        for b_start in range(0, invoices_needed, inv_batch_size):
            b_count = min(inv_batch_size, invoices_needed - b_start)
            idx_offset = existing_invoices_count + b_start + 1

            invoices_batch = []
            invoice_metadata = []

            for i in range(b_count):
                idx = idx_offset + i
                sub_index = (idx - 1) % sub_count
                cycle = (idx - 1) // sub_count
                sub = all_subs[sub_index]
                subtotal = sub.plan.price
                tax = round_money(subtotal * Decimal("0.18"))
                total = round_money(subtotal + tax)

                # Set paid status
                is_paid = random.random() < 0.88
                amount_paid = total if is_paid else Decimal("0.00")
                balance_due = Decimal("0.00") if is_paid else total
                inv_status = Invoice.Status.PAID if is_paid else Invoice.Status.OPEN

                # Distinct non-overlapping periods per cycle for this subscription
                period_start = today - timedelta(days=30 * (cycle + 1))
                period_end = period_start + timedelta(days=30)
                issue_d = period_start
                due_d = period_start + timedelta(days=15)
                invoice_number = f"INV-2026-{idx:06d}"
                invoices_batch.append(
                    Invoice(
                        invoice_number=invoice_number,
                        customer=sub.customer,
                        subscription=sub,
                        status=inv_status,
                        issue_date=issue_d,
                        due_date=due_d,
                        period_start=issue_d,
                        period_end=due_d,
                        subtotal=subtotal,
                        tax_amount=tax,
                        total_amount=total,
                        amount_paid=amount_paid,
                        balance_due=balance_due,
                    )
                )
                invoice_metadata.append((is_paid, total, sub.customer))

            created_invoices = Invoice.objects.bulk_create(invoices_batch)

            # Generate Line Items and Payments for created invoices
            line_items_batch = []
            payments_batch = []

            for inv, (is_paid, total, cust) in zip(created_invoices, invoice_metadata):
                line_items_batch.append(
                    InvoiceLineItem(
                        invoice=inv,
                        description=f"{inv.subscription.plan.name} License",
                        quantity=1,
                        unit_price=inv.subtotal,
                        total_price=inv.subtotal,
                    )
                )
                if is_paid:
                    method = random.choice([Payment.PaymentMethod.UPI, Payment.PaymentMethod.CARD, Payment.PaymentMethod.NETBANKING])
                    payments_batch.append(
                        Payment(
                            payment_number=f"PAY-2026-{inv.id:06d}",
                            invoice=inv,
                            customer=cust,
                            amount=total,
                            payment_method=method,
                            status=Payment.Status.SUCCEEDED,
                            transaction_reference=f"TXN-{random.randint(10000000, 99999999)}",
                        )
                    )

            InvoiceLineItem.objects.bulk_create(line_items_batch)
            if payments_batch:
                Payment.objects.bulk_create(payments_batch)

            print(f"      Seeded {b_start + b_count}/{invoices_needed} invoices...")

    elapsed = time.time() - start_time
    total_subs_now = Subscription.objects.count()
    total_invs_now = Invoice.objects.count()
    total_pays_now = Payment.objects.count()
    print("==================================================================")
    print(f" SEEDING COMPLETE in {elapsed:.2f}s!")
    print(f" - Active Subscriptions in DB: {total_subs_now:,}")
    print(f" - Invoices in DB:             {total_invs_now:,}")
    print(f" - Payments in DB:             {total_pays_now:,}")
    print("==================================================================")


if __name__ == "__main__":
    subs = 5000
    invs = 20000
    if "--fast" in sys.argv:
        subs = 100
        invs = 300
    elif "--subs" in sys.argv:
        try:
            s_idx = sys.argv.index("--subs") + 1
            subs = int(sys.argv[s_idx])
        except (ValueError, IndexError):
            pass
    seed_database(subscriptions_count=subs, invoices_count=invs)
