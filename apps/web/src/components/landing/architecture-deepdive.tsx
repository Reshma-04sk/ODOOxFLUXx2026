"use client";

import React, { useState } from "react";
import {
  Layers,
  Server,
  Database,
  ShieldCheck,
  Code2,
  FileCode,
  Terminal,
  CheckCircle,
  Copy,
  ExternalLink,
} from "lucide-react";

type ArchTab = "monorepo" | "erd" | "auth" | "benchmark";

export function ArchitectureDeepdive() {
  const [activeTab, setActiveTab] = useState<ArchTab>("monorepo");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="architecture" className="py-24 border-t border-zinc-800/80 bg-zinc-950/80 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Server className="w-3.5 h-3.5" />
            <span>Under the Hood</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Production-Grade <span className="font-serif italic font-normal text-emerald-400">Technical Architecture</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Every layer of PlanLedger is architected according to the Odoo Hackathon specification, eliminating bloat while maximizing reliability and speed.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          <button
            onClick={() => setActiveTab("monorepo")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "monorepo"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                : "bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Monorepo Structure</span>
          </button>
          <button
            onClick={() => setActiveTab("erd")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "erd"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                : "bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Data Model & ERD</span>
          </button>
          <button
            onClick={() => setActiveTab("auth")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "auth"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                : "bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Same-Origin /api & Auth</span>
          </button>
          <button
            onClick={() => setActiveTab("benchmark")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "benchmark"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                : "bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Seed Dataset & Benchmarks</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="glass-card rounded-2xl p-6 md:p-8 border border-zinc-800/80">
          {activeTab === "monorepo" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Single Monorepo: Clean Code Boundaries</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Strict two-member ownership: M1 (Backend/DB) & M2 (Frontend/UX)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                    CODEOWNERS Protected
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 font-mono text-xs text-zinc-300 space-y-1 overflow-x-auto">
                  <div className="text-zinc-500"># Monorepo Topology</div>
                  <div>planledger/</div>
                  <div className="text-emerald-400 pl-4">├── apps/</div>
                  <div className="text-cyan-400 pl-8">├── api/ (Django 6 + DRF)</div>
                  <div className="text-zinc-400 pl-12">├── accounts, catalog, subscriptions</div>
                  <div className="text-zinc-400 pl-12">└── billing, payments, analytics</div>
                  <div className="text-emerald-400 pl-8">└── web/ (Next.js 16 App Router)</div>
                  <div className="text-zinc-400 pl-12">├── app, components, lib, services</div>
                  <div className="text-amber-400 pl-4">├── docs/</div>
                  <div className="text-zinc-400 pl-8">├── TEAM_PLAN.md, ARCHITECTURE.md</div>
                  <div className="text-zinc-400 pl-8">└── DATA_MODEL.md, BILLING_RULES.md</div>
                  <div className="text-emerald-400 pl-4">└── infrastructure/</div>
                  <div className="text-zinc-400 pl-8">├── docker-compose.yml (Postgres 17)</div>
                  <div className="text-zinc-400 pl-8">└── render.yaml (Gunicorn + Neon)</div>
                </div>

                <div className="space-y-4 text-xs text-zinc-300">
                  <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Zero Dependency Bloat</span>
                    </div>
                    <p className="text-zinc-400 leading-relaxed">
                      No BaaS, no external auth intermediaries, and no unnecessary LLM dependencies. Local Docker Compose spins up real Postgres 17 in 3 seconds.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span>Contract Synchronization</span>
                    </div>
                    <p className="text-zinc-400 leading-relaxed">
                      OpenAPI schema generated at <code className="text-cyan-400">/api/schema/</code>. TypeScript types automatically consumed by Next.js to eliminate type drift.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "erd" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Relational Data Model & PROTECT Cascades</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Financial entities preserve historical integrity even if customer or catalog objects change.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2">
                  <div className="font-bold text-emerald-400 font-mono">accounts_user</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Email, Argon2 hash, role (Admin/Staff/Customer). Case-insensitive lower index.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2">
                  <div className="font-bold text-cyan-400 font-mono">catalog_plan</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Pricing, period, interval_count, auto_close, pausable, and renewable lifecycle flags.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2">
                  <div className="font-bold text-amber-400 font-mono">billing_invoice</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Locked sequence (INV/2026/00001), subtotal, tax snapshot, discount redemption, total, amount_paid.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2">
                  <div className="font-bold text-purple-400 font-mono">core_auditlog</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Actor, action, entity, entity_id, JSONB change delta for audit trail and compliance.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "auth" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Same-Origin /api Rewrite & Cookie Security</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Zero localStorage token storage. Protected against XSS with HttpOnly cookies.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 font-mono text-xs text-zinc-300 space-y-2">
                <div className="text-zinc-500">// Next.js next.config.ts rewrite configuration</div>
                <div className="text-emerald-400">
                  {`rewrites() {`}
                </div>
                <div className="text-zinc-200 pl-4">
                  {`return [{ source: "/api/:path*", destination: "\${DJANGO_API_URL}/api/:path*" }];`}
                </div>
                <div className="text-emerald-400">
                  {`}`}
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 text-xs text-zinc-300">
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="font-bold text-emerald-400 mb-1">Argon2 Password Hashing</div>
                  <p className="text-[11px] text-zinc-400">Memory-hard password derivation function.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="font-bold text-cyan-400 mb-1">CSRF Cookie Validation</div>
                  <p className="text-[11px] text-zinc-400">Enforced on all state-mutating requests.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="font-bold text-amber-400 mb-1">HttpOnly Session Cookies</div>
                  <p className="text-[11px] text-zinc-400">Prevents client-side script token theft.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "benchmark" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Seed Dataset & Benchmark Verification</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Tested on 5,000 subscriptions and 20,000 invoices with <code className="text-emerald-400 font-mono">select_related</code> and index optimization.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <div className="text-zinc-500 text-[10px]">Endpoint</div>
                  <div className="text-white font-bold">GET /api/subscriptions/</div>
                  <div className="text-emerald-400 font-bold text-lg pt-1">182 ms</div>
                  <div className="text-[10px] text-zinc-400">Page 1 of 5,000 rows</div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <div className="text-zinc-500 text-[10px]">Endpoint</div>
                  <div className="text-white font-bold">GET /api/invoices/</div>
                  <div className="text-cyan-400 font-bold text-lg pt-1">214 ms</div>
                  <div className="text-[10px] text-zinc-400">Page 1 of 20,000 rows</div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <div className="text-zinc-500 text-[10px]">Endpoint</div>
                  <div className="text-white font-bold">GET /api/analytics/overview/</div>
                  <div className="text-amber-400 font-bold text-lg pt-1">345 ms</div>
                  <div className="text-[10px] text-zinc-400">Database SQL Aggregation</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
