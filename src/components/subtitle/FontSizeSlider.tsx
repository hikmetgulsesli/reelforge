"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FontSizeSliderProps {
  value: number;
  onChange: (size: number) => void;
  min?: number;
  max?: number;
}

export function FontSizeSlider({
  value,
  onChange,
  min = 12,
  max = 120,
}: FontSizeSliderProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)] flex justify-between">
        <span>Size</span>
        <span className="text-[var(--color-primary)]">{value}px</span>
      </label>
      <div className="h-[42px] flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            "w-full appearance-none bg-transparent cursor-pointer",
            "[&::-webkit-slider-runnable-track]:w-full",
            "[&::-webkit-slider-runnable-track]:h-1.5",
            "[&::-webkit-slider-runnable-track]:rounded-full",
            "[&::-webkit-slider-runnable-track]:bg-[var(--color-slate-100)]",
            "dark:[&::-webkit-slider-runnable-track]:bg-[var(--color-surface-hover)]",
            "[&::-webkit-slider-thumb]:appearance-none",
            "[&::-webkit-slider-thumb]:w-4",
            "[&::-webkit-slider-thumb]:h-4",
            "[&::-webkit-slider-thumb]:rounded-full",
            "[&::-webkit-slider-thumb]:bg-[var(--color-primary)]",
            "[&::-webkit-slider-thumb]:cursor-pointer",
            "[&::-webkit-slider-thumb]:-mt-1"
          )}
        />
      </div>
    </div>
  );
}
