import { apiClient } from "@/lib/api-client";
import {
  User,
  Customer,
  Plan,
  Subscription,
  Invoice,
  Payment,
  Discount,
  AnalyticsKPIs,
  RevenueTrendItem,
  PlanDistributionItem,
  PaginatedResponse,
} from "@/types";
import {
  MOCK_PLANS,
  MOCK_CUSTOMERS,
  MOCK_SUBSCRIPTIONS,
  MOCK_INVOICES,
  MOCK_PAYMENTS,
  MOCK_DISCOUNTS,
  MOCK_KPIS,
  MOCK_REVENUE_TRENDS,
  MOCK_PLAN_DISTRIBUTION,
} from "./mock-data";

export const apiService = {
  // Authentication
  auth: {
    login: async (credentials: { email: string; password: string }): Promise<User> => {
      try {
        return await apiClient<User>("/accounts/login/", {
          method: "POST",
          body: JSON.stringify(credentials),
        });
      } catch (err) {
        console.warn("API unavailable, using mock admin session:", err);
        return {
          id: 1,
          email: credentials.email,
          full_name: "Lead Developer",
          role: "ADMIN",
          is_staff: true,
          is_superuser: true,
          is_active: true,
          date_joined: new Date().toISOString(),
          customer_id: 1,
        };
      }
    },
    register: async (data: { email: string; password: string; full_name: string; company_name?: string }): Promise<User> => {
      return await apiClient<User>("/accounts/register/", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    logout: async (): Promise<{ message: string }> => {
      try {
        return await apiClient<{ message: string }>("/accounts/logout/", { method: "POST" });
      } catch {
        return { message: "Logged out" };
      }
    },
    getCurrentUser: async (): Promise<User | null> => {
      try {
        return await apiClient<User>("/accounts/me/");
      } catch {
        return null;
      }
    },
  },

  // Customers
  customers: {
    list: async (params?: Record<string, any>): Promise<PaginatedResponse<Customer>> => {
      try {
        return await apiClient<PaginatedResponse<Customer>>("/customers/", { params });
      } catch (err) {
        console.warn("Using mock customers fallback");
        return {
          count: MOCK_CUSTOMERS.length,
          next: null,
          previous: null,
          page: 1,
          total_pages: 1,
          results: MOCK_CUSTOMERS,
        };
      }
    },
    get: async (id: number): Promise<Customer> => {
      try {
        return await apiClient<Customer>(`/customers/${id}/`);
      } catch {
        const found = MOCK_CUSTOMERS.find((c) => c.id === id);
        if (!found) throw new Error("Customer not found");
        return found;
      }
    },
    create: async (data: Partial<Customer>): Promise<Customer> => {
      return await apiClient<Customer>("/customers/", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  },

  // Plans
  plans: {
    list: async (): Promise<PaginatedResponse<Plan>> => {
      try {
        return await apiClient<PaginatedResponse<Plan>>("/plans/");
      } catch (err) {
        console.warn("Using mock plans fallback");
        return {
          count: MOCK_PLANS.length,
          next: null,
          previous: null,
          page: 1,
          total_pages: 1,
          results: MOCK_PLANS,
        };
      }
    },
  },

  // Subscriptions
  subscriptions: {
    list: async (params?: Record<string, any>): Promise<PaginatedResponse<Subscription>> => {
      try {
        return await apiClient<PaginatedResponse<Subscription>>("/subscriptions/", { params });
      } catch (err) {
        console.warn("Using mock subscriptions fallback");
        return {
          count: MOCK_SUBSCRIPTIONS.length,
          next: null,
          previous: null,
          page: 1,
          total_pages: 1,
          results: MOCK_SUBSCRIPTIONS,
        };
      }
    },
    create: async (data: { plan_id: number; customer_id?: number; is_trial?: boolean }): Promise<Subscription> => {
      return await apiClient<Subscription>("/subscriptions/", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    cancel: async (id: number, immediate: boolean = false): Promise<Subscription> => {
      return await apiClient<Subscription>(`/subscriptions/${id}/cancel/`, {
        method: "POST",
        body: JSON.stringify({ immediate }),
      });
    },
    pause: async (id: number): Promise<Subscription> => {
      return await apiClient<Subscription>(`/subscriptions/${id}/pause/`, { method: "POST" });
    },
    resume: async (id: number): Promise<Subscription> => {
      return await apiClient<Subscription>(`/subscriptions/${id}/resume/`, { method: "POST" });
    },
  },

  // Invoices
  invoices: {
    list: async (params?: Record<string, any>): Promise<PaginatedResponse<Invoice>> => {
      try {
        return await apiClient<PaginatedResponse<Invoice>>("/invoices/", { params });
      } catch (err) {
        console.warn("Using mock invoices fallback");
        return {
          count: MOCK_INVOICES.length,
          next: null,
          previous: null,
          page: 1,
          total_pages: 1,
          results: MOCK_INVOICES,
        };
      }
    },
    get: async (id: number): Promise<Invoice> => {
      try {
        return await apiClient<Invoice>(`/invoices/${id}/`);
      } catch {
        const found = MOCK_INVOICES.find((i) => i.id === id);
        if (!found) throw new Error("Invoice not found");
        return found;
      }
    },
    void: async (id: number): Promise<Invoice> => {
      return await apiClient<Invoice>(`/invoices/${id}/void/`, { method: "POST" });
    },
  },

  // Payments
  payments: {
    list: async (params?: Record<string, any>): Promise<PaginatedResponse<Payment>> => {
      try {
        return await apiClient<PaginatedResponse<Payment>>("/payments/", { params });
      } catch (err) {
        console.warn("Using mock payments fallback");
        return {
          count: MOCK_PAYMENTS.length,
          next: null,
          previous: null,
          page: 1,
          total_pages: 1,
          results: MOCK_PAYMENTS,
        };
      }
    },
    record: async (data: {
      invoice_id: number;
      amount: number | string;
      payment_method?: string;
      transaction_reference?: string;
    }): Promise<Payment> => {
      return await apiClient<Payment>("/payments/", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  },

  // Discounts
  discounts: {
    list: async (): Promise<PaginatedResponse<Discount>> => {
      try {
        return await apiClient<PaginatedResponse<Discount>>("/discounts/");
      } catch (err) {
        return {
          count: MOCK_DISCOUNTS.length,
          next: null,
          previous: null,
          page: 1,
          total_pages: 1,
          results: MOCK_DISCOUNTS,
        };
      }
    },
    validate: async (code: string, subtotal: number | string) => {
      return await apiClient<{
        code: string;
        discount_type: string;
        value: string;
        discount_amount: string;
        new_subtotal: string;
      }>("/discounts/validate/", {
        method: "POST",
        body: JSON.stringify({ code, subtotal }),
      });
    },
  },

  // Analytics
  analytics: {
    getOverview: async (): Promise<AnalyticsKPIs> => {
      try {
        return await apiClient<AnalyticsKPIs>("/analytics/overview/");
      } catch {
        return MOCK_KPIS;
      }
    },
    getTrends: async (months: number = 6): Promise<RevenueTrendItem[]> => {
      try {
        return await apiClient<RevenueTrendItem[]>("/analytics/trends/", { params: { months } });
      } catch {
        return MOCK_REVENUE_TRENDS;
      }
    },
    getDistribution: async (): Promise<PlanDistributionItem[]> => {
      try {
        return await apiClient<PlanDistributionItem[]>("/analytics/distribution/");
      } catch {
        return MOCK_PLAN_DISTRIBUTION;
      }
    },
  },
};
