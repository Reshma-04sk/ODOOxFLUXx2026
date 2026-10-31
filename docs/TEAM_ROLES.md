# PlanLedger Team Roles & Governance

**Monorepo**: Exactly TWO Developers.

---

## 1. Member Profiles

### M1 — Reshma Shaik
- **Role**: Team Lead | Backend & Infrastructure Owner
- **GitHub**: [https://github.com/Reshma-04sk](https://github.com/Reshma-04sk)
- **Primary Ownership**:
  - Django 6 REST Framework backend architecture
  - PostgreSQL 17 database schema, migrations, constraints & indexes
  - Idempotent subscription lifecycle & automated billing engine
  - Invoice generation (18% GST) & payment reconciliation
  - Authentication (Argon2), authorization, and tenant isolation (HTTP 404)
  - Backend performance & query optimization under 5k/20k seed scale
  - Deployment & environment configuration (Render, Neon, Docker)
  - Repository governance, PR reviews and integration

### M2 — Gayathri Devi G
- **Role**: Frontend Lead
- **GitHub**: [https://github.com/gaayathri-devi-07](https://github.com/gaayathri-devi-07)
- **Primary Ownership**:
  - Next.js 16 (App Router) frontend architecture
  - UI/UX and Tailwind CSS v4 design system
  - Landing page with Three.js particle constellation shader visual
  - Dashboard overview & analytical pages
  - Subscriptions, Invoices, Payments, Plans, and Coupons interfaces
  - Form validation with React Hook Form and Zod
  - Financial charts (Recharts) & interactive controls
  - Client-side error handling & Sonner notifications
  - Frontend responsiveness, accessibility (a11y), and performance

---

## 2. Review & Integration Rules
1. Every PR must have at least one approving review from the other team member.
2. Integration changes touching `docs/API_CONTRACT.md`, root configuration, or CI workflows require approval from **both** developers.
3. Neither developer is permitted to push directly to `main`.
