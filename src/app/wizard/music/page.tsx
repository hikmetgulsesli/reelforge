"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MusicSelection } from "@/components/music/MusicSelection";
import { MusicSettings } from "@/types/music";

export default function MusicWizardPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_settings, setSettings] = useState<MusicSettings | null>(null);
  const [currentStep] = useState(6);
  const totalSteps = 7;

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <main className="flex-1 flex flex-col max-w-[1200px] w-full mx-auto px-4 py-8 md:px-8">
      {/* Progress Stepper */}
      <div className="flex flex-col gap-3 mb-8 w-full max-w-3xl mx-auto">
        <div className="flex gap-6 justify-between items-end">
          <p className="font-[family-name:var(--font-display)] text-lg font-semibold">
            Adım 6: Arka Plan Müziği
          </p>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {currentStep} / {totalSteps}
          </p>
        </div>
        <div className="rounded-full bg-primary/20 h-2.5 w-full overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="font-[family-name:var(--font-display)] tracking-tight text-3xl md:text-4xl font-bold mb-2">
          Arka Plan Müziği Seçin
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Videonuz için atmosfer oluşturan bir müzik seçin veya kendi müziğinizi yükleyin.
        </p>
      </div>

      {/* Music Selection Component */}
      <MusicSelection
        onSettingsChange={setSettings}
        initialSettings={{
          trackId: null,
          volume: 30,
          fadeInDuration: 1.5,
          fadeOutDuration: 2.0,
          aiRecommended: false,
          voiceMusicBalance: 70,
        }}
      />

      {/* Navigation Buttons */}
      <div className="mt-auto pt-8 border-t border-primary/20 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link
          href="/wizard/voice"
          className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-primary/20 text-slate-700 dark:text-slate-300 font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Geri
        </Link>
        <Link
          href="/wizard/review"
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
        >
          Sonraki: İncele ve Oluştur
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </main>
  );
}
