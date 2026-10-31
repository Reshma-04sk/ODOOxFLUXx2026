"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";

/* --- SVG Topographic Pattern -------------------------------- */
function TopoLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.08]">
      <svg
        viewBox="0 0 1440 900"
        className="absolute inset-0 w-full h-full topo-animate"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <style>{`.tl{fill:none;stroke:currentColor;stroke-width:1;}`}</style>
        </defs>
        <ellipse className="tl text-[var(--accent)]" cx="720" cy="450" rx="680" ry="390" />
        <ellipse className="tl text-[var(--accent)]" cx="720" cy="450" rx="580" ry="320" />
        <ellipse className="tl text-[var(--accent)]" cx="720" cy="450" rx="480" ry="255" />
        <ellipse className="tl text-[var(--accent)]" cx="720" cy="450" rx="380" ry="195" />
        <ellipse className="tl text-[var(--accent)]" cx="720" cy="450" rx="290" ry="145" />
        <ellipse className="tl text-[var(--accent)]" cx="720" cy="450" rx="205" ry="100" />
        <ellipse className="tl text-[var(--accent)]" cx="720" cy="450" rx="128" ry="62" />
        <ellipse className="tl text-[var(--accent)]" cx="720" cy="450" rx="62"  ry="30" />
        <ellipse className="tl text-[var(--accent)]" cx="160"  cy="200" rx="340" ry="200" />
        <ellipse className="tl text-[var(--accent)]" cx="160"  cy="200" rx="240" ry="140" />
        <ellipse className="tl text-[var(--accent)]" cx="160"  cy="200" rx="140" ry="82"  />
        <ellipse className="tl text-[var(--accent)]" cx="1300" cy="780" rx="320" ry="190" />
        <ellipse className="tl text-[var(--accent)]" cx="1300" cy="780" rx="210" ry="122" />
        <path className="tl text-[var(--accent)]" d="M0,400 Q360,280 720,420 T1440,380" />
        <path className="tl text-[var(--accent)]" d="M0,500 Q360,360 720,510 T1440,460" />
        <path className="tl text-[var(--accent)]" d="M0,580 Q360,430 720,590 T1440,540" />
      </svg>
    </div>
  );
}

/* --- Hero Section -------------------------------------------- */
export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef   = useRef<HTMLSpanElement[]>([]);

  const addWord = (el: HTMLSpanElement | null, i: number) => {
    if (el) wordsRef.current[i] = el;
  };

  const LINES = ["ENGINEERED", "FOR ABSOLUTE", "PRECISION."];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(wordsRef.current, {
        y: 0,
        duration: 1.0,
        ease: "power4.out",
        stagger: 0.1,
        delay: 0.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[92vh] flex flex-col justify-center arch-grid-bg overflow-hidden border-b border-[var(--border-subtle)]"
    >
      <TopoLines />

      {/* Structural horizontal guidelines */}
      <div className="absolute top-16 left-0 right-0 h-px bg-[var(--border-subtle)] z-[2]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--border-subtle)] z-[2]" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-8 pt-32 pb-24 w-full">

        {/* Eyebrow - Requirement: text-sm uppercase tracking-widest font-mono */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-8 h-px bg-[var(--accent)]" />
          <span className="text-sm uppercase tracking-widest font-mono font-semibold text-[var(--text-secondary)]">
            ODOO HACKATHON 2026 · FINANCIAL LEDGER & SUBSCRIPTION ENGINE
          </span>
          <div className="flex-1 h-px bg-[var(--border-subtle)]" />
          <div className="w-2.5 h-2.5 border border-[var(--text-muted)] rotate-45" />
        </div>

        {/* Main Hero Header - Scaled down to balanced text-5xl md:text-7xl */}
        <h1
          className="display-text text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-8"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
          aria-label="Engineered for Absolute Precision"
        >
          {LINES.map((line, li) => (
            <span key={li} className="block">
              {line.split(" ").map((word, wi) => {
                const idx = li * 3 + wi;
                return (
                  <span key={wi} className="word-mask mr-[0.22em]">
                    <span
                      ref={(el) => addWord(el, idx)}
                      className="word-inner text-[var(--text-heading)]"
                    >
                      {word}
                    </span>
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        {/* Subtitle & Value Proposition */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12 border-t border-[var(--border-subtle)] pt-8">
          <div className="md:col-span-7">
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-sans">
              PlanLedger is an architectural financial operations engine. Designed for mission-critical subscription lifecycles with PostgreSQL 17 atomic transaction guarantees, deterministic state machine enforcement, and 0% invoice leakage.
            </p>
          </div>

          <div className="md:col-span-5 flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4 sm:items-center md:items-start lg:items-center justify-end">
            <Link
              href="/dashboard"
              className="px-8 py-3.5 bg-[var(--accent)] text-[var(--bg-base)] font-bold text-xs uppercase tracking-widest font-mono hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <span>Access Terminal</span>
              <span>→</span>
            </Link>

            <a
              href="#simulator"
              className="px-6 py-3.5 border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent)] font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center"
            >
              View Pipeline
            </a>
          </div>
        </div>

        {/* Structural Metadata Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="p-4 border-r border-b sm:border-b-0 border-[var(--border-subtle)]">
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">
              ENGINE ID
            </div>
            <div className="font-mono text-sm font-bold text-[var(--text-primary)]">
              PL-PG17-ACID
            </div>
          </div>
          <div className="p-4 sm:border-r border-b sm:border-b-0 border-[var(--border-subtle)]">
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">
              CONCURRENCY
            </div>
            <div className="font-mono text-sm font-bold text-[var(--text-primary)]">
              ISOLATION LEVEL 4
            </div>
          </div>
          <div className="p-4 border-r border-[var(--border-subtle)]">
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">
              STATE MACHINE
            </div>
            <div className="font-mono text-sm font-bold text-[var(--text-primary)]">
              FINITE & STRICT
            </div>
          </div>
          <div className="p-4">
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">
              PIPELINE RUNNER
            </div>
            <div className="font-mono text-sm font-bold text-[var(--text-primary)]">
              IDEMPOTENT CRON
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
