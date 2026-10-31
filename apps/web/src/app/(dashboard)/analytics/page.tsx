"use client";

import React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MOCK_KPIS, MOCK_REVENUE_TRENDS, MOCK_PLAN_DISTRIBUTION } from "@/services/mock-data";
import { formatINR } from "@/lib/utils";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const NEON = "#C4B5FD";
const LAVENDER = "#A78BFA";
const BLUE = "#60A5FA";

const customTooltipStyle = {
  backgroundColor: "var(--bg-surface)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "1rem",
  fontSize: "11px",
  color: "var(--text-primary)",
};

export default function AnalyticsPage() {
  const planColors = [NEON, LAVENDER, BLUE];

  return (
    <DashboardShell title="Revenue Analytics" subtitle="Financial cohorts, ARR run rates, plan distributions and churn dynamics">
      <div className="space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Monthly Recurring Revenue", value: formatINR(MOCK_KPIS.mrr), sub: "+14.2% MoM Growth", subColor: "text-emerald-500" },
            { label: "Annualized Run Rate (ARR)",  value: formatINR(MOCK_KPIS.arr), sub: "Projected 12-month rate", subColor: "text-[var(--text-muted)]" },
            { label: "Avg Revenue / User (ARPU)",  value: formatINR(MOCK_KPIS.arpu), sub: "Blended per subscriber", subColor: "text-[var(--text-muted)]" },
            { label: "Subscription Churn Rate",    value: `${MOCK_KPIS.churn_rate}%`, sub: "Industry benchmark < 5%", subColor: "text-emerald-500" },
          ].map((kpi) => (
            <div key={kpi.label} className="fintech-card p-5 space-y-2">
              <p className="text-xs text-[var(--text-muted)] font-semibold leading-snug">{kpi.label}</p>
              <p className="text-2xl font-extrabold text-[var(--text-primary)]">{kpi.value}</p>
              <p className={`text-[11px] font-semibold ${kpi.subColor}`}>{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Area Chart: Revenue Trend */}
          <div className="fintech-card p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Monthly Invoiced Revenue</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Gross billing volumes — past 6 months</p>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_REVENUE_TRENDS} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="neonGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={NEON} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={NEON} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 100000).toFixed(1)}L`} />
                  <Tooltip contentStyle={customTooltipStyle} formatter={(val) => [typeof val === "number" ? formatINR(val) : String(val ?? 0), "Invoiced"]} />
                  <Area type="monotone" dataKey="invoiced" stroke={NEON} strokeWidth={2.5} fill="url(#neonGrad)" dot={{ fill: NEON, strokeWidth: 0, r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart: Collected vs Invoiced */}
          <div className="fintech-card p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Collections vs Invoiced</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Cash collected vs gross billed comparison</p>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_REVENUE_TRENDS} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 100000).toFixed(1)}L`} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Bar dataKey="invoiced" fill={LAVENDER} radius={[6, 6, 0, 0]} maxBarSize={32} name="Invoiced" />
                  <Bar dataKey="collected" fill={NEON} radius={[6, 6, 0, 0]} maxBarSize={32} name="Collected" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="fintech-card p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Active Subscriber Distribution</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Distribution across subscription tiers</p>
          </div>
          <div className="space-y-5">
            {MOCK_PLAN_DISTRIBUTION.map((item, idx) => {
              const total = MOCK_PLAN_DISTRIBUTION.reduce((a, b) => a + b.subscribers, 0);
              const pct = Math.round((item.subscribers / total) * 100);
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: planColors[idx % planColors.length] }}
                      />
                      <span className="font-bold text-[var(--text-primary)]">{item.plan_name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[var(--text-muted)]">
                      <span className="font-hash font-semibold">{item.subscribers} subscribers</span>
                      <span className="font-bold text-[var(--text-primary)] w-8 text-right">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2.5 w-full bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: planColors[idx % planColors.length],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}


