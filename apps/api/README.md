# PlanLedger API — Django 6 REST Framework

Lead Owner: **Reshma Shaik** (`@Reshma-04sk`)

## Architecture
- Python 3.13 & Django 6
- Django REST Framework
- PostgreSQL 17 (psycopg 3 driver)
- Argon2 password hashing
- Gunicorn & WhiteNoise
- drf-spectacular OpenAPI 3.0 schema generation

## Quickstart
```bash
python -m venv .venv
source .venv/bin/activate  # on Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py test tests
python manage.py runserver 8000
```

## Running the Idempotent Billing Engine
```bash
# Dry run:
python manage.py run_billing --dry-run

# Live execution for today:
python manage.py run_billing
```
