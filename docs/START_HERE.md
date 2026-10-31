# PlanLedger — Simultaneous Development Guide (START_HERE)

Welcome to **PlanLedger**, the Brightloop Software Subscription Management System.

This repository is an **integrated monorepo** designed specifically for **two developers working concurrently** without blocking one another.

---

## 1. Team Composition & Module Ownership

| Member | Role | GitHub | Primary Ownership |
| :--- | :--- | :--- | :--- |
| **M1: Reshma Shaik** | Team Lead / Backend & Infra Owner | [Reshma-04sk](https://github.com/Reshma-04sk) | `apps/api/**`, `infrastructure/**`, Database schema, Billing engine, Invoices, Security, API docs |
| **M2: Gayathri Devi G** | Frontend Lead | [gaayathri-devi-07](https://github.com/gaayathri-devi-07) | `apps/web/**`, Next.js architecture, UI/UX design system, Landing page, Dashboard pages, Charts |

---

## 2. Dedicated Onboarding Guides

Before starting work, each team member should read their dedicated setup document:
- **Reshma (M1)**: [docs/START_M1.md](file:///c:/Projects/ODOOxFLUXx2026/docs/START_M1.md)
- **Gayathri (M2)**: [docs/START_M2.md](file:///c:/Projects/ODOOxFLUXx2026/docs/START_M2.md)

---

## 3. How Both Developers Work Simultaneously

```
+-------------------------------------------------------------+
|                      PlanLedger Monorepo                     |
+-------------------------------------------------------------+
               |                               |
       [apps/api (Django 6)]          [apps/web (Next.js 16)]
         Reshma Shaik                   Gayathri Devi G
      feat/backend-* branches        feat/frontend-* branches
               |                               |
               |                               |
        REST API Contract             Centralized API Client
      (docs/API_CONTRACT.md)          (apps/web/src/lib/api-client)
               |                               |
               +---------------+---------------+
                               |
                        [Pull Requests]
                     Peer Review & Approval
                               |
                            [main]
```

### Why Neither Developer is Blocked:
1. **Contract-First Development**: All endpoint contracts, paths, schemas, request payloads, and response envelopes are frozen in [docs/API_CONTRACT.md](file:///c:/Projects/ODOOxFLUXx2026/docs/API_CONTRACT.md) and [apps/api/schema.yml](file:///c:/Projects/ODOOxFLUXx2026/apps/api/schema.yml).
2. **Built-in Mock Fallback Layer**: If Reshma is working on billing migrations and the Django API is stopped, Gayathri's frontend in `apps/web` seamlessly falls back to typed data in `src/services/mock-data.ts`. The UI never breaks or hangs.
3. **Transparent Proxying**: In `apps/web/next.config.ts`, Next.js rewrites all `/api/*` calls to the Django API port (`http://localhost:8000`), allowing same-origin cookie session authentication and double-submit CSRF tokens.
4. **Git Branch Isolation**:
   - Reshma works on `feat/backend-*`
   - Gayathri works on `feat/frontend-*`
   - No direct commits to `main` are permitted.

---

## 4. Daily Workflow & Quickstart

```bash
# 1. Clone the monorepo
git clone <repo-url>
cd ODOOxFLUXx2026

# 2. Reshma starts backend:
cd apps/api
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000

# 3. Gayathri starts frontend:
cd apps/web
npm install
npm run dev
# Opens at http://localhost:3000
```
