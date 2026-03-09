"use client";

import { useState, useMemo } from "react";
import { Mic, Music, Sparkles, SlidersHorizontal } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

// Pre-defined bar heights for visualizer (deterministic)
const VISUALIZER_BARS = [
  { height: 25, opacity: 0.4 },
  { height: 50, opacity: 0.6 },
  { height: 100, opacity: 0.8 },
  { height: 75, opacity: 1.0 },
  { height: 50, opacity: 0.6 },
  { height: 75, opacity: 0.4 },
  { height: 25, opacity: 0.8 },
  { height: 50, opacity: 0.5 },
  { height: 100, opacity: 0.7 },
  { height: 66, opacity: 1.0 },
  { height: 33, opacity: 0.3 },
  { height: 75, opacity: 0.6 },
];

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
  const [localBalance, setLocalBalance] = useState(voiceMusicBalance);

  // Generate dynamic bars based on playing state (using useMemo for stability)
  const visualizerBars = useMemo(() => {
    if (!isPlaying) return VISUALIZER_BARS;
    // When playing, return bars with slightly randomized heights but stable
    return VISUALIZER_BARS.map((bar, i) => ({
      ...bar,
      animationDelay: i * 100,
    }));
  }, [isPlaying]);

  const handleBalanceChange = (value: number[]) => {
    const newValue = value[0];
    setLocalBalance(newValue);
    onVoiceMusicBalanceChange(newValue);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-primary/10 sticky top-24">
      <div className="flex items-center gap-2 mb-6 text-primary">
        <SlidersHorizontal className="w-5 h-5" />
        <h3 className="font-[family-name:var(--font-display)] font-bold text-xl text-slate-900 dark:text-slate-100">
          Ses Mikseri
        </h3>
      </div>

      <div className="flex flex-col gap-8">
        {/* Voice-Music Balance */}
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
            <Slider
              value={[localBalance]}
              onValueChange={handleBalanceChange}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
              <span>{localBalance}%</span>
              <span>{100 - localBalance}%</span>
            </div>
          </div>
        </div>

        {/* Fade Controls */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Fade Ayarları
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-500 dark:text-slate-400">
                Fade In (sn)
              </label>
              <input
                type="number"
                min={0}
                max={10}
                step={0.5}
                value={fadeInDuration}
                onChange={(e) => onFadeInDurationChange(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-primary/20 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-500 dark:text-slate-400">
                Fade Out (sn)
              </label>
              <input
                type="number"
                min={0}
                max={10}
                step={0.5}
                value={fadeOutDuration}
                onChange={(e) => onFadeOutDurationChange(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-primary/20 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        </div>

        {/* AI Recommendation Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-primary/5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              AI Önerisi
            </span>
          </div>
          <Switch
            checked={aiRecommended}
            onCheckedChange={onAiRecommendedChange}
          />
        </div>

        {/* Real-time visualizer mockup */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-primary/5 flex flex-col items-center justify-center gap-2 h-32">
          <div className="flex items-end gap-1 h-12 w-full justify-center opacity-70">
            {visualizerBars.map((bar, i) => (
              <div
                key={i}
                className={`w-1.5 bg-primary rounded-t-sm transition-all duration-300 ${
                  isPlaying ? "animate-pulse" : ""
                }`}
                style={{
                  height: `${bar.height}%`,
                  opacity: bar.opacity,
                  animationDelay: `${bar.animationDelay ?? i * 50}ms`,
                }}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-2 flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${
                isPlaying ? "bg-green-500 animate-pulse" : "bg-slate-400"
              }`}
            />
            {isPlaying ? "Önizleme Aktif" : "Önizleme Bekleniyor"}
          </span>
        </div>
      </div>
    </div>
  );
}
