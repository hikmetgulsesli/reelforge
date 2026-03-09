"use client";

import { useState, useRef } from "react";
import { Play, Pause, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Voice } from "@/types/voice";

interface VoiceCardProps {
  voice: Voice;
  isSelected: boolean;
  onSelect: (voice: Voice) => void;
}

export function VoiceCard({ voice, isSelected, onSelect }: VoiceCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!voice.previewUrl) {
      // For voices without preview, just show a toast or alert
      return;
    }

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const categoryLabels: Record<string, string> = {
    MALE: "Erkek",
    FEMALE: "Kadın",
    NEUTRAL: "Nötr",
  };

  const providerLabels: Record<string, string> = {
    ELEVENLABS: "ElevenLabs",
    EDGE_TTS: "Edge TTS",
    CUSTOM: "Özel",
  };

  return (
    <div
      onClick={() => onSelect(voice)}
      className={cn(
        "relative rounded-xl p-4 border shadow-sm flex flex-col items-center gap-3 cursor-pointer transition-all",
        "bg-white dark:bg-slate-900/50",
        "hover:shadow-md",
        isSelected
          ? "border-2 border-primary"
          : "border-slate-200 dark:border-slate-800 hover:border-primary/50"
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelect(voice);
        }
      }}
      aria-pressed={isSelected}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 text-primary">
          <CheckCircle className="w-5 h-5" />
        </div>
      )}

      <div className="relative w-24 h-24 mt-2">
        <div
          className="absolute inset-0 bg-cover bg-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20"
          style={
            voice.avatarUrl
              ? { backgroundImage: `url(${voice.avatarUrl})` }
              : undefined
          }
          aria-label={`${voice.name} avatar`}
        />
        <button
          onClick={handlePlay}
          className={cn(
            "absolute -bottom-2 -right-2 rounded-full p-2 transition-colors shadow-sm flex items-center justify-center",
            isPlaying
              ? "bg-primary text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary hover:text-white"
          )}
          aria-label={isPlaying ? "Durdur" : "Önizleme çal"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>
        {voice.previewUrl && (
          <audio
            ref={audioRef}
            src={voice.previewUrl}
            onEnded={handleAudioEnded}
            preload="none"
          />
        )}
      </div>

      <div className="text-center mt-2">
        <h3 className="font-display font-bold text-lg">{voice.name}</h3>
        <div className="flex gap-2 justify-center mt-1 flex-wrap">
          <span
            className={cn(
              "text-xs px-2 py-1 rounded-full font-medium",
              isSelected
                ? "bg-primary/10 text-primary"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            )}
          >
            {categoryLabels[voice.category] || voice.category}
          </span>
          {voice.accent && (
            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full font-medium">
              {voice.accent}
            </span>
          )}
        </div>
        {voice.isPremium && (
          <span className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium mt-1 inline-block">
            Premium
          </span>
        )}
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
        {providerLabels[voice.provider] || voice.provider}
      </div>
    </div>
  );
}
