# PlanLedger System Architecture

**Project Type**: Brightloop Software Subscription Management System  
**Lead Architect & Backend Owner**: Reshma Shaik (`@Reshma-04sk`)  
**Frontend Lead**: Gayathri Devi G (`@gaayathri-devi-07`)

---

## 1. High-Level Architectural Diagram

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|  Next.js 16 (App Router) • React 19 • Tailwind CSS v4 • Three.js • TanStack       |
+-----------------------------------------------------------------------------------+
                                         |
                            HTTPS Same-Origin /api Rewrite
                                         v
+-----------------------------------------------------------------------------------+
|                                  GATEWAY & PROXY                                  |
|   Vercel Edge Proxy / Next.js rewrites -> Render (planledger-api.onrender.com)    |
|   Double-Submit CSRF Cookie Protection • Session Authentication Headers           |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                              DJANGO REST FRAMEWORK (API)                          |
|  Python 3.13 • Django 6 • Argon2 Hashing • WhiteNoise • drf-spectacular           |
|                                                                                   |
|  +----------------+  +-------------------+  +------------------+                  |
|  | accounts (Auth)|  | customers (Tenant)|  | plans (Tiers)    |                  |
|  +----------------+  +-------------------+  +------------------+                  |
|  +----------------+  +-------------------+  +------------------+                  |
|  | subscriptions  |  | billing (Engine)  |  | invoices (GST)   |                  |
|  +----------------+  +-------------------+  +------------------+                  |
|  +----------------+  +-------------------+  +------------------+                  |
|  | payments (Rec) |  | discounts (Promo) |  | analytics (MRR)  |                  |
|  +----------------+  +-------------------+  +------------------+                  |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                               PERSISTENCE & STORAGE                               |
|   Neon Serverless PostgreSQL 17 / Local Docker PostgreSQL 17                      |
|   psycopg 3 Driver • NUMERIC(12,2) Currency Fields • Period Unique Constraints    |
+-----------------------------------------------------------------------------------+
```

---

## 2. Core Architectural Pillars

### A. Idempotent Billing Engine
The `BillingEngine` runs daily (or ad-hoc) to process recurring renewals.
1. Evaluates all active subscriptions where `current_period_end <= target_date`.
2. Computes the next period: `period_start = current_period_end`, `period_end = calculate_period_end(period_start, frequency)`.
3. **Database Constraint & Atomic Lock**: Before generating an invoice, the engine checks for existing records matching `(subscription_id, period_start, period_end)`.
4. If an invoice exists, generation is skipped. If not, the invoice is generated and the subscription's period is advanced in a single transaction.

### B. Financial Calculations & Currency Precision
- All monetary amounts use PostgreSQL `NUMERIC(12, 2)` and Python `Decimal`.
- Operations apply `ROUND_HALF_UP` bankers' rounding.
- Single unified currency: Indian Rupee (`INR`, ₹).
- Overpayments are strictly rejected with HTTP 400.

### C. Multi-Tenant Customer Isolation
- Every query is partitioned by the authenticated user's `customer_profile`.
- Staff and Superusers have global visibility.
- If a customer attempts to inspect or mutate another tenant's resource, the API returns **HTTP 404 (Not Found)** rather than HTTP 403, preventing resource enumeration.

### D. Zero-Dependency Local Development
- Configured to run against **Neon PostgreSQL 17** in production, **Docker Compose PostgreSQL 17** in local containers, and falls back to **SQLite** automatically if `DATABASE_URL` is unset.
