import React from 'react';
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { Footer } from "@/components/footer";
import { PricingSection } from "@/components/pricing-section";

export default function LandingPage() {
    return (
        <main className="min-h-screen overflow-hidden">
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <PricingSection />
            <TestimonialsSection />
            <Footer />
        </main>
    );
}
