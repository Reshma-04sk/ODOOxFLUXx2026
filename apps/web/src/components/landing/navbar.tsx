"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { SquareLogo } from "@/components/square-logo";
import { useAuthModal } from "@/components/auth-modal-context";

const NAV_LINKS = [
  { label: "Metrics",      href: "#metrics" },
  { label: "Pipeline",     href: "#simulator" },
  { label: "Architecture", href: "#architecture" },
  { label: "Team",         href: "#team" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { openAuthModal } = useAuthModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg-base)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Brand with 2 Squared Icon (Small square inside a big one) */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-[#C4B5FD] text-black flex items-center justify-center font-extrabold shadow-md group-hover:scale-105 transition-transform">
            <SquareLogo size={18} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[var(--text-heading)]">
            PlanLedger
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8 font-semibold text-sm">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle variant="pill" />

          {/* Clicking asks login/signup via modal */}
          <button
            onClick={() => openAuthModal("login")}
            className="btn-neon px-5 py-2.5 text-xs uppercase tracking-wider font-bold shadow-md cursor-pointer"
          >
            Launch Terminal
          </button>
        </div>
      </div>
    </header>
  );
}