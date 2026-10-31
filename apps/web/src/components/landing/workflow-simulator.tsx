"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
          { clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)" },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              end: "top 30%",
              scrub: 1.2,
            },
          }
        );
      }

      gsap.fromTo(
        ".sim-step",
        { x: -24, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const step = STEPS.find((s) => s.id === active)!;

  return (
    <section
      ref={sectionRef}
      id="simulator"
      className="relative bg-[#06141B] border-t border-[#253745] overflow-hidden"
    >
      <div ref={clipPanelRef} className="clip-section">
        <div className="absolute inset-0 arch-grid-fine opacity-20 pointer-events-none" />

        {/* Header */}
        <div className="max-w-[1400px] mx-auto px-8 py-10 border-b border-[#253745] flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4" style={{ fontFamily: "var(--font-space-mono)" }}>
            <div className="w-2 h-2 border border-[#ADC2D5] rotate-45 bg-[#ADC2D5]" />
            <span className="mono-label text-[#88A7C1]">BILLING STATE MACHINE SIMULATOR</span>
          </div>
          <span className="mono-label text-[#253745] hidden md:block" style={{ fontFamily: "var(--font-space-mono)" }}>
            NEXT.JS 16 → DJANGO 6 API
          </span>
        </div>

        <div className="max-w-[1400px] mx-auto px-8 py-12 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8">

            {/* Step nav */}
            <div className="lg:col-span-4 flex flex-col border border-[#253745]">
              {STEPS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setActive(s.id); setPayDone(false); }}
                  className={`sim-step opacity-0 text-left p-5 border-b border-[#253745] last:border-b-0 transition-all duration-300 ${
                    active === s.id ? "panel-active" : "hover:bg-[#0B1826]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div
                        className="mono-label mb-1"
                        style={{ fontFamily: "var(--font-space-mono)", color: active === s.id ? "#ADC2D5" : "#5A7896" }}
                      >
                        {s.index} — {s.tag}
                      </div>
                      <div
                        className="text-sm font-bold tracking-[0.06em]"
                        style={{ fontFamily: "var(--font-space-grotesk)", color: active === s.id ? "#ADC2D5" : "#88A7C1" }}
                      >
                        {s.label}
                      </div>
                    </div>
                    {active === s.id && <div className="w-1.5 h-1.5 bg-[#ADC2D5] rounded-full mt-1 shrink-0" />}
                  </div>
                </button>
              ))}
              <div className="p-4 border-t border-[#253745]">
                <button
                  onClick={() => {
                    const order: StepId[] = ["quote", "subscription", "invoice", "payment"];
                    const next = (order.indexOf(active) + 1) % order.length;
                    setActive(order[next]);
                    setPayDone(false);
                  }}
                  className="w-full py-2 border border-[#253745] text-[10px] tracking-[0.15em] uppercase text-[#5A7896] hover:border-[#ADC2D5] hover:text-[#ADC2D5] transition-all duration-200"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  ADVANCE STATE →
                </button>
              </div>
            </div>

            {/* Detail panels */}
            <div className="lg:col-span-8 flex flex-col gap-6">

              {/* Description */}
              <div className="border border-[#253745] p-6">
                <div className="mono-label mb-3 text-[#5A7896]" style={{ fontFamily: "var(--font-space-mono)" }}>
                  STEP {step.index} / STATE DESCRIPTION
                </div>
                <p className="text-[#88A7C1] text-sm leading-relaxed mb-5" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {step.description}
                </p>
                <div className="bg-[#06141B] border border-[#253745] p-4">
                  <div className="text-[9px] tracking-[0.2em] text-[#5A7896] mb-2 uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>
                    DB OPERATION
                  </div>
                  <pre className="text-[11px] text-[#ADC2D5] overflow-x-auto" style={{ fontFamily: "var(--font-space-mono)" }}>
                    {step.dbOp}
                  </pre>
                </div>
              </div>

              {/* Invoice snapshot */}
              <div className="border border-[#253745]">
                <div className="p-5 border-b border-[#253745] flex items-center justify-between">
                  <div>
                    <div className="mono-label text-[#5A7896]" style={{ fontFamily: "var(--font-space-mono)" }}>INVOICE SNAPSHOT</div>
                    <div className="text-sm font-bold text-[#ADC2D5] mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                      {active === "quote" && "QT/2026/00042"}
                      {active === "subscription" && "SUB/2026/00042"}
                      {active === "invoice" && "INV/2026/00108"}
                      {active === "payment" && "PAY/2026/00094"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mono-label text-[#5A7896]" style={{ fontFamily: "var(--font-space-mono)" }}>TOTAL</div>
                    <div className="text-lg font-bold text-[#ADC2D5] mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                      {FMT_INR(total)}
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-[#253745]">
                  <div className="px-5 py-3 flex justify-between text-xs">
                    <span className="text-[#88A7C1]" style={{ fontFamily: "var(--font-space-grotesk)" }}>PlanLedger Enterprise Subscription</span>
                    <span className="text-[#ADC2D5]" style={{ fontFamily: "var(--font-space-mono)" }}>&#8377;{BASE.toFixed(2)}</span>
                  </div>
                  <div className="px-5 py-3 flex justify-between text-xs">
                    <span className="text-[#88A7C1]" style={{ fontFamily: "var(--font-space-grotesk)" }}>Attribute Surcharge (Brand)</span>
                    <span className="text-[#ADC2D5]" style={{ fontFamily: "var(--font-space-mono)" }}>+&#8377;{SURCHARGE.toFixed(2)}</span>
                  </div>
                  {discount && (
                    <div className="px-5 py-3 flex justify-between text-xs">
                      <span className="text-[#ADC2D5]" style={{ fontFamily: "var(--font-space-grotesk)" }}>Discount: HACKATHON2026 (15%)</span>
                      <span className="text-[#ADC2D5]" style={{ fontFamily: "var(--font-space-mono)" }}>-&#8377;{((BASE + SURCHARGE) * DISC_PCT).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="px-5 py-3 flex justify-between text-xs">
                    <span className="text-[#5A7896]" style={{ fontFamily: "var(--font-space-mono)" }}>GST 18% — Decimal(ROUND_HALF_UP)</span>
                    <span className="text-[#88A7C1]" style={{ fontFamily: "var(--font-space-mono)" }}>+&#8377;{tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="px-5 py-4 border-t border-[#253745] flex items-center gap-4 flex-wrap">
                  <button
                    onClick={() => setDiscount((p) => !p)}
                    className={`text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 border transition-all duration-200 ${
                      discount
                        ? "border-[#ADC2D5] text-[#ADC2D5]"
                        : "border-[#253745] text-[#5A7896] hover:border-[#5A7896]"
                    }`}
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  >
                    {discount ? "✓ DISCOUNT APPLIED" : "APPLY HACKATHON2026"}
                  </button>
                  {active === "payment" && (
                    <button
                      onClick={() => setPayDone((p) => !p)}
                      className={`text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 border transition-all duration-200 ${
                        payDone
                          ? "border-[#ADC2D5] text-[#06141B] bg-[#ADC2D5]"
                          : "border-[#253745] text-[#5A7896] hover:border-[#ADC2D5]"
                      }`}
                      style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                      {payDone ? "✓ SETTLED" : "RECONCILE PAYMENT"}
                    </button>
                  )}
                  <div className="ml-auto text-[10px] text-[#5A7896] flex items-center gap-2" style={{ fontFamily: "var(--font-space-mono)" }}>
                    <div className="w-1.5 h-1.5 bg-[#ADC2D5] rounded-full animate-pulse" />
                    ACID SAFE
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