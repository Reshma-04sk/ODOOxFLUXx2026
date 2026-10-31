"use client";

import React from "react";

const PLANS = [
  {
    tier: "STARTER",
    code: "PLN-001",
    price: "₹1,700",
    cycle: "/ MONTH",
    features: [
      "Up to 50 active subscriptions",
      "Monthly billing cadence",
      "PostgreSQL constraint enforcement",
      "Basic MRR / ARR tracking",
      "REST API access",
    ],
    cta: "START FREE",
    highlight: false,
  },
  {
    tier: "ENTERPRISE",
    code: "PLN-002",
    price: "₹2,260",
    cycle: "/ MONTH",
    features: [
      "Unlimited subscriptions",
      "All billing cadences (M / A / W)",
      "Full idempotency guarantee",
      "Advanced analytics & audit logs",
      "Priority SLA & custom domain",
      "OpenAPI 3.1 integration",
    ],
    cta: "LAUNCH APP",
    highlight: true,
  },
  {
    tier: "CUSTOM",
    code: "PLN-003",
    price: "CONTACT",
    cycle: "",
    features: [
      "White-label deployment",
      "Custom billing rules engine",
      "Dedicated Neon Postgres cluster",
      "SLA with financial audit trail",
      "Custom attribute-value pricing",
    ],
    cta: "GET IN TOUCH",
    highlight: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="relative bg-[var(--bg-base)] border-t border-[var(--border-subtle)]">
      <div className="absolute inset-0 arch-grid-fine opacity-15 pointer-events-none" />

      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-8 py-10 border-b border-[var(--border-subtle)] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4" style={{ fontFamily: "var(--font-space-mono)" }}>
          <div className="w-2 h-2 border border-[var(--text-muted)]" />
          <span className="mono-label text-[var(--text-muted)]">SUBSCRIPTION PLANS</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-16 relative z-10">
        <h2
          className="text-4xl sm:text-5xl font-bold tracking-[-0.04em] text-[var(--text-heading)] leading-none mb-12"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          TRANSPARENT PRICING.<br />ZERO HIDDEN DRIFT.
        </h2>

        <div className="grid md:grid-cols-3 border border-[var(--border-subtle)]">
          {PLANS.map((plan, i) => (
            <div
              key={plan.tier}
              className={`flex flex-col p-8 ${
                i < PLANS.length - 1 ? "border-b md:border-b-0 md:border-r border-[var(--border-subtle)]" : ""
              } ${plan.highlight ? "bg-[var(--bg-elevated)]" : ""}`}
            >
              {/* Tier */}
              <div
                className="flex items-center justify-between mb-6"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                <span className={`mono-label ${plan.highlight ? "text-[var(--text-heading)]" : "text-[var(--text-muted)]"}`}>
                  {plan.tier}
                </span>
                <span className="mono-label text-[var(--border-strong)]">{plan.code}</span>
              </div>

              {/* Price */}
              <div className="mb-8 pb-6 border-b border-[var(--border-subtle)]">
                <span
                  className="text-4xl font-bold tracking-[-0.04em] text-[var(--text-heading)]"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {plan.price}
                </span>
                {plan.cycle && (
                  <span
                    className="text-xs text-[var(--text-muted)] ml-1"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  >
                    {plan.cycle}
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, fi) => (
                  <li
                    key={fi}
                    className="flex items-start gap-3 text-[11px] text-[var(--text-secondary)]"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    <span
                      className="shrink-0 text-[var(--text-muted)] text-[9px] mt-0.5"
                      style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                      +
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className={`w-full py-3 text-[10px] tracking-[0.15em] uppercase font-bold transition-all duration-200 ${
                  plan.highlight
                    ? "bg-[var(--text-heading)] text-[var(--bg-base)] hover:bg-[var(--text-primary)]"
                    : "border border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--text-muted)] hover:text-[var(--text-heading)]"
                }`}
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Fine print */}
        <div
          className="mt-6 text-[10px] text-[var(--border-strong)] flex items-center gap-4"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          <span>ALL PRICES IN INR. GST 18% APPLIED VIA DECIMAL ROUND_HALF_UP.</span>
          <div className="flex-1 h-px bg-[var(--border-subtle)]" />
          <span>ZERO REVENUE LEAKAGE GUARANTEED.</span>
        </div>
      </div>
    </section>
  );
}