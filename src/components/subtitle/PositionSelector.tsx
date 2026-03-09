"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { SubtitlePosition } from "@/types/subtitle";
import { ArrowUp, Minus, ArrowDown } from "lucide-react";

interface PositionSelectorProps {
  value: SubtitlePosition;
  onChange: (position: SubtitlePosition) => void;
}

const POSITIONS = [
  { value: "TOP" as SubtitlePosition, label: "Top", icon: ArrowUp },
  { value: "CENTER" as SubtitlePosition, label: "Middle", icon: Minus },
  { value: "BOTTOM" as SubtitlePosition, label: "Bottom", icon: ArrowDown },
];

export function PositionSelector({ value, onChange }: PositionSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)]">
        Position
      </label>
      <div className="flex gap-2 p-1 bg-[var(--color-slate-100)] dark:bg-[var(--color-surface-dark)]/80 rounded-lg">
        {POSITIONS.map((pos) => {
          const Icon = pos.icon;
          const isSelected = value === pos.value;

          return (
            <button
              key={pos.value}
              onClick={() => onChange(pos.value)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 py-2 px-3 rounded text-sm font-medium transition-colors",
                isSelected
                  ? "bg-white dark:bg-[var(--color-surface-hover)] text-[var(--color-text-main-light)] dark:text-white shadow-sm"
                  : "text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)] hover:text-[var(--color-text-main-light)] dark:hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{pos.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
