"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";

/* --- SVG Topographic Pattern -------------------------------- */
function TopoLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.07]">
      <svg
        viewBox="0 0 1440 900"
        className="absolute inset-0 w-full h-full topo-animate"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <style>{`.tl{fill:none;stroke:#ADC2D5;stroke-width:1;}`}</style>
        </defs>
        {/* Concentric topographic contours */}
        <ellipse className="tl" cx="720" cy="450" rx="680" ry="390" />
        <ellipse className="tl" cx="720" cy="450" rx="580" ry="320" />
        <ellipse className="tl" cx="720" cy="450" rx="480" ry="255" />
        <ellipse className="tl" cx="720" cy="450" rx="380" ry="195" />
        <ellipse className="tl" cx="720" cy="450" rx="290" ry="145" />
        <ellipse className="tl" cx="720" cy="450" rx="205" ry="100" />
        <ellipse className="tl" cx="720" cy="450" rx="128" ry="62" />
        <ellipse className="tl" cx="720" cy="450" rx="62"  ry="30" />
        {/* Displaced rings — upper-left cluster */}
        <ellipse className="tl" cx="160"  cy="200" rx="340" ry="200" />
        <ellipse className="tl" cx="160"  cy="200" rx="240" ry="140" />
        <ellipse className="tl" cx="160"  cy="200" rx="140" ry="82"  />
        <ellipse className="tl" cx="160"  cy="200" rx="66"  ry="38"  />
        {/* Lower-right cluster */}
        <ellipse className="tl" cx="1300" cy="780" rx="320" ry="190" />
        <ellipse className="tl" cx="1300" cy="780" rx="210" ry="122" />
        <ellipse className="tl" cx="1300" cy="780" rx="110" ry="64"  />
        {/* Diagonal flow lines */}
        <path className="tl" d="M0,400 Q360,280 720,420 T1440,380" />
        <path className="tl" d="M0,500 Q360,360 720,510 T1440,460" />
        <path className="tl" d="M0,580 Q360,430 720,590 T1440,540" />
        <path className="tl" d="M0,300 Q360,200 720,330 T1440,290" />
        <path className="tl" d="M0,620 Q480,510 720,650 T1440,600" />
        {/* Extra density lines */}
        <path className="tl" d="M0,160 Q300,100 700,200 Q1000,280 1440,180" />
        <path className="tl" d="M0,700 Q400,640 720,720 Q1050,800 1440,720" />
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
      // Staggered mask-reveal on load
      gsap.to(wordsRef.current, {
        y: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.12,
        delay: 0.3,
      });

      // Subtle parallax on scroll
      gsap.to(sectionRef.current, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-center arch-grid-bg overflow-hidden"
    >
      {/* Topographic Lines Background */}
      <TopoLines />

      {/* Deep vignette so center content pops */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, #06141B 100%)",
        }}
      />

      {/* Horizontal rule lines — structural feel */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#253745] z-[2]" style={{ top: "56px" }} />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#253745] z-[2]" />

      {/* Main content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-8 pt-32 pb-24 w-full">

        {/* Overline */}
        <div
          className="flex items-center gap-4 mb-10"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          <div className="w-8 h-px bg-[#5A7896]" />
          <span className="mono-label text-[#5A7896]">
            ODOO HACKATHON 2026 — SUBSCRIPTION MANAGEMENT PLATFORM
          </span>
          <div className="flex-1 h-px bg-[#253745]" />
          <div className="w-2 h-2 border border-[#5A7896] rotate-45" />
        </div>

        {/* Massive display headline — mask reveal */}
        <h1
          className="display-text text-[clamp(3rem,9vw,9.5rem)] leading-none tracking-[-0.04em] mb-12"
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
                      className="word-inner"
                    >
                      {word}
                    </span>
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        {/* Descriptor row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[#253745] max-w-3xl">
          <div className="p-6 border-b md:border-b-0 md:border-r border-[#253745]">
            <p
              className="text-sm text-[#88A7C1] leading-relaxed"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Automate recurring billing. Eliminate revenue leakage.
              Calculate true MRR/ARR with sub-millisecond database constraints
              and ACID transaction isolation.
            </p>
          </div>
          <div className="p-6 flex flex-col justify-between gap-4">
            <div
              className="grid grid-cols-2 gap-x-6 gap-y-2 text-[10px] tracking-[0.12em] text-[#5A7896]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              <span>POSTGRESQL 17</span>
              <span>DJANGO 6</span>
              <span>NEXT.JS 16</span>
              <span>ACID ISOLATION</span>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-[#253745]">
              <Link
                href="/dashboard"
                className="px-6 py-2 bg-[#ADC2D5] text-[#06141B] font-bold text-xs tracking-[0.15em] uppercase hover:bg-[#CCD0CF] transition-colors duration-200"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                LAUNCH APP
              </Link>
              <a
                href="#architecture"
                className="px-5 py-2 border border-[#253745] text-[#5A7896] hover:border-[#5A7896] hover:text-[#ADC2D5] transition-all duration-200 text-xs tracking-[0.12em] uppercase"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                READ DOCS
              </a>
            </div>
          </div>
        </div>

        {/* Bottom scroll indicator */}
        <div
          className="mt-20 flex items-center gap-3 text-[10px] text-[#5A7896]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          <span className="tracking-[0.15em]">SCROLL TO EXPLORE</span>
          <div className="flex-1 h-px bg-[#253745] max-w-[120px]" />
          <div className="w-px h-6 bg-[#253745] animate-pulse" />
        </div>
      </div>

      {/* Right-edge vertical data label */}
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-10 hidden xl:flex"
        style={{ fontFamily: "var(--font-space-mono)" }}
      >
        <div className="w-px h-24 bg-[#253745]" />
        <span
          className="text-[9px] tracking-[0.3em] text-[#5A7896] uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          BUILD/2026/PLANLEDGER
        </span>
        <div className="w-px h-24 bg-[#253745]" />
      </div>
    </section>
  );
}

