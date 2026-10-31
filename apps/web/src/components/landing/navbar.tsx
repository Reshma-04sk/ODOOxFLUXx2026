"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS = [
  { label: "METRICS",      href: "#metrics" },
  { label: "PIPELINE",     href: "#simulator" },
  { label: "ARCHITECTURE", href: "#architecture" },
  { label: "TEAM",         href: "#team" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg-base)]/90 backdrop-blur-md border-b border-[var(--border-subtle)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-8 h-16 flex items-center justify-between">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 border border-[var(--accent)] flex items-center justify-center relative">
            <div className="w-3.5 h-3.5 bg-[var(--accent)]" />
          </div>
          <span
            className="text-base font-bold tracking-[0.16em] uppercase text-[var(--text-heading)]"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            PlanLedger
          </span>
        </Link>

        {/* Nav links - Typography requirement: text-sm uppercase tracking-widest font-mono */}
        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-link text-sm uppercase tracking-widest font-mono font-medium"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA & Theme Controls */}
        <div className="flex items-center gap-4">
          <span
            className="hidden lg:block text-xs uppercase tracking-widest font-mono text-[var(--text-muted)]"
          >
            ODOO HX 2026
          </span>

          <ThemeToggle compact />

          <Link
            href="/dashboard"
            className="px-5 py-2 border border-[var(--accent)] bg-transparent text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg-base)] transition-all duration-150 text-xs tracking-widest uppercase font-mono font-bold"
          >
            Terminal
          </Link>
        </div>
      </div>
    </header>
  );
}
