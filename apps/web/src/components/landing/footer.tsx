"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { SquareLogo } from "@/components/square-logo";
import { ThemeToggle } from "@/components/theme-toggle";

const FOOTER_LINKS = [
  { label: "STATE MACHINE", href: "#simulator" },
  { label: "DB GUARANTEES", href: "#bento" },
  { label: "METRICS",       href: "#metrics" },
  { label: "ARCHITECTURE",  href: "#architecture" },
  { label: "TEAM",          href: "#team" },
  { label: "PRICING",       href: "#pricing" },
];

export function Footer() {
  return (
    <footer className="relative bg-[var(--bg-surface)] border-t border-[var(--border-subtle)]">
      <div className="absolute inset-0 arch-grid-fine opacity-10 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-[var(--border-subtle)] py-12 gap-10">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#C4B5FD] text-black flex items-center justify-center font-extrabold shadow-sm">
                <SquareLogo size={18} />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[var(--text-heading)]">
                PlanLedger
              </span>
            </Link>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-[280px]">
              Enterprise SaaS subscription engine and double-entry financial ledger. Built for the Odoo Hackathon 2026.
            </p>

            <div className="flex items-center gap-2 text-xs font-hash text-[var(--text-muted)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>POSTGRESQL 17 &middot; PRODUCTION READY</span>
            </div>

            <div className="pt-2">
              <ThemeToggle variant="pill" />
            </div>
          </div>

          {/* Nav links */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] font-hash">
              Platform Modules
            </div>
            <ul className="grid grid-cols-2 gap-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Team links */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] font-hash">
              Engineering Governance
            </div>
            <div className="flex flex-col gap-3">
              <a
                href="https://github.com/Reshma-04sk"
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:border-[#C4B5FD] transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-extrabold text-[var(--text-heading)] mb-0.5">
                    Reshma Shaik
                  </div>
                  <div className="text-[10px] font-hash text-[var(--text-muted)]">
                    M1 &middot; Team Lead &amp; Backend
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[#C4B5FD] transition-colors" />
              </a>

              <a
                href="https://github.com/gaayathri-devi-07"
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:border-[#A78BFA] transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-extrabold text-[var(--text-heading)] mb-0.5">
                    Gayathri Devi G
                  </div>
                  <div className="text-[10px] font-hash text-[var(--text-muted)]">
                    M2 &middot; Frontend Lead &amp; UX
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[#A78BFA] transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-hash text-[var(--text-muted)]">
          <span>&copy; 2026 PlanLedger. Next.js 16 / Django 6 / PostgreSQL 17 / Tailwind CSS v4.</span>
          <div className="flex items-center gap-4">
            <span>ODDO HACKATHON 2026</span>
            <span>&middot;</span>
            <span className="text-emerald-500 font-bold">100% IDEMPOTENT BILLING</span>
          </div>
        </div>

      </div>
    </footer>
  );
}