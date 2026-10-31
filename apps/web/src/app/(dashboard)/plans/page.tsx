"use client";

import React, { useState } from "react";
import { Plus, CheckCircle2, Zap, Star } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MOCK_PLANS } from "@/services/mock-data";
import { formatINR } from "@/lib/utils";
import { toast } from "sonner";

const tierColors: Record<string, { badge: string; glow: string }> = {
  starter:    { badge: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",       glow: "" },
  growth:     { badge: "bg-violet-400/15 text-violet-400 border-violet-400/30",          glow: "border-violet-400/40" },
  enterprise: { badge: "bg-[#C4B5FD]/15 text-[#C4B5FD] border-[#C4B5FD]/30",            glow: "border-[#C4B5FD]/40" },
};

export default function PlansPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <DashboardShell title="Plans & Pricing" subtitle="Configure subscription tiers, feature flags, and trial limits">
      <div className="space-y-8">
        {/* Cycle Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-1.5 rounded-2xl">
            {(["monthly", "yearly"] as const).map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all capitalize ${
                  billingCycle === cycle
                    ? "bg-[#C4B5FD] text-black shadow-md"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                {cycle === "yearly" ? "Yearly (Save 16%)" : "Monthly"}
              </button>
            ))}
          </div>
          <button
            onClick={() => toast.success("Create new tier modal")}
            className="btn-neon flex items-center gap-2 px-5 py-2.5 text-xs font-bold shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Plan</span>
          </button>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {MOCK_PLANS.map((plan, idx) => {
            const price = billingCycle === "yearly" ? parseFloat(plan.price) * 10 : parseFloat(plan.price);
            const tier = plan.tier?.toLowerCase() || "starter";
            const colors = tierColors[tier] || tierColors.starter;
            const isPopular = idx === 1;

            return (
              <div
                key={plan.id}
                className={`fintech-card p-6 space-y-6 relative ${isPopular ? "ring-2 ring-violet-400/40" : ""}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1 bg-violet-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                      <Star className="w-3 h-3 fill-current" />
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${colors.badge}`}>
                      {plan.tier}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] font-medium">
                      <Zap className="w-3 h-3" />
                      <span>{plan.trial_period_days}d Trial</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-extrabold text-[var(--text-primary)] mt-3">{plan.name}</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-[var(--text-primary)]">{formatINR(price)}</span>
                  <span className="text-xs text-[var(--text-muted)] font-medium">/{billingCycle === "yearly" ? "year" : "month"}</span>
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block">Includes</span>
                  {plan.features.map((feat: string, i: number) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-px" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => toast.info(`Editing plan ${plan.name}`)}
                  className={`w-full py-3 rounded-2xl text-xs font-bold transition-all ${
                    isPopular
                      ? "btn-lavender"
                      : "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  Configure Tier
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
