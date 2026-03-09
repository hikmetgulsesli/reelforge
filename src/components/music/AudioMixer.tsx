"use client";

import { Mic, Music, Sparkles, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioMixerProps {
  voiceMusicBalance: number;
  onVoiceMusicBalanceChange: (value: number) => void;
  fadeInDuration: number;
  onFadeInDurationChange: (value: number) => void;
  fadeOutDuration: number;
  onFadeOutDurationChange: (value: number) => void;
  aiRecommended: boolean;
  onAiRecommendedChange: (value: boolean) => void;
  isPlaying: boolean;
}

function formatDb(value: number): string {
  // Convert percentage to approximate dB scale (-60dB to 0dB)
  if (value === 0) return "-∞ dB";
  const db = Math.round((value / 100) * 60 - 60);
  return `${db} dB`;
}

// Static bars for visualization
const VISUALIZER_BARS = [25, 50, 75, 100, 80, 50, 75, 60, 25, 100, 70, 33];

export function AudioMixer({
  voiceMusicBalance,
  onVoiceMusicBalanceChange,
  fadeInDuration,
  onFadeInDurationChange,
  fadeOutDuration,
  onFadeOutDurationChange,
  aiRecommended,
  onAiRecommendedChange,
  isPlaying,
}: AudioMixerProps) {
  const musicVolume = 100 - voiceMusicBalance;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-primary/10 sticky top-24">
      <div className="flex items-center gap-2 mb-6 text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-tune"
        >
          <path d="M12 20v-6M6 20V10M18 20V4" />
        </svg>
        <h3 className="font-[family-name:var(--font-display)] font-bold text-xl text-slate-900 dark:text-slate-100">
          Ses Mikseri
        </h3>
      </div>

      <div className="flex flex-col gap-8">
        {/* Voice/Music Balance Slider */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <Mic className="w-4 h-4" /> Ses
            </span>
            <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
              Müzik <Music className="w-4 h-4" />
            </span>
          </div>
          <div className="relative pt-1">
            <input
              type="range"
              min="0"
              max="100"
              value={voiceMusicBalance}
              onChange={(e) => onVoiceMusicBalanceChange(Number(e.target.value))}
              className="w-full h-1 bg-primary/20 rounded-lg appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-primary
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:shadow-sm
                [&::-moz-range-thumb]:w-4
                [&::-moz-range-thumb]:h-4
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-primary
                [&::-moz-range-thumb]:cursor-pointer
                [&::-moz-range-thumb]:border-0"
              aria-label="Ses ve müzik dengesi"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
              <span>{voiceMusicBalance}%</span>
              <span>{musicVolume}%</span>
            </div>
          </div>
        </div>

        {/* Volume Display */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500 dark:text-slate-400">
              Ses Seviyesi
            </label>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="text-slate-700 dark:text-slate-300">
                {formatDb(voiceMusicBalance)}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500 dark:text-slate-400">
              Müzik Seviyesi
            </label>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="text-slate-700 dark:text-slate-300">
                {formatDb(musicVolume)}
              </span>
            </div>
          </div>
        </div>

        {/* Fade Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Fade In
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={fadeInDuration}
                onChange={(e) => onFadeInDurationChange(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-primary/10 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                aria-label="Fade in süresi (saniye)"
              />
              <span className="text-xs text-slate-400">sn</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              Fade Out
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={fadeOutDuration}
                onChange={(e) => onFadeOutDurationChange(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-primary/10 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                aria-label="Fade out süresi (saniye)"
              />
              <span className="text-xs text-slate-400">sn</span>
            </div>
          </div>
        </div>

        {/* AI Recommendation Toggle */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-primary/5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                AI Önerisi
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                İçeriğe uygun müzik öner
              </span>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={aiRecommended}
            onClick={() => onAiRecommendedChange(!aiRecommended)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2",
              aiRecommended ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200",
                aiRecommended ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>

        {/* Real-time visualizer mockup */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-primary/5 flex flex-col items-center justify-center gap-2 h-32">
          <div className="flex items-end gap-1 h-12 w-full justify-center opacity-70">
            {VISUALIZER_BARS.map((height, i) => (
              <div
                key={i}
                className={cn(
                  "w-1.5 rounded-t-sm",
                  isPlaying
                    ? "bg-primary animate-pulse"
                    : "bg-primary/40"
                )}
                style={{
                  height: isPlaying ? `${height}%` : `${height / 3}%`,
                }}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-2 flex items-center gap-1">
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                isPlaying ? "bg-green-500 animate-pulse" : "bg-slate-400"
              )}
            />
            {isPlaying ? "Önizleme Oynatılıyor" : "Önizleme Bekliyor"}
          </span>
        </div>
      </div>
    </div>
  );
}