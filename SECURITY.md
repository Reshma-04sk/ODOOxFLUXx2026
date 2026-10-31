# PlanLedger Security Policy

## 1. Supported Versions

| Component | Version | Supported |
| :--- | :--- | :--- |
| PlanLedger API (Django) | 6.x | Yes |
| PlanLedger Web (Next.js) | 16.x | Yes |
| Database (PostgreSQL) | 17.x | Yes |

---

## 2. Security Architecture & Controls

### Authentication & Passwords
- **Argon2 Password Hashing**: PlanLedger uses `Argon2PasswordHasher` as the primary password hasher, providing memory-hard protection against GPU brute-force attacks.
- **Session Authentication & CSRF**: API requests use Django session authentication with double-submit CSRF tokens and same-origin reverse-proxy rewrites (`/api`).
- **Role-Based Access Control**: Users are partitioned into Superuser, Staff, and Customer roles.

### Customer Isolation (Multi-Tenancy)
- Every query accessing customer resources filters by the authenticated user's associated `customer_id`.
- Attempts to query or mutate an unauthorized tenant's resources return an immediate **HTTP 404** (not HTTP 403), preventing tenant enumeration attacks.

### Financial Integrity
- All monetary calculations are performed with Python `Decimal` and PostgreSQL `NUMERIC(12, 2)` using standard `ROUND_HALF_UP` banking rounding.
- Overpayments are strictly rejected at the database and service layers.
- Invoices enforce unique sequential numbering per tenant.
- Billing runs use database transactions (`@transaction.atomic`) with unique constraint checks to ensure strict idempotency and zero duplicate invoices.

### Secret Management
- Secrets are NEVER committed to Git. All credentials use environment variables loaded via `python-dotenv`.
- In production, secrets are securely injected through Render and Vercel environment dashboards.

---

## 3. Reporting a Vulnerability

If you discover a security vulnerability in PlanLedger, please report it privately to the team lead:
- Lead Developer: Reshma Shaik (`https://github.com/Reshma-04sk`)
- Frontend Lead: Gayathri Devi G (`https://github.com/gaayathri-devi-07`)

Please do not open public GitHub issues for security vulnerabilities.
