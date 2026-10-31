# PlanLedger — Brightloop Software Subscription Management System
> Built for **ODOOxFLUXx2026** — 24-hour coding marathon where talent meets technology, and innovation knows no bounds.

[![CI](https://github.com/Reshma-04sk/ODOOxFLUXx2026/actions/workflows/ci.yml/badge.svg)](https://github.com/Reshma-04sk/ODOOxFLUXx2026/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python: 3.13](https://img.shields.io/badge/Python-3.13-blue.svg)](https://www.python.org/)
[![Django: 6](https://img.shields.io/badge/Django-6.0-green.svg)](https://www.djangoproject.com/)
[![Next.js: 16](https://img.shields.io/badge/Next.js-16.0-black.svg)](https://nextjs.org/)
[![PostgreSQL: 17](https://img.shields.io/badge/PostgreSQL-17-blue.svg)](https://www.postgresql.org/)

---

## 1. Project Overview
**PlanLedger** is an enterprise-grade subscription management and financial billing system built for high-growth B2B SaaS platforms. It provides automated, idempotent subscription renewals, multi-tier pricing, promotional coupon validation, 18% GST-compliant sequential invoicing, and transaction reconciliation in Indian Rupees (`INR`, ₹).

---

## 2. Key Features
- **Idempotent Billing Engine**: Automated recurring billing runs with strict period locks. Duplicate invoices are prevented at both the application and database level.
- **Financial Decimal Precision**: All currency calculations use PostgreSQL `NUMERIC(12, 2)` and Python `Decimal` with standard `ROUND_HALF_UP` banking rounding.
- **Strict Customer Isolation**: Multi-tenant architecture ensures customers can only query and mutate their own subscriptions. Cross-tenant queries return **HTTP 404** (preventing tenant enumeration).
- **Overpayment Rejection**: Payments update invoice balances atomically and reject any attempt to overpay beyond remaining balance with HTTP 400.
- **Multi-Coupon Promotional Engine**: Percentage and fixed INR discounts with minimum invoice subtotal constraints, validity date windows, and maximum redemption limits.
- **Real-Time Revenue Analytics**: Live metrics for Monthly Recurring Revenue (MRR), Annualized Run Rate (ARR), churn rates, ARPU, and monthly revenue trends.
- **Interactive Three.js Experience**: Custom particle constellation hero visual with graceful WebGL fallbacks and reduced-motion support.

---

## 3. Architecture
```
+-------------------------------------------------------------+
|                      Next.js 16 Web App                     |
|           (Tailwind CSS v4 • Three.js • TanStack)           |
+-------------------------------------------------------------+
                              |
                   Same-origin /api rewrite
                              v
+-------------------------------------------------------------+
|                  Django 6 REST API (v1)                     |
|   (Argon2 Auth • Session Cookies • drf-spectacular docs)    |
+-------------------------------------------------------------+
                              |
                    psycopg 3 connection
                              v
+-------------------------------------------------------------+
|                    PostgreSQL 17 Database                   |
|     (Neon Serverless / Docker • NUMERIC(12,2) • Indexes)    |
+-------------------------------------------------------------+
```
For detailed architectural diagrams, see [docs/ARCHITECTURE.md](file:///c:/Projects/ODOOxFLUXx2026/docs/ARCHITECTURE.md).

---

## 4. Technology Stack

### Backend
- **Language**: Python 3.13
- **Framework**: Django 6 & Django REST Framework
- **Database**: PostgreSQL 17 (psycopg 3 driver)
- **Security**: Argon2 password hashing, double-submit CSRF cookies, Session auth
- **API Documentation**: drf-spectacular (OpenAPI 3.0 / Swagger UI / Redoc)
- **Production Server**: Gunicorn & WhiteNoise

### Frontend
- **Framework**: Next.js 16 (App Router) & React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 & custom glassmorphism design system
- **State & Tables**: TanStack Query & TanStack Table
- **Forms**: React Hook Form & Zod
- **Visuals & Charts**: Recharts, Three.js, Lucide Icons, Sonner toasts

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Hosted Database**: Neon PostgreSQL 17
- **Backend Host**: Render (Python Web Service + Daily Cron)
- **Frontend Host**: Vercel (Edge Network)
- **CI/CD & Cron**: GitHub Actions

---

## 5. Repository Structure
```
planledger/
├── apps/
│   ├── api/                   # Django 6 REST Framework backend
│   │   ├── config/            # Django settings, WSGI/ASGI, URLs
│   │   ├── accounts/          # User model, Argon2 auth, CSRF, /me/
│   │   ├── customers/         # Customer profiles & tenant isolation
│   │   ├── plans/             # Subscription tiers & pricing
│   │   ├── subscriptions/     # Subscription lifecycles & state machine
│   │   ├── billing/           # Idempotent billing engine & run_billing
│   │   ├── invoices/          # GST invoices & line items
│   │   ├── payments/          # Transaction ledger & overpayment guard
│   │   ├── discounts/         # Promotional coupons & redemption
│   │   ├── analytics/         # MRR, ARR, churn rate, ARPU
│   │   ├── notifications/     # In-app and Brevo email notifications
│   │   ├── common/            # Money utilities, pagination, exceptions
│   │   └── tests/             # 33 unit tests across all domains
│   │
│   └── web/                   # Next.js 16 App Router frontend
│       ├── src/app/           # Public pages & dashboard routes
│       ├── src/components/    # Sidebar, Header, Shell, Three.js hero
│       ├── src/services/      # Typed API service & mock data layer
│       ├── src/lib/           # Centralized API client & query provider
│       └── src/types/         # TypeScript domain contracts
│
├── docs/                      # Complete system documentation
├── infrastructure/            # Dockerfiles, deployment blueprints, seeders
├── .github/                   # Workflows (CI, billing cron), CODEOWNERS
└── docker-compose.yml         # Local PostgreSQL 17 container
```

---

## 6. Screenshots Section Placeholder

| Screen | Description |
| :--- | :--- |
| ![Landing Page Placeholder](docs/screenshots/landing_hero.png) | Interactive Three.js particle constellation and pricing tiers |
| ![Dashboard Overview Placeholder](docs/screenshots/dashboard.png) | MRR, ARR, churn rate, and manual billing trigger controls |
| ![Subscriptions Placeholder](docs/screenshots/subscriptions.png) | Subscription lifecycle management and pause/resume/cancel actions |
| ![Invoices Placeholder](docs/screenshots/invoices.png) | 18% GST itemized invoices and sequential numbering |

---

## 7. Local Setup
Clone the monorepo:
```bash
git clone https://github.com/Reshma-04sk/ODOOxFLUXx2026.git
cd ODOOxFLUXx2026
```

---

## 8. Environment Configuration
### Backend
```bash
cd apps/api
cp .env.example .env
# If DATABASE_URL is left blank, SQLite is used automatically for zero-friction local testing.
```

### Frontend
```bash
cd apps/web
cp .env.example .env.local
```

---

## 9. Backend Startup
```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate  # on Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

---

## 10. Frontend Startup
```bash
cd apps/web
npm install
npm run dev
# Open http://localhost:3000
```

---

## 11. API Documentation
When the backend is running, open:
- **Swagger UI**: [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
- **Redoc Reference**: [http://localhost:8000/api/redoc/](http://localhost:8000/api/redoc/)
- **Raw OpenAPI Schema**: [http://localhost:8000/api/schema/](http://localhost:8000/api/schema/)

---

## 12. Testing Instructions
Run the automated test suite (33 tests):
```bash
cd apps/api
python manage.py test tests --verbosity=2
```

Run high-scale database seed generator:
```bash
# Fast mode (100 subscriptions, 300 invoices):
python infrastructure/scripts/seed_data.py --fast

# Full benchmark (5,000 subscriptions, 20,000 invoices):
python infrastructure/scripts/seed_data.py --subs 5000
```

---

## 13. Deployment
- **Frontend**: Deployed to Vercel via [infrastructure/deployment/vercel.json](file:///c:/Projects/ODOOxFLUXx2026/infrastructure/deployment/vercel.json).
- **Backend**: Deployed to Render via [infrastructure/deployment/render.yaml](file:///c:/Projects/ODOOxFLUXx2026/infrastructure/deployment/render.yaml).
- **Database**: Serverless PostgreSQL 17 on Neon.
- **Scheduled Billing**: Daily GitHub Actions cron workflow at [billing_cron.yml](file:///c:/Projects/ODOOxFLUXx2026/.github/workflows/billing_cron.yml).

---

## 14. Team Members

| Developer | Role | GitHub Profile | Subsystem Ownership |
| :--- | :--- | :--- | :--- |
| **Reshma Shaik** | Team Lead / Backend Owner | [@Reshma-04sk](https://github.com/Reshma-04sk) | `apps/api/**`, `infrastructure/**`, DB & Billing |
| **Gayathri Devi G** | Frontend Lead | [@gaayathri-devi-07](https://github.com/gaayathri-devi-07) | `apps/web/**`, Design System, Landing & UI |

---

## 15. Contribution Guidelines
Please review [CONTRIBUTING.md](file:///c:/Projects/ODOOxFLUXx2026/CONTRIBUTING.md) and individual onboarding guides:
- [docs/START_M1.md](file:///c:/Projects/ODOOxFLUXx2026/docs/START_M1.md) (Reshma Shaik)
- [docs/START_M2.md](file:///c:/Projects/ODOOxFLUXx2026/docs/START_M2.md) (Gayathri Devi G)
- [docs/START_HERE.md](file:///c:/Projects/ODOOxFLUXx2026/docs/START_HERE.md) (Simultaneous Parallel Development)
