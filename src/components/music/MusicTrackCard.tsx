"use client";

import { MusicTrack } from "@/types/music";
import { Play, Pause, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MusicTrackCardProps {
  track: MusicTrack;
  isSelected: boolean;
  isPlaying: boolean;
  onSelect: () => void;
  onPlayToggle: () => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function MusicTrackCard({
  track,
  isSelected,
  isPlaying,
  onSelect,
  onPlayToggle,
}: MusicTrackCardProps) {
  const coverArtStyle = track.coverArt
    ? { backgroundImage: `url('${track.coverArt}')` }
    : {};

  return (
    <div
      onClick={onSelect}
      className={cn(
        "flex flex-col gap-3 rounded-xl p-4 border relative shadow-sm cursor-pointer transition-all duration-200",
        isSelected
          ? "bg-primary/5 border-2 border-primary"
          : "bg-white dark:bg-slate-800 border-primary/10 hover:border-primary/30"
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-label={`${track.title} by ${track.artist}${isSelected ? " (selected)" : ""}`}
      aria-pressed={isSelected}
    >
      {isSelected && (
        <div
          className="absolute top-3 right-3 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center z-10 shadow-sm"
          aria-hidden="true"
        >
          <Check className="w-4 h-4" />
        </div>
      )}

      <div className="flex gap-4">
        <div
          className={cn(
            "w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0 shadow-sm",
            !track.coverArt && "bg-slate-200 dark:bg-slate-700"
          )}
          style={coverArtStyle}
          role="img"
          aria-label={`${track.title} albüm kapağı`}
        />

        <div className="flex flex-col justify-center flex-1 min-w-0">
          <p className="font-bold font-[family-name:var(--font-display)] text-base truncate">
            {track.title}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
            {track.artist}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {formatDuration(track.duration)}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlayToggle();
          }}
          className={cn(
            "self-center rounded-full w-10 h-10 flex items-center justify-center shadow-sm flex-shrink-0 transition-all duration-200",
            isSelected
              ? "bg-white dark:bg-slate-700 text-primary hover:scale-105"
              : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary"
          )}
          aria-label={isPlaying ? `${track.title} durdur` : `${track.title} oynat`}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>
      </div>

      {isSelected && (
        <div
          className="w-full h-8 flex items-end gap-0.5 opacity-80 mt-2 px-1"
          aria-hidden="true"
        >
          <div className="w-full h-1 bg-primary/30 rounded-full relative">
            <div
              className="absolute left-0 top-0 bottom-0 bg-primary rounded-full"
              style={{ width: isPlaying ? "33%" : "0%" }}
            />
            {isPlaying && (
              <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-sm" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}