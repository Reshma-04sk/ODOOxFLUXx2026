"use client";

import React, { useState } from "react";
import { Plus, Search, Mail, MapPin, Receipt } from "lucide-react";
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

  return (
    <DashboardShell title="Customers" subtitle="B2B client organizations, billing profiles and tax identifiers">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by company, email or GSTIN..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => toast.success("New customer onboarding dialog")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-500/25 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Customer</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((cust) => (
            <div key={cust.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">{cust.company_name}</h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                    <Mail className="w-3 h-3" />
                    <span>{cust.email}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {cust.status.toUpperCase()}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    {cust.city}, {cust.state} ({cust.country})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Receipt className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-[11px] font-mono text-slate-400">GSTIN: {cust.tax_id}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Total Invoiced</span>
                  <span className="font-bold text-white">{formatINR(cust.total_invoiced)}</span>
                </div>
                <button
                  onClick={() => toast.info(`Viewing details for ${cust.company_name}`)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-400 hover:text-blue-300 hover:bg-slate-900 border border-blue-500/20 transition-colors"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
