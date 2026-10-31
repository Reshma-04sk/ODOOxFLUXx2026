# PlanLedger Testing & Performance Guide

## 1. Automated Test Suite (Django)

The automated test suite runs 33 tests across 8 key domain specifications:

```bash
cd apps/api
python manage.py test tests --verbosity=2
```

### Domains Tested:
1. **Authentication & Security (`test_auth.py`)**:
   - Argon2 password hashing verification.
   - Case-insensitive unique email enforcement.
   - Double-submit CSRF cookie token endpoint.
   - User registration & auto Customer provisioning.
   - Session authentication login/logout.
2. **Customer Isolation (`test_customer_isolation.py`)**:
   - Multi-tenant query partitioning.
   - Cross-tenant lookups strictly returning **HTTP 404** (not 403).
   - Staff/Admin global visibility.
3. **Subscription Lifecycle (`test_subscription_lifecycle.py`)**:
   - Creation with 14-day trial period.
   - Immediate cancellation vs cancel at period end.
   - Pause and resume state transitions.
   - Invalid state transition rejection (HTTP 400).
   - Plan upgrades.
4. **Billing Engine Idempotency (`test_billing_engine.py`)**:
   - Period advancement on renewal.
   - Strict idempotency: second billing run on the same date produces 0 new invoices.
   - Subscriptions set to cancel at period end transitioning to `canceled`.
5. **Invoice Generation & Tax (`test_invoices.py`)**:
   - Sequential `INV-YYYY-XXXXXX` numbering.
   - 18% GST tax calculation with `ROUND_HALF_UP`.
   - Voiding rules (cannot void paid invoices).
6. **Payment Reconciliation (`test_payments.py`)**:
   - Partial and full payment tracking.
   - Overpayment rejection constraint (HTTP 400).
   - Void invoice payment rejection.
7. **Discounts & Coupons (`test_discounts.py`)**:
   - Percentage and fixed discount math.
   - Minimum subtotal threshold.
   - Expiry date bounds & maximum redemption exhaustion.
8. **Pagination & Query Latency (`test_pagination_and_performance.py`)**:
   - Uniform pagination envelope (`count`, `next`, `previous`, `results`, `page`, `total_pages`).
   - Query response under 2.0s threshold.

---

## 2. High-Scale Seed Data Performance Benchmarking
```bash
# Seed 5,000 subscriptions and 20,000 invoices
python infrastructure/scripts/seed_data.py --subs 5000
```
With composite database indexes on `[customer_id, status]`, `[status, current_period_end]`, and `[issue_date]`, API queries for 20-item paginated results execute in **under 50 milliseconds**.
