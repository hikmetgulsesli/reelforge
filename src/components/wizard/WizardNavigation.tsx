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
    <div className="mt-8 pt-6 border-t border-primary/20 flex flex-col sm:flex-row justify-between items-center gap-4">
      <button
        onClick={onPrevious}
        disabled={isFirstStep}
        className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${
          isFirstStep
            ? 'border-2 border-primary/20 text-muted-foreground/50 cursor-not-allowed'
            : 'border-2 border-primary/20 text-muted-foreground hover:bg-primary/5'
        }`}
        aria-label="Onceki adim"
      >
        <ArrowLeft className="w-5 h-5" />
        {previousLabel}
      </button>

      <button
        onClick={onNext}
        disabled={!canProceed || isSubmitting}
        className={`w-full sm:w-auto px-8 py-3 rounded-xl text-white font-bold transition-colors shadow-lg flex items-center justify-center gap-2 ${
          isLastStep
            ? 'bg-green-600 hover:bg-green-700 shadow-green-600/30'
            : 'bg-primary hover:bg-primary/90 shadow-primary/30'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label={isLastStep ? 'Tamamla' : 'Sonraki adim'}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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