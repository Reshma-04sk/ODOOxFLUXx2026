"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#06141B]/90 backdrop-blur-md border-b border-[#253745]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-8 h-14 flex items-center justify-between">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Sharp geometric mark */}
          <div className="w-7 h-7 border border-[#ADC2D5] flex items-center justify-center relative">
            <div className="w-3 h-3 bg-[#ADC2D5]" />
          </div>
          <span
            className="text-sm font-bold tracking-[0.18em] uppercase text-[#ADC2D5]"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            PlanLedger
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-link text-[10px] tracking-[0.2em]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <span
            className="hidden sm:block text-[10px] tracking-[0.15em] text-[#5A7896] uppercase"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            ODOO HX 2026
          </span>
          <Link
            href="/dashboard"
            className="px-4 py-1.5 border border-[#ADC2D5] text-[#ADC2D5] hover:bg-[#ADC2D5] hover:text-[#06141B] transition-all duration-200 text-[10px] tracking-[0.15em] uppercase font-bold"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Launch App
          </Link>
        </div>
      </div>
    </header>
  );
}

