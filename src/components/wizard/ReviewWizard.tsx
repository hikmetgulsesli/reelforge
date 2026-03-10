"use client";

import { useAppStore } from "../../lib/store";
import { Check, Video, Palette, Volume2, Type, Music, Film, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ReviewWizardProps {
  onPrev: () => void;
}

const STYLE_NAMES: Record<string, string> = {
  "cinematic": "Sinematik",
  "cyberpunk": "Cyberpunk",
  "minimal": "Minimal",
  "3d-abstract": "3D Abstract",
  "nature": "Doğa",
  "retro": "Retro",
  "tech": "Teknoloji",
  "dark": "Karanlık",
};

export function ReviewWizard({ onPrev }: ReviewWizardProps) {
  const { videoDraft, credits, setCredits, addVideo, resetVideoDraft } = useAppStore();
  const [isRendering, setIsRendering] = useState(false);
  const [renderComplete, setRenderComplete] = useState(false);
  const router = useRouter();

  const handleRender = async () => {
    if (credits < 1) return;
    
    setIsRendering(true);
    
    // Simulate rendering process
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    // Create video project
    const newVideo = {
      id: `video-${Date.now()}`,
      title: videoDraft.title || "Untitled",
      script: videoDraft.script || "",
      style: videoDraft.style || "cinematic",
      voiceId: videoDraft.voiceId || null,
      voiceName: videoDraft.voiceName || null,
      subtitlesEnabled: videoDraft.subtitlesEnabled ?? true,
      subtitleStyle: videoDraft.subtitleStyle || "modern",
      musicId: videoDraft.musicId || null,
      musicName: videoDraft.musicName || null,
      status: "completed" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      duration: 45,
    };
    
    addVideo(newVideo);
    setCredits(credits - 1);
    setIsRendering(false);
    setRenderComplete(true);
    
    // Reset wizard after a delay
    setTimeout(() => {
      resetVideoDraft();
      router.push("/library");
    }, 2000);
  };

  const summaryItems = [
    { icon: <Film className="w-5 h-5" />, label: "Başlık", value: videoDraft.title || "Belirtilmedi" },
    { icon: <Palette className="w-5 h-5" />, label: "Stil", value: STYLE_NAMES[videoDraft.style || "cinematic"] || "Sinematik" },
    { icon: <Volume2 className="w-5 h-5" />, label: "Seslendirme", value: videoDraft.voiceName || "Seçilmedi" },
    { icon: <Type className="w-5 h-5" />, label: "Altyazı", value: videoDraft.subtitlesEnabled ? `Evet (${videoDraft.subtitleStyle})` : "Hayır" },
    { icon: <Music className="w-5 h-5" />, label: "Müzik", value: videoDraft.musicName || "Yok" },
  ];

  if (renderComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
          <Check className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">
          Video Oluşturuldu!
        </h2>
        <p className="text-[var(--text-muted)] text-center">
          Videonuz başarıyla oluşturuldu. Kütüphaneye yönlendiriliyorsunuz...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">
          İnceleme ve Render
        </h2>
        <p className="text-[var(--text-muted)] mt-1">
          Video ayarlarınızı kontrol edin ve render işlemini başlatın
        </p>
      </div>

      {/* Video Preview */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center">
          <Video className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <p className="text-white font-medium">{videoDraft.title}</p>
          <p className="text-sm text-white/50 mt-1">Tahmini süre: 45 saniye</p>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">Video Özeti</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {summaryItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--background)]"
            >
              <div className="text-[var(--color-primary)]">{item.icon}</div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">{item.label}</p>
                <p className="text-sm text-white font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Credit Info */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-[var(--background)]">
        <div>
          <p className="text-white font-medium">Kredi Maliyeti</p>
          <p className="text-sm text-[var(--text-muted)]">1 video = 1 kredi</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-[var(--color-primary)]">1 Kredi</p>
          <p className="text-sm text-[var(--text-muted)]">Kalan: {credits} kredi</p>
        </div>
      </div>

      {/* Error if no credits */}
      {credits < 1 && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10">
          <p className="text-red-400 text-sm">
            Yeterli krediniz yok. Lütfen kredi satın alın.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onPrev}
          disabled={isRendering}
          className="px-6 py-3 rounded-xl border border-[var(--border)] text-white font-medium hover:bg-[var(--color-surface-hover)] transition-colors disabled:opacity-50"
        >
          ← Önceki
        </button>
        <button
          onClick={handleRender}
          disabled={isRendering || credits < 1}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-purple-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isRendering ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Render Ediliyor...
            </>
          ) : (
            <>
              <Video className="w-5 h-5" />
              Render Başlat
            </>
          )}
        </button>
      </div>
    </div>
  );
}