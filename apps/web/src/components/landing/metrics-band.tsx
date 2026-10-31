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
    detail: "Normalized across monthly, annual ÷ 12, weekly × 52/12 cadences",
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
        { y: 40, opacity: 0 },
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
      <div className="absolute inset-0 arch-grid-fine opacity-30 pointer-events-none" />

      {/* Section header */}
      <div className="max-w-[1400px] mx-auto px-8 py-10 border-b border-[var(--border-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-4" style={{ fontFamily: "var(--font-space-mono)" }}>
          <div className="w-2 h-2 border border-[var(--text-muted)] rotate-45" />
          <span className="mono-label text-[var(--text-muted)]">FINANCIAL PERFORMANCE METRICS</span>
        </div>
        <span className="mono-label text-[var(--border-subtle)] hidden md:block" style={{ fontFamily: "var(--font-space-mono)" }}>
          SYSTEM / LEDGER / LIVE
        </span>
      </div>

      {/* Metrics grid  divided by 1px borders, no border-radius */}
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((metric, i) => (
            <div
              key={metric.id}
              className={`metric-card opacity-0 p-8 flex flex-col justify-between min-h-[260px] ${
                i < METRICS.length - 1 ? "border-r-0 sm:border-r border-[var(--border-subtle)]" : ""
              } ${i >= 2 ? "border-t border-[var(--border-subtle)] lg:border-t-0" : ""} ${
                i === 1 ? "border-t border-[var(--border-subtle)] sm:border-t-0" : ""
              }`}
              style={{ borderRight: i < METRICS.length - 1 ? "1px solid #253745" : "none" }}
            >
              {/* Tag */}
              <div
                className="flex items-center justify-between mb-6"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                <span className="mono-label text-[var(--text-muted)]">{metric.sublabel}</span>
                <span
                  className="text-[9px] tracking-[0.15em] border border-[var(--border-subtle)] text-[var(--text-muted)] px-2 py-0.5"
                >
                  {metric.tag}
                </span>
              </div>

              {/* Big number */}
              <div
                className="text-[clamp(2.5rem,4vw,3.8rem)] font-bold leading-none tracking-[-0.04em] text-[var(--text-heading)] mb-4"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                <CounterValue metric={metric} triggered={triggered} />
              </div>

              {/* Label */}
              <div className="mt-auto">
                <div
                  className="text-xs font-semibold text-[var(--text-secondary)] tracking-[0.08em] mb-2 uppercase"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {metric.label}
                </div>
                <div
                  className="text-[11px] text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-subtle)] pt-3"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
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

