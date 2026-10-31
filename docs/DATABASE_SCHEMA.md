# PlanLedger Database Schema (PostgreSQL 17)

All tables inherit `TimeStampedModel` (`created_at`, `updated_at`). All monetary fields use `NUMERIC(12, 2)`.

---

## 1. Entity Relationship Overview

```
 [User] (accounts_user)
    | 1:1
    v
 [Customer] (customers_customer)
    |
    +----< [Subscription] (subscriptions_subscription) >----+ [Plan] (plans_plan)
    |             |                                         |
    |             +----< [Invoice] (invoices_invoice) >-----+
    |                        |            |
    |                        |            +----< [InvoiceLineItem]
    |                        |
    +----< [Payment] (payments_payment)   +----< [DiscountRedemption] >----+ [Discount]
```

---

## 2. Table Specifications

### `accounts_user`
- `id` (BIGSERIAL PRIMARY KEY)
- `email` (VARCHAR(255) UNIQUE NOT NULL) — Case-insensitive normalized
- `full_name` (VARCHAR(255))
- `password` (VARCHAR(128)) — Argon2 password hash
- `role` (VARCHAR(20)) — `ADMIN`, `STAFF`, `CUSTOMER`
- `is_active` (BOOLEAN DEFAULT TRUE)
- `is_staff` (BOOLEAN DEFAULT FALSE)
- `date_joined` (TIMESTAMPTZ)
- **Indexes**: `[email, role]`

### `customers_customer`
- `id` (BIGSERIAL PRIMARY KEY)
- `user_id` (BIGINT UNIQUE NULL, FK -> `accounts_user.id`)
- `company_name` (VARCHAR(255) NOT NULL)
- `email` (VARCHAR(255) NOT NULL)
- `phone` (VARCHAR(30))
- `billing_address` (TEXT)
- `city` (VARCHAR(100))
- `state` (VARCHAR(100))
- `postal_code` (VARCHAR(20))
- `country` (VARCHAR(100) DEFAULT 'India')
- `tax_id` (VARCHAR(50)) — GSTIN for India
- `currency` (VARCHAR(10) DEFAULT 'INR')
- `status` (VARCHAR(20)) — `active`, `suspended`, `churned`
- **Indexes**: `[email, status]`, `[company_name, status]`

### `plans_plan`
- `id` (BIGSERIAL PRIMARY KEY)
- `name` (VARCHAR(100) NOT NULL)
- `code` (VARCHAR(100) UNIQUE NOT NULL)
- `tier` (VARCHAR(20)) — `starter`, `growth`, `enterprise`
- `billing_frequency` (VARCHAR(20)) — `monthly`, `yearly`
- `price` (NUMERIC(12,2) NOT NULL)
- `currency` (VARCHAR(10) DEFAULT 'INR')
- `trial_period_days` (INTEGER DEFAULT 14)
- `features` (JSONB / JSON DEFAULT '[]')
- `is_active` (BOOLEAN DEFAULT TRUE)
- `display_order` (INTEGER DEFAULT 0)
- `interval_count` (INTEGER DEFAULT 1)
- `min_qty` (INTEGER DEFAULT 1)
- `start_date` (DATE NULL)
- `end_date` (DATE NULL)
- `auto_close` (BOOLEAN DEFAULT FALSE)
- `closable` (BOOLEAN DEFAULT TRUE)
- `pausable` (BOOLEAN DEFAULT TRUE)
- `renewable` (BOOLEAN DEFAULT TRUE)
- **Indexes**: `[tier, billing_frequency, is_active]`

### `subscriptions_subscription`
- `id` (BIGSERIAL PRIMARY KEY)
- `customer_id` (BIGINT NOT NULL, FK -> `customers_customer.id`)
- `plan_id` (BIGINT NOT NULL, FK -> `plans_plan.id`)
- `payment_term_id` (BIGINT NULL, FK -> `catalog_paymentterm.id`)
- `status` (VARCHAR(20)) — `trialing`, `active`, `past_due`, `canceled`, `paused`
- `start_date` (DATE NOT NULL)
- `current_period_start` (DATE NOT NULL)
- `current_period_end` (DATE NOT NULL)
- `trial_end` (DATE NULL)
- `cancel_at_period_end` (BOOLEAN DEFAULT FALSE)
- `canceled_at` (TIMESTAMPTZ NULL)
- `paused_at` (TIMESTAMPTZ NULL)
- **Indexes**: `[customer_id, status]`, `[status, current_period_end]`, `[current_period_end]`

### `subscriptions_subscriptionline`
- `id` (BIGSERIAL PRIMARY KEY)
- `subscription_id` (BIGINT NOT NULL, FK -> `subscriptions_subscription.id`)
- `product_id` (BIGINT NOT NULL, FK -> `catalog_product.id`)
- `variant_id` (BIGINT NULL, FK -> `catalog_productvariant.id`)
- `quantity` (NUMERIC(10,2) DEFAULT 1.00)
- `unit_price` (NUMERIC(12,2) NOT NULL) — Snapshot price with variant extra_price
- M2M `taxes` (FK -> `catalog_tax.id`)

### `subscriptions_subscriptionevent`
- `id` (BIGSERIAL PRIMARY KEY)
- `subscription_id` (BIGINT NOT NULL, FK -> `subscriptions_subscription.id`)
- `from_status` (VARCHAR(20))
- `to_status` (VARCHAR(20))
- `actor_id` (BIGINT NULL, FK -> `accounts_user.id`)
- `reason` (VARCHAR(255))
- `created_at` (TIMESTAMPTZ)

