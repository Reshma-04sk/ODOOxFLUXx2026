import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { AppQueryProvider } from "@/lib/query-client";
import { Toaster } from "sonner";
import { LenisScrollProvider } from "@/components/landing/lenis-provider";
import { ThemeProvider } from "@/components/theme-provider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "PlanLedger - Subscription Management & Financial Operations Platform",
  description:
    "Enterprise-grade subscription engine built for the Odoo Hackathon 2026. PostgreSQL 17 transaction guarantees, idempotent recurring billing, real-time financial ledger.",
  keywords: ["subscription management", "billing engine", "financial operations", "PostgreSQL", "Django", "Next.js"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AppQueryProvider>
            <LenisScrollProvider>
              {children}
              <Toaster position="top-right" />
            </LenisScrollProvider>
          </AppQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
