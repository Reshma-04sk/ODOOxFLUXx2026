# Pull Request Draft: M1 Core Backend Architecture & Billing Engine

- **PR Branch**: `feat/backend-subscription-billing-core`
- **Target Branch**: `main`
- **Author**: Reshma Shaik ([@Reshma-04sk](https://github.com/Reshma-04sk)) — Team Lead | Backend & Infrastructure Owner
- **Reviewer**: Gayathri Devi G ([@gaayathri-devi-07](https://github.com/gaayathri-devi-07)) — Frontend Lead
- **GitHub PR URL**: [https://github.com/Reshma-04sk/ODOOxFLUXx2026/pull/new/feat/backend-subscription-billing-core](https://github.com/Reshma-04sk/ODOOxFLUXx2026/pull/new/feat/backend-subscription-billing-core)

---

## Pull Request Description

### Summary of Changes
This pull request introduces the complete core backend architecture for **PlanLedger** (Brightloop Software Subscription Management System), covering data models, domain business logic, idempotency controls, RESTful APIs, transaction security, automated unit tests, and deployment health monitoring.

Key capabilities included in this PR:
1. **Accounts & Authentication**:
   - Custom `User` model with Argon2 password hashing.
   - Session authentication with CSRF double-submit cookies (`/api/v1/accounts/csrf/`, `/register/`, `/login/`, `/logout/`, `/me/`).
2. **Multi-Tenant Customer Isolation**:
   - Strict organization isolation where non-staff users querying unowned customer, subscription, or invoice resources receive **HTTP 404 (Not Found)** rather than HTTP 403, eliminating resource enumeration vulnerabilities.
3. **Plan & Subscription Lifecycle State Machine**:
   - Monthly and Annual subscription tiers with trial support.
   - State transition validation (CANCEL, PAUSE, RESUME, UPGRADE) preventing illegal status transitions.
   - Automated transactional email notifications upon subscription activation, cancellation, and plan changes.
4. **Idempotent BillingEngine & Cron Management**:
   - Daily billing renewal engine with DB-level `UniqueConstraint` on `(subscription, period_start, period_end)` to prevent duplicate billing runs.
   - `python manage.py run_billing` CLI command with `--dry-run` and `--target-date` options.
   - GitHub Actions automated daily cron workflow (`.github/workflows/billing_cron.yml`).
5. **GST-Compliant Invoicing & Receipts**:
   - Sequential GST invoice numbering (`INV-YYYY-XXXXXX`).
   - 18% GST tax calculation with exact Decimal `ROUND_HALF_UP` arithmetic.
   - `GET /api/v1/invoices/{id}/receipt/` endpoint supporting structured JSON and printable HTML (`?export=html`).
   - Void invoice lifecycle handling (`POST /api/v1/invoices/{id}/void/`).
6. **Payments Ledger & Refund Processing**:
   - Payment recording supporting UPI, Card, Net Banking, and Bank Transfer.
   - Overpayment protection rejecting amounts exceeding outstanding invoice balance.
   - Staff-restricted refund processing (`POST /api/v1/payments/{id}/refund/`) with automatic invoice balance reinstatement.
7. **Discounts & Coupons**:
   - Promotional discount validation with expiration dates, maximum redemption limits, and minimum spend thresholds.
8. **Real-time Analytics Engine**:
   - Real-time aggregation of MRR, ARR, ARPU, active subscribers, and monthly revenue trends.
9. **Infrastructure & Deployment Readiness**:
   - Production Dockerfiles (`infrastructure/docker/Dockerfile.api`, `Dockerfile.web`).
   - Render deployment blueprint (`infrastructure/deployment/render.yaml`) with `/api/health/` health check probe.
   - Database wait script (`infrastructure/scripts/wait_for_db.py`).
   - Fast and high-scale seed data generator (`infrastructure/scripts/seed_data.py`).
   - OpenAPI 3.0 schema generation (`drf-spectacular`) with 0 errors.

---

### Related Issue / Task
- Task Board: Tasks **B-01** through **B-12** from [docs/TASK_BOARD.md](file:///c:/Projects/ODOOxFLUXx2026/docs/TASK_BOARD.md).

---

### Type of Change
- [x] `feat(api)`: Backend feature
- [x] `feat(infra)`: CI/CD pipeline and deployment infrastructure
- [x] `docs`: API contracts and documentation

---

### Subsystem Ownership Check
- [x] **M1 (Reshma Shaik)**: Changes in `apps/api/**` and `infrastructure/**`
- [ ] **M2 (Gayathri Devi G)**: Changes in `apps/web/**`
- [x] **Shared**: Changes in `docs/API_CONTRACT.md`

---

### Testing & Verification

1. **Automated Unit Tests**:
   - Executed via `.venv\Scripts\python.exe apps/api/manage.py test tests`
   - **40 tests executed — 40 passed (0 failures, 0 errors) in 16.98s**.
   - Coverage:
     - `test_auth.py`: Registration, login, logout, session persistence, CSRF.
     - `test_customer_isolation.py`: Tenant isolation and HTTP 404 enumeration prevention.
     - `test_subscription_lifecycle.py`: State machine transitions, pause/resume, upgrades.
     - `test_billing_engine.py`: Billing cycle renewal and idempotency guarantees.
     - `test_invoices.py`: Sequential numbering, 18% GST calculation, voiding, receipt HTML/JSON.
     - `test_payments.py`: Overpayment rejection, balance updates, staff refund processing.
     - `test_discounts.py`: Promo validity dates, usage limits, minimum amounts.
     - `test_pagination_and_performance.py`: Standard pagination contract.
     - `test_health.py`: Liveness probe and DB connectivity verification.

2. **OpenAPI Schema Verification**:
   - Generated using `python apps/api/manage.py spectacular --file apps/api/schema.yml`
   - Schema generation completed with **0 errors**.

3. **Database Seeding Verification**:
   - Ran `python infrastructure/scripts/seed_data.py --fast`
   - Seeded 100 subscriptions, 300 invoices, 263 payments in 0.30s.

---

### Reviewer Checklist for M2 (Gayathri Devi G)
- [ ] Code follows PEP 8 and Django architectural best practices.
- [ ] All new endpoints match the interface documented in [docs/API_CONTRACT.md](file:///c:/Projects/ODOOxFLUXx2026/docs/API_CONTRACT.md).
- [ ] No secrets committed (all credentials use `.env` / environment variables).
- [ ] Ready to merge into `main` after review approval.
