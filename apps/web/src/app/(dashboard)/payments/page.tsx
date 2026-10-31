"use client";

import React, { useState } from "react";
import { Plus, Search, CheckCircle2, Wallet } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MOCK_PAYMENTS } from "@/services/mock-data";
import { formatDate, formatINR } from "@/lib/utils";
import { toast } from "sonner";

export default function PaymentsPage() {
  const [payments] = useState(MOCK_PAYMENTS);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = payments.filter(
    (p) =>
      p.payment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transaction_reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const methodColors: Record<string, string> = {
    upi:           "bg-violet-400/15 text-violet-400 border border-violet-400/30",
    neft:          "bg-blue-500/15 text-blue-500 border border-blue-500/30",
    razorpay:      "bg-[#C4B5FD]/15 text-[#C4B5FD] border border-[#C4B5FD]/30",
    stripe:        "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30",
    bank_transfer: "bg-amber-500/15 text-amber-500 border border-amber-500/30",
    cash:          "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30",
  };

  const totalCollected = payments.reduce((acc, p) => acc + parseFloat(String(p.amount || "0")), 0);

  return (
    <DashboardShell title="Payments" subtitle="Reconciled collections, gateways, UPI and bank transfers">
      <div className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="fintech-card p-5 space-y-1">
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <Wallet className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Total Collected</span>
            </div>
            <p className="text-2xl font-extrabold text-[#C4B5FD]">{formatINR(totalCollected)}</p>
          </div>
          <div className="fintech-card p-5 space-y-1">
            <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider">Transactions</p>
            <p className="text-2xl font-extrabold text-[var(--text-primary)]">{payments.length}</p>
          </div>
          <div className="fintech-card p-5 space-y-1">
            <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider">Success Rate</p>
            <p className="text-2xl font-extrabold text-emerald-500">100%</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by payment # or reference..."
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl pl-9 pr-4 py-2.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-strong)] transition-colors"
            />
          </div>
          <button
            onClick={() => toast.success("Record offline payment modal")}
            className="btn-neon flex items-center gap-2 px-5 py-2.5 text-xs font-bold shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </button>
        </div>

        {/* Table */}
        <div className="fintech-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className="text-[var(--text-muted)] uppercase tracking-wider text-[10px] border-b border-[var(--border-subtle)] font-semibold"
                style={{ backgroundColor: "var(--bg-elevated)" }}
              >
                <tr>
                  <th className="px-6 py-4">Payment #</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Invoice #</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Amount (INR)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Processed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] font-medium text-[var(--text-secondary)]">
                {filtered.map((pay) => (
                  <tr key={pay.id} className="hover:bg-[var(--bg-elevated)] transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-hash font-bold text-[var(--text-primary)]">{pay.payment_number}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[var(--text-primary)]">{pay.customer_name}</td>
                    <td className="px-6 py-4">
                      <span className="font-hash text-blue-500">{pay.invoice_number}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${methodColors[pay.payment_method?.toLowerCase()] || "bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]"}`}>
                        {pay.payment_method}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-[#C4B5FD]">{formatINR(pay.amount)}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        SUCCEEDED
                      </span>
                    </td>
                    <td className="px-6 py-4">{formatDate(pay.processed_at)}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-[var(--text-muted)]">No payments match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
