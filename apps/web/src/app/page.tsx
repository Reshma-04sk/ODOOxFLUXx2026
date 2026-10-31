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
    <div className="min-h-screen bg-[#06141B] text-[#CCD0CF]">
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

