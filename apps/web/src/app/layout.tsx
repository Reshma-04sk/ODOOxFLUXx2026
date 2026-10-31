import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppQueryProvider } from "@/lib/query-client";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlanLedger — Brightloop Software Subscription Management",
  description: "Enterprise SaaS subscription lifecycle, idempotent billing engine, and financial ledger.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#070b12] text-slate-100">
        <AppQueryProvider>
          {children}
          <Toaster richColors position="top-right" theme="dark" />
        </AppQueryProvider>
      </body>
    </html>
  );
}
