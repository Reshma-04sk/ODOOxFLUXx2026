"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowUpRight } from "lucide-react";
import { useAuthModal } from "@/components/auth-modal-context";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const { openAuthModal } = useAuthModal();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headlineRef.current, {
        y: 30,
        opacity: 0,
        duration: 1.0,
        ease: "power3.out",
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
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-8 pt-32 pb-24 w-full">

        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)] shadow-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-[#C4B5FD] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Odoo Hackathon 2026 &middot; Subscription &amp; Billing Platform
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#C4B5FD]/20 text-[#6D28D9] dark:text-[#C4B5FD]">
            PG 17 ACID
          </span>
        </div>

        {/* Big Bold Headline in Lavender / Pastel Purple */}
        <h1
          ref={headlineRef}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.08] tracking-tight text-[var(--text-heading)] mb-8 max-w-5xl"
        >
          Engineered for <span className="text-[#A78BFA] dark:text-[#C4B5FD]">Absolute Precision</span> in Financial Operations.
        </h1>

        {/* Value Proposition */}
        <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed max-w-3xl mb-10 font-medium">
          PlanLedger is an architectural subscription operations engine designed for mission-critical financial lifecycles. Powered by PostgreSQL 17 transaction guarantees, deterministic state machine enforcement, and 0% invoice drift.
        </p>

        {/* Action Buttons: Clicking asks login/signup via modal */}
        <div className="flex flex-wrap items-center gap-4 mb-16">
          <button
            onClick={() => openAuthModal("login")}
            className="btn-neon px-8 py-4 text-sm uppercase tracking-wider font-bold shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <span>Launch Dashboard</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <a
            href="#simulator"
            className="px-8 py-4 rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[#C4B5FD] font-bold text-sm tracking-wide transition-all shadow-sm"
          >
            View State Machine
          </a>
        </div>

        {/* Floating Telemetry Stats Card */}
        <div className="fintech-card p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Transaction Engine
            </div>
            <div className="text-xl font-extrabold text-[var(--text-primary)]">
              PostgreSQL 17
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Concurrency Lock
            </div>
            <div className="text-xl font-extrabold text-[var(--text-primary)]">
              Serializable
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Invoice Leakage
            </div>
            <div className="text-xl font-extrabold text-emerald-500">
              0.00% Drift
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Billing Runner
            </div>
            <div className="text-xl font-extrabold text-[#6D28D9] dark:text-[#C4B5FD]">
              Idempotent Cron
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}