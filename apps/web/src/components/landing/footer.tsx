"use client";

import React from "react";
import Link from "next/link";
import { Layers, Github, ExternalLink, Heart, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-[#060708] py-16 relative overflow-hidden text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 p-[1px]">
                <div className="w-full h-full bg-[#08090a] rounded-[7px] flex items-center justify-center">
                  <Layers className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">
                PlanLedger
              </span>
            </div>
            <p className="text-zinc-400 leading-relaxed max-w-sm">
              Enterprise SaaS subscription engine and double-entry financial ledger platform built for the Odoo Hackathon 2026.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Production Infrastructure Ready · Neon PostgreSQL 17</span>
            </div>
          </div>

          {/* Core Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Platform Modules</h4>
            <ul className="space-y-2 text-zinc-400 text-xs">
              <li>
                <a href="#simulator" className="hover:text-emerald-400 transition-colors">
                  State Machine Simulator
                </a>
              </li>
              <li>
                <a href="#bento" className="hover:text-emerald-400 transition-colors">
                  PostgreSQL 17 Guarantees
                </a>
              </li>
              <li>
                <a href="#metrics" className="hover:text-emerald-400 transition-colors">
                  Live Financial Metrics
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-emerald-400 transition-colors">
                  Technical Architecture
                </a>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-emerald-400 transition-colors">
                  Subscription Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* GitHub & Team */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Team Ownership</h4>
            <div className="space-y-2.5 text-xs">
              <a
                href="https://github.com/Reshma-04sk"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors group"
              >
                <div>
                  <div className="font-semibold text-zinc-200 group-hover:text-emerald-400 transition-colors">
                    Reshma Shaik
                  </div>
                  <div className="text-[10px] text-zinc-400">M1 · Team Lead & Backend</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
              </a>

              <a
                href="https://github.com/gaayathri-devi-07"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors group"
              >
                <div>
                  <div className="font-semibold text-zinc-200 group-hover:text-cyan-400 transition-colors">
                    Gayathri Devi G
                  </div>
                  <div className="text-[10px] text-zinc-400">M2 · Frontend Lead & UX</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <div>
            © 2026 PlanLedger. Built with Next.js 16 (App Router), Django 6, PostgreSQL 17 &amp; Tailwind CSS v4.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400">Odoo Hackathon 2026</span>
            <span>•</span>
            <span className="text-emerald-400 font-mono">100% Idempotent</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
