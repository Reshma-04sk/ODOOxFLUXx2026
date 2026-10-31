"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Layers,
  FileText,
  BadgePercent,
  BarChart3,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Subscriptions", href: "/dashboard/subscriptions", icon: CreditCard },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  { name: "Plans & Pricing", href: "/dashboard/plans", icon: Layers },
  { name: "Invoices", href: "/dashboard/invoices", icon: FileText },
  { name: "Payments", href: "/dashboard/payments", icon: Zap },
  { name: "Coupons & Discounts", href: "/dashboard/discounts", icon: BadgePercent },
  { name: "Revenue Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/70 backdrop-blur-xl flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-base text-slate-100 tracking-tight flex items-center gap-1.5">
            PlanLedger
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
              v1.0
            </span>
          </span>
          <span className="text-xs text-slate-400 font-medium">Brightloop SaaS Engine</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Subscription Management
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200"
                )}
              />
              <span>{item.name}</span>
              {isActive && (
                <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Team Badge Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
        <div className="rounded-xl p-3 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Team Owners</div>
          <div className="text-slate-200 font-medium flex items-center justify-between">
            <span>M1: Reshma Shaik</span>
            <span className="text-[10px] text-emerald-400 font-semibold">Backend</span>
          </div>
          <div className="text-slate-200 font-medium flex items-center justify-between">
            <span>M2: Gayathri Devi G</span>
            <span className="text-[10px] text-cyan-400 font-semibold">Frontend</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
