"use client";

import React, { useState } from "react";
import { Lock, FileCheck, TrendingUp, GitBranch, Zap, Binary, Check } from "lucide-react";

const SQL_TABS = {
  unique: `CREATE UNIQUE INDEX uq_invoice_subscription_period
  ON invoices(subscription_id, billing_period_start)
  WHERE status NOT IN ('cancelled', 'void');

-- Guarantee: Zero duplicate invoices across concurrent runs,
-- enforced at the PostgreSQL storage engine level.`,
  due: `SELECT s.id, s.next_invoice_date,
       p.name as plan, c.email
FROM subscriptions s
JOIN plans p ON s.plan_id = p.id
JOIN customers c ON s.customer_id = c.id
WHERE s.status = 'active'
  AND s.next_invoice_date <= NOW()
  AND s.next_invoice_date > NOW() - INTERVAL '1 day'
ORDER BY s.next_invoice_date;`,
  case: `UPDATE subscriptions
SET mrr_contribution = CASE
  WHEN billing_cycle = 'monthly'  THEN price
  WHEN billing_cycle = 'annual'   THEN price / 12
  WHEN billing_cycle = 'weekly'   THEN price * 52 / 12
  ELSE 0
END
WHERE status = 'active';`,
};

const FEATURES = [
  {
    icon: Lock,
    title: "PARTIAL UNIQUE INDEX",
    body: "uq_invoice_subscription_period prevents duplicate billing runs at the PostgreSQL storage layer — application logic can never bypass this.",
  },
  {
    icon: FileCheck,
    title: "IMMUTABLE PRICE SNAPSHOT",
    body: "Line-item prices and tax rates are frozen at invoice generation time. Future price tier edits never retroactively alter historical invoices.",
  },
  {
    icon: TrendingUp,
    title: "MRR / ARR NORMALIZATION",
    body: "Monthly, annual, and weekly cadences are normalized to a single MRR contribution using SQL CASE logic at the database layer.",
  },
  {
    icon: GitBranch,
    title: "STATE MACHINE CONSTRAINTS",
    body: "PostgreSQL CHECK constraints enforce valid status transitions. Invalid state mutations (paid → active) fail at the database level.",
  },
  {
    icon: Zap,
    title: "ATOMIC BILLING RUNS",
    body: "The scheduler uses Django transaction.atomic() with idempotency keys. Re-running for the same period safely absorbs conflicts.",
  },
  {
    icon: Binary,
    title: "DECIMAL QUANTIZATION",
    body: "Python Decimal with ROUND_HALF_UP quantization. Zero IEEE 754 floating-point drift anywhere in the financial ledger.",
  },
];

type TabKey = keyof typeof SQL_TABS;

export function BentoGrid() {
  const [tab, setTab] = useState<TabKey>("unique");

  return (
    <section id="bento" className="relative py-24 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)]">
      <div className="absolute inset-0 arch-grid-fine opacity-15 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-xs font-bold text-[#C4B5FD] uppercase tracking-wider mb-4 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#C4B5FD]" />
              <span>Storage Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-heading)] max-w-2xl">
              Built on Database Guarantees, Not Flaky Application Code
            </h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-md font-medium leading-relaxed">
            Every business invariant is anchored in PostgreSQL 17 ACID properties. Transactions cannot double-invoice, drift, or silently corrupt state.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="fintech-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-200"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[#7C3AED] dark:text-[#C4B5FD] mb-5 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-extrabold tracking-wider text-[var(--text-heading)] uppercase mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                    {f.body}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center gap-2 text-[11px] font-hash text-emerald-500">
                  <Check className="w-3.5 h-3.5" />
                  <span>Enforced at DB Layer</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* SQL Panel */}
        <div className="fintech-card overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 px-4 pt-3 gap-2 overflow-x-auto">
            {(["unique", "due", "case"] as TabKey[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2.5 rounded-t-xl text-xs font-bold tracking-wider font-hash transition-all ${
                  tab === t
                    ? "bg-[var(--bg-surface)] text-[var(--text-heading)] border-t-2 border-[#C4B5FD] shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                {t === "unique" && "UQ_INVOICE_INDEX"}
                {t === "due"    && "DUE_BILLING_SELECT"}
                {t === "case"   && "MRR_NORMALIZATION"}
              </button>
            ))}
          </div>
          <div className="p-6 bg-[var(--bg-base)]">
            <pre className="text-xs font-hash text-[var(--text-secondary)] overflow-x-auto leading-relaxed">
              {SQL_TABS[tab]}
            </pre>
          </div>
        </div>

      </div>
    </section>
  );
}