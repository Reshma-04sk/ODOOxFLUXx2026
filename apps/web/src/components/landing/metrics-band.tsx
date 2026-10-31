"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Metric {
  id: string;
  label: string;
  sublabel: string;
  value: string;
  numericTarget: number;
  prefix: string;
  suffix: string;
  decimals: number;
  detail: string;
  tag: string;
}

const METRICS: Metric[] = [
  {
    id: "mrr",
    label: "TRACKED MRR / ARR",
    sublabel: "LIVE LEDGER",
    value: "12.4",
    numericTarget: 12.4,
    prefix: "$",
    suffix: "M+",
    decimals: 1,
    detail: "Normalized across monthly, annual / 12, and weekly * 52/12 cadences",
    tag: "FINANCIAL",
  },
  {
    id: "leakage",
    label: "REVENUE LEAKAGE",
    sublabel: "ZERO DRIFT",
    value: "0",
    numericTarget: 0,
    prefix: "",
    suffix: "%",
    decimals: 0,
    detail: "Immutable line-item price & tax snapshot preserved at invoice time",
    tag: "INTEGRITY",
  },
  {
    id: "idempotency",
    label: "IDEMPOTENT BILLING RUNS",
    sublabel: "GUARANTEED",
    value: "100",
    numericTarget: 100,
    prefix: "",
    suffix: "%",
    decimals: 0,
    detail: "uq_invoice_subscription_period partial unique index prevents duplicate runs",
    tag: "ATOMICITY",
  },
  {
    id: "benchmark",
    label: "SEED QUERY BENCHMARK",
    sublabel: "POSTGRES 17",
    value: "<1.42",
    numericTarget: 1.42,
    prefix: "<",
    suffix: "s",
    decimals: 2,
    detail: "Measured on 5,000 subscriptions & 20,000 invoice lines with indexes",
    tag: "PERFORMANCE",
  },
];

function CounterValue({ metric, triggered }: { metric: Metric; triggered: boolean }) {
  const [display, setDisplay] = useState(metric.decimals === 0 ? "0" : "0.0");
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!triggered) return;
    const start = performance.now();
    const duration = 1600;
    const target = metric.numericTarget;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = target * ease;
      setDisplay(current.toFixed(metric.decimals));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [triggered, metric]);

  return <>{metric.prefix}{display}{metric.suffix}</>;
}

export function MetricsBand() {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        onEnter: () => setTriggered(true),
        once: true,
      });

      gsap.fromTo(
        sectionRef.current!.querySelectorAll(".metric-card"),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
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
      id="metrics"
      className="relative bg-[var(--bg-surface)] border-y border-[var(--border-subtle)]"
    >
      {/* Fine grid overlay */}
      <div className="absolute inset-0 arch-grid-fine opacity-20 pointer-events-none" />

      {/* Section header */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8 border-b border-[var(--border-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#C4B5FD]" />
          <span className="text-xs font-bold tracking-widest uppercase text-[var(--text-secondary)]">
            FINANCIAL PERFORMANCE TELEMETRY
          </span>
        </div>
        <span className="text-xs font-hash text-[var(--text-muted)] hidden md:block">
          POSTGRESQL 17 &middot; ACID ASSURANCE
        </span>
      </div>

      {/* Metrics grid */}
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((metric, i) => (
            <div
              key={metric.id}
              className={`metric-card p-8 flex flex-col justify-between min-h-[260px] border-b sm:border-b-0 ${
                i < METRICS.length - 1 ? "lg:border-r border-[var(--border-subtle)]" : ""
              } ${i % 2 === 0 ? "sm:border-r border-[var(--border-subtle)]" : ""}`}
            >
              {/* Tag */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold tracking-wider text-[var(--text-muted)] font-hash">{metric.sublabel}</span>
                <span className="text-[10px] font-bold tracking-wider rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] px-2 py-0.5">
                  {metric.tag}
                </span>
              </div>

              {/* Big number */}
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-heading)] mb-4 font-hash">
                <CounterValue metric={metric} triggered={triggered} />
              </div>

              {/* Label */}
              <div className="mt-auto">
                <div className="text-xs font-bold text-[var(--text-secondary)] tracking-wider mb-2 uppercase">
                  {metric.label}
                </div>
                <div className="text-xs text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-subtle)] pt-3 font-sans-modern">
                  {metric.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}