"use client";

import React from "react";
import { Github, ExternalLink, Code2, Database, Layout, Sparkles, CheckCircle2 } from "lucide-react";

export function TeamSection() {
  return (
    <section id="team" className="py-24 border-t border-zinc-800/80 bg-[#08090a] relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Two-Member Monorepo Delivery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Engineered by <span className="font-serif italic font-normal text-emerald-400">Two Specialized Leads</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            One unified repository with distinct architectural ownership, branch conventions, and automated contract synchronization.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* M1: Reshma Shaik */}
          <div className="glass-card rounded-2xl p-8 relative overflow-hidden border border-zinc-800 hover:border-emerald-500/40 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                  M1 · Team Lead &amp; Platform Owner
                </span>
                <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded">
                  apps/api
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">Reshma Shaik</h3>
                <p className="text-xs text-emerald-400/90 font-mono mt-0.5">GitHub: @Reshma-04sk</p>
                <p className="text-xs text-zinc-300 mt-3 leading-relaxed">
                  Repository governance, Django 6 backend architecture, PostgreSQL 17 database guarantees, partial unique indexes, idempotent billing engine, and cloud infrastructure deployment.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Key Deliverables
                </div>
                <div className="grid grid-cols-1 gap-1.5 text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>PostgreSQL 17 constraints, sequences &amp; ERD model</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Atomic invoice generation &amp; due billing scheduler</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Argon2 auth, session security &amp; BOLA protection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>OpenAPI 3.1 schema endpoint (/api/schema/)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center justify-between">
              <a
                href="https://github.com/Reshma-04sk"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>github.com/Reshma-04sk</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[10px] font-mono text-zinc-400">Backend Lead</span>
            </div>
          </div>

          {/* M2: Gayathri Devi G */}
          <div className="glass-card rounded-2xl p-8 relative overflow-hidden border border-zinc-800 hover:border-cyan-500/40 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
                  M2 · Frontend Lead &amp; UX Owner
                </span>
                <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded">
                  apps/web
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">Gayathri Devi G</h3>
                <p className="text-xs text-cyan-400/90 font-mono mt-0.5">GitHub: @gaayathri-devi-07</p>
                <p className="text-xs text-zinc-300 mt-3 leading-relaxed">
                  Next.js 16 App Router architecture, luxury financial design system, Three.js 3D dynamic ledger canvas, GSAP &amp; Lenis smooth momentum scrolling, customer portal, and data tables.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Key Deliverables
                </div>
                <div className="grid grid-cols-1 gap-1.5 text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Interactive 3D dynamic ledger canvas &amp; kinetic typography</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>State machine simulator &amp; snapshot calculation UI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>TanStack Query &amp; same-origin /api rewrite integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Customer Portal, billing management &amp; analytics dashboards</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center justify-between">
              <a
                href="https://github.com/gaayathri-devi-07"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>github.com/gaayathri-devi-07</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[10px] font-mono text-zinc-400">Frontend Lead</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
