"use client";

import { useRouter } from "next/navigation";
import { VoiceWizard } from "@/components/wizard/VoiceWizard";
import type { VoiceSettings } from "@/types/voice";

export default function VoiceWizardPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/wizard/assets");
  };

  const handleNext = (settings: VoiceSettings) => {
    // Save settings to state/store
    console.log("Voice settings:", settings);
    router.push("/wizard/music");
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-80px)]">
        <VoiceWizard
          userPlan="pro"
          onBack={handleBack}
          onNext={handleNext}
        />
      </main>
    </div>
  );
}
