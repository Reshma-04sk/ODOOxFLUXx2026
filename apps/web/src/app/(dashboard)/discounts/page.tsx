"use client";

import React, { useState } from "react";
import { Plus, Search, BadgePercent, CheckCircle2 } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MOCK_DISCOUNTS } from "@/services/mock-data";
import { formatDate, formatINR } from "@/lib/utils";
import { toast } from "sonner";

export default function DiscountsPage() {
  const [discounts] = useState(MOCK_DISCOUNTS);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = discounts.filter(
    (d) =>
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardShell title="Coupons & Discounts" subtitle="Promotional voucher codes, percentage discounts, and usage limits">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by coupon code..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => toast.success("Create new coupon code modal")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-500/25 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Coupon Code</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((coupon) => (
            <div key={coupon.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-white tracking-wider px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      {coupon.code}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">
                      {coupon.discount_type === "percentage" ? `${coupon.value}% OFF` : `₹${coupon.value} FLAT`}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{coupon.description}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ACTIVE
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Times Redeemed:</span>
                  <span className="font-semibold text-white">
                    {coupon.times_redeemed} {coupon.max_redemptions ? `/ ${coupon.max_redemptions}` : "(Unlimited)"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Minimum Subtotal:</span>
                  <span className="font-semibold text-white">{formatINR(coupon.min_subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Valid Until:</span>
                  <span className="font-semibold text-white">{formatDate(coupon.valid_until)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
