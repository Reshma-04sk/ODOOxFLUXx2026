"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  FileText,
  Layers,
  Zap,
  BarChart3,
  Settings,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const PRIMARY_NAV = [
  { name: "OVERVIEW",      href: "/dashboard",     icon: LayoutDashboard },
  { name: "SUBSCRIPTIONS", href: "/subscriptions", icon: CreditCard },
  { name: "CUSTOMERS",     href: "/customers",     icon: Users },
  { name: "INVOICES",      href: "/invoices",      icon: FileText },
];

const SECONDARY_NAV = [
  { name: "PLANS & TIERS", href: "/plans",         icon: Layers },
  { name: "PAYMENTS",      href: "/payments",      icon: Zap },
  { name: "ANALYTICS",     href: "/analytics",     icon: BarChart3 },
  { name: "SETTINGS",      href: "/settings",      icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col shrink-0 min-h-screen">
      
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-[var(--border-subtle)] justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-7 h-7 border border-[var(--accent)] flex items-center justify-center bg-[var(--bg-base)]">
            <div className="w-3 h-3 bg-[var(--accent)]" />
          </div>
          <div className="flex flex-col">
            <span
              className="text-sm font-bold tracking-[0.16em] uppercase text-[var(--text-heading)] leading-none"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              PlanLedger
            </span>
            <span className="font-mono text-[9px] tracking-widest text-[var(--text-muted)] uppercase mt-0.5">
              TERMINAL V2.4
            </span>
          </div>
        </Link>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Online" />
      </div>

      {/* Terminal Mode Indicator */}
      <div className="px-6 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] flex items-center justify-between font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase">
        <span className="flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-[var(--accent)]" />
          MODE: LEDGER
        </span>
        <span className="text-[var(--text-secondary)]">POSTGRES 17</span>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 py-4 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6 px-3">
          {/* Core Modules */}
          <div>
            <div className="px-3 pb-2 font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--text-muted)]">
              CORE PROTOCOLS
            </div>
            <nav className="space-y-1">
              {PRIMARY_NAV.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 font-mono text-xs uppercase tracking-wider border ${
                      isActive
                        ? "bg-[var(--text-primary)] text-[var(--bg-base)] border-[var(--text-primary)] font-bold shadow-sm"
                        : "border-transparent text-[var(--text-secondary)] terminal-link-hover"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Extended Operations */}
          <div>
            <div className="px-3 pb-2 font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--text-muted)]">
              OPERATIONS
            </div>
            <nav className="space-y-1">
              {SECONDARY_NAV.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 font-mono text-xs uppercase tracking-wider border ${
                      isActive
                        ? "bg-[var(--text-primary)] text-[var(--bg-base)] border-[var(--text-primary)] font-bold shadow-sm"
                        : "border-transparent text-[var(--text-secondary)] terminal-link-hover"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer Controls & Theme Toggle */}
        <div className="p-4 border-t border-[var(--border-subtle)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
              THEME SELECT
            </span>
            <ThemeToggle compact={false} className="w-full" />
          </div>

          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between font-mono text-[10px] text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              IDEMPOTENT
            </span>
            <span>ENV: PROD</span>
          </div>
        </div>

      </div>
    </aside>
  );
}
