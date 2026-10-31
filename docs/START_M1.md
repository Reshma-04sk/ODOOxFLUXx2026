# Onboarding & Execution Guide for M1 — Reshma Shaik

**Role**: Team Lead | Backend & Infrastructure Owner  
**GitHub**: [https://github.com/Reshma-04sk](https://github.com/Reshma-04sk)

---

## 1. What to Install
- **Python 3.13** (Verify: `python --version`)
- **Docker Desktop** (for PostgreSQL 17 local container; verify: `docker --version`)
- **Git** (Verify: `git --version`)
- Optional: `uv` for ultra-fast Python package installation (`pip install uv`)

---

## 2. How to Open the Monorepo
```bash
git clone <repo-url>
cd ODOOxFLUXx2026
```

---

## 3. How to Configure the Django Environment
```bash
cd apps/api
cp .env.example .env
# Edit .env if connecting to Neon PostgreSQL or leave DATABASE_URL blank to use local SQLite
```

---

## 4. How to Start PostgreSQL
```bash
# From the repository root:
docker-compose up -d db

# Verify database health:
docker-compose ps
```

---

## 5. How to Run Migrations
```bash
cd apps/api
# If using virtual environment:
python manage.py migrate
```

---

## 6. How to Create an Administrative Superuser
```bash
python manage.py createsuperuser
# Enter email: admin@brightloop.io
# Enter full name: Reshma Shaik
# Enter password (Argon2 hashed)
```
*Alternatively, run the database seeder to automatically provision the admin user and plans:*
```bash
python ../../infrastructure/scripts/seed_data.py --fast
```

---

## 7. How to Start the Backend
```bash
python manage.py runserver 0.0.0.0:8000
```
Backend will be live at `http://localhost:8000/`.

---

## 8. How to Access API Documentation
- Interactive Swagger UI: [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
- Redoc Reference: [http://localhost:8000/api/redoc/](http://localhost:8000/api/redoc/)
- Raw OpenAPI YAML: [http://localhost:8000/api/schema/](http://localhost:8000/api/schema/)

---

## 9. Which Folders M1 Owns
- `apps/api/**` (All Django apps, models, services, serializers, URLs)
- `infrastructure/**` (Dockerfiles, deployment scripts, seeders)
- `docker-compose.yml`
- Database & billing documentation (`docs/DATABASE_SCHEMA.md`, `docs/DEPLOYMENT.md`)

---

## 10. First Five Tasks in Priority Order
1. **Verify Migrations & Test Suite**: Run `python manage.py test tests` to verify all 48 unit tests pass.
2. **Execute Seed Data Generator**: Run `python ../../infrastructure/scripts/seed_data.py --fast` to populate plans, test customers, subscriptions, and invoices.
3. **Verify Billing Engine Idempotency**: Run `python manage.py run_billing --dry-run` to test automated subscription renewal evaluation.
4. **Configure Neon PostgreSQL & Render**: Connect environment variables on Render for production API deployment.
5. **Review Frontend Integration PRs**: Review API calls and contract alignment with M2 (Gayathri Devi G).

---

## 11. How to Commit and Push a Feature Branch
```bash
# 1. Ensure main is up to date
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feat/backend-billing-reconciliation

# 3. Make changes and verify tests pass
python manage.py test tests

# 4. Commit with Conventional Commits
git add apps/api/
git commit -m "feat(billing): enhance reconciliation audit logs"

# 5. Push to GitHub
git push -u origin feat/backend-billing-reconciliation
```

---

## 12. How to Open and Review a Pull Request
1. Navigate to GitHub repository and click **Compare & pull request**.
2. Select base: `main` &lt;- compare: `feat/backend-billing-reconciliation`.
3. Fill out `.github/PULL_REQUEST_TEMPLATE.md`.
4. Assign **Gayathri Devi G** (`@gaayathri-devi-07`) as reviewer.
5. For incoming frontend PRs from Gayathri, inspect `apps/web/` changes, check CI checks, and approve when ready.
