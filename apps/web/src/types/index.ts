export interface User {
  id: number;
  email: string;
  full_name: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  date_joined: string;
  customer_id: number | null;
}

export interface Customer {
  id: number;
  company_name: string;
  email: string;
  phone: string;
  billing_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  tax_id: string;
  currency: string;
  status: "active" | "suspended" | "churned";
  active_subscriptions_count?: number;
  total_invoiced?: string;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: number;
  name: string;
  code: string;
  description: string;
  tier: "starter" | "growth" | "enterprise";
  billing_frequency: "monthly" | "yearly";
  price: string;
  price_formatted: string;
  currency: string;
  trial_period_days: number;
  features: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: number;
  customer: number;
  customer_company: string;
  customer_email: string;
  plan: Plan;
  status: "trialing" | "active" | "past_due" | "canceled" | "paused";
  start_date: string;
  current_period_start: string;
  current_period_end: string;
  trial_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  paused_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceLineItem {
  id: number;
  description: string;
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  customer: number;
  customer_name: string;
  customer_email: string;
  subscription: number | null;
  plan_name: string | null;
  status: "draft" | "open" | "paid" | "void" | "uncollectible";
  issue_date: string;
  due_date: string;
  period_start: string | null;
  period_end: string | null;
  subtotal: string;
  discount_amount: string;
  tax_amount: string;
  total_amount: string;
  amount_paid: string;
  balance_due: string;
  currency: string;
  notes: string;
  line_items?: InvoiceLineItem[];
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  payment_number: string;
  invoice: number;
  invoice_number: string;
  customer: number;
  customer_name: string;
  amount: string;
  currency: string;
  payment_method: "upi" | "card" | "netbanking" | "bank_transfer";
  status: "pending" | "succeeded" | "failed" | "refunded";
  transaction_reference: string;
  processed_at: string;
  created_at: string;
  updated_at: string;
}

export interface Discount {
  id: number;
  code: string;
  description: string;
  discount_type: "percentage" | "fixed_amount";
  value: string;
  min_subtotal: string;
  max_redemptions: number | null;
  times_redeemed: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  is_valid_now?: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsKPIs {
  mrr: string;
  arr: string;
  active_subscriptions: number;
  trialing_subscriptions: number;
  canceled_subscriptions: number;
  total_subscriptions: number;
  churn_rate: number;
  total_revenue: string;
  total_outstanding: string;
  arpu: string;
  currency: string;
}

export interface RevenueTrendItem {
  month: string;
  invoiced: number;
  collected: number;
}

export interface PlanDistributionItem {
  plan_name: string;
  tier: string;
  subscribers: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  page: number;
  total_pages: number;
  results: T[];
}
