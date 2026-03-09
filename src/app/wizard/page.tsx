"use client";

import React, { useState } from "react";
import { ScriptWizard } from "@/components/script-wizard/ScriptWizard";
import { cn } from "@/lib/utils";

const STEPS = [
  { number: 1, label: "Script", active: true },
  { number: 2, label: "Görseller", active: false },
  { number: 3, label: "Ses", active: false },
  { number: 4, label: "Ses", active: false },
  { number: 5, label: "Altyazı", active: false },
  { number: 6, label: "Müzik", active: false },
  { number: 7, label: "İncele", active: false },
];

export default function WizardPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleCancel = () => {
    // Navigate back or reset
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[var(--border)] px-6 sm:px-10 py-3 bg-[var(--background)] z-10 sticky top-0">
        <div className="flex items-center gap-4 text-[var(--primary)]">
          <div className="size-6">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
            </svg>
          </div>
          <h2 className="font-[var(--font-display)] text-xl font-bold leading-tight tracking-[-0.015em] text-[var(--text-main)]">
            ReelForge
          </h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9 hidden sm:flex">
            <a
              className="text-[var(--text-main)] text-sm font-medium leading-normal hover:text-[var(--primary)] transition-colors"
              href="/dashboard"
            >
              Dashboard
            </a>
            <a
              className="text-[var(--text-main)] text-sm font-medium leading-normal hover:text-[var(--primary)] transition-colors"
              href="#"
            >
              Projeler
            </a>
            <a
              className="text-[var(--text-main)] text-sm font-medium leading-normal hover:text-[var(--primary)] transition-colors"
              href="#"
            >
              Şablonlar
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="layout-container flex flex-1 flex-col max-w-[1200px] mx-auto w-full px-4 sm:px-6 py-8">
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-[var(--font-display)] text-xl font-bold">
              Proje Oluşturma Sihirbazı
            </h3>
            <span className="text-sm text-[var(--text-muted)] font-medium">
              Adım {currentStep} / 7
            </span>
          </div>
          <div className="flex items-center w-full">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center relative z-10">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                      step.number <= currentStep
                        ? "bg-[var(--primary)] text-white shadow-md"
                        : "bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)]"
                    )}
                  >
                    {step.number}
                  </div>
                  {step.label && (
                    <span
                      className={cn(
                        "absolute top-10 text-xs font-medium whitespace-nowrap hidden sm:block",
                        step.number <= currentStep
                          ? "text-[var(--primary)]"
                          : "text-[var(--text-muted)]"
                      )}
                    >
                      {step.label}
                    </span>
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div className="flex-1 h-1 mx-2 rounded-full bg-[var(--surface)] border border-[var(--border)]">
                    <div
                      className={cn(
                        "h-full rounded-full bg-[var(--primary)] transition-all",
                        step.number < currentStep ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Wizard Content */}
        <div className="mt-8">
          {currentStep === 1 && (
            <ScriptWizard onNext={handleNext} onCancel={handleCancel} />
          )}
          {currentStep > 1 && (
            <div className="text-center py-20">
              <p className="text-[var(--text-muted)]">
                Adım {currentStep} yakında geliyor...
              </p>
              <button
                onClick={() => setCurrentStep(1)}
                className="mt-4 text-[var(--primary)] hover:underline"
              >
                Script adımına dön
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
