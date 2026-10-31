"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Mail, Lock, Building, User, ArrowRight, Loader2, AlertCircle, Zap } from "lucide-react";
import { apiService } from "@/services/api-service";
import { SquareLogo } from "@/components/square-logo";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

export function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("admin@brightloop.io");
  const [password, setPassword] = useState("Admin@12345");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    setTab(defaultTab);
    setError(null);
  }, [defaultTab, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiService.auth.login({ email, password });
      onClose();
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid credentials. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiService.auth.register({
        email,
        password,
        full_name: fullName || "Operations Lead",
        company_name: companyName || "Enterprise Corp",
      });
      onClose();
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoInstantAccess = async () => {
    setEmail("admin@brightloop.io");
    setPassword("Admin@12345");
    setLoading(true);
    setError(null);

    try {
      await apiService.auth.login({ email: "admin@brightloop.io", password: "Admin@12345" });
      onClose();
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Demo sign in failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md fintech-card p-6 sm:p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#C4B5FD] text-black flex items-center justify-center font-extrabold shadow-md shrink-0">
            <SquareLogo size={18} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[var(--text-heading)] tracking-tight">
              PlanLedger Access Console
            </h2>
            <p className="text-xs text-[var(--text-secondary)] font-medium">
              Sign in or create an account to enter platform
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-[var(--bg-elevated)] p-1 border border-[var(--border-subtle)] mb-5">
          <button
            type="button"
            onClick={() => { setTab("login"); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === "login"
                ? "bg-[var(--bg-surface)] text-[var(--text-heading)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab("register"); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === "register"
                ? "bg-[var(--bg-surface)] text-[var(--text-heading)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-500 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        {tab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@brightloop.io"
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#C4B5FD] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Password</label>
                <span className="text-[10px] text-[#A78BFA] hover:underline cursor-pointer">Forgot?</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#C4B5FD] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider btn-neon flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Entering Platform...</span>
                </>
              ) : (
                <>
                  <span>Sign In &amp; Enter Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {/* 1-Click Instant Demo Button */}
            <button
              type="button"
              onClick={handleDemoInstantAccess}
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-xs font-bold tracking-wide border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:border-[#C4B5FD] flex items-center justify-center gap-2 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>Instant 1-Click Demo Login</span>
            </button>
          </form>
        )}

        {/* Register Form */}
        {tab === "register" && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Aarav Sharma"
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#C4B5FD] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Company Name</label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  placeholder="Apex Cloud Corp"
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#C4B5FD] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="aarav@apexcloud.io"
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#C4B5FD] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#C4B5FD] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider btn-neon flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account &amp; Enter Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}