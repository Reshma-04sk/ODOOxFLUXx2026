"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MEMBERS = [
  {
    role: "M1",
    tag: "TEAM LEAD / BACKEND",
    name: "Reshma Shaik",
    github: "Reshma-04sk",
    scope: "apps/api",
    color: "var(--text-heading)",
    summary:
      "Repository governance, Django 6 backend architecture, PostgreSQL 17 database guarantees, partial unique indexes, idempotent billing engine, and cloud infrastructure deployment.",
    deliverables: [
      "PostgreSQL 17 constraints, sequences & ERD model",
      "Atomic invoice generation & due billing scheduler",
      "Argon2id auth, session security & BOLA protection",
      "OpenAPI 3.1 schema endpoint — /api/schema/",
    ],
  },
  {
    role: "M2",
    tag: "FRONTEND LEAD / UX",
    name: "Gayathri Devi G",
    github: "gaayathri-devi-07",
    scope: "apps/web",
    color: "var(--text-secondary)",
    summary:
      "Next.js 16 App Router architecture, luxury financial design system, GSAP & Lenis smooth momentum scrolling, customer portal, data tables, and API integration.",
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
      className="relative bg-[var(--bg-base)] border-t border-[var(--border-subtle)]"
    >
      <div className="absolute inset-0 arch-grid-bg opacity-30 pointer-events-none" />

      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-8 py-10 border-b border-[var(--border-subtle)] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4" style={{ fontFamily: "var(--font-space-mono)" }}>
          <div className="w-2 h-2 border border-[var(--text-muted)] rotate-45" />
          <span className="mono-label text-[var(--text-muted)]">TWO-MEMBER MONOREPO DELIVERY</span>
        </div>
        <span className="mono-label hidden md:block" style={{ fontFamily: "var(--font-space-mono)" }}>
          ODOO HX 2026 / TEAM
        </span>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-16 relative z-10">
        <h2
          className="text-4xl sm:text-5xl font-bold tracking-[-0.04em] text-[var(--text-heading)] leading-none mb-12"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          BUILT BY TWO<br />SPECIALIZED LEADS
        </h2>

        <div className="grid md:grid-cols-2 gap-0 border border-[var(--border-subtle)]">
          {MEMBERS.map((m, i) => (
            <div
              key={m.role}
              className={`team-card opacity-0 p-8 flex flex-col gap-6 ${
                i === 0 ? "border-b md:border-b-0 md:border-r border-[var(--border-subtle)]" : ""
              }`}
            >
              {/* Role header */}
              <div className="flex items-center justify-between" style={{ fontFamily: "var(--font-space-mono)" }}>
                <span
                  className="mono-label border border-[var(--border-subtle)] px-3 py-1"
                  style={{ color: m.color }}
                >
                  {m.role} — {m.tag}
                </span>
                <span className="mono-label text-[var(--border-strong)]">{m.scope}</span>
              </div>

              {/* Name */}
              <div>
                <h3
                  className="text-2xl font-bold tracking-[-0.02em] mb-1"
                  style={{ fontFamily: "var(--font-space-grotesk)", color: m.color }}
                >
                  {m.name}
                </h3>
                <a
                  href={`https://github.com/${m.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] tracking-[0.15em] text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-colors"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  GITHUB / {m.github.toUpperCase()} ↗
                </a>
              </div>

              {/* Summary */}
              <p
                className="text-[var(--text-secondary)] text-xs leading-relaxed border-t border-[var(--border-subtle)] pt-4"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {m.summary}
              </p>

              {/* Deliverables */}
              <div className="border-t border-[var(--border-subtle)] pt-4">
                <div
                  className="mono-label text-[var(--border-strong)] mb-3"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  KEY DELIVERABLES
                </div>
                <ul className="space-y-2">
                  {m.deliverables.map((d, di) => (
                    <li
                      key={di}
                      className="flex items-start gap-3 text-[11px] text-[var(--text-secondary)]"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      <span
                        className="shrink-0 text-[9px] text-[var(--text-muted)] mt-0.5"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                      >
                        {String(di + 1).padStart(2, "0")}
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}