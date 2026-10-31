# PlanLedger REST API Contract (v1)

**Base URL**: `/api/v1`  
**Authentication**: Session-based with double-submit CSRF cookie (`X-CSRFToken` header).  
**Interactive Docs**: [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/) (Swagger UI) / [http://localhost:8000/api/redoc/](http://localhost:8000/api/redoc/)

---

## 1. Authentication (`/api/v1/accounts/`)

| Method | Endpoint | Description | Auth Required | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/csrf/` | Get CSRF token | None | None |
| `POST` | `/register/` | Register user & provision Customer | None | `{"email", "password", "full_name", "company_name"}` |
| `POST` | `/login/` | Sign in & create session | None | `{"email", "password"}` |
| `POST` | `/logout/` | Sign out & flush session | Yes | None |
| `GET` | `/me/` | Current user & tenant profile | Yes | None |

---

## 2. Customers (`/api/v1/customers/`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | List customers (isolated to tenant) | Yes |
| `POST` | `/` | Create customer profile | Staff / Admin |
| `GET` | `/{id}/` | Get customer profile (404 on cross-tenant) | Yes |
| `PATCH` | `/{id}/` | Update customer billing info | Yes |

---

## 3. Plans (`/api/v1/plans/`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | List active plans | None |
| `GET` | `/{id}/` | Plan details (with lifecycle rules & flags) | None |
| `POST` | `/` | Create new tier | Staff / Admin |

---

## 4. Catalog & Quotations (`/api/v1/catalog/`)
*Access Control: Admin writes only; Staff read-only for catalog entities.*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/products/` | List products with variant trees & taxes | Staff / Admin |
| `POST` | `/products/` | Create product (sales_price, cost_price, notes) | Admin |
| `GET/POST`| `/taxes/` | Manage taxes (percentage GST, fixed cess) | Admin write / Staff read |
| `GET/POST`| `/payment-terms/` | Manage payment terms (due_days) | Admin write / Staff read |
| `GET/POST`| `/attributes/` | Variant attributes (Brand, Storage, Seats) | Admin write / Staff read |
| `GET/POST`| `/attribute-values/`| Attribute values with extra_price surcharges | Admin write / Staff read |
| `GET/POST`| `/templates/` | Quotation templates with plan & lines | Admin write / Staff read |
| `GET` | `/quotations/` | List quotations (tenant isolated) | Yes |
| `POST` | `/quotations/create_from_template/` | Instantiate quotation from template | Yes |
| `POST` | `/quotations/{id}/confirm_subscription/` | Provision active Subscription from quotation | Yes |

---


## 4. Subscriptions (`/api/v1/subscriptions/`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | List subscriptions (tenant-isolated) | Yes |
| `POST` | `/` | Create subscription (`plan_id`, `is_trial`) | Yes |
| `GET` | `/{id}/` | Get subscription details | Yes |
| `POST` | `/{id}/cancel/` | Cancel subscription (`immediate: boolean`) | Yes |
| `POST` | `/{id}/pause/` | Pause active subscription | Yes |
| `POST` | `/{id}/resume/` | Resume paused subscription | Yes |
| `POST` | `/{id}/change_plan/` | Upgrade/downgrade (`new_plan_id`) | Yes |

---

## 5. Invoices (`/api/v1/invoices/`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | List invoices (tenant-isolated) | Yes |
| `POST` | `/` | Generate manual invoice | Yes |
| `GET` | `/{id}/` | Get invoice detail with line items | Yes |
| `POST` | `/{id}/void/` | Void an open invoice | Yes |
| `GET` | `/{id}/receipt/` | Tax Invoice receipt (supports `?export=html`) | Yes |

---

## 6. Payments (`/api/v1/payments/`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | List payment transactions | Yes |
| `POST` | `/` | Record payment (`invoice_id`, `amount`, `payment_method`) | Yes |
| `POST` | `/{id}/refund/` | Process refund (`refund_amount`, `reason`) | Staff / Admin |

---

## 7. Discounts & Coupons (`/api/v1/discounts/`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | List active coupon codes | Yes |
| `POST` | `/validate/` | Validate coupon (`code`, `subtotal`) | Yes |

---

## 8. Billing Engine (`/api/v1/billing/`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/records/` | History of billing execution runs | Staff / Admin |
| `POST` | `/trigger/` | Trigger manual billing (`target_date`, `dry_run`) | Staff / Admin |

---

## 9. Analytics (`/api/v1/analytics/`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/overview/` | MRR, ARR, active subscribers, churn rate | Yes |
| `GET` | `/trends/` | Monthly invoiced vs collected revenue | Yes |
| `GET` | `/distribution/` | Subscriber distribution by plan tier | Yes |

---

## 10. System & Health Check (`/api/health/`, `/healthz`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health/` | Service health, database connectivity, and latency check | None |
| `GET` | `/healthz` | Lightweight liveness probe alias | None |

