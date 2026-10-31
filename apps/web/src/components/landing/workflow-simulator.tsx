"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, CheckCircle2, ShieldCheck, Database, Workflow } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type StepId = "quote" | "subscription" | "invoice" | "payment";

interface Step {
  id: StepId;
  index: string;
  label: string;
  tag: string;
  description: string;
  dbOp: string;
}

const STEPS: Step[] = [
  {
    id: "quote",
    index: "01",
    label: "QUOTATION",
    tag: "DRAFT STATE",
    description:
      "Staff confirms product variant attributes (brand, tier). Price computed from attribute-value surcharges. Locked as immutable snapshot on confirmation.",
    dbOp: "INSERT INTO quotes (status) VALUES ('draft') RETURNING id;",
  },
  {
    id: "subscription",
    index: "02",
    label: "SUBSCRIPTION",
    tag: "ACTIVE STATE",
    description:
      "State machine transitions quote to subscription. Billing cadence set (monthly/annual/weekly). Next invoice date calculated deterministically from start_date.",
    dbOp: "UPDATE subscriptions SET status='active', next_invoice_date=start_date+interval;",
  },
  {
    id: "invoice",
    index: "03",
    label: "INVOICE GENERATION",
    tag: "CONFIRMED STATE",
    description:
      "Atomic billing run protected by uq_invoice_subscription_period partial unique index. Zero floating-point drift via Python Decimal ROUND_HALF_UP. Tax snapshot frozen.",
    dbOp: "INSERT INTO invoices (idempotency_key) VALUES ($1) ON CONFLICT DO NOTHING;",
  },
  {
    id: "payment",
    index: "04",
    label: "PAYMENT & SETTLEMENT",
    tag: "PAID STATE",
    description:
      "Payment reconciled against invoice. Balance cleared to zero. Subscription auto-renews with new billing cycle start. Full audit trail preserved.",
    dbOp: "UPDATE invoices SET status='paid', paid_at=NOW() WHERE id=$1;",
  },
];

const FMT_INR = (v: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v);

const BASE = 1700;
const SURCHARGE = 560;
const TAX_RATE = 0.18;
const DISC_PCT = 0.15;

