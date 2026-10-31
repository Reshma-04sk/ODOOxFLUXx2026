"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, ShieldCheck, Zap, Database, CheckCircle2 } from "lucide-react";

interface MetricItem {
  id: string;
  label: string;
  targetValue: number;
  prefix?: string;
  suffix?: string;
  displayOverride?: string;
  subtext: string;
  badge: string;
  badgeColor: string;
  icon: any;
}

const METRICS: MetricItem[] = [
  {
    id: "mrr",
    label: "Tracked MRR & ARR",
    targetValue: 12.4,
    prefix: "$",
    suffix: "M+",
    subtext: "Normalized: Monthly direct, Annual ÷ 12, Weekly × 52/12",
    badge: "Live Ledger",
    badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    icon: TrendingUp,
  },
  {
    id: "leakage",
    label: "Revenue Leakage",
    targetValue: 0,
    prefix: "",
    suffix: "%",
    subtext: "Immutable line-item price & tax snapshot preservation",
    badge: "Zero Drift",
    badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    icon: ShieldCheck,
  },
  {
    id: "idempotency",
    label: "Idempotent Billing Runs",
    targetValue: 100,
    prefix: "",
    suffix: "%",
    subtext: "uq_invoice_subscription_period partial unique index lock",
    badge: "Guaranteed",
    badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    icon: Zap,
  },
  {
    id: "benchmark",
    label: "Seed Query Benchmark",
    targetValue: 2.0,
    prefix: "< ",
    suffix: "s",
    displayOverride: "< 1.42s",
    subtext: "Measured on 5,000 subscriptions & 20,000 invoice lines",
    badge: "Postgres 17",
    badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    icon: Database,
  },
];

export function MetricsBand() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="metrics" className="relative py-20 border-y border-zinc-800/80 bg-zinc-950/70">
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Demonstrable Financial Integrity</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Engineered for <span className="font-serif italic font-normal text-emerald-400">Absolute Precision</span> at Scale
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Every metric below is backed by strict PostgreSQL 17 engine constraints and ACID transaction isolation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.id}
                className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/40"
              >
                {/* Ambient glow on hover */}
                <div className="absolute -right-8 -top-8 w-28 h-28 bg-emerald-500/5 group-hover:bg-emerald-500/15 rounded-full blur-2xl transition-all pointer-events-none" />

                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${metric.badgeColor}`}
                  >
                    {metric.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono flex items-baseline">
                    <span className="text-emerald-400">{metric.prefix}</span>
                    <span>{metric.displayOverride ? metric.displayOverride.replace(metric.prefix || "", "") : metric.targetValue}</span>
                    <span className="text-zinc-400 text-xl ml-0.5">{metric.displayOverride ? "" : metric.suffix}</span>
                  </div>

                  <h3 className="text-sm font-semibold text-zinc-200">{metric.label}</h3>
                  <p className="text-[11px] text-zinc-400 leading-relaxed pt-1 border-t border-zinc-800/80">
                    {metric.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
