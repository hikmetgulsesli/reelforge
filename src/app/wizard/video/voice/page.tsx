'use client';

import { useState, useCallback } from 'react';
import { VoiceStep, WizardProgress, WizardNavigation, WIZARD_STEPS, type VoiceStepData } from '@/components/wizard';
import { useRouter } from 'next/navigation';

const CURRENT_STEP = 4; // Voice step (Step 4 of 7)

export default function VideoCreateWizardPage() {
  const router = useRouter();
  const [voiceData, setVoiceData] = useState<VoiceStepData>({
    selectedVoice: null,
    voiceCategory: 'male',
    speed: 1.0,
    pitch: 1.0,
    customVoiceFile: null,
    testResult: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock script content - in real app this would come from store/context
  const scriptContent = "Video icin hazirlanan senaryo metni buraya gelecek. Bu metin seslendirme icin kullanilacak.";

  const handleDataChange = useCallback((data: VoiceStepData) => {
    setVoiceData(data);
  }, []);

  const handleNext = useCallback(() => {
    setIsSubmitting(true);
    // In a real app, save data to store/API
    console.log('Voice data:', voiceData);
    setTimeout(() => {
      router.push('/wizard/video/music');
    }, 500);
  }, [router, voiceData]);

  const handlePrevious = useCallback(() => {
    router.push('/wizard/video/visuals');
  }, [router]);

  return (
    <main className="flex-1 flex flex-col max-w-[1200px] w-full mx-auto px-4 py-8 md:px-8">
      {/* Progress Stepper */}
      <WizardProgress
        currentStep={CURRENT_STEP}
        totalSteps={WIZARD_STEPS.length}
        steps={WIZARD_STEPS}
      />

      {/* Voice Step Component */}
      <VoiceStep
        initialData={voiceData}
        onDataChange={handleDataChange}
        scriptContent={scriptContent}
      />

      {/* Navigation */}
      <WizardNavigation
        currentStep={CURRENT_STEP}
        totalSteps={WIZARD_STEPS.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
        canProceed={!!voiceData.selectedVoice}
        isSubmitting={isSubmitting}
        nextLabel="Sonraki: Arka Plan Müzigi"
        previousLabel="Geri: Gorsel"
      />
    </main>
  );
}
