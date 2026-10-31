"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  FileCheck2,
  Lock,
  BarChart3,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { HeroShaderVisual } from "@/components/landing/hero-shader";
import { MOCK_PLANS } from "@/services/mock-data";
import { formatINR } from "@/lib/utils";

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 selection:bg-blue-500/20 selection:text-blue-200">
      {/* Navigation Bar */}
      <nav className="h-20 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg text-white tracking-tight">PlanLedger</span>
            <span className="hidden sm:inline-block ml-2 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full font-medium">
              Brightloop
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-blue-400 transition-colors">
            Capabilities
          </a>
          <a href="#pricing" className="hover:text-blue-400 transition-colors">
            Pricing
          </a>
          <a href="#architecture" className="hover:text-blue-400 transition-colors">
            Architecture
          </a>
          <a href="#team" className="hover:text-blue-400 transition-colors">
            Engineering Team
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <HeroShaderVisual />

        <div className="relative max-w-5xl mx-auto px-6 text-center space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 tracking-wide uppercase shadow-inner">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            Brightloop Software Subscription Engine
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 tracking-tight leading-[1.15]">
            Subscription Ledger & Billing Infrastructure.
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
            Engineered for high-growth SaaS applications. Fully idempotent automated billing, multi-tier subscription
            lifecycles, GST-compliant invoicing, and instant payment reconciliation in INR.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-xl shadow-xl shadow-blue-500/30 transition-all hover:-translate-y-0.5"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-base font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-900 border border-slate-800 px-8 py-4 rounded-xl transition-colors"
            >
              <span>View Plans & Pricing</span>
            </Link>
          </div>

          {/* Key Metrics Strip */}
          <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="glass-card p-5 rounded-2xl text-center">
              <div className="text-3xl font-black text-blue-400">100%</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Idempotent Billing</div>
            </div>
            <div className="glass-card p-5 rounded-2xl text-center">
              <div className="text-3xl font-black text-emerald-400">&lt; 2.0s</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">20k Invoices Query</div>
            </div>
            <div className="glass-card p-5 rounded-2xl text-center">
              <div className="text-3xl font-black text-indigo-400">Argon2</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Password Security</div>
            </div>
            <div className="glass-card p-5 rounded-2xl text-center">
              <div className="text-3xl font-black text-cyan-400">18% GST</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Automatic Tax Engine</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 border-t border-slate-900 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Enterprise Billing Engine Architecture
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              Built with precision database constraints, financial decimals, and complete tenant isolation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl space-y-4 hover:border-blue-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Idempotent Billing Runs</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Atomic database transactions check unique subscription periods before generating renewal invoices. Zero
                duplicate charges guaranteed.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl space-y-4 hover:border-emerald-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Sequential GST Invoices</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Unique sequential numbering (INV-YYYY-XXXXXX), automatic 18% GST calculation, itemized line items, and
                PDF generation.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl space-y-4 hover:border-purple-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Strict Customer Isolation</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Multi-tenant architecture enforces that customers can only query and mutate their own subscriptions.
                Cross-tenant queries return HTTP 404.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl space-y-4 hover:border-cyan-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Overpayment Rejection</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Payments update balances atomically. Overpayments beyond the invoice balance are strictly rejected with
                HTTP 400.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl space-y-4 hover:border-amber-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Flexible Discount Engine</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Percentage and fixed coupons with start/expiry dates, maximum redemption limits, and minimum invoice
                subtotals.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl space-y-4 hover:border-indigo-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">MRR & ARR Analytics</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Real-time financial metrics calculating Monthly Recurring Revenue, Annualized Run Rate, churn rate, and
                monthly revenue trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Table Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Transparent Subscription Plans</h2>
            <p className="text-slate-400 text-sm md:text-base">
              Choose the right tier for your organization with instant activation and Net 15 billing.
            </p>

            {/* Monthly / Yearly Toggle */}
            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  billingCycle === "yearly"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold">
                  2 Months Free
                </span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {MOCK_PLANS.map((plan) => {
              const isGrowth = plan.tier === "growth";
              const price = billingCycle === "yearly" ? parseFloat(plan.price) * 10 : parseFloat(plan.price);

              return (
                <div
                  key={plan.id}
                  className={`glass-card rounded-2xl p-8 flex flex-col justify-between relative transition-all duration-300 ${
                    isGrowth ? "border-blue-500/50 shadow-2xl shadow-blue-500/20 ring-1 ring-blue-500/30" : ""
                  }`}
                >
                  {isGrowth && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      Most Popular
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-white">{formatINR(price)}</span>
                      <span className="text-xs text-slate-400 font-medium">/{billingCycle === "yearly" ? "yr" : "mo"}</span>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-800">
                      <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Features</div>
                      {plan.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    <Link
                      href="/register"
                      className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        isGrowth
                          ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                          : "bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800"
                      }`}
                    >
                      <span>Start 14-Day Free Trial</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Ownership Section */}
      <section id="team" className="py-20 border-t border-slate-900 bg-slate-950/60">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Built by Exactly Two Full-Stack Engineers</h2>
            <p className="text-slate-400 text-sm">
              One unified monorepo with strict module ownership, branch conventions, and automated CI pipelines.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 text-left">
            <div className="glass-card p-6 rounded-2xl border border-blue-500/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
                  M1 — Team Lead & Backend
                </span>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold">
                  apps/api
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Reshma Shaik</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Django 6 architecture, Postgres 17 database schema, idempotent billing engine, Argon2 authentication,
                REST APIs, and Render/Neon infrastructure.
              </p>
              <a
                href="https://github.com/Reshma-04sk"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold"
              >
                <span>github.com/Reshma-04sk</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-cyan-500/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                  M2 — Frontend Lead
                </span>
                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-bold">
                  apps/web
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Gayathri Devi G</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Next.js 16 App Router architecture, Tailwind CSS v4 design system, TanStack Query & Table, Recharts
                financial visualizations, and Three.js hero experience.
              </p>
              <a
                href="https://github.com/gaayathri-devi-07"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                <span>github.com/gaayathri-devi-07</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-900 text-center text-xs text-slate-400 space-y-2">
        <p>© 2026 PlanLedger • Brightloop Software Subscription Management System</p>
        <p className="text-slate-400">
          Powered by Django 6 • PostgreSQL 17 • Next.js 16 • Tailwind CSS v4 • WhiteNoise
        </p>
      </footer>
    </div>
  );
}
