import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppQueryProvider } from "@/lib/query-client";
import { Toaster } from "sonner";
import { LenisScrollProvider } from "@/components/landing/lenis-provider";
import { ThemeProvider } from "@/components/theme-provider";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "PlanLedger - Subscription Management & Financial Operations Platform",
  description:
    "Next-generation FinTech subscription and financial operations platform. PostgreSQL 17 transactional guarantees, idempotent recurring billing, real-time ledger pulse.",
  keywords: ["subscription management", "FinTech", "billing engine", "PostgreSQL 17", "Next.js"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AppQueryProvider>
            <LenisScrollProvider>
              {children}
              <Toaster position="top-right" richColors />
            </LenisScrollProvider>
          </AppQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
