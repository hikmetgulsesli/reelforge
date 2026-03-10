"use client";

import { useAppStore } from "../../lib/store";
import { Check } from "lucide-react";

interface SubtitleWizardProps {
  onNext: () => void;
  onPrev: () => void;
}

const SUBTITLE_STYLES = [
  { id: "modern", name: "Modern", description: "Temiz ve minimalist" },
  { id: "bold", name: "Kalın", description: "Büyük ve dikkat çekici" },
  { id: "neon", name: "Neon", description: "Parlayan efektler" },
  { id: "classic", name: "Klasik", description: "Geleneksel görünüm" },
];

export function SubtitleWizard({ onNext, onPrev }: SubtitleWizardProps) {
  const { videoDraft, updateVideoDraft } = useAppStore();

  const handleToggleSubtitles = () => {
    updateVideoDraft({ subtitlesEnabled: !videoDraft.subtitlesEnabled });
  };

  const handleSelectStyle = (styleId: string) => {
    updateVideoDraft({ subtitleStyle: styleId });
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">
          Altyazı Ayarları
        </h2>
        <p className="text-[var(--text-muted)] mt-1">
          Otomatik altyazı ekleyin ve stilini seçin
        </p>
      </div>

      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-[var(--background)]">
        <div>
          <p className="text-white font-medium">Otomatik Altyazı</p>
          <p className="text-sm text-[var(--text-muted)]">AI ile otomatik altyazı oluştur</p>
        </div>
        <button
          onClick={handleToggleSubtitles}
          className={`w-14 h-8 rounded-full transition-colors ${
            videoDraft.subtitlesEnabled
              ? "bg-[var(--color-primary)]"
              : "bg-[var(--color-surface-hover)]"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full bg-white transition-transform ${
              videoDraft.subtitlesEnabled ? "translate-x-7" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Subtitle Styles */}
      {videoDraft.subtitlesEnabled && (
        <div className="space-y-4">
          <p className="text-white font-medium">Altyazı Stili</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SUBTITLE_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => handleSelectStyle(style.id)}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  videoDraft.subtitleStyle === style.id
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                    : "border-[var(--border)] hover:border-[var(--color-primary)]/50 bg-[var(--background)]"
                }`}
              >
                <div className="text-center">
                  <p className="text-white font-medium">{style.name}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{style.description}</p>
                </div>
                {videoDraft.subtitleStyle === style.id && (
                  <Check className="absolute top-2 right-2 w-4 h-4 text-[var(--color-primary)]" />
                )}
              </button>
            ))}
          </div>

          {/* Preview */}
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)]">
            <p className="text-sm text-[var(--text-muted)] mb-2">Önizleme</p>
            <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-end justify-center pb-4">
              <p className={`text-white text-center px-4 ${
                videoDraft.subtitleStyle === "bold" ? "font-bold text-lg" :
                videoDraft.subtitleStyle === "neon" ? "text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]" :
                videoDraft.subtitleStyle === "classic" ? "bg-black/60 px-2 py-1 text-sm" :
                "text-base"
              }`}>
                Örnek altyazı metni
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onPrev}
          className="px-6 py-3 rounded-xl border border-[var(--border)] text-white font-medium hover:bg-[var(--color-surface-hover)] transition-colors"
        >
          ← Önceki
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          Sonraki Adım →
        </button>
      </div>
    </div>
  );
}