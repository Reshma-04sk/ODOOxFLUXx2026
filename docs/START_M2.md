# Onboarding & Execution Guide for M2 — Gayathri Devi G

**Role**: Frontend Lead  
**GitHub**: [https://github.com/gaayathri-devi-07](https://github.com/gaayathri-devi-07)

---

## 1. What to Install
- **Node.js 22 LTS or Node.js 24** (Verify: `node --version`)
- **npm** (Verify: `npm --version`)
- **Git** (Verify: `git --version`)

---

## 2. How to Open the Monorepo
```bash
git clone <repo-url>
cd ODOOxFLUXx2026
```

---

## 3. How to Install Frontend Dependencies
```bash
cd apps/web
npm install
```

---

## 4. How to Configure Environment Variables
```bash
cd apps/web
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000 (defaults to proxying via Next.js /api)
```

---

## 5. How to Start Next.js Development Server
```bash
npm run dev
```

---

## 6. How to Access the Frontend
- Web Application: [http://localhost:3000](http://localhost:3000)
- Dashboard Overview: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- Subscriptions: [http://localhost:3000/dashboard/subscriptions](http://localhost:3000/dashboard/subscriptions)
- Plans: [http://localhost:3000/dashboard/plans](http://localhost:3000/dashboard/plans)
- Invoices: [http://localhost:3000/dashboard/invoices](http://localhost:3000/dashboard/invoices)

---

## 7. How to Connect to the Backend API
The frontend uses a centralized API client in `src/lib/api-client.ts`. Next.js automatically rewrites `/api/*` requests to the Django backend.
- If Django is running locally on port 8000, real live data is fetched automatically.
- If Django is offline during local UI development, `src/services/api-service.ts` gracefully falls back to typed data in `src/services/mock-data.ts`. You are never blocked!

---

## 8. Which Folders M2 Owns
- `apps/web/**` (Next.js 16 App Router, TypeScript, Tailwind CSS v4, components, pages)
- `docs/API_CONTRACT.md` (Co-owner with M1)
- UI/UX design system, animations (GSAP, Three.js), and charts

---

## 9. First Five Tasks in Priority Order
1. **Verify Local Web Server**: Run `npm run dev` and navigate through all dashboard routes to ensure clean compilation.
2. **Review Design System Tokens**: Inspect `src/app/globals.css` and verify theme consistency across data tables, badges, and cards.
3. **Refine Subscription Action Modals**: Implement or refine modal dialogs for pausing, resuming, and changing subscription plans.
4. **Test Live API Integration**: Connect to local running Django API (port 8000) and verify login, customer listing, and invoice tables against real endpoints.
5. **Optimize Landing Page Animations**: Review Three.js canvas shader hero and verify smooth scrolling with responsive fallbacks on mobile devices.

---

## 10. How to Commit and Push a Feature Branch
```bash
# 1. Ensure main is up to date
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feat/frontend-invoice-checkout

# 3. Make changes and verify build
npm run build
npm run lint

# 4. Commit with Conventional Commits
git add apps/web/
git commit -m "feat(web): polish invoice receipt modal and payment confirmation"

# 5. Push to GitHub
git push -u origin feat/frontend-invoice-checkout
```

---

## 11. How to Open and Review a Pull Request
1. Push branch to GitHub and open a Pull Request targeting `main`.
2. Fill out `.github/PULL_REQUEST_TEMPLATE.md`.
3. Assign **Reshma Shaik** (`@Reshma-04sk`) as reviewer.
4. For incoming backend PRs from Reshma, verify whether any changes impact `docs/API_CONTRACT.md` or client request schemas.
