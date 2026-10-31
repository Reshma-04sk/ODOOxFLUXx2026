"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const emptySubscribe = () => () => {};

export function ThemeToggle({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { setTheme, resolvedTheme } = useTheme();
  
  // Official React 19 pattern to detect client hydration without cascading effect renders
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div
        className={`h-8 w-8 border border-[var(--border-subtle)] bg-[var(--bg-surface)] ${className}`}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`group flex items-center justify-center gap-2 px-3 py-1.5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors duration-150 font-mono text-xs uppercase tracking-wider cursor-pointer ${className}`}
      title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
      aria-label="Toggle light or dark theme"
    >
      {isDark ? (
        <Sun className="w-3.5 h-3.5 text-amber-300 transition-transform duration-200 group-hover:rotate-45" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-slate-800 transition-transform duration-200 group-hover:-rotate-12" />
      )}
      {!compact && (
        <span className="font-mono text-[11px] tracking-widest uppercase font-semibold">
          {isDark ? "LIGHT" : "DARK"}
        </span>
      )}
    </button>
  );
}
