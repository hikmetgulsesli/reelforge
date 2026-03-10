"use client";

import { useAppStore } from "../../lib/store";
import { Check } from "lucide-react";

interface StyleWizardProps {
  onNext: () => void;
  onPrev: () => void;
}

const VISUAL_STYLES = [
  { id: "cinematic", name: "Sinematik", description: "Film kalitesinde görüntüler", color: "from-amber-500 to-orange-600" },
  { id: "cyberpunk", name: "Cyberpunk", description: "Neon ve futuristik temalar", color: "from-purple-500 to-pink-600" },
  { id: "minimal", name: "Minimal", description: "Temiz ve modern tasarım", color: "from-gray-400 to-gray-600" },
  { id: "3d-abstract", name: "3D Abstract", description: "Dinamik 3D şekiller", color: "from-blue-500 to-cyan-600" },
  { id: "nature", name: "Doğa", description: "Doğal ve organik görüntüler", color: "from-green-500 to-emerald-600" },
  { id: "retro", name: "Retro", description: "80'ler ve 90'lar estetiği", color: "from-pink-500 to-yellow-500" },
  { id: "tech", name: "Teknoloji", description: "Dijital ve tech temalar", color: "from-cyan-500 to-blue-600" },
  { id: "dark", name: "Karanlık", description: "Gizemli ve dramatik", color: "from-gray-700 to-gray-900" },
];

export function StyleWizard({ onNext, onPrev }: StyleWizardProps) {
  const { videoDraft, updateVideoDraft } = useAppStore();

  const handleSelect = (styleId: string) => {
    updateVideoDraft({ style: styleId });
  };

  const handleNext = () => {
    if (videoDraft.style) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">
          Görsel Stil Seçin
        </h2>
        <p className="text-[var(--text-muted)] mt-1">
          Videonuzun görsel tarzını belirleyin
        </p>
      </div>

      {/* Style Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {VISUAL_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => handleSelect(style.id)}
            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
              videoDraft.style === style.id
                ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/50"
                : "border-[var(--border)] hover:border-[var(--color-primary)]/50"
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${style.color}`} />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-3">
              <p className="text-white font-medium text-center">{style.name}</p>
              <p className="text-white/70 text-xs text-center mt-1">{style.description}</p>
            </div>
            {videoDraft.style === style.id && (
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
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
          disabled={!videoDraft.style}
          className="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sonraki Adım →
        </button>
      </div>
    </div>
  );
}