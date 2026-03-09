"use client";

import { useState } from "react";
import { StyleWizardStep } from "@/components/style/StyleWizardStep";
import { StyleOption } from "@/types/style";

const STEPS = [
  { id: "details", label: "Proje Detayları" },
  { id: "style", label: "Görsel Stil" },
  { id: "assets", label: "Görseller" },
  { id: "voice", label: "Ses" },
  { id: "subtitles", label: "Altyazılar" },
  { id: "music", label: "Müzik" },
  { id: "review", label: "İnceleme" },
];

export default function VideoWizardPage() {
  const [currentStep, setCurrentStep] = useState(1); // 0-indexed, step 1 is Visual Style
  const [selectedStyle, setSelectedStyle] = useState<StyleOption | null>(null);
  const [, setWizardData] = useState<{
    style?: StyleOption;
  }>({});

  const handleStyleSelect = (style: StyleOption) => {
    setSelectedStyle(style);
    setWizardData((prev) => ({ ...prev, style }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const currentStepData = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-[var(--color-background-dark)]">
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[var(--color-border)] px-6 lg:px-10 py-4">
          <div className="flex items-center gap-3 text-[var(--color-text-main)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-[var(--color-primary)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <h1 className="text-xl font-bold">ReelForge</h1>
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Yardım
          </button>
        </header>

        {/* Progress Stepper */}
        <div className="flex flex-col gap-3 p-4 px-6 lg:px-10 border-b border-[var(--color-border)]">
          <div className="flex gap-6 justify-between items-center">
            <p className="text-base font-semibold text-[var(--color-text-muted)]">
              Adım {currentStep + 1} / {STEPS.length}
            </p>
            <span className="text-sm font-medium text-[var(--color-primary)]">%{Math.round(progress)} Tamamlandı</span>
          </div>
          <div className="rounded-full bg-[var(--color-surface-dark)] h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 overflow-x-auto">
            {STEPS.map((step, index) => (
              <span
                key={step.id}
                className={`text-xs whitespace-nowrap px-2 ${
                  index === currentStep
                    ? "font-bold text-[var(--color-primary)]"
                    : index < currentStep
                      ? "text-[var(--color-text-main)]"
                      : "text-[var(--color-text-muted)]"
                }`}
              >
                {step.label}
              </span>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-6 lg:px-10 py-6 max-w-[1200px] mx-auto w-full">
          {currentStep === 1 && (
            <StyleWizardStep
              onNext={handleNext}
              onBack={handleBack}
              onStyleSelect={handleStyleSelect}
              selectedStyleValue={selectedStyle?.value || null}
            />
          )}
          {currentStep !== 1 && (
            <div className="flex flex-col items-center justify-center h-64 text-[var(--color-text-muted)]">
              <p>Bu adım henüz uygulanmadı.</p>
              <p className="text-sm mt-2">Mevcut: {currentStepData.label}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
