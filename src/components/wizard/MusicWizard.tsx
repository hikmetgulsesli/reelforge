"use client";

import { useAppStore } from "../../lib/store";
import { Check, Music, Play, VolumeX } from "lucide-react";
import { useState } from "react";

interface MusicWizardProps {
  onNext: () => void;
  onPrev: () => void;
}

const MUSIC_OPTIONS = [
  { id: "upbeat-1", name: "Enerjik Pop", genre: "Pop", duration: "0:30", mood: "Neşeli" },
  { id: "chill-1", name: "Rahatlatıcı", genre: "Lo-Fi", duration: "0:45", mood: "Sakin" },
  { id: "epic-1", name: "Epik Orkestra", genre: "Sinematik", duration: "0:30", mood: "Dramatik" },
  { id: "tech-1", name: "Teknoloji", genre: "Elektronik", duration: "0:30", mood: "Modern" },
  { id: "nature-1", name: "Doğa Sesleri", genre: "Ambient", duration: "0:45", mood: "Huzurlu" },
  { id: "none", name: "Müzik Yok", genre: "-", duration: "-", mood: "-" },
];

export function MusicWizard({ onNext, onPrev }: MusicWizardProps) {
  const { videoDraft, updateVideoDraft } = useAppStore();
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleSelect = (musicId: string, musicName: string) => {
    updateVideoDraft({ musicId, musicName });
  };

  const handlePlayPreview = (musicId: string) => {
    setPlayingId(musicId);
    setTimeout(() => setPlayingId(null), 2000);
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">
          Arka Plan Müziği
        </h2>
        <p className="text-[var(--text-muted)] mt-1">
          Videonuz için arka plan müziği seçin
        </p>
      </div>

      {/* Music Grid */}
      <div className="space-y-3">
        {MUSIC_OPTIONS.map((music) => (
          <div
            key={music.id}
            onClick={() => handleSelect(music.id, music.name)}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              videoDraft.musicId === music.id
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                : "border-[var(--border)] hover:border-[var(--color-primary)]/50 bg-[var(--background)]"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              {music.id === "none" ? (
                <VolumeX className="w-6 h-6 text-white" />
              ) : (
                <Music className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{music.name}</p>
              <p className="text-sm text-[var(--text-muted)]">{music.genre} • {music.mood}</p>
            </div>
            <span className="text-sm text-[var(--text-muted)]">{music.duration}</span>
            {music.id !== "none" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPreview(music.id);
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  playingId === music.id
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-surface-hover)] text-[var(--text-muted)] hover:text-white"
                }`}
              >
                <Play className="w-4 h-4" />
              </button>
            )}
            {videoDraft.musicId === music.id && (
              <Check className="w-5 h-5 text-[var(--color-primary)]" />
            )}
          </div>
        ))}
      </div>

      {/* Volume Control */}
      {videoDraft.musicId && videoDraft.musicId !== "none" && (
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)]">
          <p className="text-white font-medium mb-3">Müzik Seviyesi</p>
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="50"
            className="w-full accent-[var(--color-primary)]"
          />
          <div className="flex justify-between text-sm text-[var(--text-muted)] mt-1">
            <span>Sessiz</span>
            <span>Yüksek</span>
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