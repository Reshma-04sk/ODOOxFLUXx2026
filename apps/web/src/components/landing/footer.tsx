"use client";

import React from "react";

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
    <footer className="relative bg-[var(--bg-base)] border-t border-[var(--border-subtle)]">
      <div className="absolute inset-0 arch-grid-fine opacity-10 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-8 relative z-10">

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-[var(--border-subtle)] py-12 gap-10 md:gap-0">

          {/* Brand */}
          <div className="md:border-r border-[var(--border-subtle)] md:pr-10 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 border border-[var(--text-heading)] flex items-center justify-center">
                <div className="w-3 h-3 bg-[var(--text-heading)]" />
              </div>
              <span
                className="text-sm font-bold tracking-[0.18em] uppercase text-[var(--text-heading)]"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                PlanLedger
              </span>
            </div>
            <p
              className="text-xs text-[var(--text-muted)] leading-relaxed max-w-[240px]"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Enterprise SaaS subscription engine and double-entry financial ledger. Built for the Odoo Hackathon 2026.
            </p>
            <div
              className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              <div className="w-1.5 h-1.5 bg-[var(--text-heading)] rounded-full animate-pulse" />
              NEON POSTGRESQL 17 — PRODUCTION READY
            </div>
          </div>

          {/* Nav links */}
          <div className="md:px-10 md:border-r border-[var(--border-subtle)]">
            <div
              className="mono-label text-[var(--border-strong)] mb-5"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              PLATFORM MODULES
            </div>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[10px] tracking-[0.12em] text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-colors duration-200"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Team links */}
          <div className="md:pl-10">
            <div
              className="mono-label text-[var(--border-strong)] mb-5"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              TEAM OWNERSHIP
            </div>
            <div className="flex flex-col gap-3">
              <a
                href="https://github.com/Reshma-04sk"
                target="_blank"
                rel="noreferrer"
                className="p-4 border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-colors group"
              >
                <div
                  className="text-[10px] font-bold text-[var(--text-heading)] group-hover:text-[var(--text-primary)] tracking-[0.12em] mb-0.5"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  RESHMA SHAIK ↗
                </div>
                <div
                  className="text-[9px] text-[var(--text-muted)] tracking-[0.1em]"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  M1 — TEAM LEAD & BACKEND
                </div>
              </a>
              <a
                href="https://github.com/gaayathri-devi-07"
                target="_blank"
                rel="noreferrer"
                className="p-4 border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-colors group"
              >
                <div
                  className="text-[10px] font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-heading)] tracking-[0.12em] mb-0.5"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  GAYATHRI DEVI G ↗
                </div>
                <div
                  className="text-[9px] text-[var(--text-muted)] tracking-[0.1em]"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  M2 — FRONTEND LEAD & UX
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[9px] text-[var(--border-strong)]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          <span className="tracking-[0.12em]">
            © 2026 PLANLEDGER. NEXT.JS 16 / DJANGO 6 / POSTGRESQL 17 / TAILWIND CSS V4.
          </span>
          <div className="flex items-center gap-6">
            <span>ODOO HACKATHON 2026</span>
            <div className="w-px h-3 bg-[var(--border-subtle)]" />
            <span className="text-[var(--text-muted)]">100% IDEMPOTENT BILLING</span>
          </div>
        </div>
      </div>
    </footer>
  );
}