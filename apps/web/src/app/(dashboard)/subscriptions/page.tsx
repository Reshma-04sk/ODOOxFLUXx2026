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
      prev.map((s) => (s.id === id ? { ...s, status: "canceled", cancel_at_period_end: true } : s))
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

  return (
    <DashboardShell title="Subscriptions" subtitle="Manage subscriber lifecycles, plans, renewals and cancellations">
      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by customer or plan..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
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
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-500/25 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Subscription</span>
          </button>
        </div>

        {/* Subscriptions Table */}
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800 font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Plan & Frequency</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Current Period End</th>
                  <th className="px-6 py-3.5">Price</th>
                  <th className="px-6 py-3.5 text-right">Lifecycle Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
                {filtered.map((sub) => {
                  const statusColors: Record<string, string> = {
                    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                    trialing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                    paused: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                    canceled: "bg-rose-500/10 text-rose-400 border-rose-500/20",
                  };

                  return (
                    <tr key={sub.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{sub.customer_company}</div>
                        <div className="text-[11px] text-slate-400">{sub.customer_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{sub.plan.name}</div>
                        <div className="text-[11px] text-slate-400 uppercase font-semibold">
                          {sub.plan.billing_frequency}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            statusColors[sub.status] || "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {sub.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{formatDate(sub.current_period_end)}</td>
                      <td className="px-6 py-4 font-bold text-white">{formatINR(sub.plan.price)}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {sub.status === "active" && (
                          <button
                            onClick={() => handlePause(sub.id)}
                            title="Pause Subscription"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-900 transition-colors"
                          >
                            <Pause className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {sub.status === "paused" && (
                          <button
                            onClick={() => handleResume(sub.id)}
                            title="Resume Subscription"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-900 transition-colors"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {sub.status !== "canceled" && (
                          <button
                            onClick={() => handleCancel(sub.id)}
                            title="Cancel Subscription"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
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