### `invoices_invoice`
- `id` (BIGSERIAL PRIMARY KEY)
- `invoice_number` (VARCHAR(64) UNIQUE NOT NULL) — Format: `INV-YYYY-XXXXXX`
- `customer_id` (BIGINT NOT NULL, FK -> `customers_customer.id`)
- `subscription_id` (BIGINT NULL, FK -> `subscriptions_subscription.id`)
- `status` (VARCHAR(20)) — `draft`, `open`, `paid`, `void`, `uncollectible`
- `issue_date` (DATE NOT NULL)
- `due_date` (DATE NOT NULL)
- `period_start` (DATE NULL)
- `period_end` (DATE NULL)
- `subtotal` (NUMERIC(12,2) DEFAULT 0.00)
- `discount_amount` (NUMERIC(12,2) DEFAULT 0.00)
- `tax_amount` (NUMERIC(12,2) DEFAULT 0.00) — Sum of line-level taxes
- `total_amount` (NUMERIC(12,2) DEFAULT 0.00)
- `amount_paid` (NUMERIC(12,2) DEFAULT 0.00)
- `balance_due` (NUMERIC(12,2) DEFAULT 0.00)
- `currency` (VARCHAR(10) DEFAULT 'INR')
- **Billing Idempotency Constraint**:
  `UNIQUE(subscription_id, period_start, period_end) WHERE subscription_id IS NOT NULL`
- **Indexes**: `[customer_id, status]`, `[status, due_date]`, `[issue_date]`

### `invoices_invoicelineitem`
- `id` (BIGSERIAL PRIMARY KEY)
- `invoice_id` (BIGINT NOT NULL, FK -> `invoices_invoice.id`)
- `product_id` (BIGINT NULL, FK -> `catalog_product.id`)
- `variant_id` (BIGINT NULL, FK -> `catalog_productvariant.id`)
- `description` (VARCHAR(255))
- `quantity` (INTEGER DEFAULT 1)
- `unit_price` (NUMERIC(12,2))
- `tax_amount` (NUMERIC(12,2) DEFAULT 0.00)
- `total_price` (NUMERIC(12,2))

### `invoices_invoicelinetax`
- `id` (BIGSERIAL PRIMARY KEY)
- `line_item_id` (BIGINT NOT NULL, FK -> `invoices_invoicelineitem.id`)
- `tax_id` (BIGINT NULL, FK -> `catalog_tax.id`)
- `name` (VARCHAR(100)) — Snapshot tax name
- `rate` (NUMERIC(6,4)) — Snapshot rate
- `amount` (NUMERIC(12,2)) — Calculated with ROUND_HALF_UP

### `catalog_product`, `catalog_attribute`, `catalog_attributevalue`, `catalog_productvariant`
- Product: `name`, `type` (`service`, `consu`, `product`), `sales_price`, `cost_price`, `notes`, `is_active`
- Attribute: `name` (e.g. `Brand`)
- AttributeValue: `attribute_id`, `name` (e.g. `Odoo`), `extra_price` (e.g. `+560.00`)
- ProductVariant: `product_id`, `sku`, M2M `attribute_values` (effective_price = sales_price + extra_price)

### `catalog_tax` & `catalog_paymentterm`
- Tax: `name`, `rate` (e.g. `0.1800`), `kind` (`percent`, `fixed`), `is_active`
- PaymentTerm: `name` (e.g. `Net 30`), `due_days` (INTEGER)

### `catalog_quotationtemplate` & `catalog_quotation`
- QuotationTemplate: `name`, `plan_id`, `validity_days`, `payment_term_id`
- Quotation: `quotation_number` (`QUO-YYYY-XXXXXX`), `customer_id`, `template_id`, `plan_id`, `payment_term_id`, `status`, `validity_date`, `subtotal`, `tax_amount`, `total_amount`, `subscription_id`
- QuotationLine: `quotation_id`, `product_id`, `variant_id`, `quantity`, `unit_price`, `subtotal`, `tax_amount`, `total_price`

### `payments_payment`
- `id` (BIGSERIAL PRIMARY KEY)
- `payment_number` (VARCHAR(64) UNIQUE NOT NULL) — Format: `PAY-YYYY-XXXXXX`
- `invoice_id` (BIGINT NOT NULL, FK -> `invoices_invoice.id`)
- `customer_id` (BIGINT NOT NULL, FK -> `customers_customer.id`)
- `amount` (NUMERIC(12,2) NOT NULL)
- `currency` (VARCHAR(10) DEFAULT 'INR')
- `payment_method` (VARCHAR(30)) — `upi`, `card`, `netbanking`, `bank_transfer`
- `status` (VARCHAR(20)) — `pending`, `succeeded`, `failed`, `refunded`
- `transaction_reference` (VARCHAR(100)) — Bank UTR
- `processed_at` (TIMESTAMPTZ NOT NULL)
- **Indexes**: `[customer_id, status]`, `[invoice_id, status]`, `[processed_at]`

### `discounts_discount` & `discounts_discountredemption`
- `code` (VARCHAR(50) UNIQUE NOT NULL)
- `discount_type` (VARCHAR(20)) — `percentage`, `fixed_amount`
- `value` (NUMERIC(12,2))
- `min_subtotal` (NUMERIC(12,2) DEFAULT 0.00)
- `max_redemptions` (INTEGER NULL)
- `times_redeemed` (INTEGER DEFAULT 0)
- `valid_from` (TIMESTAMPTZ NOT NULL)
- `valid_until` (TIMESTAMPTZ NOT NULL)
- **Constraint on redemption**: `UNIQUE(discount_id, customer_id, invoice_id)`

