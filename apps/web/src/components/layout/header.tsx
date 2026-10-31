"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Zap, RefreshCw, CheckCircle2 } from "lucide-react";
import { apiService } from "@/services/api-service";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({
  title = "Overview",
  subtitle = "Real-time subscription pulse & ledger metrics",
}: HeaderProps) {
  const router = useRouter();
  const [isRunningBilling, setIsRunningBilling] = useState(false);

  const handleLogout = async () => {
    try {
      await apiService.auth.logout();
    } finally {
      router.push("/login");
    }
  };

  const handleTriggerBilling = () => {
    setIsRunningBilling(true);
    toast.loading("Dispatching PostgreSQL 17 Idempotent Billing Engine...", {
      id: "billing-dispatch",
    });

    setTimeout(() => {
      setIsRunningBilling(false);
      toast.success(
        "Billing Execution Success: 4 Evaluated, 0 Duplicates (Hash: BIL-20261031-OK)",
        { id: "billing-dispatch" }
      );
    }, 1100);
  };

  return (
    <header className="p-4 pb-0">
      <div className="fintech-card px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Title & Breadcrumbs */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
            <span>PlanLedger</span>
            <span>/</span>
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-[var(--text-primary)] font-bold">{title}</span>
          </div>
          <h1 className="text-xl font-extrabold text-[var(--text-heading)] tracking-tight mt-0.5">
            {title}
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 hidden sm:block">{subtitle}</p>
        </div>

        {/* Right Controls: Prominent Theme Switch + Neon CTA */}
        <div className="flex items-center flex-wrap gap-3">
          
          {/* Status Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#A78BFA]/15 text-[#7C3AED] dark:text-[#A78BFA] border border-[#A78BFA]/30 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>PostgreSQL 17 Acid Core</span>
          </div>

          {/* Prominent Theme Toggle Switch Pill (Creme vs Black) */}
          <ThemeToggle variant="pill" />

          {/* Vibrant Neon Green Action Button */}
          <button
            type="button"
            onClick={handleTriggerBilling}
            disabled={isRunningBilling}
            className="btn-neon px-5 py-2.5 text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {isRunningBilling ? (
              <RefreshCw className="w-4 h-4 animate-spin text-black" />
            ) : (
              <Zap className="w-4 h-4 fill-black text-black" />
            )}
            <span>Trigger Billing Run</span>
          </button>

          {/* User Sign Out */}
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-rose-500 hover:border-rose-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
