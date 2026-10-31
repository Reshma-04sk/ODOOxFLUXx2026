"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, ExternalLink, GitFork, CheckCircle2 } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MEMBERS = [
  {
    role: "M1",
    tag: "TEAM LEAD / BACKEND ARCHITECT",
    name: "Reshma Shaik",
    github: "Reshma-04sk",
    scope: "apps/api",
    summary:
      "Repository governance, Django 6 backend architecture, PostgreSQL 17 database guarantees, partial unique indexes, idempotent billing engine, and cloud infrastructure deployment.",
    deliverables: [
      "PostgreSQL 17 constraints, sequences & ERD schema",
      "Atomic invoice generation & due billing scheduler",
      "Argon2id auth, session security & BOLA protection",
      "OpenAPI 3.1 schema endpoint (/api/schema/)",
    ],
  },
  {
    role: "M2",
    tag: "FRONTEND LEAD / UX ENGINEER",
    name: "Gayathri Devi G",
    github: "gaayathri-devi-07",
    scope: "apps/web",
    summary:
      "Next.js 16 App Router architecture, luxury financial design system, GSAP & Lenis smooth scrolling, customer portal, data tables, and API integration.",
    deliverables: [
      "Architectural design system & landing page",
      "State machine simulator & snapshot calculation UI",
      "TanStack Query & same-origin /api rewrite integration",
      "Customer portal, billing management & analytics dashboards",
    ],
  },
];

export function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".team-card",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="team"
      className="relative py-24 bg-[var(--bg-base)] border-t border-[var(--border-subtle)]"
    >
      <div className="absolute inset-0 arch-grid-bg opacity-30 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-bold text-[#A78BFA] uppercase tracking-wider mb-4 shadow-sm">
              <Users className="w-3.5 h-3.5" />
              <span>Two-Member Core Engineering</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-heading)]">
              Built by Specialized Leads
            </h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-md font-medium leading-relaxed">
            Engineered exclusively for the Odoo Hackathon 2026. Monorepo architecture with clean separation of backend database guarantees and frontend user experience.
          </p>
        </div>

        {/* Team Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {MEMBERS.map((m) => (
            <div
              key={m.role}
              className="team-card fintech-card p-8 flex flex-col justify-between"
            >
              <div>
                {/* Role Header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-extrabold tracking-wider px-3 py-1 rounded-full bg-[#C4B5FD]/20 text-[#000000] dark:text-[#C4B5FD] border border-[#C4B5FD]/30">
                    {m.role} &middot; {m.tag}
                  </span>
                  <span className="text-xs font-hash font-bold text-[var(--text-muted)] bg-[var(--bg-elevated)] px-2.5 py-1 rounded-lg border border-[var(--border-subtle)]">
                    {m.scope}
                  </span>
                </div>

                {/* Name & GitHub */}
                <div className="mb-6">
                  <h3 className="text-2xl font-extrabold text-[var(--text-heading)] tracking-tight mb-2">
                    {m.name}
                  </h3>
                  <a
                    href={`https://github.com/${m.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-hash font-semibold text-[#7C3AED] dark:text-[#A78BFA] hover:underline"
                  >
                    <span>github.com/{m.github}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Summary */}
                <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed border-t border-[var(--border-subtle)] pt-4 mb-6">
                  {m.summary}
                </p>

                {/* Deliverables */}
                <div className="border-t border-[var(--border-subtle)] pt-4">
                  <div className="text-[11px] font-bold font-hash uppercase tracking-wider text-[var(--text-muted)] mb-3">
                    Key Deliverables
                  </div>
                  <ul className="space-y-2.5">
                    {m.deliverables.map((d, di) => (
                      <li key={di} className="flex items-start gap-2.5 text-xs text-[var(--text-primary)] font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-hash text-[var(--text-muted)]">
                <span>Odoo Hackathon 2026</span>
                <span className="text-emerald-500 font-bold">100% Monorepo Ready</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}