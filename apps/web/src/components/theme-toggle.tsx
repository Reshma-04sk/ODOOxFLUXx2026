"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const emptySubscribe = () => () => {};

export function ThemeToggle({
  className = "",
  variant = "pill",
}: {
  className?: string;
  variant?: "pill" | "icon";
}) {
  const { setTheme, resolvedTheme } = useTheme();

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div
        className={`h-10 w-28 bg-stone-200 dark:bg-zinc-800 rounded-full animate-pulse ${className}`}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`p-2.5 rounded-full border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-stone-800 dark:text-zinc-200 hover:scale-105 transition-all shadow-sm cursor-pointer ${className}`}
        title={`Switch to ${isDark ? "Light (Creme)" : "Dark (Pitch Black)"} theme`}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-[#C4B5FD]" />
        ) : (
          <Moon className="w-4 h-4 text-stone-900" />
        )}
      </button>
    );
  }

  // Prominent FinTech Dual-Pill Switch (Creme vs Black)
  return (
    <div
      className={`inline-flex items-center p-1 rounded-full border border-stone-300 dark:border-zinc-800 bg-stone-200/80 dark:bg-zinc-900/90 shadow-sm transition-colors duration-200 ${className}`}
      role="group"
      aria-label="Theme selection"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
          !isDark
            ? "bg-white text-black shadow-md font-bold scale-[1.02]"
            : "text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white"
        }`}
      >
        <Sun className={`w-3.5 h-3.5 ${!isDark ? "text-amber-500 fill-amber-500" : ""}`} />
        <span>Creme</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
          isDark
            ? "bg-black text-[#C4B5FD] shadow-md font-bold scale-[1.02]"
            : "text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white"
        }`}
      >
        <Moon className={`w-3.5 h-3.5 ${isDark ? "text-[#C4B5FD] fill-[#C4B5FD]" : ""}`} />
        <span>Black</span>
      </button>
    </div>
  );
}
