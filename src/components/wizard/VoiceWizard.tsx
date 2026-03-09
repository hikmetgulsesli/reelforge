"use client";

import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VoiceCard } from "../voice/VoiceCard";
import { VoiceCategoryTabs } from "../voice/VoiceCategoryTabs";
import { VoiceCustomizationPanel } from "../voice/VoiceCustomizationPanel";
import { VoiceCloningUpload } from "../voice/VoiceCloningUpload";
import type { Voice, VoiceCategory, VoiceSettings } from "@/types/voice";

interface VoiceWizardProps {
  userPlan?: "free" | "starter" | "pro" | "business";
  initialSettings?: Partial<VoiceSettings>;
  onBack?: () => void;
  onNext?: (settings: VoiceSettings) => void;
}

export function VoiceWizard({
  userPlan = "free",
  initialSettings,
  onBack,
  onNext,
}: VoiceWizardProps) {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<VoiceCategory | "ALL">("ALL");
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(
    initialSettings?.voiceId || null
  );
  const [speed, setSpeed] = useState(initialSettings?.speed ?? 1.0);
  const [pitch, setPitch] = useState(initialSettings?.pitch ?? 0);
  const [usePitchAdjustment, setUsePitchAdjustment] = useState(
    initialSettings?.usePitchAdjustment ?? false
  );
  const [error, setError] = useState<string | null>(null);

  // Fetch voices from API
  useEffect(() => {
    async function fetchVoices() {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (activeCategory !== "ALL") {
          params.append("category", activeCategory);
        }

        const response = await fetch(`/api/voices?${params}`);
        if (!response.ok) {
          throw new Error("Failed to fetch voices");
        }

        const result = await response.json();
        setVoices(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sesler yüklenirken hata oluştu");
      } finally {
        setIsLoading(false);
      }
    }

    fetchVoices();
  }, [activeCategory]);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<VoiceCategory | "ALL", number> = {
      ALL: voices.length,
      MALE: 0,
      FEMALE: 0,
      NEUTRAL: 0,
    };

    voices.forEach((voice) => {
      counts[voice.category]++;
    });

    return counts;
  }, [voices]);

  // Selected voice details (available for future use)
  // const selectedVoice = useMemo(
  //   () => voices.find((v) => v.id === selectedVoiceId),
  //   [voices, selectedVoiceId]
  // );

  const handleVoiceSelect = (voice: Voice) => {
    setSelectedVoiceId(voice.id);
  };

  const handleCloningUpload = (file: File) => {
    // In a real implementation, this would upload to a server
    console.log("Voice sample uploaded:", file.name);
  };

  const handleNext = () => {
    if (!selectedVoiceId) return;

    const settings: VoiceSettings = {
      voiceId: selectedVoiceId,
      speed,
      pitch,
      usePitchAdjustment,
    };

    onNext?.(settings);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Progress Stepper */}
      <div className="flex flex-col gap-3 w-full max-w-3xl mx-auto mb-6">
        <div className="flex gap-6 justify-between items-center">
          <p className="font-display text-lg font-bold leading-normal">
            Adım 4: Ses Seçimi
          </p>
          <p className="text-sm font-medium leading-normal text-primary">
            Adım 4 / 7
          </p>
        </div>
        <div className="rounded-full bg-primary/20 dark:bg-primary/10 h-2 w-full overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: "57%" }}
          />
        </div>
        <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
          <span>Senaryo</span>
          <span>Görsel</span>
          <span>Ses</span>
          <span className="text-primary font-bold">Ses</span>
          <span>Müzik</span>
          <span>İncele</span>
          <span>İhracat</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
        {/* Left Column: Voices */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <VoiceCategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            counts={categoryCounts}
          />

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
                {voices.map((voice) => (
                  <VoiceCard
                    key={voice.id}
                    voice={voice}
                    isSelected={voice.id === selectedVoiceId}
                    onSelect={handleVoiceSelect}
                  />
                ))}
              </div>

              {voices.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-500 dark:text-slate-400">
                    Bu kategoride ses bulunamadı.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Customization */}
        <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
          <VoiceCustomizationPanel
            speed={speed}
            onSpeedChange={setSpeed}
            pitch={pitch}
            onPitchChange={setPitch}
            usePitchAdjustment={usePitchAdjustment}
            onUsePitchAdjustmentChange={setUsePitchAdjustment}
          />

          <VoiceCloningUpload
            userPlan={userPlan}
            onUpload={handleCloningUpload}
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Geri
        </Button>
        <Button
          onClick={handleNext}
          disabled={!selectedVoiceId}
          className="flex items-center gap-2"
        >
          Sonraki: Arka Plan Müziği
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
