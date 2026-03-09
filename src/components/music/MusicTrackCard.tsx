"use client";

import { Play, Pause, Volume2 } from "lucide-react";
import { MusicTrack } from "@/types/music";

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
  return (
    <div
      onClick={onSelect}
      className={`flex flex-col gap-3 rounded-xl p-4 border-2 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-primary/5 border-primary shadow-sm"
          : "bg-white dark:bg-slate-800 border-primary/10 hover:border-primary/30 shadow-sm"
      }`}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center z-10 shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}
      <div className="flex gap-4 relative">
        <div
          className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0 shadow-sm"
          style={{
            backgroundImage: track.coverArt
              ? `url('${track.coverArt}')`
              : "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
            backgroundColor: "var(--primary)",
          }}
        >
          {!track.coverArt && (
            <div className="w-full h-full flex items-center justify-center">
              <Volume2 className="w-6 h-6 text-white/70" />
            </div>
          )}
        </div>
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
          className={`self-center rounded-full w-10 h-10 flex items-center justify-center shadow-sm transition-all duration-200 flex-shrink-0 ${
            isSelected
              ? "bg-white dark:bg-slate-700 text-primary hover:scale-105"
              : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary"
          }`}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>
      </div>
      {isSelected && isPlaying && (
        <div className="w-full h-8 flex items-end gap-0.5 opacity-80 mt-2 px-1">
          <div className="w-full h-1 bg-primary/30 rounded-full relative">
            <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-primary rounded-full animate-pulse" />
            <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-sm" />
          </div>
        </div>
      )}
    </div>
  );
}
