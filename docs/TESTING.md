# PlanLedger Testing & Performance Guide

## 1. Automated Test Suite (Django)

The automated test suite runs 48 tests across 10 key domain specifications:

```bash
cd apps/api
python manage.py test tests --verbosity=2
```

### Domains Tested:
1. **Catalog, Variants, Taxes & Quotations (`test_catalog.py`)**:
   - Product variant extra price surcharge (e.g., Brand=Odoo +560.00).
   - Percentage and fixed tax calculation with `ROUND_HALF_UP`.
   - QuotationTemplate instantiation with validity days and payment terms.
   - Quotation confirmation to Subscription with `SubscriptionLine` items and audit events.
   - Admin-only write vs. staff read-only permissions (`IsAdminOrStaffReadOnly`).
   - Plan lifecycle flag enforcement (`auto_close`, `closable`, `pausable`, `renewable`, date bounds).
   - Billing engine auto-close and non-renewable plan cancellation handling.
   - Per-line `InvoiceLineTax` snapshots and variant price calculation.
2. **Authentication & Security (`test_auth.py`)**:
   - Argon2 password hashing verification.
   - Case-insensitive unique email enforcement.
   - Double-submit CSRF cookie token endpoint.
   - User registration & auto Customer provisioning.
   - Session authentication login/logout.
3. **Customer Isolation (`test_customer_isolation.py`)**:
   - Multi-tenant query partitioning.
   - Cross-tenant lookups strictly returning **HTTP 404** (not 403).
   - Staff/Admin global visibility.
4. **Subscription Lifecycle (`test_subscription_lifecycle.py`)**:
   - Creation with 14-day trial period.
   - Immediate cancellation vs cancel at period end.
   - Pause and resume state transitions.
   - Invalid state transition rejection (HTTP 400).
   - Plan upgrades.
5. **Billing Engine Idempotency (`test_billing_engine.py`)**:
   - Period advancement on renewal.
   - Strict idempotency: second billing run on the same date produces 0 new invoices.
   - Subscriptions set to cancel at period end transitioning to `canceled`.
6. **Invoice Generation & Tax (`test_invoices.py`)**:
   - Sequential `INV-YYYY-XXXXXX` numbering.
   - 18% GST tax calculation with `ROUND_HALF_UP`.
   - Voiding rules (cannot void paid invoices).
   - Printable HTML receipt export (`?export=html`) and structured JSON receipt.
7. **Payment Reconciliation (`test_payments.py`)**:
   - Partial and full payment tracking.
   - Overpayment rejection constraint (HTTP 400).
   - Void invoice payment rejection.
   - Staff-authorized refunds and balance reinstatement.
8. **Discounts & Coupons (`test_discounts.py`)**:
   - Percentage and fixed discount math.
   - Minimum subtotal threshold.
   - Expiry date bounds & maximum redemption exhaustion.
9. **Pagination & Query Latency (`test_pagination_and_performance.py`)**:
   - Uniform pagination envelope (`count`, `next`, `previous`, `results`, `page`, `total_pages`).
   - Query response under 2.0s threshold.
10. **System Health & Liveness (`test_health.py`)**:
    - GET `/api/health/` and `/healthz` liveness probes with DB connectivity checks.

---

## 2. High-Scale Seed Data Performance Benchmarking
```bash
# Seed 5,000 subscriptions and 20,000 invoices
python infrastructure/scripts/seed_data.py --subs 5000
```
With composite database indexes on `[customer_id, status]`, `[status, current_period_end]`, and `[issue_date]`, API queries for 20-item paginated results execute in **under 50 milliseconds**.
