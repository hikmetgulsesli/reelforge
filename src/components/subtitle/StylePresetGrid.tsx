"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { SubtitleStyle, PresetType } from "@/types/subtitle";

interface StylePresetGridProps {
  styles: SubtitleStyle[];
  selectedStyleId?: string;
  onSelect: (style: SubtitleStyle) => void;
}

// Preset style display configurations
const PRESET_DISPLAY: Record<
  PresetType,
  {
    label: string;
    previewClass: string;
    sampleText: string;
  }
> = {
  "youtube-classic": {
    label: "YouTube Classic",
    previewClass:
      "bg-white text-black font-sans text-xs font-normal",
    sampleText: "Hello world",
  },
  "tiktok-modern": {
    label: "TikTok Modern",
    previewClass:
      "bg-black text-white font-sans text-xs font-bold uppercase tracking-wide",
    sampleText: "HELLO WORLD",
  },
  cinematic: {
    label: "Cinematic",
    previewClass:
      "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-800 dark:text-slate-100 font-serif italic text-xs shadow-sm",
    sampleText: "Hello world",
  },
  minimal: {
    label: "Minimal",
    previewClass:
      "bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-light",
    sampleText: "Hello world",
  },
  animated: {
    label: "Animated",
    previewClass:
      "bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold animate-pulse",
    sampleText: "HELLO",
  },
  "emoji-rich": {
    label: "Emoji Rich",
    previewClass:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs",
    sampleText: "Hello!",
  },
  highlight: {
    label: "Highlight",
    previewClass:
      "bg-yellow-300 dark:bg-yellow-500 text-black text-xs font-bold",
    sampleText: "Hello world",
  },
  kinetic: {
    label: "Kinetic",
    previewClass:
      "bg-gradient-to-br from-cyan-400 to-blue-500 text-white text-xs font-black uppercase",
    sampleText: "HELLO",
  },
  "neon-glow": {
    label: "Neon Glow",
    previewClass:
      "bg-slate-900 text-cyan-400 text-xs font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]",
    sampleText: "NEON",
  },
  custom: {
    label: "Custom",
    previewClass:
      "bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 text-xs",
    sampleText: "Custom",
  },
};

export function StylePresetGrid({
  styles,
  selectedStyleId,
  onSelect,
}: StylePresetGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {styles.map((style) => {
        const display = PRESET_DISPLAY[style.presetType as PresetType] || {
          label: style.name,
          previewClass: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs",
          sampleText: style.previewText || "Preview",
        };
        const isSelected = selectedStyleId === style.id;

        return (
          <button
            key={style.id}
            onClick={() => onSelect(style)}
            className={cn(
              "group flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-left",
              isSelected
                ? "border-2 border-[var(--color-primary)] bg-[var(--color-primary)]/5 dark:bg-[var(--color-primary)]/10"
                : "border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] hover:border-[var(--color-primary)] dark:hover:border-[var(--color-primary)] bg-white dark:bg-[var(--color-surface-dark)]/50"
            )}
          >
            <div
              className={cn(
                "w-full h-10 rounded flex items-center justify-center overflow-hidden",
                display.previewClass
              )}
              style={{
                fontFamily: style.fontFamily,
              }}
            >
              <span
                style={{
                  textShadow: style.shadowEnabled
                    ? "0 2px 4px rgba(0,0,0,0.3)"
                    : undefined,
                }}
              >
                {display.sampleText}
              </span>
            </div>
            <span
              className={cn(
                "text-xs font-medium w-full text-center",
                isSelected
                  ? "text-[var(--color-primary)]"
                  : "group-hover:text-[var(--color-primary)]"
              )}
            >
              {display.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
