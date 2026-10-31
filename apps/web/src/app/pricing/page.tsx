"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { MOCK_PLANS } from "@/services/mock-data";
import { formatINR } from "@/lib/utils";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 selection:bg-blue-500/20 selection:text-blue-200">
      <nav className="h-20 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl flex items-center justify-between px-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-white tracking-tight">PlanLedger</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/register"
            className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-all"
          >
            Start Free Trial
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Predictable Pricing for High-Growth SaaS
          </h1>
          <p className="text-slate-400 text-base">
            Every plan includes idempotent automated billing, 18% GST tax invoices, customer portals, and webhooks.
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                billingCycle === "monthly"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-slate-400 hover:text-white bg-slate-900/60"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                billingCycle === "yearly"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-slate-400 hover:text-white bg-slate-900/60"
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                2 Months Free
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {MOCK_PLANS.map((plan) => {
            const isGrowth = plan.tier === "growth";
            const price = billingCycle === "yearly" ? parseFloat(plan.price) * 10 : parseFloat(plan.price);

            return (
              <div
                key={plan.id}
                className={`glass-card rounded-2xl p-8 flex flex-col justify-between relative transition-all duration-300 ${
                  isGrowth ? "border-blue-500/50 shadow-2xl shadow-blue-500/20 ring-1 ring-blue-500/30" : ""
                }`}
              >
                {isGrowth && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    Most Popular
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">{formatINR(price)}</span>
                    <span className="text-xs text-slate-400 font-medium">/{billingCycle === "yearly" ? "yr" : "mo"}</span>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Features Included</div>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <Link
                    href="/register"
                    className={`w-full py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      isGrowth
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                        : "bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800"
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
