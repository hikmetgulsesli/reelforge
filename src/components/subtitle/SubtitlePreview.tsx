"use client";

import React from "react";
import { SubtitleStyle, SubtitlePosition } from "@/types/subtitle";
import { Play, Pause } from "lucide-react";

interface SubtitlePreviewProps {
  config: Partial<SubtitleStyle>;
  sampleText?: string;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
}

const POSITION_STYLES: Record<SubtitlePosition, React.CSSProperties> = {
  TOP: { top: "10%", bottom: "auto" },
  CENTER: { top: "50%", bottom: "auto", transform: "translateY(-50%)" },
  BOTTOM: { top: "auto", bottom: "10%" },
};

export function SubtitlePreview({
  config,
  sampleText = "Create stunning videos in seconds",
  isPlaying = false,
  onTogglePlay,
}: SubtitlePreviewProps) {
  const position = config.position || "BOTTOM";
  const positionStyle = POSITION_STYLES[position];

  // Split text for karaoke effect
  const words = sampleText.split(" ");
  const highlightIndex = 1; // Highlight second word for demo

  const subtitleStyle: React.CSSProperties = {
    fontFamily: config.fontFamily || "Space Grotesk",
    fontSize: `clamp(24px, 4vw, ${config.fontSize || 42}px)`,
    fontWeight: config.fontWeight || "bold",
    textTransform: (config.textTransform as React.CSSProperties["textTransform"]) || "uppercase",
    letterSpacing: config.letterSpacing || "0.05em",
    color: config.textColor || "#FFFFFF",
    textShadow: config.shadowEnabled
      ? `0 2px 8px rgba(0,0,0,0.8)${
          config.outlineColor
            ? `, 0 0 0 2px ${config.outlineColor}`
            : ""
        }`
      : undefined,
    WebkitTextStroke: config.outlineColor && config.outlineWidth
      ? `${config.outlineWidth}px ${config.outlineColor}`
      : undefined,
    backgroundColor: config.backgroundColor
      ? `${config.backgroundColor}${Math.round(
          (config.backgroundOpacity || 1) * 255
        )
          .toString(16)
          .padStart(2, "0")}`
      : undefined,
    padding: config.padding || "0.25em 0.5em",
    borderRadius: config.borderRadius || "4px",
    lineHeight: 1.2,
  };

  return (
    <div className="w-full max-w-4xl aspect-[16/9] lg:aspect-[9/16] xl:aspect-[16/9] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl relative border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      {/* Subtitle Overlay */}
      <div
        className="absolute left-0 w-full px-8 flex flex-col items-center justify-end pointer-events-none drop-shadow-lg text-center"
        style={positionStyle}
      >
        {config.karaokeStyle ? (
          // Karaoke style - highlight words progressively
          <p style={subtitleStyle}>
            {words.map((word, i) => (
              <span
                key={i}
                style={{
                  color:
                    i <= highlightIndex
                      ? config.highlightColor || "var(--color-primary)"
                      : config.textColor || "#FFFFFF",
                  opacity: i <= highlightIndex ? 1 : 0.5,
                }}
              >
                {word}{" "}
              </span>
            ))}
          </p>
        ) : (
          // Regular style
          <p style={subtitleStyle}>{sampleText}</p>
        )}
      </div>

      {/* Player Controls Mock */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 text-white/80">
        <button
          onClick={onTogglePlay}
          className="hover:text-white transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 fill-current" />
          )}
        </button>
        <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-[var(--color-primary)] rounded-full" />
        </div>
        <span className="text-xs font-medium">0:12 / 0:30</span>
      </div>
    </div>
  );
}
