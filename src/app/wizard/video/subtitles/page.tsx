'use client';

import { useState, useCallback } from 'react';
import { SubtitlesStep, WizardProgress, WizardNavigation, WIZARD_STEPS, type SubtitlesStepData } from '@/components/wizard';
import { useRouter } from 'next/navigation';

const CURRENT_STEP = 5; // Subtitles step

export default function SubtitlesWizardPage() {
  const router = useRouter();
  const [subtitlesData, setSubtitlesData] = useState<SubtitlesStepData>({
    selectedPreset: 'modern-bold',
    fontFamily: 'inter',
    textColor: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0.6)',
    outlineColor: '#000000',
    animationEnabled: true,
    position: 'bottom',
  });

  const handleDataChange = useCallback((data: SubtitlesStepData) => {
    setSubtitlesData(data);
  }, []);

  const handleNext = useCallback(() => {
    router.push('/wizard/video/create');
  }, [router]);

  const handlePrevious = useCallback(() => {
    router.push('/wizard/video/voice');
  }, [router]);

  return (
    <main className="flex-1 flex flex-col max-w-[1200px] w-full mx-auto px-4 py-8 md:px-8">
      {/* Progress Stepper */}
      <WizardProgress
        currentStep={CURRENT_STEP}
        totalSteps={WIZARD_STEPS.length}
        steps={WIZARD_STEPS}
      />

      {/* Subtitles Step Component */}
      <SubtitlesStep
        initialData={subtitlesData}
        onDataChange={handleDataChange}
      />

      {/* Navigation */}
      <WizardNavigation
        currentStep={CURRENT_STEP}
        totalSteps={WIZARD_STEPS.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
        canProceed={true}
        nextLabel="Sonraki: Muzik"
        previousLabel="Geri"
      />
    </main>
  );
}