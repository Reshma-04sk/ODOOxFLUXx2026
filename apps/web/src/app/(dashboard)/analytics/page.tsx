"use client";

import React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MOCK_KPIS, MOCK_REVENUE_TRENDS, MOCK_PLAN_DISTRIBUTION } from "@/services/mock-data";
import { formatINR } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsPage() {
  return (
    <DashboardShell title="Revenue Analytics" subtitle="Financial cohorts, ARR run rates, plan distributions and churn dynamics">
      <div className="space-y-8">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Monthly Recurring Revenue</span>
            <div className="text-3xl font-extrabold text-white">{formatINR(MOCK_KPIS.mrr)}</div>
            <span className="text-[11px] text-emerald-400 font-semibold">+14.2% MoM Growth</span>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Annualized Run Rate</span>
            <div className="text-3xl font-extrabold text-blue-400">{formatINR(MOCK_KPIS.arr)}</div>
            <span className="text-[11px] text-slate-400">Projected 12-month run rate</span>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Average Revenue / User (ARPU)</span>
            <div className="text-3xl font-extrabold text-indigo-400">{formatINR(MOCK_KPIS.arpu)}</div>
            <span className="text-[11px] text-slate-400">Blended average per subscriber</span>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Subscription Churn Rate</span>
            <div className="text-3xl font-extrabold text-emerald-400">{MOCK_KPIS.churn_rate}%</div>
            <span className="text-[11px] text-slate-400">Industry benchmark &lt; 5%</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Monthly Invoiced Revenue</h3>
              <p className="text-xs text-slate-400">Gross billing volumes across past 6 months</p>
            </div>
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_REVENUE_TRENDS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "0.5rem" }} />
                  <Bar dataKey="invoiced" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Active Subscriber Distribution</h3>
              <p className="text-xs text-slate-400">Distribution of customers across subscription tiers</p>
            </div>
            <div className="space-y-4 pt-4">
              {MOCK_PLAN_DISTRIBUTION.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{item.plan_name}</span>
                    <span className="font-mono text-slate-400">{item.subscribers} Subscribers</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        idx === 0 ? "bg-blue-500" : idx === 1 ? "bg-emerald-500" : "bg-purple-500"
                      }`}
                      style={{ width: `${(item.subscribers / 142) * 100}%` }}
                    />
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
