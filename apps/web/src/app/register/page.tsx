"use client";

import { SquareLogo } from "@/components/square-logo";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, Building, User as UserIcon, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { apiService } from "@/services/api-service";
import { ThemeToggle } from "@/components/theme-toggle";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiService.auth.register({
        email,
        password,
        full_name: fullName,
        company_name: companyName,
      });
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed. Please check your inputs.";
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
          <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text-heading)] mt-3">Create Account</h2>
          <p className="text-xs text-[var(--text-secondary)] font-medium">
            Launch your subscription operations workspace in seconds
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
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Aarav Sharma"
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#C4B5FD] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Company / Organization</label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  placeholder="Apex Cloud Technologies"
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#C4B5FD] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="aarav@apexcloud.io"
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#C4B5FD] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Minimum 8 characters"
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-[var(--text-secondary)] font-medium">
          Already have an account?{" "}
          <Link href="/login" className="text-[#7C3AED] dark:text-[#A78BFA] font-bold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}