export function WorkflowSimulator() {
  const sectionRef   = useRef<HTMLElement>(null);
  const clipPanelRef = useRef<HTMLDivElement>(null);
  const [active, setActive]     = useState<StepId>("quote");
  const [payDone, setPayDone]   = useState(false);
  const [discount, setDiscount] = useState(false);

  const taxable  = discount ? (BASE + SURCHARGE) * (1 - DISC_PCT) : BASE + SURCHARGE;
  const tax      = parseFloat((taxable * TAX_RATE).toFixed(2));
  const total    = taxable + tax;

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (clipPanelRef.current) {
        gsap.fromTo(
          clipPanelRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const step = STEPS.find((s) => s.id === active)!;

  return (
    <section
      ref={sectionRef}
      id="simulator"
      className="relative py-24 arch-grid-bg border-b border-[var(--border-subtle)]"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-bold text-[#7C3AED] dark:text-[#A78BFA] uppercase tracking-wider mb-4 shadow-sm">
              <Workflow className="w-3.5 h-3.5" />
              <span>Interactive Pipeline</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-heading)]">
              Double-Entry Lifecycle Engine
            </h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-md font-medium leading-relaxed">
            Step through each phase of PlanLedger&apos;s deterministic billing machine. Experience zero-drift calculation, immutable snapshots, and ACID idempotency.
          </p>
        </div>

        {/* Interactive Workspace */}
        <div ref={clipPanelRef} className="fintech-card p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Steps Navigation */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1 px-1">
                Lifecycle Stages
              </div>
              {STEPS.map((s) => {
                const isSelected = active === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActive(s.id);
                      setPayDone(false);
                    }}
                    className={`text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? "bg-[var(--bg-elevated)] border-[#C4B5FD] shadow-md ring-1 ring-[#C4B5FD]/30"
                        : "bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
                    }`}
                  >
                    <div>
                      <div className="text-[11px] font-bold font-hash text-[var(--text-muted)] mb-1">
                        STAGE {s.index} &middot; {s.tag}
                      </div>
                      <div className="text-sm font-extrabold tracking-tight text-[var(--text-heading)]">
                        {s.label}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C4B5FD] shadow-[0_0_8px_#C4B5FD]" />
                    )}
                  </button>
                );
              })}

              <button
                onClick={() => {
                  const order: StepId[] = ["quote", "subscription", "invoice", "payment"];
                  const next = (order.indexOf(active) + 1) % order.length;
                  setActive(order[next]);
                  setPayDone(false);
                }}
                className="mt-2 w-full py-3 rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-surface)] text-xs font-bold tracking-wider uppercase text-[var(--text-primary)] hover:border-[#C4B5FD] flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Advance State</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right Detail Panels */}
            <div className="lg:col-span-8 flex flex-col gap-6">

              {/* Description & DB Operation */}
              <div className="p-6 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-hash">
                    STAGE {step.index} &mdash; {step.tag}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                    <ShieldCheck className="w-4 h-4" />
                    <span>ACID Verified</span>
                  </div>
                </div>

                <p className="text-[var(--text-secondary)] text-sm font-medium leading-relaxed mb-5">
                  {step.description}
                </p>

                <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2 font-hash">
                    <Database className="w-3.5 h-3.5 text-[#A78BFA]" />
                    <span>PostgreSQL 17 Mutation</span>
                  </div>
                  <pre className="text-xs font-hash text-[var(--text-heading)] overflow-x-auto whitespace-pre-wrap">
                    {step.dbOp}
                  </pre>
                </div>
              </div>

              {/* Immutable Snapshot Card */}
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-sm">
                <div className="p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold font-hash text-[var(--text-muted)]">SNAPSHOT REFERENCE</div>
                    <div className="text-base font-extrabold text-[var(--text-heading)] font-hash mt-0.5">
                      {active === "quote" && "QT-2026-00042"}
                      {active === "subscription" && "SUB-2026-00042"}
                      {active === "invoice" && "INV-2026-00108"}
                      {active === "payment" && "PAY-2026-00094"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold font-hash text-[var(--text-muted)]">COMPUTED TOTAL</div>
                    <div className="text-xl font-extrabold text-[var(--text-heading)] font-hash mt-0.5">
                      {FMT_INR(total)}
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-[var(--border-subtle)]">
                  <div className="px-5 py-3 flex justify-between text-xs font-medium">
                    <span className="text-[var(--text-secondary)]">PlanLedger Enterprise Base</span>
                    <span className="font-hash text-[var(--text-heading)] font-bold">{FMT_INR(BASE)}</span>
                  </div>
                  <div className="px-5 py-3 flex justify-between text-xs font-medium">
                    <span className="text-[var(--text-secondary)]">Attribute Surcharge (Custom Brand)</span>
                    <span className="font-hash text-[var(--text-heading)] font-bold">+{FMT_INR(SURCHARGE)}</span>
                  </div>
                  {discount && (
                    <div className="px-5 py-3 flex justify-between text-xs font-medium bg-[#C4B5FD]/10">
                      <span className="text-[#000000] dark:text-[#C4B5FD] font-bold">Discount: HACKATHON2026 (-15%)</span>
                      <span className="font-hash text-[#000000] dark:text-[#C4B5FD] font-bold">
                        -{FMT_INR((BASE + SURCHARGE) * DISC_PCT)}
                      </span>
                    </div>
                  )}
                  <div className="px-5 py-3 flex justify-between text-xs font-medium">
                    <span className="text-[var(--text-muted)]">GST (18% via Decimal ROUND_HALF_UP)</span>
                    <span className="font-hash text-[var(--text-secondary)]">+{FMT_INR(tax)}</span>
                  </div>
                </div>

                <div className="p-4 border-t border-[var(--border-subtle)] flex items-center gap-3 flex-wrap bg-[var(--bg-elevated)]/30">
                  <button
                    onClick={() => setDiscount((p) => !p)}
                    className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all ${
                      discount
                        ? "bg-[#C4B5FD] text-black shadow-sm"
                        : "border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[#C4B5FD]"
                    }`}
                  >
                    {discount ? "✓ 15% DISCOUNT ACTIVE" : "+ APPLY HACKATHON2026"}
                  </button>

                  {active === "payment" && (
                    <button
                      onClick={() => setPayDone((p) => !p)}
                      className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all ${
                        payDone
                          ? "bg-emerald-500 text-white shadow-sm"
                          : "bg-[#A78BFA] text-black hover:opacity-90"
                      }`}
                    >
                      {payDone ? "✓ RECONCILED & SETTLED" : "RECONCILE PAYMENT"}
                    </button>
                  )}

                  <div className="ml-auto text-xs font-hash text-[var(--text-muted)] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>0.000% Floating Drift</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}