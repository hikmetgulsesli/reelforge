"use client";

import { useAppStore } from "../../lib/store";
import { Check, Volume2, Play } from "lucide-react";
import { useState } from "react";

interface VoiceWizardProps {
  onNext: () => void;
  onPrev: () => void;
}

const VOICE_OPTIONS = [
  { id: "tr-female-1", name: "Elif", gender: "Kadın", accent: "Türkçe", preview: "Merhaba, ben Elif." },
  { id: "tr-female-2", name: "Zeynep", gender: "Kadın", accent: "Türkçe", preview: "Merhaba, ben Zeynep." },
  { id: "tr-male-1", name: "Burak", gender: "Erkek", accent: "Türkçe", preview: "Merhaba, ben Burak." },
  { id: "tr-male-2", name: "Mert", gender: "Erkek", accent: "Türkçe", preview: "Merhaba, ben Mert." },
  { id: "en-female-1", name: "Sarah", gender: "Kadın", accent: "İngilizce", preview: "Hello, I'm Sarah." },
  { id: "en-male-1", name: "James", gender: "Erkek", accent: "İngilizce", preview: "Hello, I'm James." },
];

export function VoiceWizard({ onNext, onPrev }: VoiceWizardProps) {
  const { videoDraft, updateVideoDraft } = useAppStore();
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleSelect = (voiceId: string, voiceName: string) => {
    updateVideoDraft({ voiceId, voiceName });
  };

  const handlePlayPreview = (voiceId: string) => {
    setPlayingId(voiceId);
    // Simulate playing audio
    setTimeout(() => setPlayingId(null), 2000);
  };

  const handleNext = () => {
    if (videoDraft.voiceId) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">
          Seslendirme Seçin
        </h2>
        <p className="text-[var(--text-muted)] mt-1">
          Videonuz için AI sesi seçin
        </p>
      </div>

      {/* Voice Grid */}
      <div className="space-y-3">
        {VOICE_OPTIONS.map((voice) => (
          <div
            key={voice.id}
            onClick={() => handleSelect(voice.id, voice.name)}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              videoDraft.voiceId === voice.id
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                : "border-[var(--border)] hover:border-[var(--color-primary)]/50 bg-[var(--background)]"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{voice.name}</p>
              <p className="text-sm text-[var(--text-muted)]">{voice.gender} • {voice.accent}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePlayPreview(voice.id);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                playingId === voice.id
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-surface-hover)] text-[var(--text-muted)] hover:text-white"
              }`}
            >
              <Play className="w-4 h-4" />
            </button>
            {videoDraft.voiceId === voice.id && (
              <Check className="w-5 h-5 text-[var(--color-primary)]" />
            )}
          </div>
        ))}
      </div>

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
          disabled={!videoDraft.voiceId}
          className="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sonraki Adım →
        </button>
      </div>
    </div>
  );
}