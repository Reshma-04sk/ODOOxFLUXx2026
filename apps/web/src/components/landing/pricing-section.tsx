"use client";

import React from "react";
import { Check, ArrowRight } from "lucide-react";
import { SquareLogo } from "@/components/square-logo";
import { useAuthModal } from "@/components/auth-modal-context";

const PLANS = [
  {
    tier: "STARTER",
    code: "PLN-001",
    price: "₹1,700",
    cycle: "/ month",
    features: [
      "Up to 50 active subscriptions",
      "Monthly & annual billing cadences",
      "PostgreSQL 17 constraint enforcement",
      "Basic MRR / ARR ledger tracking",
      "REST API access & customer portal",
    ],
    cta: "Start Free Trial",
    highlight: false,
    tab: "register" as const,
  },
  {
    tier: "ENTERPRISE",
    code: "PLN-002",
    price: "₹12,260",
    cycle: "/ month",
    features: [
      "Unlimited active subscriptions",
      "All billing cadences (M / A / W)",
      "Zero-drift idempotency guarantee",
      "Full analytics suite & audit trail",
      "Priority SLA & custom webhooks",
      "OpenAPI 3.1 schema synchronization",
    ],
    cta: "Launch Enterprise",
    highlight: true,
    tab: "register" as const,
  },
  {
    tier: "SCALE",
    code: "PLN-003",
    price: "Custom",
    cycle: "",
    features: [
      "Dedicated multi-tenant database cluster",
      "Custom billing rules & surcharge engine",
      "Air-gapped deployment option",
      "SLA with double-entry audit logging",
      "Attribute-value matrix pricing",
    ],
    cta: "Contact Architecture Team",
    highlight: false,
    tab: "login" as const,
  },
];

export function PricingSection() {
  const { openAuthModal } = useAuthModal();

  return (
    <section id="pricing" className="relative py-24 bg-[var(--bg-base)] border-t border-[var(--border-subtle)]">
      <div className="absolute inset-0 arch-grid-fine opacity-15 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-bold text-[#A78BFA] uppercase tracking-wider mb-4 shadow-sm">
              <SquareLogo size={12} />
              <span>Transparent Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-heading)]">
              Predictable Pricing. Zero Drift.
            </h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-md font-medium leading-relaxed">
            All plans include idempotent automated billing, 18% GST calculation, customer portals, and double-entry reconciliations.
          </p>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.tier}
              className={`fintech-card p-8 flex flex-col justify-between relative transition-all duration-300 ${
                plan.highlight
                  ? "border-[#C4B5FD] shadow-2xl ring-1 ring-[#C4B5FD]/30"
                  : ""
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#C4B5FD] text-black text-[11px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--text-muted)] font-hash">
                    {plan.tier}
                  </span>
                  <span className="text-[10px] font-hash font-bold text-[var(--text-muted)] px-2 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
                    {plan.code}
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-[var(--border-subtle)]">
                  <span className="text-4xl font-extrabold tracking-tight text-[var(--text-heading)] font-hash">
                    {plan.price}
                  </span>
                  {plan.cycle && (
                    <span className="text-xs font-semibold text-[var(--text-muted)]">
                      {plan.cycle}
                    </span>
                  )}
                </div>

                <div className="space-y-3 mb-8">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-hash">
                    Included Capabilities
                  </div>
                  {plan.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-2.5 text-xs text-[var(--text-secondary)] font-medium">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {/* Clicking button asks login/signup via modal */}
                <button
                  onClick={() => openAuthModal(plan.tab)}
                  className={`w-full py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    plan.highlight
                      ? "btn-neon"
                      : "border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[#C4B5FD]"
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Fine print */}
        <div className="mt-12 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-hash text-[var(--text-muted)]">
          <span>ALL PRICES IN INR. GST 18% APPLIED VIA DECIMAL ROUND_HALF_UP.</span>
          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>ZERO REVENUE LEAKAGE GUARANTEED.</span>
        </div>

      </div>
    </section>
  );
}