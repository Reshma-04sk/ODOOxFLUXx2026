import React from "react";
import {
  Navbar,
  HeroSection,
  MetricsBand,
  WorkflowSimulator,
  BentoGrid,
  ArchitectureDeepdive,
  PricingSection,
  TeamSection,
  Footer,
} from "@/components/landing";
import { AuthModalProvider } from "@/components/auth-modal-context";

export default function LandingPage() {
  return (
    <AuthModalProvider>
      <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200">
        <Navbar />
        <main>
          <HeroSection />
          <MetricsBand />
          <WorkflowSimulator />
          <BentoGrid />
          <ArchitectureDeepdive />
          <PricingSection />
          <TeamSection />
        </main>
        <Footer />
      </div>
    </AuthModalProvider>
  );
}