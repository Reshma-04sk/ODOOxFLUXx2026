"use client";

import React, { useState } from "react";
import {
  FileText,
  CheckCircle,
  Receipt,
  CreditCard,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Lock,
  Calendar,
  Layers,
  ChevronRight,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

type StepId = "quote" | "subscription" | "invoice" | "payment";

export function WorkflowSimulator() {
  const [activeStep, setActiveStep] = useState<StepId>("quote");
  const [applyDiscount, setApplyDiscount] = useState<boolean>(true);
  const [taxRate, setTaxRate] = useState<number>(0.18); // 18% GST standard
  const [idempotencyAttempted, setIdempotencyAttempted] = useState<boolean>(false);
  const [paymentDone, setPaymentDone] = useState<boolean>(false);

  // Financial calculations with Decimal ROUND_HALF_UP simulation
  const basePrice = 2260.0; // Base Plan (₹1700) + Odoo Variant (+₹560)
  const discountAmount = applyDiscount ? Math.round(basePrice * 0.15 * 100) / 100 : 0.0;
  const taxableSubtotal = basePrice - discountAmount;
  const calculatedTax = Math.round(taxableSubtotal * taxRate * 100) / 100;
  const totalAmount = Math.round((taxableSubtotal + calculatedTax) * 100) / 100;

  const steps = [
    {
      id: "quote" as StepId,
      number: "01",
      title: "Quote Generation",
      tag: "Draft ➔ Quotation",
      icon: FileText,
      description: "Quotation template with product lines, brand variant (+₹560), and discount rules.",
    },
    {
      id: "subscription" as StepId,
      number: "02",
      title: "Subscription Active",
      tag: "State Machine",
      icon: Layers,
      description: "Confirmed state machine transition. Sequence locked: SUB/2026/00042.",
    },
    {
      id: "invoice" as StepId,
      number: "03",
      title: "Idempotent Invoice",
      tag: "ACID Guaranteed",
      icon: Receipt,
      description: "Snapshot line-items, tax rounding (ROUND_HALF_UP), and partial unique index lock.",
    },
    {
      id: "payment" as StepId,
      number: "04",
      title: "Payment Recorded",
      tag: "Balance Settled",
      icon: CreditCard,
      description: "Multi-method payment (UPI/Card/Transfer). Zero overpayment constraint.",
    },
  ];

  return (
    <section id="simulator" className="py-24 relative overflow-hidden bg-[#08090a]">
      {/* Mesh glow overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Core Engine Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            The PlanLedger <span className="font-serif italic font-normal text-emerald-400">State Machine</span> in Action
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
            Experience how PlanLedger moves from initial quotation to atomic billing and verified settlement with zero revenue leakage.
          </p>
        </div>

        {/* Step Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = activeStep === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStep(s.id)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer relative overflow-hidden ${
                  isActive
                    ? "bg-zinc-900 border-emerald-500/50 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                    : "bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-900/40 hover:border-zinc-700/80 text-zinc-400"
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 to-cyan-400" />
                )}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-bold ${isActive ? "text-emerald-400" : "text-zinc-400"}`}>
                    {s.number}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                    {s.tag}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-bold text-sm text-white mb-1">
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-zinc-400"}`} />
                  <span>{s.title}</span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">{s.description}</p>
              </button>
            );
          })}
        </div>

        {/* Simulation Card Display */}
        <div className="glass-card rounded-2xl p-6 md:p-8 border border-zinc-800/80 relative">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Interactive Settings & Controls */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                    Phase {steps.find((s) => s.id === activeStep)?.number} Configuration
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {activeStep === "quote" && "Configure Quotation Parameters"}
                  {activeStep === "subscription" && "Subscription State Machine Lifecycle"}
                  {activeStep === "invoice" && "Billing Snapshot & Idempotency Check"}
                  {activeStep === "payment" && "Payment Reconciliation & Settlement"}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Adjust live parameters below to see sub-millisecond database updates and decimal precision calculations.
                </p>
              </div>

              {/* Dynamic Controls based on Step */}
              <div className="space-y-4 pt-4 border-t border-zinc-800/80">
                {/* Discount toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-zinc-200">Promotional Discount (15%)</div>
                    <div className="text-[11px] text-zinc-400 font-mono">Code: HACKATHON2026</div>
                  </div>
                  <button
                    onClick={() => setApplyDiscount(!applyDiscount)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      applyDiscount
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {applyDiscount ? "Applied" : "Excluded"}
                  </button>
                </div>

                {/* Tax Rate Selection */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-zinc-200">GST / Tax Jurisdiction</div>
                    <div className="text-[11px] text-zinc-400">Snapshot Tax Code</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setTaxRate(0.18)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                        taxRate === 0.18
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      18% GST
                    </button>
                    <button
                      onClick={() => setTaxRate(0.0)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                        taxRate === 0.0
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      0% Export
                    </button>
                  </div>
                </div>

                {/* Step Specific Action Buttons */}
                {activeStep === "invoice" && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                      <RefreshCw className="w-4 h-4" />
                      <span>Test Database Idempotency</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      Click below to simulate triggering the billing engine a second time for this identical period.
                    </p>
                    <button
                      onClick={() => setIdempotencyAttempted(true)}
                      className="w-full py-2 px-3 text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Trigger Duplicate Run (run_due_billing)</span>
                    </button>

                    {idempotencyAttempted && (
                      <div className="p-2.5 rounded-lg bg-zinc-950 border border-emerald-500/40 text-[11px] text-emerald-300 flex items-start gap-2 animate-blur-slide-in">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong>PostgreSQL Protected:</strong> Duplicate generation rejected by{" "}
                          <code className="text-emerald-400 font-mono">uq_invoice_subscription_period</code>. Existing
                          invoice retained without duplicate line items.
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeStep === "payment" && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                      <Lock className="w-4 h-4" />
                      <span>Invoice Balance Lock</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      Payments acquire a <code className="text-emerald-400 font-mono">select_for_update</code> lock on
                      the invoice row before recording the receipt.
                    </p>
                    <button
                      onClick={() => setPaymentDone(!paymentDone)}
                      className="w-full py-2 px-3 text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{paymentDone ? "Reset Payment Simulation" : "Record Full Settlement (UPI Instant)"}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Step Navigation Pill */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-zinc-400 font-mono">Next.js 16 ➔ Django 6 API</span>
                <button
                  onClick={() => {
                    const stepOrder: StepId[] = ["quote", "subscription", "invoice", "payment"];
                    const nextIdx = (stepOrder.indexOf(activeStep) + 1) % stepOrder.length;
                    setActiveStep(stepOrder[nextIdx]);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                >
                  <span>Advance State</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Live Mock UI Card Representation */}
            <div className="lg:col-span-7">
              <div className="bg-[#0b0c10] rounded-xl border border-zinc-800 p-6 shadow-2xl relative">
                {/* Header of Mock Record */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-white">
                        {activeStep === "quote" && "QT/2026/00042"}
                        {activeStep === "subscription" && "SUB/2026/00042"}
                        {activeStep === "invoice" && "INV/2026/00108"}
                        {activeStep === "payment" && "PAY/2026/00094"}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                          activeStep === "payment" && paymentDone
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                        }`}
                      >
                        {activeStep === "quote" && "Quotation (Valid 15 Days)"}
                        {activeStep === "subscription" && "Active (Monthly Cadence)"}
                        {activeStep === "invoice" && "Confirmed (Due Net 15)"}
                        {activeStep === "payment" && (paymentDone ? "Reconciled & Paid" : "Awaiting Settlement")}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400">Customer: Acropolis Technologies Private Limited</div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-zinc-400 font-mono">Currency: INR</div>
                    <div className="text-lg font-bold font-mono text-emerald-400">{formatINR(totalAmount)}</div>
                  </div>
                </div>

                {/* Body: Line-Item Snapshot Details */}
                <div className="py-4 space-y-3">
                  <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex justify-between">
                    <span>Snapshot Description</span>
                    <span>Line Total</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                      <div>
                        <div className="font-semibold text-zinc-200">PlanLedger Enterprise Subscription</div>
                        <div className="text-[10px] text-zinc-400">Monthly billing cadence · Net 15 terms</div>
                      </div>
                      <div className="font-mono font-medium text-zinc-200">₹1,700.00</div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                      <div>
                        <div className="font-semibold text-zinc-200">
                          Product Variant: Brand = Odoo Hackathon 2026
                        </div>
                        <div className="text-[10px] text-zinc-400">Attribute value surcharge snapshot (+560.00)</div>
                      </div>
                      <div className="font-mono font-medium text-zinc-200">+₹560.00</div>
                    </div>

                    {applyDiscount && (
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-400">
                        <div>
                          <div className="font-semibold">Discount Redemption: HACKATHON2026 (15%)</div>
                          <div className="text-[10px] text-emerald-500/80">
                            Unique redemption locked to invoice row
                          </div>
                        </div>
                        <div className="font-mono font-bold">-₹{discountAmount.toFixed(2)}</div>
                      </div>
                    )}

                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/40 text-zinc-300">
                      <div>
                        <div className="font-medium">Calculated Tax Snapshot (GST {(taxRate * 100).toFixed(0)}%)</div>
                        <div className="text-[10px] text-zinc-400">
                          Python Decimal(taxable_subtotal * rate) with ROUND_HALF_UP
                        </div>
                      </div>
                      <div className="font-mono">+₹{calculatedTax.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {/* Footer Calculations & Database Evidence */}
                <div className="pt-4 border-t border-zinc-800 space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Taxable Subtotal:</span>
                    <span className="font-mono text-zinc-300">₹{taxableSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Tax Total (Snapshot):</span>
                    <span className="font-mono text-zinc-300">₹{calculatedTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-zinc-800">
                    <span>Final Invoice Total:</span>
                    <span className="font-mono text-emerald-400 text-base">{formatINR(totalAmount)}</span>
                  </div>

                  {/* ACID Verification Badge */}
                  <div className="mt-4 p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>
                        {activeStep === "quote" && "Draft quotation ready for staff confirmation"}
                        {activeStep === "subscription" && "State: active · Next Invoice Date: 01 Dec 2026"}
                        {activeStep === "invoice" && "Status: confirmed · Idempotency key verified"}
                        {activeStep === "payment" &&
                          (paymentDone ? "Balance: ₹0.00 (Fully Settled)" : `Balance Due: ${formatINR(totalAmount)}`)}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">ACID Safe</span>
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
