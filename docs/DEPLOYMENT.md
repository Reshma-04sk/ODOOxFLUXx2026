# PlanLedger Production Deployment Guide

## 1. Cloud Architecture Overview

| Component | Target Platform | Free-Tier Practicality | Configuration File |
| :--- | :--- | :--- | :--- |
| **Frontend** | Vercel | Free Tier | `infrastructure/deployment/vercel.json` |
| **Backend API** | Render | Free Web Service | `infrastructure/deployment/render.yaml` |
| **Database** | Neon PostgreSQL 17 | Serverless Free Tier | Managed connection pooling |
| **Scheduled Billing** | GitHub Actions Cron | Free 2,000 mins/mo | `.github/workflows/billing_cron.yml` |
| **Email Relay** | Brevo SMTP | Free 300 emails/day | `apps/api/config/settings.py` |

---

## 2. Neon PostgreSQL 17 Setup
1. Create a project at [https://console.neon.tech](https://console.neon.tech).
2. Choose PostgreSQL 17 in the nearest region (e.g. `ap-southeast-1` or `eu-central-1`).
3. Copy the pooled connection string:
   ```
   postgresql://<user>:<password>@<endpoint>-pooler.<region>.neon.tech/planledger?sslmode=require
   ```

---

## 3. Render Deployment (`apps/api`)
1. Create a new Web Service on Render linked to this repository.
2. Select Root Directory: `apps/api`.
3. Set Build Command:
   ```bash
   pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
   ```
4. Set Start Command:
   ```bash
   gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --timeout 60
   ```
5. Add Environment Variables:
   - `DATABASE_URL`: Your Neon PostgreSQL pooled connection string.
   - `SECRET_KEY`: Secure generated secret.
   - `DEBUG`: `False`.
   - `ALLOWED_HOSTS`: `.onrender.com,localhost`.
   - `CORS_ALLOWED_ORIGINS`: `https://planledger.vercel.app`.
   - `CSRF_TRUSTED_ORIGINS`: `https://planledger.vercel.app,https://*.onrender.com`.
   - `EMAIL_BACKEND_TYPE`: `smtp`.
   - `BREVO_SMTP_LOGIN`: Your Brevo relay login.
   - `BREVO_SMTP_PASSWORD`: Your Brevo SMTP master key.

---

## 4. Vercel Deployment (`apps/web`)
1. Import repository on [https://vercel.com](https://vercel.com).
2. Set Root Directory: `apps/web`.
3. Framework Preset: `Next.js`.
4. Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g. `https://planledger-api.onrender.com`).
5. Deploy! Vercel automatically respects `next.config.ts` and `vercel.json` rewrites.
