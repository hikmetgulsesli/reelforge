import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Header />
      
      <main className="flex-1">
        <div className="px-4 sm:px-8 md:px-16 lg:px-40 flex flex-col">
          <div className="max-w-[1200px] mx-auto w-full">
            <HeroSection />
            <FeaturesSection />
            <PricingSection />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
