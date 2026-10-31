"use client";

import React, { useState } from "react";
import { Plus, Search, CheckCircle2 } from "lucide-react";
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

  return (
    <DashboardShell title="Payments" subtitle="Reconciled collections, gateways, UPI and bank transfers">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by payment # or transaction reference..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => toast.success("Record offline payment modal")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-500/25 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </button>
        </div>

        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800 font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Payment #</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Invoice #</th>
                  <th className="px-6 py-3.5">Payment Method</th>
                  <th className="px-6 py-3.5">Amount (INR)</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Processed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
                {filtered.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-white">{pay.payment_number}</td>
                    <td className="px-6 py-4 font-semibold text-white">{pay.customer_name}</td>
                    <td className="px-6 py-4 font-mono text-blue-400">{pay.invoice_number}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {pay.payment_method}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-400">{formatINR(pay.amount)}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>SUCCEEDED</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{formatDate(pay.processed_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
