# PlanLedger Final Demonstration Script

A step-by-step 5-minute live demonstration script for **Reshma Shaik** (M1) and **Gayathri Devi G** (M2).

---

## 1. Setup Before Demo
1. Start backend: `cd apps/api && python manage.py runserver 8000`
2. Start frontend: `cd apps/web && npm run dev`
3. Open browser at [http://localhost:3000](http://localhost:3000)

---

## 2. Walkthrough Script (5 Minutes)

### Act 1: Landing Page & Architecture (M2 - Gayathri)
- **Action**: Showcase the landing page at `http://localhost:3000`.
- **Talking Points**:
  - Point out the real-time Three.js particle constellation shader hero visual and responsive fallbacks.
  - Show the Monthly vs Annual pricing toggle with automatic "2 Months Free" computation.
  - Highlight the engineering team section with direct GitHub profile links for both developers.

### Act 2: Authentication & Multi-Tenancy (M1 - Reshma)
- **Action**: Click "Sign In" or navigate to `/login`.
- **Talking Points**:
  - Show session authentication with double-submit CSRF cookie protection.
  - Explain the Argon2 password hasher running on Django 6.
  - Log in as `admin@brightloop.io` / `Admin@12345`.

### Act 3: Subscriptions Lifecycle & State Machine (M2 - Gayathri)
- **Action**: Navigate to `/dashboard/subscriptions`.
- **Talking Points**:
  - Show active subscriptions across Starter, Growth, and Enterprise tiers.
  - Demonstrate pausing a subscription: click the **Pause** icon. Notice instantaneous state transition.
  - Demonstrate clicking **Resume**.
  - Explain how the backend rejects invalid state transitions with HTTP 400 (e.g. pausing an already paused subscription).

### Act 4: Billing Engine Idempotency in Action (M1 - Reshma)
- **Action**: On `/dashboard`, click the **Trigger Manual Billing Run** button.
- **Talking Points**:
  - Show the `BillingEngine` evaluating subscriptions in atomic transactions.
  - Trigger it a second time: show that **0 duplicate invoices** are created due to the database constraint `UNIQUE(subscription_id, period_start, period_end)`.
  - Show the command-line equivalent: `python manage.py run_billing`.

### Act 5: Invoices, 18% GST, & Overpayment Rejection (Shared)
- **Action**: Navigate to `/dashboard/invoices` and `/dashboard/payments`.
- **Talking Points**:
  - Show sequential numbering: `INV-2026-000101`.
  - Highlight the 18% GST breakdown and line items.
  - Explain that overpayment attempts (paying more than the remaining balance due) are strictly blocked with HTTP 400.

### Act 6: Financial Analytics & Wrap-up (Shared)
- **Action**: Navigate to `/dashboard/analytics`.
- **Talking Points**:
  - Highlight real-time MRR, ARR, ARPU, and Churn Rate calculations.
  - Point to the interactive Recharts monthly volume graphs and tier distributions.
  - Summarize the clean monorepo architecture, testing suite (33 tests passing), and cloud-readiness on Vercel, Render, and Neon.
