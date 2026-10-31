"use client";

import React, { useState } from "react";
import { Plus, Search, Ban, DollarSign, Download, FileText } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MOCK_INVOICES } from "@/services/mock-data";
import { formatDate, formatINR } from "@/lib/utils";
import { toast } from "sonner";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleVoid = (id: number) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "void", balance_due: "0.00" } : inv))
    );
    toast.success("Invoice voided successfully.");
  };

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusStyles: Record<string, string> = {
    paid:          "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30",
    open:          "bg-blue-500/15 text-blue-500 border border-blue-500/30",
    void:          "bg-rose-500/15 text-rose-500 border border-rose-500/30",
    uncollectible: "bg-amber-500/15 text-amber-500 border border-amber-500/30",
    draft:         "bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]",
  };

  const totalOpen   = invoices.filter(i => i.status === "open").length;
  const totalPaid   = invoices.filter(i => i.status === "paid").length;
  const totalVoided = invoices.filter(i => i.status === "void").length;
  const totalDue    = invoices.filter(i => i.status === "open").reduce((acc, i) => acc + parseFloat(i.balance_due || "0"), 0);

  return (
    <DashboardShell title="Invoices" subtitle="GST-compliant billing records, payment statuses and receivables">
      <div className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Open Invoices",    value: totalOpen,              display: String(totalOpen),        color: "text-blue-500" },
            { label: "Collected",        value: totalPaid,              display: String(totalPaid),        color: "text-emerald-500" },
            { label: "Voided",           value: totalVoided,            display: String(totalVoided),      color: "text-rose-500" },
            { label: "Outstanding AR",   value: totalDue,               display: formatINR(totalDue),      color: "text-amber-500" },
          ].map((stat) => (
            <div key={stat.label} className="fintech-card p-4 space-y-1">
              <p className="text-xs text-[var(--text-muted)] font-medium">{stat.label}</p>
              <p className={`text-xl font-extrabold ${stat.color}`}>{stat.display}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by invoice # or customer..."
                className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl pl-9 pr-4 py-2.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-strong)] transition-colors"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl px-3 py-2.5 text-xs text-[var(--text-secondary)] focus:outline-none focus:border-[var(--border-strong)] transition-colors cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="open">Open</option>
              <option value="void">Void</option>
              <option value="uncollectible">Uncollectible</option>
            </select>
          </div>
          <button
            onClick={() => toast.success("Draft invoice creation modal")}
            className="btn-neon flex items-center gap-2 px-5 py-2.5 text-xs font-bold shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate Manual Invoice</span>
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
                  <th className="px-6 py-4">Invoice #</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Issue Date</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Total (inc. GST)</th>
                  <th className="px-6 py-4">Balance Due</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] font-medium text-[var(--text-secondary)]">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[var(--bg-elevated)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                        <span className="font-hash font-bold text-[var(--text-primary)]">{inv.invoice_number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[var(--text-primary)]">{inv.customer_name}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">{inv.plan_name || "Subscription Fee"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusStyles[inv.status] || "bg-[var(--bg-elevated)] text-[var(--text-muted)]"}`}>
                        {inv.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">{formatDate(inv.issue_date)}</td>
                    <td className="px-6 py-4">{formatDate(inv.due_date)}</td>
                    <td className="px-6 py-4 font-bold text-[var(--text-primary)]">{formatINR(inv.total_amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${parseFloat(inv.balance_due || "0") > 0 ? "text-amber-500" : "text-emerald-500"}`}>
                        {formatINR(inv.balance_due)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1">
                      {inv.status === "open" && (
                        <button
                          onClick={() => toast.success(`Record payment for ${inv.invoice_number}`)}
                          title="Record Payment"
                          className="p-2 rounded-xl text-[var(--text-muted)] hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {inv.status !== "paid" && inv.status !== "void" && (
                        <button
                          onClick={() => handleVoid(inv.id)}
                          title="Void Invoice"
                          className="p-2 rounded-xl text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => toast.info(`Downloading PDF for ${inv.invoice_number}`)}
                        title="Download Invoice"
                        className="p-2 rounded-xl text-[var(--text-muted)] hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-[var(--text-muted)]">No invoices match your filters.</td>
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
