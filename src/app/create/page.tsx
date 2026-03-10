"use client";
export const dynamic = "force-dynamic";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Header } from "../../components/layout/Header";
import { useAppStore } from "../../lib/store";
import { ScriptWizard } from "../../components/wizard/ScriptWizard";
import { StyleWizard } from "../../components/wizard/StyleWizard";
import { VoiceWizard } from "../../components/wizard/VoiceWizard";
import { SubtitleWizard } from "../../components/wizard/SubtitleWizard";
import { MusicWizard } from "../../components/wizard/MusicWizard";
import { ReviewWizard } from "../../components/wizard/ReviewWizard";

const WIZARD_STEPS = [
  { id: 1, name: "Senaryo", description: "Video içeriğini yazın" },
  { id: 2, name: "Stil", description: "Görsel stil seçin" },
  { id: 3, name: "Seslendirme", description: "AI ses seçin" },
  { id: 4, name: "Altyazı", description: "Altyazı ayarları" },
  { id: 5, name: "Müzik", description: "Arka plan müziği" },
  { id: 6, name: "İnceleme", description: "Son kontroller" },
];

export default function CreatePage() {
  const { currentStep, setCurrentStep } = useAppStore();

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ScriptWizard onNext={handleNext} />;
      case 2:
        return <StyleWizard onNext={handleNext} onPrev={handlePrev} />;
      case 3:
        return <VoiceWizard onNext={handleNext} onPrev={handlePrev} />;
      case 4:
        return <SubtitleWizard onNext={handleNext} onPrev={handlePrev} />;
      case 5:
        return <MusicWizard onNext={handleNext} onPrev={handlePrev} />;
      case 6:
        return <ReviewWizard onPrev={handlePrev} />;
      default:
        return <ScriptWizard onNext={handleNext} />;
    }
  };

  return (
    <DashboardLayout>
      <Header title="Video Oluştur" />
      <div className="flex-1 overflow-y-auto p-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {WIZARD_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      currentStep >= step.id
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]"
                    }`}
                  >
                    {currentStep > step.id ? "✓" : step.id}
                  </div>
                  <div className="mt-2 text-center">
                    <p
                      className={`text-xs font-medium ${
                        currentStep >= step.id
                          ? "text-[var(--color-primary)]"
                          : "text-[var(--text-muted)]"
                      }`}
                    >
                      {step.name}
                    </p>
                  </div>
                </div>
                {index < WIZARD_STEPS.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${
                      currentStep > step.id
                        ? "bg-[var(--color-primary)]"
                        : "bg-[var(--border)]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6">
            {renderStep()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}