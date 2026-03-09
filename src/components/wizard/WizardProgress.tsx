'use client';

import { Check } from 'lucide-react';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: { id: string; label: string; shortLabel?: string }[];
}

export function WizardProgress({ currentStep, totalSteps, steps }: WizardProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-xl" style={{ fontFamily: 'var(--font-display)' }}>
          Video Olusturma Sihirbazi
        </h3>
        <span className="text-sm text-muted-foreground font-medium">
          Adim {currentStep} / {totalSteps}
        </span>
      </div>
      <div className="flex items-center w-full overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center relative z-10 min-w-[60px]">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : isCompleted
                        ? 'bg-primary text-white'
                        : 'bg-card border border-border text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={`absolute top-10 text-xs font-medium whitespace-nowrap ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {step.shortLabel || step.label}
                </span>
              </div>
              {index < totalSteps - 1 && (
                <div className="flex-1 h-1 min-w-[20px] mx-2 rounded-full bg-card border border-border overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          );
        })}
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