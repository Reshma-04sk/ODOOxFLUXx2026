"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  CreditCard,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  Zap,
  Play,
  Loader2,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { formatINR, formatDate } from "@/lib/utils";
import { MOCK_KPIS, MOCK_SUBSCRIPTIONS, MOCK_INVOICES } from "@/services/mock-data";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CHART_DATA = [
  { month: "May", invoiced: 185000, collected: 178000 },
  { month: "Jun", invoiced: 210000, collected: 204000 },
  { month: "Jul", invoiced: 228000, collected: 221000 },
  { month: "Aug", invoiced: 235000, collected: 230000 },
  { month: "Sep", invoiced: 242000, collected: 239000 },
  { month: "Oct", invoiced: 248500, collected: 244000 },
];

export default function DashboardOverviewPage() {
  const [triggeringBilling, setTriggeringBilling] = useState(false);

  const handleManualBillingTrigger = async () => {
    setTriggeringBilling(true);
    setTimeout(() => {
      setTriggeringBilling(false);
      toast.success("Billing Engine Executed! 4 Subscriptions evaluated, 0 duplicates.");
    }, 1200);
  };

  return (
    <DashboardShell title="Dashboard Overview" subtitle="Real-time Brightloop Subscription & Revenue Pulse">
      <div className="space-y-8">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl glass-card border border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Idempotent Billing Engine</h2>
              <p className="text-xs text-slate-400">Automated daily billing active • Scheduled via GitHub Actions & Render</p>
            </div>
          </div>
          <button
            onClick={handleManualBillingTrigger}
            disabled={triggeringBilling}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all shadow-md shadow-blue-500/25 active:scale-95"
          >
            {triggeringBilling ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Running Billing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Trigger Manual Billing Run</span>
              </>
            )}
          </button>
        </div>

        {/* 4 Primary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Monthly Recurring Revenue</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">{formatINR(MOCK_KPIS.mrr)}</div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
              <span>+14.2%</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Active Subscriptions</span>
              <CreditCard className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">{MOCK_KPIS.active_subscriptions}</div>
            <div className="text-[11px] text-blue-400 flex items-center gap-1 font-semibold">
              <span>{MOCK_KPIS.trialing_subscriptions} in trial</span>
              <span className="text-slate-400 font-normal">• 94.2% retention</span>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Annualized Run Rate (ARR)</span>
              <FileText className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white">{formatINR(MOCK_KPIS.arr)}</div>
            <div className="text-[11px] text-indigo-400 flex items-center gap-1 font-semibold">
              <span>ARPU: {formatINR(MOCK_KPIS.arpu)}</span>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Churn Rate</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">{MOCK_KPIS.churn_rate}%</div>
            <div className="text-[11px] text-amber-400 flex items-center gap-1 font-semibold">
              <span>Low risk threshold</span>
            </div>
          </div>
        </div>

        {/* Revenue Trend Chart & Recent Invoices */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Revenue Performance (INR)</h3>
                <p className="text-xs text-slate-400">Monthly invoiced vs collected totals</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-blue-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Invoiced
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Collected
                </span>
              </div>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="colorInvoiced" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "0.5rem" }}
                  />
                  <Area type="monotone" dataKey="invoiced" stroke="#3b82f6" fillOpacity={1} fill="url(#colorInvoiced)" strokeWidth={2} />
                  <Area type="monotone" dataKey="collected" stroke="#10b981" fillOpacity={1} fill="url(#colorCollected)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Subscriptions Summary */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Active Subscriptions</h3>
              <Link href="/dashboard/subscriptions" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                <span>View all</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {MOCK_SUBSCRIPTIONS.map((sub) => (
                <div key={sub.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{sub.customer_company}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {sub.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{sub.plan.name}</span>
                    <span>Renews {formatDate(sub.current_period_end)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
