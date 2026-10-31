# PlanLedger — Contribution & Collaboration Guidelines

Welcome to the **PlanLedger** monorepo! This document establishes the engineering rules and team workflow for:
- **Reshma Shaik** (`@Reshma-04sk`) — Team Lead | Backend & Infrastructure Owner
- **Gayathri Devi G** (`@gaayathri-devi-07`) — Frontend Lead

---

## 1. Monorepo Principles
1. **One Monorepo**: All backend (`apps/api`), frontend (`apps/web`), documentation (`docs/`), and infrastructure (`infrastructure/`) live in this single repository.
2. **Independent Productivity**: Both developers can work in parallel without blocking each other. The frontend contains a typed mock fallback layer, while the backend provides a documented API contract.
3. **No Direct Commits to `main`**: All features and fixes must go through topic branches and pull requests.

---

## 2. Branch Naming Conventions

All branches must adhere strictly to the following prefixes:

| Branch Pattern | Purpose | Example |
| :--- | :--- | :--- |
| `feat/backend-*` | Backend features | `feat/backend-subscription-engine` |
| `feat/frontend-*` | Frontend features | `feat/frontend-dashboard-analytics` |
| `feat/integration-*` | End-to-end integration | `feat/integration-billing-checkout` |
| `fix/backend-*` | Backend bug fixes | `fix/backend-tax-rounding` |
| `fix/frontend-*` | Frontend UI/UX fixes | `fix/frontend-table-pagination` |
| `docs/*` | Documentation updates | `docs/api-contract-refresh` |

---

## 3. Commit Message Conventions (Conventional Commits)

Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:
```
<type>(<scope>): <short description in imperative mood>

[optional body explaining WHY, not what]
```

### Allowed Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding or updating tests
- `chore`: Build tasks, package updates, config changes
- `ci`: Changes to CI/CD workflows

### Examples:
```bash
feat(api): implement subscription creation and renewal logic
feat(web): build modern subscription comparison table
fix(billing): prevent duplicate invoice generation with period uniqueness
docs(contract): document invoice refund endpoint schema
```

---

## 4. Subsystem Ownership

### M1 — Reshma Shaik (@Reshma-04sk)
- `apps/api/**` (Django apps, models, serializers, services, URLs)
- `infrastructure/**` (Docker, deployment scripts, seeders)
- Database schema and billing engine logic
- Deployment and environment configuration (Neon, Render)

### M2 — Gayathri Devi G (@gaayathri-devi-07)
- `apps/web/**` (Next.js 16 App Router, TypeScript, Tailwind CSS v4)
- UI/UX design system, landing page, animations, charts
- Frontend API integration and client state

### Shared Ownership
- `docs/**`
- Root `README.md`
- `docker-compose.yml`
- `.github/workflows/**`
- API contracts & integration tests

---

## 5. Pull Request & Review Process

1. **Create Branch**: Check out from latest `main`.
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/backend-customer-isolation
   ```
2. **Implement & Test**: Write code and verify locally:
   - Backend: `python manage.py test`
   - Frontend: `npm run build && npm run lint`
3. **Open PR**: Push to GitHub and open PR targeting `main`.
4. **Use PR Template**: Fill out the PR template completely.
5. **Review**: The other team member must review and approve before merging. Both developers must approve integration changes.
6. **Merge**: Use "Squash and Merge" to keep a clean linear history on `main`.
