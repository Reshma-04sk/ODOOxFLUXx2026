import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppQueryProvider } from "@/lib/query-client";
import { Toaster } from "sonner";
import { LenisScrollProvider } from "@/components/landing/lenis-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "PlanLedger — Subscription Management & Financial Operations Platform",
  description:
    "Enterprise-grade subscription engine, PostgreSQL 17 transaction guarantees, idempotent recurring billing, and real-time financial ledger built for the Odoo Hackathon 2026.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#08090a] text-zinc-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
        <AppQueryProvider>
          <LenisScrollProvider>
            {children}
            <Toaster richColors position="top-right" theme="dark" />
          </LenisScrollProvider>
        </AppQueryProvider>
      </body>
    </html>
  );
}
