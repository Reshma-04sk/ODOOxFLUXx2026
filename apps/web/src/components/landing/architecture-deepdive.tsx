"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DB_GUARANTEES = [
  {
    code: "PG-01",
    title: "PARTIAL UNIQUE INDEX",
    constraint: "uq_invoice_subscription_period",
    body: "Prevents duplicate invoice generation for the same subscription in the same billing period. Enforced at the PostgreSQL 17 storage layer — application logic cannot override this.",
    sql: "CREATE UNIQUE INDEX uq_invoice_subscription_period\n  ON invoices(subscription_id, billing_period_start)\n  WHERE status NOT IN ('cancelled', 'void');",
  },
  {
    code: "PG-02",
    title: "DECIMAL PRECISION GUARANTEE",
    constraint: "ROUND_HALF_UP via Python Decimal",
    body: "All monetary values use Python's decimal.Decimal with ROUND_HALF_UP quantization. No IEEE 754 floating-point arithmetic is used anywhere in the billing pipeline.",
    sql: "tax = Decimal(str(taxable_subtotal * tax_rate))\n  .quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)",
  },
  {
    code: "PG-03",
    title: "FOREIGN KEY CHAIN INTEGRITY",
    constraint: "ON DELETE PROTECT / RESTRICT",
    body: "Subscriptions cannot be deleted while active invoices exist. Invoice lines reference immutable price snapshots, not the live product table. Orphan records are structurally impossible.",
    sql: "FOREIGN KEY (subscription_id)\n  REFERENCES subscriptions(id)\n  ON DELETE RESTRICT\n  DEFERRABLE INITIALLY DEFERRED;",
  },
  {
    code: "PG-04",
    title: "STATE MACHINE ENFORCEMENT",
    constraint: "CHECK constraint on status column",
    body: "Subscription and invoice status transitions are restricted by a PostgreSQL CHECK constraint. Invalid state transitions (e.g. paid → active) are rejected at the DB layer, not just the API.",
    sql: "ALTER TABLE subscriptions\n  ADD CONSTRAINT valid_status\n  CHECK (status IN ('trial','active','paused',\n    'cancelled','expired'));",
  },
  {
    code: "PG-05",
    title: "IDEMPOTENT BILLING SCHEDULER",
    constraint: "Atomicity via Django transaction.atomic()",
    body: "The billing scheduler uses idempotency keys. Re-running the scheduler for the same period is completely safe — the unique index absorbs the conflict and the transaction rolls back cleanly.",
    sql: "with transaction.atomic():\n  Invoice.objects.create(\n    idempotency_key=f'{sub.id}:{period}'\n  )  # ON CONFLICT: no-op, no exception",
  },
  {
    code: "PG-06",
    title: "SECURITY — ARGON2 + BOLA",
    constraint: "Argon2id password hashing, row-level filters",
    body: "Passwords hashed with Argon2id (memory-hard). All subscription/invoice queries are tenant-scoped by user FK — cross-tenant data access is structurally prevented at the ORM layer.",
    sql: "queryset = Invoice.objects.filter(\n  subscription__customer__user=request.user\n)  # BOLA protection: row-level isolation",
  },
];

const ARCH_LAYERS = [
  { layer: "PRESENTATION", tech: "Next.js 16 / App Router", detail: "apps/web — SSR + Static pages, TanStack Query, Lenis + GSAP" },
  { layer: "API GATEWAY",  tech: "same-origin /api/* rewrite", detail: "Next.js proxies /api/* to Django — no CORS, single domain" },
  { layer: "BUSINESS",     tech: "Django 6 + DRF", detail: "apps/api — Billing engine, state machine, OpenAPI 3.1 schema" },
  { layer: "DATA",         tech: "PostgreSQL 17 (Neon)", detail: "apps/api — Partial indexes, FK chains, CHECK constraints" },
];

