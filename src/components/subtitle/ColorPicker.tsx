"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
  allowCustom?: boolean;
}

const DEFAULT_PRESETS = [
  "#FFFFFF", // White
  "#000000", // Black
  "#FFD700", // Gold
  "#E02485", // Primary Pink
  "#00FF00", // Neon Green
  "#FF0000", // Red
  "#00BFFF", // Deep Sky Blue
  "#FF69B4", // Hot Pink
  "#8A2BE2", // Blue Violet
  "#FFA500", // Orange
];

export function ColorPicker({
  label,
  value,
  onChange,
  presetColors = DEFAULT_PRESETS,
  allowCustom = true,
}: ColorPickerProps) {
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)]">
        {label}
      </label>
      <div className="flex flex-wrap gap-3">
        {presetColors.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={cn(
              "w-8 h-8 rounded-full border-2 transition-all",
              value === color
                ? "ring-2 ring-[var(--color-primary)] ring-offset-2 dark:ring-offset-[var(--color-surface-darker)] border-transparent"
                : "border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] hover:scale-110"
            )}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          />
        ))}
        {allowCustom && (
          <button
            onClick={() => setShowCustom(!showCustom)}
            className={cn(
              "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
              "border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]",
              "bg-[var(--color-slate-100)] dark:bg-[var(--color-surface-dark)]",
              "text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)]",
              "hover:bg-[var(--color-slate-100)] dark:hover:bg-[var(--color-surface-hover)]"
            )}
            aria-label="Add custom color"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
      {showCustom && (
        <div className="flex items-center gap-2 mt-1">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer border-0 p-0"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              "flex-1 px-3 py-2 text-sm rounded-lg border",
              "bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)]",
              "border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]",
              "text-[var(--color-text-main-light)] dark:text-white",
              "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            )}
            placeholder="#RRGGBB"
          />
        </div>
      )}
    </div>
  );
}
