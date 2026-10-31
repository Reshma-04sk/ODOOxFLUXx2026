"use client";

import React, { useState } from "react";
import { Plus, Search, Play, Pause, XCircle } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MOCK_SUBSCRIPTIONS } from "@/services/mock-data";
import { formatDate, formatINR } from "@/lib/utils";
import { toast } from "sonner";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState(MOCK_SUBSCRIPTIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handlePause = (id: number) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "paused" } : s))
    );
    toast.success("Subscription paused successfully.");
  };

  const handleResume = (id: number) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "active" } : s))
    );
    toast.success("Subscription resumed successfully.");
  };

  const handleCancel = (id: number) => {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "canceled", cancel_at_period_end: true } : s
      )
    );
    toast.info("Subscription marked to cancel at end of billing period.");
  };

  const filtered = subscriptions.filter((s) => {
    const matchesSearch =
      s.customer_company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.plan.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusStyles: Record<string, string> = {
    active:   "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30",
    trialing: "bg-violet-400/15 text-violet-400 border border-violet-400/30",
    paused:   "bg-amber-500/15 text-amber-500 border border-amber-500/30",
    canceled: "bg-rose-500/15 text-rose-500 border border-rose-500/30",
  };

  return (
    <DashboardShell title="Subscriptions" subtitle="Manage subscriber lifecycles, plans, renewals and cancellations">
      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by customer or plan..."
                className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl pl-9 pr-4 py-2.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-strong)] transition-colors"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl px-3 py-2.5 text-xs text-[var(--text-secondary)] focus:outline-none focus:border-[var(--border-strong)] transition-colors cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="trialing">Trialing</option>
              <option value="paused">Paused</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
          <button
            onClick={() => toast.success("New subscription checkout modal")}
            className="btn-neon flex items-center gap-2 px-5 py-2.5 text-xs font-bold shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Subscription</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Active", value: subscriptions.filter(s => s.status === "active").length, color: "text-emerald-500" },
            { label: "Trialing", value: subscriptions.filter(s => s.status === "trialing").length, color: "text-violet-400" },
            { label: "Paused", value: subscriptions.filter(s => s.status === "paused").length, color: "text-amber-500" },
            { label: "Canceled", value: subscriptions.filter(s => s.status === "canceled").length, color: "text-rose-500" },
          ].map((stat) => (
            <div key={stat.label} className="fintech-card p-4 space-y-1">
              <p className="text-xs text-[var(--text-muted)] font-medium">{stat.label}</p>
              <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Subscriptions Table */}
        <div className="fintech-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className="text-[var(--text-muted)] uppercase tracking-wider text-[10px] border-b border-[var(--border-subtle)] font-semibold"
                style={{ backgroundColor: "var(--bg-elevated)" }}
              >
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Plan &amp; Frequency</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Current Period End</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Lifecycle Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] font-medium text-[var(--text-secondary)]">
                {filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[var(--bg-elevated)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[var(--text-primary)]">{sub.customer_company}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">{sub.customer_email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[var(--text-primary)]">{sub.plan.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)] uppercase font-bold tracking-wide">{sub.plan.billing_frequency}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusStyles[sub.status] || "bg-[var(--bg-elevated)] text-[var(--text-muted)]"}`}>
                        {sub.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">{formatDate(sub.current_period_end)}</td>
                    <td className="px-6 py-4 font-bold text-[var(--text-primary)]">{formatINR(sub.plan.price)}</td>
                    <td className="px-6 py-4 text-right space-x-1">
                      {sub.status === "active" && (
                        <button onClick={() => handlePause(sub.id)} title="Pause" className="p-2 rounded-xl text-[var(--text-muted)] hover:text-amber-500 hover:bg-amber-500/10 transition-colors">
                          <Pause className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {sub.status === "paused" && (
                        <button onClick={() => handleResume(sub.id)} title="Resume" className="p-2 rounded-xl text-[var(--text-muted)] hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors">
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {sub.status !== "canceled" && (
                        <button onClick={() => handleCancel(sub.id)} title="Cancel" className="p-2 rounded-xl text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors">
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-[var(--text-muted)]">No subscriptions match your filters.</td>
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
