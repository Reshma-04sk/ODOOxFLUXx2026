"use client";

import { SquareLogo } from "@/components/square-logo";
import React, { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { MOCK_PLANS } from "@/services/mock-data";
import { formatINR } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen arch-grid-bg text-[var(--text-primary)]">
      {/* Navbar */}
      <nav className="h-20 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#C4B5FD] text-black flex items-center justify-center font-extrabold shadow-sm">
              <SquareLogo size={18} />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-[var(--text-heading)]">PlanLedger</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <ThemeToggle variant="pill" />
            <Link
              href="/register"
              className="btn-neon px-4 py-2 text-xs uppercase tracking-wider font-bold shadow-sm"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-bold text-[#C4B5FD] uppercase tracking-wider shadow-sm">
            <span>Production-Grade Architecture</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-heading)] tracking-tight">
            Predictable Pricing for High-Growth SaaS
          </h1>
          <p className="text-[var(--text-secondary)] text-base font-medium">
            Every plan includes idempotent automated billing, 18% GST tax invoices, customer portals, and webhooks.
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <div className="p-1 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] inline-flex items-center gap-1 shadow-sm">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-[#C4B5FD] text-black shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === "yearly"
                    ? "bg-[#C4B5FD] text-black shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">
                  2 Months Free
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {MOCK_PLANS.map((plan) => {
            const isGrowth = plan.tier === "growth";
            const price = billingCycle === "yearly" ? parseFloat(plan.price) * 10 : parseFloat(plan.price);

            return (
              <div
                key={plan.id}
                className={`fintech-card p-8 flex flex-col justify-between relative transition-all duration-300 ${
                  isGrowth ? "border-[#C4B5FD] shadow-2xl ring-1 ring-[#C4B5FD]/30" : ""
                }`}
              >
                {isGrowth && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#C4B5FD] text-black text-[11px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                    Most Popular
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-[var(--text-heading)]">{plan.name}</h2>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-[var(--text-heading)] font-hash">{formatINR(price)}</span>
                    <span className="text-xs text-[var(--text-muted)] font-semibold">
                      /{billingCycle === "yearly" ? "yr" : "mo"}
                    </span>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-hash">
                      Features Included
                    </div>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-[var(--text-secondary)] font-medium">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <Link
                    href="/register"
                    className={`w-full py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      isGrowth
                        ? "btn-neon"
                        : "border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[#C4B5FD]"
                    }`}
                  >
                    <span>Start 14-Day Free Trial</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}