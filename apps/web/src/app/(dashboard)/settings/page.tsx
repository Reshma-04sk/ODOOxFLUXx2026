"use client";

import React, { useState } from "react";
import { Save, Key, Mail, Building } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { toast } from "sonner";

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState("Brightloop Software Technologies Pvt Ltd");
  const [taxId, setTaxId] = useState("29AAAAA0000A1Z5");
  const [currency] = useState("INR (₹)");
  const [taxRate] = useState("18% (Standard GST)");
  const [emailRelay] = useState("Brevo (smtp-relay.brevo.com:587)");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Organization and billing settings saved successfully.");
  };

  return (
    <DashboardShell title="Settings" subtitle="System configuration, tax identifiers, API tokens and email dispatch">
      <div className="max-w-4xl space-y-8">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Organization & Billing Info */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Organization & Tax Profile</h3>
                <p className="text-xs text-slate-400">Legal entity details printed on generated invoices</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Company Legal Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">GSTIN / Tax ID</label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Billing Currency</label>
                <input
                  type="text"
                  value={currency}
                  disabled
                  className="w-full bg-slate-950 border border-slate-800/60 rounded-xl px-3 py-2 text-xs text-slate-400 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Default Tax Rate</label>
                <input
                  type="text"
                  value={taxRate}
                  disabled
                  className="w-full bg-slate-950 border border-slate-800/60 rounded-xl px-3 py-2 text-xs text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Email & Notifications */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Email Dispatch Relay</h3>
                <p className="text-xs text-slate-400">Automated invoice sending & billing failure alerts</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Configured SMTP Provider</label>
              <input
                type="text"
                value={emailRelay}
                disabled
                className="w-full bg-slate-950 border border-slate-800/60 rounded-xl px-3 py-2 text-xs text-slate-400 cursor-not-allowed"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Local development routes to Django console backend; Production routes via Brevo SMTP relay.
              </span>
            </div>
          </div>

          {/* API Key */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">API Tokens & Webhook Access</h3>
                <p className="text-xs text-slate-400">REST API v1 authentication for external microservices</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="password"
                value="pl_live_98a7sd8f7a6sd876f8a7sd8f76as8d7"
                disabled
                className="flex-1 bg-slate-950 border border-slate-800/60 rounded-xl px-3 py-2 text-xs text-slate-400 font-mono"
              />
              <button
                type="button"
                onClick={() => toast.success("API Key copied to clipboard")}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800"
              >
                Copy Key
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/25 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