export function ArchitectureDeepdive() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".guarantee-row",
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.07,
          duration: 0.55,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
          },
        }
      );

      gsap.fromTo(
        ".arch-layer",
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".arch-layers-container",
            start: "top 80%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="architecture"
      className="relative bg-[#0B1826] border-t border-[#253745]"
    >
      <div className="absolute inset-0 arch-grid-fine opacity-15 pointer-events-none" />

      {/* ── Header ── */}
      <div className="max-w-[1400px] mx-auto px-8 py-10 border-b border-[#253745] flex items-start md:items-center justify-between gap-4 relative z-10 flex-wrap">
        <div>
          <div className="flex items-center gap-4 mb-2" style={{ fontFamily: "var(--font-space-mono)" }}>
            <div className="w-2 h-2 border border-[#5A7896] rotate-45" />
            <span className="mono-label text-[#5A7896]">TECHNICAL ARCHITECTURE</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.04em] text-[#ADC2D5] leading-none"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            DATABASE GUARANTEES
          </h2>
        </div>
        <div className="text-right hidden md:block" style={{ fontFamily: "var(--font-space-mono)" }}>
          <div className="mono-label text-[#5A7896] mb-1">IMPLEMENTATION DEPTH</div>
          <div className="text-xs text-[#ADC2D5]">6 CONSTRAINTS / POSTGRESQL 17</div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 relative z-10">

        {/* ── DB Guarantee List ── */}
        <div className="divide-y divide-[#253745] border-b border-[#253745] mb-0">
          {DB_GUARANTEES.map((g, i) => (
            <div
              key={g.code}
              className="guarantee-row opacity-0 grid grid-cols-1 lg:grid-cols-12 py-8 gap-6 lg:gap-0 group"
            >
              {/* Code + Index */}
              <div className="lg:col-span-2 flex items-start gap-4 lg:gap-0 lg:flex-col justify-between lg:justify-start lg:pr-6">
                <span
                  className="text-xs font-bold text-[#3A5468] tabular-nums"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  {String(i + 1).padStart(2, "0")} / {DB_GUARANTEES.length}
                </span>
                <span
                  className="text-[10px] font-bold tracking-[0.15em] text-[#5A7896] border border-[#253745] px-2 py-0.5 lg:mt-2"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  {g.code}
                </span>
              </div>

              {/* Title + body */}
              <div className="lg:col-span-4 lg:border-l lg:border-[#253745] lg:pl-6 pr-0 lg:pr-6">
                <div
                  className="text-sm font-bold tracking-[0.08em] text-[#ADC2D5] mb-1"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {g.title}
                </div>
                <div
                  className="mono-label text-[#3A5468] mb-3"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  {g.constraint}
                </div>
                <p
                  className="text-[#88A7C1] text-xs leading-relaxed"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {g.body}
                </p>
              </div>

              {/* SQL */}
              <div className="lg:col-span-6 lg:border-l lg:border-[#253745] lg:pl-6">
                <div
                  className="mono-label text-[#3A5468] mb-3"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  SQL / PYTHON REFERENCE
                </div>
                <pre
                  className="bg-[#06141B] border border-[#253745] p-4 text-[11px] text-[#88A7C1] overflow-x-auto group-hover:border-[#3A5468] transition-colors duration-300"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  {g.sql}
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* ── Architecture Layers ── */}
        <div className="arch-layers-container py-12 border-b border-[#253745]">
          <div
            className="mono-label text-[#5A7896] mb-8"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            SYSTEM LAYER ARCHITECTURE
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#253745] border border-[#253745]">
            {ARCH_LAYERS.map((l, i) => (
              <div key={i} className="arch-layer opacity-0 p-6 flex flex-col gap-3">
                <span
                  className="mono-label text-[#5A7896]"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  L{i + 1} — {l.layer}
                </span>
                <span
                  className="text-sm font-bold text-[#ADC2D5]"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {l.tech}
                </span>
                <p
                  className="text-[11px] text-[#5A7896] leading-relaxed"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  {l.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}