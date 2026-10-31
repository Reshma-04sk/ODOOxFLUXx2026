"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Layers, Terminal, Sparkles } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#08090a]/80 backdrop-blur-xl border-b border-zinc-800/60 shadow-2xl shadow-black/50 py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Mark & Operational Status */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 p-[1px] shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
              <div className="w-full h-full bg-[#08090a] rounded-[11px] flex items-center justify-center">
                <Layers className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                PlanLedger
                <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-semibold tracking-wider">
                  v2026
                </span>
              </span>
            </div>
          </Link>

          {/* Operational Status Pill */}
          <div className="hidden lg:flex items-center gap-2 bg-zinc-900/80 border border-zinc-800/80 px-2.5 py-1 rounded-full text-[11px] text-zinc-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium">System Operational</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400 font-mono text-[10px]">PG17 Sub-ms</span>
          </div>
        </div>

        {/* Navigation Anchors */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-zinc-400">
          <a
            href="#simulator"
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Workflow Simulator
          </a>
          <a
            href="#metrics"
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Financial Metrics
          </a>
          <a
            href="#bento"
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            DB Guarantees
          </a>
          <a
            href="#architecture"
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Architecture
          </a>
          <a
            href="#pricing"
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Plans
          </a>
          <a
            href="#team"
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Team
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-all"
          >
            <span>Customer Portal</span>
          </Link>
          <Link
            href="/login"
            className="relative inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-emerald-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-lg shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all"
          >
            <span>Sign In</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
