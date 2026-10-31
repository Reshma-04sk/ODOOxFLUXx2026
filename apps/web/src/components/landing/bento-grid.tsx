"use client";

import React, { useState } from "react";

const SQL_TABS = {
  unique: `CREATE UNIQUE INDEX uq_invoice_subscription_period
  ON invoices(subscription_id, billing_period_start)
  WHERE status NOT IN ('cancelled', 'void');

-- Result: zero duplicate invoices,
-- enforced at storage layer.`,
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
    icon: "▦",
    title: "PARTIAL UNIQUE INDEX",
    body: "uq_invoice_subscription_period prevents duplicate billing runs at the PostgreSQL storage layer — no application logic can circumvent this.",
  },
  {
    icon: "◈",
    title: "IMMUTABLE PRICE SNAPSHOT",
    body: "Line-item prices and tax rates are frozen at invoice generation time. Future price changes never retroactively alter historical invoices.",
  },
  {
    icon: "⊞",
    title: "MRR / ARR NORMALIZATION",
    body: "Monthly, annual, and weekly cadences are normalized to a single MRR contribution using CASE logic at the database layer.",
  },
  {
    icon: "◻",
    title: "STATE MACHINE CHECK",
    body: "PostgreSQL CHECK constraints enforce valid status transitions. Invalid state mutations (paid → active) fail at the database, not just the API.",
  },
  {
    icon: "⊗",
    title: "ATOMIC BILLING RUNS",
    body: "The scheduler uses Django transaction.atomic() + idempotency keys. Re-running for the same period absorbs conflicts without double-charging.",
  },
  {
    icon: "◰",
    title: "DECIMAL PRECISION",
    body: "Python Decimal with ROUND_HALF_UP quantization. Zero IEEE 754 floating-point arithmetic anywhere in the billing pipeline.",
  },
];

type TabKey = keyof typeof SQL_TABS;

export function BentoGrid() {
  const [tab, setTab] = useState<TabKey>("unique");

  return (
    <section id="bento" className="relative bg-[var(--bg-surface)] border-t border-[var(--border-subtle)]">
      <div className="absolute inset-0 arch-grid-fine opacity-15 pointer-events-none" />

      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-8 py-10 border-b border-[var(--border-subtle)] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4" style={{ fontFamily: "var(--font-space-mono)" }}>
          <div className="w-2 h-2 bg-[var(--text-muted)]" />
          <span className="mono-label text-[var(--text-muted)]">POSTGRESQL 17 CORE ARCHITECTURE</span>
        </div>
        <span className="mono-label text-[var(--border-subtle)] hidden md:block" style={{ fontFamily: "var(--font-space-mono)" }}>
          CENTERPIECE OF JUDGING
        </span>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-12 relative z-10">

        {/* Headline */}
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.04em] text-[var(--text-heading)] leading-none mb-12 max-w-2xl"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          BUILT ON DATABASE GUARANTEES, NOT FLAKY APPLICATION LOGIC
        </h2>

        {/* Feature table */}
        <div className="border border-[var(--border-subtle)] mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className={`p-6 ${
                  i % 3 !== 2 ? "lg:border-r border-[var(--border-subtle)]" : ""
                } ${
                  i < 3 ? "border-b border-[var(--border-subtle)]" : ""
                } ${
                  i === 1 || i === 4 ? "sm:border-r border-[var(--border-subtle)]" : ""
                } hover:bg-[var(--bg-elevated)] transition-colors duration-200`}
              >
                <div
                  className="text-xl text-[var(--border-strong)] mb-4"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  {f.icon}
                </div>
                <div
                  className="text-xs font-bold tracking-[0.1em] text-[var(--text-heading)] mb-2 uppercase"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {f.title}
                </div>
                <p
                  className="text-[11px] text-[var(--text-muted)] leading-relaxed"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SQL Panel */}
        <div className="border border-[var(--border-subtle)]">
          {/* Tab bar */}
          <div className="flex border-b border-[var(--border-subtle)]">
            {(["unique", "due", "case"] as TabKey[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-3 text-[10px] tracking-[0.15em] uppercase transition-all duration-200 border-r border-[var(--border-subtle)] ${
                  tab === t
                    ? "text-[var(--text-heading)] bg-[var(--bg-elevated)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {t === "unique" && "UNIQUE INDEX"}
                {t === "due"    && "DUE BILLING"}
                {t === "case"   && "MRR NORMALIZE"}
              </button>
            ))}
          </div>
          <div className="p-6 bg-[var(--bg-base)]">
            <pre
              className="text-[11px] text-[var(--text-secondary)] overflow-x-auto leading-relaxed"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {SQL_TABS[tab]}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}