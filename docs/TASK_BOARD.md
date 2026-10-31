# PlanLedger — One-Day Execution Task Board (09:30 – 17:00 IST)

**Project Name**: PlanLedger  
**Target Delivery Schedule**: 09:30 – 17:00 IST  
**Team Members**:
- **M1**: Reshma Shaik (`@Reshma-04sk`) — Team Lead | Backend & Infra Owner
- **M2**: Gayathri Devi G (`@gaayathri-devi-07`) — Frontend Lead

---

## 1. Timeline Overview (09:30 – 17:00 IST)

| Time Slot (IST) | Milestone | M1 Focus (Backend / Infra) | M2 Focus (Frontend / UI) |
| :--- | :--- | :--- | :--- |
| **09:30 – 10:30** | Foundation & Scaffolding | Django 6 setup, DB schema, models | Next.js 16 setup, Tailwind v4 design system |
| **10:30 – 12:00** | Core Entities & UI Shell | Auth (Argon2), Customers, Plans APIs | Landing page, Three.js hero, Dashboard shell |
| **12:00 – 13:30** | Subscriptions & Invoicing | Subscription lifecycle & Invoicing engine | Subscriptions table, Customer profiles, Invoices UI |
| **13:30 – 14:00** | *Midday Sync & Review* | Integration verification & OpenAPI export | API client contract alignment & PR reviews |
| **14:00 – 15:15** | Financial Logic & Analytics | BillingEngine, Payments, Discounts | Payments recording, Recharts analytics, Coupons UI |
| **15:15 – 16:15** | Testing & Performance | 5k subs / 20k invoices seeder, unit tests | E2E integration test, responsive polish, dark mode |
| **16:15 – 17:00** | Deployment & Demo Prep | Render/Neon configs, GitHub Actions cron | Vercel deployment, Demo script walkthrough |

---

## 2. Tasks Grouped by Owner & Priority

### M1: Reshma Shaik (Backend & Infrastructure)

| ID | Priority | Task Description | Subsystem | Status |
| :--- | :--- | :--- | :--- | :--- |
| **B-01** | P0 | Initialize Django 6 backend with Argon2 hasher & session auth | `accounts` | Completed |
| **B-02** | P0 | Design PostgreSQL 17 models with `NUMERIC(12,2)` INR decimals | `common` / `models` | Completed |
| **B-03** | P0 | Enforce Customer tenant isolation (HTTP 404 on cross-tenant access) | `customers` | Completed |
| **B-04** | P0 | Implement Plan & Subscription lifecycle state machine (400 on invalid state) | `subscriptions` | Completed |
| **B-05** | P0 | Build Idempotent `BillingEngine` with period uniqueness constraints | `billing` | Completed |
| **B-06** | P0 | Build GST-compliant Invoicing service (18% tax, sequential INV numbers) | `invoices` | Completed |
| **B-07** | P1 | Implement Payment recording with overpayment rejection logic | `payments` | Completed |
| **B-08** | P1 | Build Promotional Discount validation (dates, max redemptions, min subtotal) | `discounts` | Completed |
| **B-09** | P1 | Implement MRR, ARR, ARPU and churn calculation service | `analytics` | Completed |
| **B-10** | P1 | Build `run_billing` management command and GitHub Actions daily cron | `billing` / `ci` | Completed |
| **B-11** | P1 | Generate OpenAPI schema and Swagger UI via `drf-spectacular` | `config` / `docs` | Completed |
| **B-12** | P2 | Prepare high-scale seed data script (5k subscriptions, 20k invoices) | `infrastructure` | Completed |
| **B-13** | P1 | Build Product Catalog, Variant Surcharges, Taxes & Quotation Templates | `catalog` | Completed |
| **B-14** | P1 | Enforce Plan Lifecycle flags & Per-line `InvoiceLineTax` snapshots | `plans` / `invoices` | Completed |

---

### M2: Gayathri Devi G (Frontend & UI/UX)

| ID | Priority | Task Description | Subsystem | Status |
| :--- | :--- | :--- | :--- | :--- |
| **F-01** | P0 | Scaffold Next.js 16 App Router project with TypeScript strict mode | `apps/web` | Completed |
| **F-02** | P0 | Create dark/light design system tokens and glassmorphism styling | `globals.css` | Completed |
| **F-03** | P0 | Build landing page with Three.js particle constellation shader hero visual | `landing` | Completed |
| **F-04** | P0 | Implement `/login` and `/register` authentication screens | `auth` | Completed |
| **F-05** | P0 | Create Dashboard Shell with collapsible Sidebar and Header navigation | `layout` | Completed |
| **F-06** | P1 | Build Subscriptions management view with pause/resume/cancel actions | `subscriptions` | Completed |
| **F-07** | P1 | Build Invoices view with status badges, balance due, and void actions | `invoices` | Completed |
| **F-08** | P1 | Build Customers directory with search and GSTIN badges | `customers` | Completed |
| **F-09** | P1 | Build Plans comparison view with Monthly / Annual price toggle | `plans` | Completed |
| **F-10** | P1 | Build Payments transaction ledger with UPI and Card indicators | `payments` | Completed |
| **F-11** | P1 | Build Coupons & Discounts view with redemption progress bars | `discounts` | Completed |
| **F-12** | P1 | Implement Recharts revenue graphs (MRR, ARR, monthly trends) | `analytics` | Completed |
| **F-13** | P2 | Build Centralized API client with CSRF and same-origin `/api` rewrites | `lib` | Completed |

---

### Shared Collaboration Tasks (Both Members)

| ID | Task Description | Responsible | Status |
| :--- | :--- | :--- | :--- |
| **S-01** | Agree on API Contract specifications (`docs/API_CONTRACT.md`) | Reshma & Gayathri | Completed |
| **S-02** | Review and merge Integration Pull Requests via GitHub | Reshma & Gayathri | Ongoing |
| **S-03** | Verify end-to-end flow: Register -> Subscribe -> Bill -> Invoice -> Pay | Reshma & Gayathri | Completed |
| **S-04** | Verify query latency under 2.0s with seeded database records | Reshma & Gayathri | Completed |
| **S-05** | Rehearse final live demonstration script (`docs/DEMO_GUIDE.md`) | Reshma & Gayathri | Ready |
