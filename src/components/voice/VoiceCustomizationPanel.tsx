"use client";


import { SlidersHorizontal } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface VoiceCustomizationPanelProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
  pitch: number;
  onPitchChange: (pitch: number) => void;
  usePitchAdjustment: boolean;
  onUsePitchAdjustmentChange: (use: boolean) => void;
}

export function VoiceCustomizationPanel({
  speed,
  onSpeedChange,
  pitch,
  onPitchChange,
  usePitchAdjustment,
  onUsePitchAdjustmentChange,
}: VoiceCustomizationPanelProps) {
  const speedMin = 0.5;
  const speedMax = 2.0;
  const pitchMin = -20;
  const pitchMax = 20;

  return (
    <div className="bg-white dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <h2 className="font-display text-xl font-bold leading-tight mb-6 flex items-center gap-2">
        <SlidersHorizontal className="w-5 h-5 text-primary" />
        Ses Özelleştirme
      </h2>

      {/* Voice Speed Slider */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-center">
          <label htmlFor="speed-slider" className="font-medium text-sm">
            Ses Hızı
          </label>
          <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded">
            {speed.toFixed(1)}x
          </span>
        </div>
        <div className="relative pt-1">
          <input
            id="speed-slider"
            type="range"
            min={speedMin}
            max={speedMax}
            step={0.1}
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className={cn(
              "w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer",
              "accent-primary",
              "focus:outline-none focus:ring-2 focus:ring-primary/50"
            )}
            aria-label="Ses hızı"
            aria-valuemin={speedMin}
            aria-valuemax={speedMax}
            aria-valuenow={speed}
          />
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
            <span>{speedMin}x</span>
            <span>Normal</span>
            <span>{speedMax}x</span>
          </div>
        </div>
      </div>

      {/* Pitch Adjustment Toggle */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
        <div>
          <label htmlFor="pitch-toggle" className="font-medium text-sm block">
            Ses Perdesi Ayarı
          </label>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Gelişmiş perde kontrolünü etkinleştir
          </span>
        </div>
        <Switch
          id="pitch-toggle"
          checked={usePitchAdjustment}
          onCheckedChange={onUsePitchAdjustmentChange}
        />
      </div>

      {/* Pitch Slider - Only shown when pitch adjustment is enabled */}
      {usePitchAdjustment && (
        <div className="flex flex-col gap-4 mt-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex justify-between items-center">
            <label htmlFor="pitch-slider" className="font-medium text-sm">
              Ses Perdesi
            </label>
            <span
              className={cn(
                "text-sm font-bold px-2 py-1 rounded",
                pitch > 0
                  ? "text-emerald-600 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900"
                  : pitch < 0
                  ? "text-amber-600 bg-amber-100 dark:text-amber-300 dark:bg-amber-900"
                  : "text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-800"
              )}
            >
              {pitch > 0 ? "+" : ""}
              {pitch}
            </span>
          </div>
          <div className="relative pt-1">
            <input
              id="pitch-slider"
              type="range"
              min={pitchMin}
              max={pitchMax}
              step={1}
              value={pitch}
              onChange={(e) => onPitchChange(parseInt(e.target.value, 10))}
              className={cn(
                "w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer",
                "accent-primary",
                "focus:outline-none focus:ring-2 focus:ring-primary/50"
              )}
              aria-label="Ses perdesi"
              aria-valuemin={pitchMin}
              aria-valuemax={pitchMax}
              aria-valuenow={pitch}
            />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
              <span>Düşük ({pitchMin})</span>
              <span>Normal</span>
              <span>Yüksek (+{pitchMax})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
