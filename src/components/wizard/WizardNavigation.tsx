'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onPrevious?: () => void;
  canProceed?: boolean;
  isSubmitting?: boolean;
  nextLabel?: string;
  previousLabel?: string;
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  canProceed = true,
  isSubmitting = false,
  nextLabel = 'Sonraki',
  previousLabel = 'Onceki',
}: WizardNavigationProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
      <button
        onClick={onPrevious}
        disabled={isFirstStep}
        className={`px-6 py-2.5 font-medium transition-colors flex items-center gap-2 ${
          isFirstStep
            ? 'text-muted-foreground/50 cursor-not-allowed'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        {previousLabel}
      </button>

      <button
        onClick={onNext}
        disabled={!canProceed || isSubmitting}
        className={`bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-md ${
          isLastStep ? 'bg-green-600 hover:bg-green-700' : ''
        }`}
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Isleniyor...
          </>
        ) : isLastStep ? (
          <>
            Tamamla
            <ArrowRight className="w-5 h-5" />
          </>
        ) : (
          <>
            {nextLabel}
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
}

export default WizardNavigation;