"use client";

import React, { useState } from "react";
import { Plus, Search, Tag, Percent } from "lucide-react";
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
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="fintech-card p-5 space-y-1">
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <Tag className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Active Coupons</span>
            </div>
            <p className="text-3xl font-extrabold text-[#C4B5FD]">{discounts.length}</p>
          </div>
          <div className="fintech-card p-5 space-y-1">
            <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider">Total Redeemed</p>
            <p className="text-3xl font-extrabold text-[var(--text-primary)]">
              {discounts.reduce((a, d) => a + (d.times_redeemed || 0), 0)}
            </p>
          </div>
          <div className="fintech-card p-5 space-y-1">
            <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider">Unlimited Codes</p>
            <p className="text-3xl font-extrabold text-violet-400">
              {discounts.filter(d => !d.max_redemptions).length}
            </p>
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
              placeholder="Search by coupon code or description..."
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl pl-9 pr-4 py-2.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-strong)] transition-colors"
            />
          </div>
          <button
            onClick={() => toast.success("Create new coupon code modal")}
            className="btn-neon flex items-center gap-2 px-5 py-2.5 text-xs font-bold shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Coupon Code</span>
          </button>
        </div>

        {/* Coupon Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((coupon) => (
            <div key={coupon.id} className="fintech-card p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-hash text-base font-bold text-[var(--text-primary)] tracking-widest px-3 py-1.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                      {coupon.code}
                    </span>
                    <span className={`flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-full ${
                      coupon.discount_type === "percentage"
                        ? "bg-[#C4B5FD]/15 text-[#C4B5FD] border border-[#C4B5FD]/30"
                        : "bg-violet-400/15 text-violet-400 border border-violet-400/30"
                    }`}>
                      {coupon.discount_type === "percentage" ? (
                        <><Percent className="w-3 h-3" />{coupon.value}% OFF</>
                      ) : (
                        <>{formatINR(coupon.value)} FLAT</>
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">{coupon.description}</p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 shrink-0">
                  ACTIVE
                </span>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase">Redeemed</p>
                  <p className="font-bold text-[var(--text-primary)]">
                    {coupon.times_redeemed}
                    {coupon.max_redemptions ? ` / ${coupon.max_redemptions}` : " (Unlimited)"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase">Min. Subtotal</p>
                  <p className="font-bold text-[var(--text-primary)]">{formatINR(coupon.min_subtotal)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase">Valid Until</p>
                  <p className="font-bold text-[var(--text-primary)]">{formatDate(coupon.valid_until)}</p>
                </div>
              </div>

              {coupon.max_redemptions && (
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C4B5FD] rounded-full transition-all"
                      style={{ width: `${Math.min((coupon.times_redeemed / coupon.max_redemptions) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    {Math.round((coupon.times_redeemed / coupon.max_redemptions) * 100)}% of redemption limit used
                  </p>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-2 py-20 text-center text-[var(--text-muted)]">No coupons match your search.</div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
