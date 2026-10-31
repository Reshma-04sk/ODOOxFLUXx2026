"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { MOCK_PLANS } from "@/services/mock-data";

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing" className="py-24 border-t border-zinc-800/80 bg-zinc-950/60 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Subscription Tiers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Flexible Plans for <span className="font-serif italic font-normal text-emerald-400">Growing Ledgers</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Choose the right tier with instant activation, automatic prorations, and Net 15 billing terms.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-md shadow-emerald-500/10"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Monthly Cadence
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === "yearly"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-md shadow-emerald-500/10"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>Annual Cadence</span>
              <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                Save 17% (2 Mo Free)
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {MOCK_PLANS.map((plan) => {
            const isGrowth = plan.tier === "growth";
            const price =
              billingCycle === "yearly"
                ? parseFloat(plan.price) * 10
                : parseFloat(plan.price);

            return (
              <div
                key={plan.id}
                className={`glass-card rounded-2xl p-8 flex flex-col justify-between relative transition-all duration-300 ${
                  isGrowth
                    ? "border-emerald-500/50 shadow-2xl shadow-emerald-500/15 ring-1 ring-emerald-500/30"
                    : "border-zinc-800/80"
                }`}
              >
                {isGrowth && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 to-teal-400 text-emerald-950 text-[10px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    Most Popular Choice
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white font-mono">{formatINR(price)}</span>
                    <span className="text-xs text-zinc-400 font-medium">
                      /{billingCycle === "yearly" ? "yr" : "mo"}
                    </span>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-zinc-800">
                    <div className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                      Included Capabilities
                    </div>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <Link
                    href="/register"
                    className={`w-full py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isGrowth
                        ? "bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-emerald-950 shadow-lg shadow-emerald-500/20"
                        : "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800"
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
      </div>
    </section>
  );
}
