"use client";

import React, { useState } from "react";
import { Plus, Search, Mail, MapPin, Receipt, TrendingUp, Users, Building2 } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MOCK_CUSTOMERS } from "@/services/mock-data";
import { formatINR } from "@/lib/utils";
import { toast } from "sonner";

export default function CustomersPage() {
  const [customers] = useState(MOCK_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tax_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = customers.reduce((acc, c) => acc + parseFloat(String(c.total_invoiced || "0")), 0);

  return (
    <DashboardShell title="Customers" subtitle="B2B client organizations, billing profiles and tax identifiers">
      <div className="space-y-6">
        {/* Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="fintech-card p-5 space-y-1">
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <Users className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Total Customers</span>
            </div>
            <p className="text-3xl font-extrabold text-[var(--text-primary)]">{customers.length}</p>
          </div>
          <div className="fintech-card p-5 space-y-1">
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <Building2 className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Active Accounts</span>
            </div>
            <p className="text-3xl font-extrabold text-emerald-500">{customers.filter(c => c.status === "active").length}</p>
          </div>
          <div className="fintech-card p-5 space-y-1">
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Total Invoiced</span>
            </div>
            <p className="text-3xl font-extrabold text-[#C4B5FD]">{formatINR(totalRevenue)}</p>
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
              placeholder="Search by company, email or GSTIN..."
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl pl-9 pr-4 py-2.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-strong)] transition-colors"
            />
          </div>
          <button
            onClick={() => toast.success("New customer onboarding dialog")}
            className="btn-neon flex items-center gap-2 px-5 py-2.5 text-xs font-bold shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Customer</span>
          </button>
        </div>

        {/* Customer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((cust) => (
            <div key={cust.id} className="fintech-card p-5 space-y-4 group">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[var(--text-primary)] text-sm truncate">{cust.company_name}</h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] mt-1">
                    <Mail className="w-3 h-3 shrink-0" />
                    <span className="truncate">{cust.email}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ml-2 shrink-0 ${
                  cust.status === "active"
                    ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                    : "bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                }`}>
                  {cust.status?.toUpperCase() || "ACTIVE"}
                </span>
              </div>

              <div className="space-y-2 text-xs text-[var(--text-secondary)]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                  <span>{cust.city}, {cust.state} ({cust.country})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Receipt className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                  <span className="font-hash text-[var(--text-muted)]">GSTIN: {cust.tax_id}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block font-semibold uppercase tracking-wider">Total Invoiced</span>
                  <span className="font-extrabold text-[#C4B5FD] text-base">{formatINR(cust.total_invoiced)}</span>
                </div>
                <button
                  onClick={() => toast.info(`Viewing details for ${cust.company_name}`)}
                  className="btn-lavender px-4 py-2 text-xs font-bold"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 py-20 text-center text-[var(--text-muted)]">No customers match your search.</div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
