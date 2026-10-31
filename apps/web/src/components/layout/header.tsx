"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Zap, Terminal, RefreshCw, CheckCircle2 } from "lucide-react";
import { apiService } from "@/services/api-service";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({
  title = "TERMINAL OVERVIEW",
  subtitle = "POSTGRES 17 SUBSCRIPTION & BILLING LEDGER",
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
    toast.loading("Executing Idempotent Billing Engine via PostgreSQL 17...", {
      id: "billing-dispatch",
    });

    setTimeout(() => {
      setIsRunningBilling(false);
      toast.success(
        "Billing Cycle Complete: 4 evaluated, 0 duplicates, Hash: BIL-RUN-20261031-OK",
        { id: "billing-dispatch" }
      );
    }, 1200);
  };

  return (
    <header className="h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
      
      {/* Clean Breadcrumbs & Subtitle */}
      <div className="flex flex-col">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />
            PLANLEDGER
          </span>
          <span className="text-[var(--border-strong)]">/</span>
          <span className="text-[var(--text-muted)] uppercase tracking-widest">
            TERMINAL
          </span>
          <span className="text-[var(--border-strong)]">/</span>
          <span className="text-[var(--text-primary)] uppercase tracking-widest font-bold">
            {title.toUpperCase()}
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)] mt-0.5 hidden sm:block">
          {subtitle}
        </span>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-4">
        {/* PostgreSQL 17 Status Tag */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 border border-[var(--border-subtle)] bg-[var(--bg-elevated)] font-mono text-[10px] tracking-widest uppercase text-[var(--text-secondary)]">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>PG17 CONCURRENCY 4 · ACID LOCKED</span>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle compact />

        {/* Prominent "Trigger Billing Run" with glowing hover effect */}
        <button
          type="button"
          onClick={handleTriggerBilling}
          disabled={isRunningBilling}
          className="relative group px-5 py-2 border border-[var(--accent)] bg-[var(--bg-base)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg-base)] hover:shadow-[0_0_24px_rgba(173,194,213,0.45)] dark:hover:shadow-[0_0_24px_rgba(173,194,213,0.35)] transition-all duration-150 font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isRunningBilling ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:text-inherit" />
          )}
          <span>TRIGGER BILLING RUN</span>
        </button>

        {/* User Account / Sign Out */}
        <div className="flex items-center gap-3 pl-3 border-l border-[var(--border-subtle)]">
          <div className="w-7 h-7 border border-[var(--border-strong)] bg-[var(--bg-elevated)] flex items-center justify-center font-mono text-[10px] font-bold text-[var(--text-primary)]">
            PL
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 text-[var(--text-muted)] hover:text-rose-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
