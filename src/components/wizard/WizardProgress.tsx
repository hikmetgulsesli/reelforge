'use client';

import { Check } from 'lucide-react';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: { id: string; label: string; shortLabel?: string }[];
}

export function WizardProgress({ currentStep, totalSteps, steps }: WizardProgressProps) {
  return (
    <div className="flex flex-col gap-3 mb-8 w-full max-w-3xl mx-auto">
      <div className="flex gap-6 justify-between items-end">
        <p
          className="font-bold text-lg"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Adim {currentStep}: {steps[currentStep - 1]?.label || ''}
        </p>
        <p className="text-sm font-medium text-muted-foreground">
          {currentStep} / {totalSteps}
        </p>
      </div>
      <div className="rounded-full bg-primary/20 h-2.5 w-full overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}

export const WIZARD_STEPS = [
  { id: 'script', label: 'Senaryo', shortLabel: 'Senaryo' },
  { id: 'visuals', label: 'Gorsel Stil', shortLabel: 'Gorsel' },
  { id: 'assets', label: 'Varliklar', shortLabel: 'Varlik' },
  { id: 'voice', label: 'Seslendirme', shortLabel: 'Ses' },
  { id: 'subtitles', label: 'Altyazi', shortLabel: 'Altyazi' },
  { id: 'music', label: 'Muzik', shortLabel: 'Muzik' },
  { id: 'review', label: 'Gozden Gecir', shortLabel: 'Onizleme' },
];

export default WizardProgress;