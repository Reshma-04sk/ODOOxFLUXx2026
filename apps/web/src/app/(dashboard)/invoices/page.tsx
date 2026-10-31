"use client";

import React, { useState } from "react";
import { Plus, Search, Ban, DollarSign, Download } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MOCK_INVOICES } from "@/services/mock-data";
import { formatDate, formatINR } from "@/lib/utils";
import { toast } from "sonner";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [searchTerm, setSearchTerm] = useState("");

  const handleVoid = (id: number) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "void", balance_due: "0.00" } : inv))
    );
    toast.success("Invoice voided successfully.");
  };

  const filtered = invoices.filter(
    (inv) =>
      inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardShell title="Invoices" subtitle="GST-compliant billing records, payment statuses and receivables">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by invoice # or customer..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => toast.success("Draft invoice creation modal")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-500/25 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate Manual Invoice</span>
          </button>
        </div>

        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800 font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Invoice #</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Issue Date</th>
                  <th className="px-6 py-3.5">Due Date</th>
                  <th className="px-6 py-3.5">Total (inc. GST)</th>
                  <th className="px-6 py-3.5">Balance Due</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
                {filtered.map((inv) => {
                  const statusColors: Record<string, string> = {
                    paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                    open: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                    void: "bg-rose-500/10 text-rose-400 border-rose-500/20",
                    uncollectible: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                  };

                  return (
                    <tr key={inv.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-white">{inv.invoice_number}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{inv.customer_name}</div>
                        <div className="text-[11px] text-slate-400">{inv.plan_name || "Subscription Fee"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            statusColors[inv.status] || "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {inv.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{formatDate(inv.issue_date)}</td>
                      <td className="px-6 py-4 text-slate-300">{formatDate(inv.due_date)}</td>
                      <td className="px-6 py-4 font-bold text-white">{formatINR(inv.total_amount)}</td>
                      <td className="px-6 py-4 font-bold text-amber-400">{formatINR(inv.balance_due)}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {inv.status === "open" && (
                          <button
                            onClick={() => toast.success(`Record payment for ${inv.invoice_number}`)}
                            title="Record Payment"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-900 transition-colors"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {inv.status !== "paid" && inv.status !== "void" && (
                          <button
                            onClick={() => handleVoid(inv.id)}
                            title="Void Invoice"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => toast.info(`Downloading PDF receipt for ${inv.invoice_number}`)}
                          title="Download Invoice"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-900 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
