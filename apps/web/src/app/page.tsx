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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#08090a] text-zinc-100 selection:bg-emerald-500/20 selection:text-emerald-300 font-sans">
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
  );
}
