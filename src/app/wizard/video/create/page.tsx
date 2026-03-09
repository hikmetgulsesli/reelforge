'use client';

import { useState, useCallback } from 'react';
import { WizardProgress, WIZARD_STEPS, WizardNavigation, ScriptStep, type ScriptStepData } from '@/components/wizard';

export default function VideoCreateWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [scriptData, setScriptData] = useState<ScriptStepData | null>(null);

  const handleScriptDataChange = useCallback((data: ScriptStepData) => {
    setScriptData(data);
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return scriptData?.generatedScript ? scriptData.generatedScript.trim().length > 0 : false;
      default:
        return true;
    }
  }, [currentStep, scriptData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-border px-6 lg:px-10 py-3 bg-background z-10 sticky top-0">
        <div className="flex items-center gap-4 text-primary">
          <div className="size-6">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
            </svg>
          </div>
          <h2 
            className="text-xl font-bold leading-tight tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ReelForge
          </h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <nav className="hidden md:flex items-center gap-9">
            <a className="text-foreground text-sm font-medium leading-normal hover:text-primary transition-colors" href="/dashboard">
              Dashboard
            </a>
            <a className="text-foreground text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">
              Projeler
            </a>
            <a className="text-foreground text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">
              Sablonlar
            </a>
          </nav>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-border bg-surface" />
        </div>
      </header>

      {/* Main Content */}
      <div className="layout-container flex flex-1 flex-col max-w-[1200px] mx-auto w-full px-6 py-8">
        {/* Progress */}
        <WizardProgress
          currentStep={currentStep}
          totalSteps={WIZARD_STEPS.length}
          steps={WIZARD_STEPS}
        />

        {/* Step Content */}
        <div className="mt-8">
          {currentStep === 1 && (
            <ScriptStep
              onDataChange={handleScriptDataChange}
            />
          )}
          
          {/* Placeholder for other steps */}
          {currentStep === 2 && (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
              <p className="text-lg">Gorsel Stil Secimi - Yakinda</p>
            </div>
          )}
          {currentStep === 3 && (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
              <p className="text-lg">Varlik Secimi - Yakinda</p>
            </div>
          )}
          {currentStep === 4 && (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
              <p className="text-lg">Seslendirme Secimi - Yakinda</p>
            </div>
          )}
          {currentStep === 5 && (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
              <p className="text-lg">Altyazi Yapilandirma - Yakinda</p>
            </div>
          )}
          {currentStep === 6 && (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
              <p className="text-lg">Arka Plan Muzigi - Yakinda</p>
            </div>
          )}
          {currentStep === 7 && (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
              <p className="text-lg">Gozden Gecir ve Render - Yakinda</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <WizardNavigation
          currentStep={currentStep}
          totalSteps={WIZARD_STEPS.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canProceed={canProceed()}
          nextLabel={currentStep === 1 ? 'Gorsel Sec' : 'Sonraki'}
          previousLabel="Iptal"
        />
      </div>
    </div>
  );
}