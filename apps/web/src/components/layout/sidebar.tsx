"use client";

import { SquareLogo } from "@/components/square-logo";
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
  
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const PRIMARY_NAV = [
  { name: "Overview",      href: "/dashboard",     icon: LayoutDashboard },
  { name: "Subscriptions", href: "/subscriptions", icon: CreditCard },
  { name: "Customers",     href: "/customers",     icon: Users },
  { name: "Invoices",      href: "/invoices",      icon: FileText },
];

const SECONDARY_NAV = [
  { name: "Plans & Tiers", href: "/plans",         icon: Layers },
  { name: "Payments",      href: "/payments",      icon: Zap },
  { name: "Analytics",     href: "/analytics",     icon: BarChart3 },
  { name: "Settings",      href: "/settings",      icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 p-4 flex flex-col shrink-0 min-h-screen">
      {/* Floating Card Sidebar Container */}
      <div className="fintech-card flex-1 flex flex-col justify-between p-5">
        
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[var(--border-subtle)]">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-[#C4B5FD] text-black font-extrabold flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <SquareLogo size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-[var(--text-heading)] leading-none">
                  PlanLedger
                </span>
                <span className="text-[11px] font-semibold text-[var(--text-muted)] mt-1">
                  FinTech OS v2.4
                </span>
              </div>
            </Link>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#C4B5FD]/20 text-black dark:text-[#C4B5FD] border border-[#C4B5FD]/30">
              PG 17
            </span>
          </div>

          {/* Navigation Items */}
          <div className="mt-6 space-y-6">
            <div>
              <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Core Engine
              </div>
              <nav className="space-y-1">
                {PRIMARY_NAV.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-150 ${
                        isActive
                          ? "bg-black text-[#C4B5FD] dark:bg-[#C4B5FD] dark:text-black font-bold shadow-md scale-[1.01]"
                          : "text-[var(--text-secondary)] hover:bg-stone-200/60 dark:hover:bg-zinc-800/60 hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div>
              <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Operations
              </div>
              <nav className="space-y-1">
                {SECONDARY_NAV.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-150 ${
                        isActive
                          ? "bg-black text-[#C4B5FD] dark:bg-[#C4B5FD] dark:text-black font-bold shadow-md scale-[1.01]"
                          : "text-[var(--text-secondary)] hover:bg-stone-200/60 dark:hover:bg-zinc-800/60 hover:text-[var(--text-primary)]"
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
        </div>

        {/* Sidebar Footer Controls with Prominent Theme Toggle */}
        <div className="pt-6 border-t border-[var(--border-subtle)] space-y-4">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-1">
              Theme Mode
            </span>
            <ThemeToggle variant="pill" className="w-full justify-center" />
          </div>

          <div className="p-3 rounded-2xl bg-[var(--bg-elevated)] flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C4B5FD]" />
              Idempotent Engine
            </span>
            <span className="text-[10px] font-bold text-emerald-500">LIVE</span>
          </div>
        </div>

      </div>
    </aside>
  );
}
