"use client";

import { SquareLogo } from "@/components/square-logo";
import React, { useEffect, useRef } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { gsap } from "gsap";
import {
  CreditCard,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RECENT_SUBSCRIPTIONS = [
  {
    id: "SUB-8091",
    company: "Acme Cloud Infrastructure",
    plan: "Enterprise Dedicated",
    amount: 142000,
    status: "ACTIVE",
    nextBilling: "Nov 05, 2026",
    hash: "0x9e4a..b12c",
  },
  {
    id: "SUB-8092",
    company: "Helix Data Labs",
    plan: "Growth Volume Tier",
    amount: 54000,
    status: "ACTIVE",
    nextBilling: "Nov 08, 2026",
    hash: "0x3f12..a801",
  },
  {
    id: "SUB-8093",
    company: "Vertex Quantum Analytics",
    plan: "Standard Cloud",
    amount: 18500,
    status: "PENDING",
    nextBilling: "Nov 10, 2026",
    hash: "0x7b8c..c992",
  },
  {
    id: "SUB-8094",
    company: "QuantPulse HFT Systems",
    plan: "Institutional Core",
    amount: 285000,
    status: "ACTIVE",
    nextBilling: "Nov 12, 2026",
    hash: "0x11a0..44f0",
  },
  {
    id: "SUB-8095",
    company: "Horizon Spatial AI",
    plan: "Scale Platform",
    amount: 42000,
    status: "OVERDUE",
    nextBilling: "Oct 28, 2026",
    hash: "0x5d90..e21a",
  },
  {
    id: "SUB-8096",
    company: "Zenith FinTech Global",
    plan: "Enterprise Dedicated",
    amount: 195000,
    status: "ACTIVE",
    nextBilling: "Nov 15, 2026",
    hash: "0x88cc..d419",
  },
];

const REVENUE_SERIES = [
  { month: "May", revenue: 112000, target: 100000 },
  { month: "Jun", revenue: 121000, target: 115000 },
  { month: "Jul", revenue: 128000, target: 125000 },
  { month: "Aug", revenue: 134000, target: 130000 },
  { month: "Sep", revenue: 138500, target: 135000 },
  { month: "Oct", revenue: 142850, target: 140000 },
];

export default function DashboardOverviewPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const arrRef = useRef<HTMLSpanElement>(null);
  const mrrRef = useRef<HTMLSpanElement>(null);
  const subsRef = useRef<HTMLSpanElement>(null);
  const churnRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Stagger load of floating cards
      gsap.from(".fintech-card-stagger", {
        y: 24,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: "power3.out",
      });

      // 2. Animated Number Tickers
      const arrCounter = { val: 0 };
      gsap.to(arrCounter, {
        val: 1714200,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => {
          if (arrRef.current) {
            arrRef.current.textContent = "$" + Math.round(arrCounter.val).toLocaleString();
          }
        },
      });

      const mrrCounter = { val: 0 };
      gsap.to(mrrCounter, {
        val: 142850,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: () => {
          if (mrrRef.current) {
            mrrRef.current.textContent = "$" + Math.round(mrrCounter.val).toLocaleString();
          }
        },
      });

      const subsCounter = { val: 0 };
      gsap.to(subsCounter, {
        val: 1284,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => {
          if (subsRef.current) {
            subsRef.current.textContent = Math.round(subsCounter.val).toLocaleString();
          }
        },
      });

      const churnCounter = { val: 0 };
      gsap.to(churnCounter, {
        val: 0.42,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () => {
          if (churnRef.current) {
            churnRef.current.textContent = churnCounter.val.toFixed(2) + "%";
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <DashboardShell
      title="Financial Overview"
      subtitle="Real-time subscription ledger pulse and financial performance"
    >
      <div className="space-y-6" ref={containerRef}>

        {/* Metric Cards - Heavily Rounded Floating FinTech Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: ARR */}
          <div className="fintech-card fintech-card-stagger p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Annual Run Rate (ARR)
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C4B5FD]/20 text-black dark:text-[#C4B5FD] border border-[#C4B5FD]/30 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +14.1%
                </span>
              </div>
              <div className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-heading)] mb-2">
                <span ref={arrRef}>$0</span>
              </div>
            </div>
            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span className="font-semibold">Fiscal 2026 Target</span>
              <span className="font-bold text-[var(--text-primary)]">$2,000,000</span>
            </div>
          </div>

          {/* Card 2: MRR */}
          <div className="fintech-card fintech-card-stagger p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Monthly Recurring (MRR)
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#A78BFA]/20 text-[#7C3AED] dark:text-[#A78BFA] border border-[#A78BFA]/30 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +12.4%
                </span>
              </div>
              <div className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-heading)] mb-2">
                <span ref={mrrRef}>$0</span>
              </div>
            </div>
            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span className="font-semibold">Net New Monthly</span>
              <span className="font-bold text-[#C4B5FD] dark:text-[#C4B5FD] bg-black px-2 py-0.5 rounded-full">+$15,700</span>
            </div>
          </div>

          {/* Card 3: Active Subscriptions */}
          <div className="fintech-card fintech-card-stagger p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Active Subscribers
                </span>
                <div className="w-8 h-8 rounded-full bg-[#C4B5FD]/20 text-black dark:text-[#C4B5FD] flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-heading)] mb-2">
                <span ref={subsRef}>0</span>
              </div>
            </div>
            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span className="font-semibold">Renewal Rate</span>
              <span className="font-bold text-emerald-500">99.58%</span>
            </div>
          </div>

          {/* Card 4: Net Churn */}
          <div className="fintech-card fintech-card-stagger p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Net Revenue Churn
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                  Optimal
                </span>
              </div>
              <div className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-heading)] mb-2">
                <span ref={churnRef}>0.00%</span>
              </div>
            </div>
            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span className="font-semibold">SaaS Benchmark</span>
              <span className="font-bold text-[var(--text-muted)]">2.10%</span>
            </div>
          </div>

        </div>

        {/* Revenue Velocity Chart Floating Card */}
        <div className="fintech-card fintech-card-stagger p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-[var(--text-heading)] tracking-tight">
                  MRR Trajectory & Collection Velocity
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#C4B5FD]/20 text-black dark:text-[#C4B5FD]">
                  Live Pulse
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Normalized revenue across all billing cadences with PostgreSQL 17 atomic reconciliation
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#C4B5FD]" />
                <span>Collected MRR</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#A78BFA]" />
                <span>Target ARR Pace</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_SERIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C4B5FD" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#C4B5FD" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="lavenderGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#A78BFA" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border-strong)",
                    borderRadius: "1rem",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    color: "var(--text-primary)",
                    fontWeight: 600,
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C4B5FD" strokeWidth={3} fillOpacity={1} fill="url(#neonGradient)" />
                <Area type="monotone" dataKey="target" stroke="#A78BFA" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#lavenderGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Subscriptions Floating Card */}
        <div className="fintech-card fintech-card-stagger overflow-hidden">
          <div className="p-6 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-[var(--text-heading)] tracking-tight">
                  Recent Subscriptions
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-200 dark:bg-zinc-800 text-[var(--text-secondary)]">
                  6 of 1,284
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Active B2B contracts governed by deterministic billing state machine
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
                Auto-Renew: 98.4%
              </span>
            </div>
          </div>

          <div className="overflow-x-auto p-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Plan Tier</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Value</th>
                  <th className="py-3 px-4">Next Billing</th>
                  <th className="py-3 px-4">Audit Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-sm font-semibold">
                {RECENT_SUBSCRIPTIONS.map((sub) => {
                  const isOverdue = sub.status === "OVERDUE";
                  const isPending = sub.status === "PENDING";
                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-stone-100/70 dark:hover:bg-zinc-800/50 transition-colors rounded-2xl group cursor-pointer"
                    >
                      <td className="py-4 px-4 font-bold text-[var(--text-primary)]">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center font-bold text-xs text-[var(--text-secondary)]">
                            {sub.company.slice(0, 2).toUpperCase()}
                          </div>
                          <span>{sub.company}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-[var(--text-secondary)]">
                        {sub.plan}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                            isOverdue
                              ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                              : isPending
                              ? "bg-[#A78BFA]/20 text-[#7C3AED] dark:text-[#A78BFA] border border-[#A78BFA]/30"
                              : "bg-[#C4B5FD]/20 text-stone-900 dark:text-[#C4B5FD] border border-[#C4B5FD]/30"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isOverdue ? "bg-rose-500" : isPending ? "bg-[#A78BFA]" : "bg-[#C4B5FD]"}`} />
                          {sub.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right font-extrabold text-[var(--text-primary)]">
                        {formatINR(sub.amount)}
                      </td>

                      <td className="py-4 px-4 text-[var(--text-secondary)] font-medium">
                        {sub.nextBilling}
                      </td>

                      <td className="py-4 px-4 font-hash text-xs text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                        <div className="flex items-center gap-1.5">
                          <span>{sub.hash}</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)] flex items-center justify-between text-xs font-semibold text-[var(--text-muted)]">
            <span className="flex items-center gap-2">
              <SquareLogo size={14} className="text-[#C4B5FD]" />
              PostgreSQL 17 Deterministic Finite State Machine
            </span>
            <span className="font-hash text-[11px]">
              ENGINE: ACID SERIALIZABLE (0 DRIFT)
            </span>
          </div>
        </div>

      </div>
    </DashboardShell>
  );
}
