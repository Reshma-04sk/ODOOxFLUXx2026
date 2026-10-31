"use client";

import React, { useEffect, useRef } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { gsap } from "gsap";
import {
  TrendingUp,
  CreditCard,
  Activity,
  ArrowUpRight,
  ExternalLink,
  Shield,
  FileCode2,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

// Mock Data strictly aligned with PlanLedger's subscription ledger
const RECENT_SUBSCRIPTIONS = [
  {
    id: "SUB-8091",
    company: "Acme Corp Infrastructure",
    plan: "Enterprise Dedicated",
    amount: 142000,
    status: "ACTIVE",
    nextBilling: "2026-11-05",
    hash: "0x9e4a..b12c",
    autoRenew: true,
  },
  {
    id: "SUB-8092",
    company: "Helix Data Labs",
    plan: "Growth Volume Tier",
    amount: 54000,
    status: "ACTIVE",
    nextBilling: "2026-11-08",
    hash: "0x3f12..a801",
    autoRenew: true,
  },
  {
    id: "SUB-8093",
    company: "Vertex Quantum Analytics",
    plan: "Standard Cloud",
    amount: 18500,
    status: "PENDING",
    nextBilling: "2026-11-10",
    hash: "0x7b8c..c992",
    autoRenew: true,
  },
  {
    id: "SUB-8094",
    company: "QuantPulse HFT Systems",
    plan: "Institutional Core",
    amount: 285000,
    status: "ACTIVE",
    nextBilling: "2026-11-12",
    hash: "0x11a0..44f0",
    autoRenew: true,
  },
  {
    id: "SUB-8095",
    company: "Horizon Spatial AI",
    plan: "Scale Platform",
    amount: 42000,
    status: "OVERDUE",
    nextBilling: "2026-10-28",
    hash: "0x5d90..e21a",
    autoRenew: false,
  },
  {
    id: "SUB-8096",
    company: "Zenith FinTech Global",
    plan: "Enterprise Dedicated",
    amount: 195000,
    status: "ACTIVE",
    nextBilling: "2026-11-15",
    hash: "0x88cc..d419",
    autoRenew: true,
  },
];

export default function DashboardOverviewPage() {
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const mrrNumberRef = useRef<HTMLSpanElement>(null);
  const arrNumberRef = useRef<HTMLSpanElement>(null);
  const subsNumberRef = useRef<HTMLSpanElement>(null);
  const churnNumberRef = useRef<HTMLSpanElement>(null);

  // Requirement: Dashboard Entry GSAP Stagger + Number Tickers on load
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Stagger load of metric cards: slide up from translateY(20px) with snappy spring easing
      gsap.from(".terminal-metric-card", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
      });

      // 2. Number Tickers animating from 0 to target values on load
      const mrrObj = { val: 0 };
      gsap.to(mrrObj, {
        val: 142850,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => {
          if (mrrNumberRef.current) {
            mrrNumberRef.current.textContent = "$" + Math.round(mrrObj.val).toLocaleString();
          }
        },
      });

      const arrObj = { val: 0 };
      gsap.to(arrObj, {
        val: 1714200,
        duration: 1.8,
        ease: "power2.out",
        onUpdate: () => {
          if (arrNumberRef.current) {
            arrNumberRef.current.textContent = "$" + Math.round(arrObj.val).toLocaleString();
          }
        },
      });

      const subsObj = { val: 0 };
      gsap.to(subsObj, {
        val: 1284,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => {
          if (subsNumberRef.current) {
            subsNumberRef.current.textContent = Math.round(subsObj.val).toLocaleString();
          }
        },
      });

      const churnObj = { val: 0 };
      gsap.to(churnObj, {
        val: 0.42,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () => {
          if (churnNumberRef.current) {
            churnNumberRef.current.textContent = churnObj.val.toFixed(2) + "%";
          }
        },
      });
    }, cardsContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <DashboardShell
      title="OPERATIONS TERMINAL"
      subtitle="REAL-TIME FINANCIAL LEDGER & SUBSCRIPTION STATE MACHINE"
    >
      <div className="space-y-8" ref={cardsContainerRef}>

        {/* Telemetry Header Strip */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-[var(--border-strong)] bg-[var(--bg-elevated)] flex items-center justify-center font-mono font-bold text-[var(--accent)]">
              SYS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-widest font-bold text-[var(--text-heading)]">
                  POSTGRESQL 17 DETERMINISTIC ENGINE ACTIVE
                </span>
                <span className="px-2 py-0.5 border border-emerald-500/40 bg-emerald-500/10 font-mono text-[9px] text-emerald-400 font-bold uppercase tracking-widest">
                  ATOMIC
                </span>
              </div>
              <p className="font-mono text-[11px] text-[var(--text-secondary)] mt-0.5">
                ISOLATION LEVEL: SERIALIZABLE · IDEMPOTENCY WINDOW: 24H · RECONCILIATION: 0 ERRORS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-[var(--text-muted)]">
            <span>LAST SYNC: 2026-10-31 15:45:00 UTC</span>
            <span className="text-[var(--border-strong)]">|</span>
            <span className="text-emerald-500 flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              CONNECTED
            </span>
          </div>
        </div>

        {/* Metric Cards Grid - Requirement: MRR, Active Subscriptions, ARR, Churn */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: MRR */}
          <div className="terminal-metric-card border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 relative">
            <div className="absolute top-2 right-2 font-mono text-[9px] text-[var(--text-muted)]">
              LOC-01 // MRR
            </div>
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] mb-3 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-[var(--accent)]" />
              MONTHLY RECURRING (MRR)
            </div>
            <div className="display-text text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              <span ref={mrrNumberRef}>$0</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-3">
              <span className="text-emerald-500 flex items-center gap-0.5 font-bold">
                <ArrowUpRight className="w-3 h-3" />
                +12.4% MoM
              </span>
              <span>RUN RATE: $142.8K</span>
            </div>
          </div>

          {/* Card 2: Active Subscriptions */}
          <div className="terminal-metric-card border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 relative">
            <div className="absolute top-2 right-2 font-mono text-[9px] text-[var(--text-muted)]">
              LOC-02 // SUBS
            </div>
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] mb-3 flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5 text-[var(--accent)]" />
              ACTIVE SUBSCRIPTIONS
            </div>
            <div className="display-text text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              <span ref={subsNumberRef}>0</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-3">
              <span className="text-emerald-500 flex items-center gap-0.5 font-bold">
                <ArrowUpRight className="w-3 h-3" />
                +48 Net Additions
              </span>
              <span>100% IDEMPOTENT</span>
            </div>
          </div>

          {/* Card 3: ARR */}
          <div className="terminal-metric-card border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 relative">
            <div className="absolute top-2 right-2 font-mono text-[9px] text-[var(--text-muted)]">
              LOC-03 // ARR
            </div>
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] mb-3 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-[var(--accent)]" />
              ANNUAL RUN RATE (ARR)
            </div>
            <div className="display-text text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              <span ref={arrNumberRef}>$0</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-3">
              <span className="text-emerald-500 flex items-center gap-0.5 font-bold">
                <ArrowUpRight className="w-3 h-3" />
                +14.1% Annualized
              </span>
              <span>TARGET: $2.0M</span>
            </div>
          </div>

          {/* Card 4: Net Churn */}
          <div className="terminal-metric-card border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 relative">
            <div className="absolute top-2 right-2 font-mono text-[9px] text-[var(--text-muted)]">
              LOC-04 // CHURN
            </div>
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] mb-3 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[var(--accent)]" />
              NET REVENUE CHURN
            </div>
            <div className="display-text text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              <span ref={churnNumberRef}>0.00%</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-3">
              <span className="text-emerald-500 font-bold">
                BENCHMARK: 2.10%
              </span>
              <span>LEAKAGE: 0.00%</span>
            </div>
          </div>

        </div>

        {/* Data Table Section - Requirement: Clean border-separated Recent Subscriptions with instant hover inversion */}
        <div className="border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          
          {/* Table Header Controls */}
          <div className="p-4 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-[var(--accent)]" />
              <h2 className="font-mono text-sm uppercase tracking-widest font-bold text-[var(--text-heading)]">
                RECENT SUBSCRIPTIONS // AUDIT LEDGER
              </h2>
            </div>
            
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-[var(--text-muted)] uppercase tracking-wider">
                SCHEMA: PUBLIC.SUBSCRIPTIONS_V2
              </span>
              <span className="px-2 py-1 border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
                SHOWING 6 OF 1,284
              </span>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
                  <th className="py-3 px-4 border-r border-[var(--border-subtle)]">SUB ID</th>
                  <th className="py-3 px-4 border-r border-[var(--border-subtle)]">SUBSCRIBER ORGANIZATION</th>
                  <th className="py-3 px-4 border-r border-[var(--border-subtle)]">PLAN TIER</th>
                  <th className="py-3 px-4 border-r border-[var(--border-subtle)]">STATUS</th>
                  <th className="py-3 px-4 border-r border-[var(--border-subtle)] text-right">MRR VALUE</th>
                  <th className="py-3 px-4 border-r border-[var(--border-subtle)]">NEXT BILLING</th>
                  <th className="py-3 px-4">TRANSACTION HASH</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] font-mono text-xs">
                {RECENT_SUBSCRIPTIONS.map((sub) => {
                  const isOverdue = sub.status === "OVERDUE";
                  const isPending = sub.status === "PENDING";
                  return (
                    <tr
                      key={sub.id}
                      className="terminal-row-hover cursor-pointer"
                    >
                      <td className="py-3.5 px-4 border-r border-[var(--border-subtle)] text-[var(--text-muted)] font-semibold">
                        {sub.id}
                      </td>
                      <td className="py-3.5 px-4 border-r border-[var(--border-subtle)] font-bold text-[var(--text-primary)]">
                        {sub.company}
                      </td>
                      <td className="py-3.5 px-4 border-r border-[var(--border-subtle)] text-[var(--text-secondary)]">
                        {sub.plan}
                      </td>
                      <td className="py-3.5 px-4 border-r border-[var(--border-subtle)]">
                        <span
                          className={`inline-block px-2 py-0.5 border text-[10px] tracking-widest uppercase font-bold ${
                            isOverdue
                              ? "border-rose-500/50 bg-rose-500/10 text-rose-400"
                              : isPending
                              ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                              : "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 border-r border-[var(--border-subtle)] text-right font-bold text-[var(--text-primary)]">
                        {formatINR(sub.amount)}
                      </td>
                      <td className="py-3.5 px-4 border-r border-[var(--border-subtle)] text-[var(--text-secondary)]">
                        {sub.nextBilling}
                      </td>
                      <td className="py-3.5 px-4 text-[var(--text-muted)] flex items-center justify-between">
                        <span>{sub.hash}</span>
                        <ExternalLink className="w-3 h-3 opacity-60 ml-2" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)] flex items-center justify-between font-mono text-[11px] text-[var(--text-muted)]">
            <span className="flex items-center gap-2">
              <FileCode2 className="w-3.5 h-3.5 text-[var(--accent)]" />
              TABLE ENGINE: ACID PROTECTED WITH POSTGRESQL SERIALIZABLE LOCKING
            </span>
            <span className="uppercase tracking-widest">
              INSTANT HOVER INVERSION ACTIVE
            </span>
          </div>

        </div>

      </div>
    </DashboardShell>
  );
}
