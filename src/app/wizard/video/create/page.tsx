'use client';

import { useState, useCallback } from 'react';
import { MusicStep, WizardProgress, WizardNavigation, WIZARD_STEPS, type MusicStepData } from '@/components/wizard';
import { useRouter } from 'next/navigation';

const CURRENT_STEP = 6; // Music step

export default function VideoCreateWizardPage() {
  const router = useRouter();
  const [musicData, setMusicData] = useState<MusicStepData>({
    selectedMusicId: null,
    category: 'upbeat',
    volume: 70,
    voiceDucking: 30,
    fadeIn: 0,
    fadeOut: 0,
    aiRecommendation: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDataChange = useCallback((data: MusicStepData) => {
    setMusicData(data);
  }, []);

  const handleNext = useCallback(() => {
    setIsSubmitting(true);
    // In a real app, save data to store/API
    setTimeout(() => {
      router.push('/wizard/video/review');
    }, 500);
  }, [router]);

  const handlePrevious = useCallback(() => {
    router.push('/wizard/video/subtitles');
  }, [router]);

  return (
    <main className="flex-1 flex flex-col max-w-[1200px] w-full mx-auto px-4 py-8 md:px-8">
      {/* Progress Stepper */}
      <WizardProgress
        currentStep={CURRENT_STEP}
        totalSteps={WIZARD_STEPS.length}
        steps={WIZARD_STEPS}
      />

      {/* Music Step Component */}
      <MusicStep
        initialData={musicData}
        onDataChange={handleDataChange}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      {/* Navigation */}
      <WizardNavigation
        currentStep={CURRENT_STEP}
        totalSteps={WIZARD_STEPS.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
        canProceed={true}
        isSubmitting={isSubmitting}
        nextLabel="Sonraki: Son Dışa Aktarma"
        previousLabel="Geri"
      />
    </main>
  );
}