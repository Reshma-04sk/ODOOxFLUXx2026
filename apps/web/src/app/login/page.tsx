"use client";

import { SquareLogo } from "@/components/square-logo";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { apiService } from "@/services/api-service";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@brightloop.io");
  const [password, setPassword] = useState("Admin@12345");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiService.auth.login({ email, password });
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid credentials. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen arch-grid-bg text-[var(--text-primary)] flex flex-col justify-center items-center px-4 relative py-12">
      {/* Top Navigation Bar with Back and Theme Toggle */}
      <div className="absolute top-6 left-6 right-6 max-w-5xl mx-auto flex items-center justify-between z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing</span>
        </Link>
        <ThemeToggle variant="pill" />
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10 mt-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#C4B5FD] text-black flex items-center justify-center font-extrabold shadow-md">
              <SquareLogo size={18} />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[var(--text-heading)]">PlanLedger</span>
          </Link>
          <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text-heading)] mt-3">Welcome Back</h2>
          <p className="text-xs text-[var(--text-secondary)] font-medium">
            Sign in to your financial ledger and subscription operations console
          </p>
        </div>

        {/* Floating FinTech Card */}
        <div className="fintech-card p-8">
          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-500 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@brightloop.io"
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#C4B5FD] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Password</label>
                <span className="text-[11px] font-semibold text-[#7C3AED] dark:text-[#A78BFA] hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#C4B5FD] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider btn-neon flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Preset */}
          <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] text-center">
            <p className="text-[11px] text-[var(--text-muted)] font-hash">
              Demo Preset: <code className="text-[#000000] dark:text-[#C4B5FD] font-bold">admin@brightloop.io</code> / <code className="text-[#000000] dark:text-[#C4B5FD] font-bold">Admin@12345</code>
            </p>
          </div>
        </div>

        <div className="text-center text-xs text-[var(--text-secondary)] font-medium">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#7C3AED] dark:text-[#A78BFA] font-bold hover:underline">
            Register your company
          </Link>
        </div>
      </div>
    </div>
  );
}