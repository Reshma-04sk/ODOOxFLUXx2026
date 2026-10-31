"use client";

import React, { useState } from "react";
import { Plus, CheckCircle } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MOCK_PLANS } from "@/services/mock-data";
import { formatINR } from "@/lib/utils";
import { toast } from "sonner";

export default function PlansPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <DashboardShell title="Plans & Pricing" subtitle="Configure subscription tiers, feature flags, and trial limits">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                billingCycle === "monthly" ? "bg-blue-600 text-white shadow-md shadow-blue-500/25" : "text-slate-400"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                billingCycle === "yearly" ? "bg-blue-600 text-white shadow-md shadow-blue-500/25" : "text-slate-400"
              }`}
            >
              Yearly (Save 16%)
            </button>
          </div>

          <button
            onClick={() => toast.success("Create new tier modal")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-500/25 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Plan</span>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {MOCK_PLANS.map((plan) => {
            const price = billingCycle === "yearly" ? parseFloat(plan.price) * 10 : parseFloat(plan.price);
            return (
              <div key={plan.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                      {plan.tier}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{plan.trial_period_days} Days Trial</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-2">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">{formatINR(price)}</span>
                  <span className="text-xs text-slate-400 font-medium">/{billingCycle === "yearly" ? "year" : "month"}</span>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-2.5">
                  <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">Features</span>
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => toast.info(`Editing plan ${plan.name}`)}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
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
