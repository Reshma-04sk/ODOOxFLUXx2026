"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Layers, ShieldCheck, Terminal, Server, Database, Code2 } from "lucide-react";

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
    body: "Subscription and invoice status transitions are restricted by a PostgreSQL CHECK constraint. Invalid state transitions (e.g. paid -> active) are rejected at the DB layer, not just the API.",
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
    title: "SECURITY: ARGON2 + BOLA",
    constraint: "Argon2id password hashing, row-level filters",
    body: "Passwords hashed with Argon2id (memory-hard). All subscription/invoice queries are tenant-scoped by user FK — cross-tenant data access is structurally prevented at the ORM layer.",
    sql: "queryset = Invoice.objects.filter(\n  subscription__customer__user=request.user\n)  # BOLA protection: row-level isolation",
  },
];

const ARCH_LAYERS = [
  { icon: Code2, layer: "PRESENTATION", tech: "Next.js 16 / App Router", detail: "apps/web — SSR + Static pages, TanStack Query, Lenis + GSAP, Neon FinTech theme" },
  { icon: Terminal, layer: "API GATEWAY", tech: "same-origin /api/* rewrite", detail: "Next.js proxies /api/* to Django — zero CORS issues, unified origin" },
  { icon: Server, layer: "BUSINESS ENGINE", tech: "Django 6 + DRF", detail: "apps/api — Idempotent billing engine, state machine, OpenAPI 3.1 schema" },
  { icon: Database, layer: "DATA PERSISTENCE", tech: "PostgreSQL 17 (Neon)", detail: "apps/api — Partial unique indexes, FK chains, CHECK constraints" },
];

export function ArchitectureDeepdive() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".guarantee-row",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
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
      className="relative py-24 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)]"
    >
      <div className="absolute inset-0 arch-grid-fine opacity-15 pointer-events-none" />

      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 mb-16 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-xs font-bold text-[#A78BFA] uppercase tracking-wider mb-4 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Technical Deep Dive</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-heading)]">
            PostgreSQL 17 Database Guarantees
          </h2>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold font-hash text-[var(--text-muted)] uppercase tracking-wider mb-1">Depth of Assurance</div>
          <div className="text-sm font-extrabold text-[var(--text-heading)] font-hash">6 Inviolable DB Constraints</div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10 space-y-6">

        {/* Guarantees List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {DB_GUARANTEES.map((g, i) => (
            <div
              key={g.code}
              className="guarantee-row fintech-card p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold font-hash text-[var(--text-muted)]">
                    {String(i + 1).padStart(2, "0")} / {DB_GUARANTEES.length}
                  </span>
                  <span className="text-[10px] font-bold tracking-wider rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[#7C3AED] dark:text-[#C4B5FD] px-2 py-0.5 font-hash">
                    {g.code}
                  </span>
                </div>

                <h3 className="text-sm font-extrabold uppercase tracking-wide text-[var(--text-heading)] mb-1">
                  {g.title}
                </h3>
                <div className="text-[11px] font-hash font-bold text-[var(--text-secondary)] mb-3">
                  {g.constraint}
                </div>
                <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed mb-6">
                  {g.body}
                </p>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2 font-hash">
                  SQL Mutation Snippet
                </div>
                <pre className="rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-3 text-[11px] font-hash text-[var(--text-primary)] overflow-x-auto whitespace-pre-wrap">
                  {g.sql}
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* Architecture Layers */}
        <div className="fintech-card p-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-6 font-hash">
            <Layers className="w-4 h-4 text-[#C4B5FD]" />
            <span>Full System Topology & Execution Stack</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ARCH_LAYERS.map((l, i) => {
              const Icon = l.icon;
              return (
                <div key={i} className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold font-hash text-[var(--text-muted)]">
                      LAYER 0{i + 1}
                    </span>
                    <Icon className="w-4 h-4 text-[#7C3AED] dark:text-[#C4B5FD]" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    {l.layer}
                  </div>
                  <div className="text-sm font-extrabold text-[var(--text-heading)]">
                    {l.tech}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed mt-1">
                    {l.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}