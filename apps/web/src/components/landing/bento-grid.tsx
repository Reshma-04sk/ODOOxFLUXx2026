"use client";

import React, { useState } from "react";
import {
  Database,
  Layers,
  ShieldAlert,
  Clock,
  Calculator,
  GitBranch,
  Terminal,
  Code2,
  CheckCircle2,
  Lock,
  ExternalLink,
} from "lucide-react";

export function BentoGrid() {
  const [selectedSqlTab, setSelectedSqlTab] = useState<"unique" | "due" | "case">("unique");

  return (
    <section id="bento" className="py-24 border-t border-zinc-800/80 bg-[#08090a] relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Database className="w-3.5 h-3.5" />
            <span>PostgreSQL 17 Core Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Built on <span className="font-serif italic font-normal text-cyan-400">Database Guarantees</span>, Not Flaky Application Logic
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Why PlanLedger stands out in judging: financial rules are enforced at the database layer with partial unique indexes, foreign key protections, and deterministic state machines.
          </p>
        </div>

        {/* 3x2 Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: PostgreSQL 17 Constraints & Indexes */}
          <div className="glass-card rounded-2xl p-6 lg:col-span-2 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">PostgreSQL 17 Database Guarantees</h3>
                    <p className="text-xs text-zinc-400">Self-managed local Docker & Neon production DB</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
                  Centerpiece of Judging
                </span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                PlanLedger prevents duplicate billing, overpayment, and invalid states at the Postgres level. Partial unique indexes guarantee exactly one non-cancelled invoice per period.
              </p>

              {/* Interactive SQL Snippet Selector */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedSqlTab("unique")}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-colors cursor-pointer ${
                      selectedSqlTab === "unique"
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    uq_invoice_subscription_period
                  </button>
                  <button
                    onClick={() => setSelectedSqlTab("due")}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-colors cursor-pointer ${
                      selectedSqlTab === "due"
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    ix_subscription_due_active
                  </button>
                  <button
                    onClick={() => setSelectedSqlTab("case")}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-colors cursor-pointer ${
                      selectedSqlTab === "case"
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    uq_user_email_lower
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-black/80 border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto">
                  {selectedSqlTab === "unique" && (
                    <div className="space-y-1">
                      <span className="text-zinc-500">-- Prevents duplicate invoices for the same billing epoch</span>
                      <div className="text-cyan-400">
                        CREATE UNIQUE INDEX uq_invoice_subscription_period
                      </div>
                      <div className="text-zinc-200">
                        ON billing_invoice (subscription_id, period_start)
                      </div>
                      <div className="text-emerald-400">
                        WHERE status &lt;&gt; &apos;cancelled&apos;;
                      </div>
                    </div>
                  )}
                  {selectedSqlTab === "due" && (
                    <div className="space-y-1">
                      <span className="text-zinc-500">-- High-speed index for scheduler batch lookups</span>
                      <div className="text-cyan-400">
                        CREATE INDEX ix_subscription_due_active
                      </div>
                      <div className="text-zinc-200">
                        ON subscriptions_subscription (next_invoice_date)
                      </div>
                      <div className="text-emerald-400">
                        WHERE status = &apos;active&apos;;
                      </div>
                    </div>
                  )}
                  {selectedSqlTab === "case" && (
                    <div className="space-y-1">
                      <span className="text-zinc-500">-- Case-insensitive uniqueness enforcement</span>
                      <div className="text-cyan-400">
                        CREATE UNIQUE INDEX uq_user_email_lower
                      </div>
                      <div className="text-emerald-400">
                        ON accounts_user (LOWER(email));
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>PROTECT foreign keys on all financial rows</span>
              </span>
              <span className="font-mono text-zinc-400">ACID Isolation</span>
            </div>
          </div>

          {/* Card 2: State Machine Lifecycle */}
          <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Subscription State Machine</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Deterministic transitions in <code className="text-emerald-400 font-mono">subscriptions/state.py</code>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>draft ➔ quotation</span>
                  <span className="text-emerald-400 font-bold">✓ Confirmed</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>confirmed ➔ active</span>
                  <span className="text-emerald-400 font-bold">✓ Bills First Period</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>active ⇄ paused</span>
                  <span className="text-cyan-400 font-bold">✓ Plan Pausable Flag</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>active ➔ closed</span>
                  <span className="text-amber-400 font-bold">✓ Auto-Close Cap</span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Illegal state transitions are rejected with friendly 400 responses. Activation automatically generates the initial period invoice and advances the billing schedule.
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <span>● Sequence: SUB/2026/00001</span>
            </div>
          </div>

          {/* Card 3: Customer Isolation & BOLA Protection */}
          <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">BOLA & Tenant Protection</h3>
                <p className="text-xs text-zinc-400 mt-1">Broken Object Level Authorization Defense</p>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Customer querysets are strictly scoped on the Django backend to the authenticated user&apos;s linked Customer profile.
              </p>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-[11px]">
                <div className="flex items-center gap-2 text-red-400 font-mono">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>Customer A requesting Customer B&apos;s invoice receives strict 404 response</span>
                </div>
                <p className="text-zinc-400 text-[10px]">
                  Prevents ID enumeration and hides object existence from unauthorized callers.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-400 font-mono">
              Role Scopes: Admin · Staff · Customer
            </div>
          </div>

          {/* Card 4: Automated Billing Scheduler */}
          <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Automated Billing Scheduler</h3>
                <p className="text-xs text-zinc-400 mt-1">Multi-tier execution strategy</p>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Three robust avenues to run recurring billing:
              </p>

              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span><strong>GitHub Actions cron:</strong> Calls bearer-protected endpoint</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span><strong>Admin UI:</strong> On-demand &quot;Run Billing Now&quot; button</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span><strong>CLI:</strong> <code className="font-mono text-zinc-400 text-[10px]">python manage.py run_billing</code></span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-400 font-mono">
              Batch query: select_for_update(skip_locked=True)
            </div>
          </div>

          {/* Card 5: Financial Decimal Precision */}
          <div className="glass-card rounded-2xl p-6 lg:col-span-2 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Decimal ROUND_HALF_UP Precision Engine</h3>
                    <p className="text-xs text-zinc-400">Zero IEEE-754 binary floating drift</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  NUMERIC(12,2)
                </span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Financial balances must never use binary float types. PlanLedger uses Python <code className="text-emerald-400 font-mono">Decimal</code> and PostgreSQL <code className="text-emerald-400 font-mono">NUMERIC(12,2)</code> with line-item tax and discount snapshots.
              </p>

              <div className="grid sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-black/60 border border-zinc-800">
                  <div className="text-zinc-500 text-[10px]">MRR Normalization Standard</div>
                  <div className="text-zinc-200 mt-1">Daily: daily_rate × 30.4375</div>
                  <div className="text-zinc-200">Weekly: weekly_rate × (52 / 12)</div>
                  <div className="text-emerald-400">Yearly: annual_price / 12</div>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-zinc-800">
                  <div className="text-zinc-500 text-[10px]">Audit Log Integrity</div>
                  <div className="text-zinc-200 mt-1">actor: user_id (Argon2)</div>
                  <div className="text-zinc-200">action: BILLING_INVOICE_GENERATED</div>
                  <div className="text-emerald-400">changes: JSONB snapshot payload</div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="text-emerald-400 font-semibold">Single INR Currency Mode</span>
              <span className="font-mono">Sub-Cent Exact Rounding</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
