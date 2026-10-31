"use client";

import React, { useState } from "react";
import { Save, Key, Mail, Building, Shield, Copy, Eye, EyeOff } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { toast } from "sonner";

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState("Brightloop Software Technologies Pvt Ltd");
  const [taxId, setTaxId] = useState("29AAAAA0000A1Z5");
  const [currency] = useState("INR (₹)");
  const [taxRate] = useState("18% (Standard GST)");
  const [emailRelay] = useState("Brevo (smtp-relay.brevo.com:587)");
  const [showKey, setShowKey] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Organization and billing settings saved successfully.");
  };

  const inputClass =
    "w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-strong)] transition-colors";
  const disabledInputClass =
    "w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-2xl px-4 py-3 text-sm text-[var(--text-muted)] cursor-not-allowed";
  const labelClass = "text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 block";
  const sectionClass = "fintech-card p-6 space-y-5";
  const iconBoxClass = (color: string) =>
    `w-10 h-10 rounded-2xl flex items-center justify-center ${color}`;

  return (
    <DashboardShell title="Settings" subtitle="System configuration, tax identifiers, API tokens and email dispatch">
      <div className="max-w-3xl space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Organization & Tax Profile */}
          <div className={sectionClass}>
            <div className="flex items-center gap-3">
              <div className={iconBoxClass("bg-blue-500/15 text-blue-500")}>
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Organization &amp; Tax Profile</h3>
                <p className="text-xs text-[var(--text-muted)]">Legal entity details printed on generated invoices</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Company Legal Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>GSTIN / Tax ID</label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className={`${inputClass} font-hash`}
                />
              </div>
              <div>
                <label className={labelClass}>Billing Currency</label>
                <input type="text" value={currency} disabled className={disabledInputClass} />
              </div>
              <div>
                <label className={labelClass}>Default Tax Rate</label>
                <input type="text" value={taxRate} disabled className={disabledInputClass} />
              </div>
            </div>
          </div>

          {/* Email & Notifications */}
          <div className={sectionClass}>
            <div className="flex items-center gap-3">
              <div className={iconBoxClass("bg-violet-500/15 text-violet-400")}>
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Email Dispatch Relay</h3>
                <p className="text-xs text-[var(--text-muted)]">Automated invoice sending &amp; billing failure alerts</p>
              </div>
            </div>
            <div>
              <label className={labelClass}>Configured SMTP Provider</label>
              <input type="text" value={emailRelay} disabled className={disabledInputClass} />
              <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                Local development routes to Django console backend; Production routes via Brevo SMTP relay.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Invoice Sent",      checked: true },
                { label: "Payment Received",  checked: true },
                { label: "Subscription Renewed", checked: true },
                { label: "Billing Failed",    checked: false },
                { label: "Trial Ending",      checked: true },
                { label: "Churn Alert",       checked: false },
              ].map((n) => (
                <label key={n.label} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-9 h-5 rounded-full flex items-center transition-all ${n.checked ? "bg-[#C4B5FD]" : "bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"}`}>
                    <span className={`w-4 h-4 rounded-full bg-white shadow transition-all mx-0.5 ${n.checked ? "translate-x-4" : ""}`} />
                  </div>
                  <span className="text-xs font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{n.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Security & API */}
          <div className={sectionClass}>
            <div className="flex items-center gap-3">
              <div className={iconBoxClass("bg-emerald-500/15 text-emerald-500")}>
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">API Tokens &amp; Webhook Access</h3>
                <p className="text-xs text-[var(--text-muted)]">REST API v1 authentication for external microservices</p>
              </div>
            </div>

            <div>
              <label className={labelClass}>Live API Key</label>
              <div className="flex items-center gap-3">
                <input
                  type={showKey ? "text" : "password"}
                  value="pl_live_98a7sd8f7a6sd876f8a7sd8f76as8d7"
                  readOnly
                  className={`${disabledInputClass} font-hash flex-1`}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => toast.success("API Key copied to clipboard")}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </button>
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-neon flex items-center gap-2 px-8 py-3 text-sm font-bold"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
