import { AboutTeaser } from "@/components/landing/AboutTeaser";
import { BuiltForKitchensSection } from "@/components/landing/BuiltForKitchensSection";
import { FeatureStrip } from "@/components/landing/FeatureStrip";
import { HeroSection } from "@/components/landing/HeroSection";
import { Navbar } from "@/components/landing/Navbar";
import { PricingTeaser } from "@/components/landing/PricingTeaser";
import { SectionContainer } from "@/components/landing/SectionContainer";

export default function Home() {
  return (
    <div className="min-h-full bg-cream text-stone-900">
      <Navbar />
      <main>
        <HeroSection />
        <FeatureStrip />
        <BuiltForKitchensSection />
        <PricingTeaser />
        <AboutTeaser />
      </main>
      <footer className="border-t border-stone-200/70 bg-gradient-to-b from-white/90 to-cream py-10">
        <SectionContainer as="div" className="flex flex-col gap-6 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-stone-800">
            © {new Date().getFullYear()} RasoiAI. Crafted for Indian homes.
          </p>
          <p className="max-w-md text-xs leading-relaxed text-stone-500 sm:text-right">
            Hero photography via Unsplash for demo polish—swap for your own brand
            assets when ready.
          </p>
        </SectionContainer>
      </footer>
    </div>
  );
}
