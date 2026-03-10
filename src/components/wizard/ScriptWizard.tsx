"use client";

import { useAppStore } from "../../lib/store";
import { useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";

interface ScriptWizardProps {
  onNext: () => void;
}

export function ScriptWizard({ onNext }: ScriptWizardProps) {
  const { videoDraft, updateVideoDraft } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIGenerate = async () => {
    if (!videoDraft.title) return;
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const generatedScript = `🎬 ${videoDraft.title}

Bu videoda, izleyicilerinizi etkileyecek harika içerik sunuyoruz.

✨ Ana Noktalar:
• İlginç ve dikkat çekici açılış
• Değerli içerik ve bilgiler
• Etkileyici kapanış ve çağrı

🚀 İzleyicilerinizi harekete geçirin!`;
    
    updateVideoDraft({ script: generatedScript });
    setIsGenerating(false);
  };

  const handleNext = () => {
    if (videoDraft.script && videoDraft.title) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">
          Senaryo Oluştur
        </h2>
        <p className="text-[var(--text-muted)] mt-1">
          Video başlığınızı girin ve AI ile senaryo oluşturun
        </p>
      </div>

      {/* Title Input */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Video Başlığı
        </label>
        <input
          type="text"
          value={videoDraft.title || ""}
          onChange={(e) => updateVideoDraft({ title: e.target.value })}
          placeholder="Örn: 5 Saniyede Uygulama Tanıtımı"
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
        />
      </div>

      {/* AI Generate Button */}
      <button
        onClick={handleAIGenerate}
        disabled={!videoDraft.title || isGenerating}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-purple-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Wand2 className={`w-5 h-5 ${isGenerating ? "animate-spin" : ""}`} />
        {isGenerating ? "Oluşturuluyor..." : "AI ile Senaryo Oluştur"}
      </button>

      {/* Script Editor */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Video Senaryosu
        </label>
        <textarea
          value={videoDraft.script || ""}
          onChange={(e) => updateVideoDraft({ script: e.target.value })}
          placeholder="Senaryonuzu buraya yazın veya AI ile oluşturun..."
          rows={10}
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
        />
      </div>

      {/* Tips */}
      <div className="bg-[var(--color-primary)]/10 rounded-xl p-4 border border-[var(--color-primary)]/20">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-white">İpucu</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Kısa videolar için 150-300 kelimelik senaryolar en iyi sonucu verir.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleNext}
          disabled={!videoDraft.script || !videoDraft.title}
          className="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sonraki Adım →
        </button>
      </div>
    </div>
  );
}