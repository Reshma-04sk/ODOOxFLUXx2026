# PlanLedger Development Setup Guide

## 1. Prerequisites
- Python 3.13
- Node.js 22 LTS or Node.js 24
- Docker & Docker Compose (optional, for local PostgreSQL 17)

## 2. Setting Up Backend (`apps/api`)
```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate  # on Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver 8000
```

## 3. Setting Up Frontend (`apps/web`)
```bash
cd apps/web
npm install
npm run dev
# Open http://localhost:3000
```

## 4. Seeding Demo Data
```bash
python infrastructure/scripts/seed_data.py --fast
# Seeds 6 plans, 3 coupons, 100 subscriptions, and 300 invoices with payments!
```
