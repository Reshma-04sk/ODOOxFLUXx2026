"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, ShieldCheck, Zap, Database, Terminal, ChevronDown } from "lucide-react";
import { KineticText } from "./kinetic-text";

// Lazy load the 3D canvas with ssr: false for fast initial load
const Hero3DCanvas = dynamic(
  () => import("./hero-3d-canvas").then((mod) => mod.Hero3DCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-radial-vignette flex items-center justify-center">
        <div className="w-[450px] h-[450px] rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
      </div>
    ),
  }
);

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center pt-32 pb-20 px-6 overflow-hidden bg-[#08090a]">
      {/* 3D Canvas Background */}
      <Hero3DCanvas />

      {/* Subtle radial mesh gradient overlays */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none z-[1]" />

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Odoo Hackathon 2026 • Enterprise-Grade Subscription Engine</span>
        </div>

        {/* Kinetic Headline with Serif Italic Accent */}
        <KineticText />

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed font-normal">
          Automate recurring billing, eliminate revenue leakage, and calculate true MRR/ARR with sub-millisecond database constraints and transaction safety.
        </p>

        {/* Primary and Secondary Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-emerald-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 transition-all shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Launch App Console</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="#architecture"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold text-zinc-200 hover:text-white glass-card hover:border-emerald-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Explore Technical Architecture</span>
          </a>
        </div>

        {/* Technical Trust Badges */}
        <div className="pt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono text-zinc-400 border-t border-zinc-800/60 max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>PostgreSQL 17</span>
          </div>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Django 6 ACID Engine</span>
          </div>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Next.js 16 App Router</span>
          </div>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Zero Floating Drift (ROUND_HALF_UP)</span>
          </div>
        </div>
      </div>

      {/* Down arrow scroll indicator */}
      <a
        href="#simulator"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-zinc-500 hover:text-emerald-400 transition-colors z-10 flex flex-col items-center gap-1 cursor-pointer"
        aria-label="Scroll down"
      >
        <span className="text-[10px] font-mono tracking-widest uppercase">Explore</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </a>
    </section>
  );
}
