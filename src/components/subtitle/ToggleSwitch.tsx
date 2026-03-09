"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: "sm" | "md";
}

export function ToggleSwitch({
  label,
  description,
  checked,
  onChange,
  size = "md",
}: ToggleSwitchProps) {
  const trackSize = size === "sm" ? "h-6 w-11" : "h-7 w-12";
  const thumbSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-[var(--color-text-main-light)] dark:text-white">
          {label}
        </span>
        {description && (
          <span className="text-xs text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)]">
            {description}
          </span>
        )}
      </div>
      <label
        className={cn(
          "relative flex cursor-pointer items-center rounded-full p-1 transition-all duration-200",
          trackSize,
          checked
            ? "justify-end bg-[var(--color-primary)]"
            : "justify-start bg-[var(--color-slate-100)] dark:bg-[var(--color-surface-hover)]"
        )}
      >
        <div
          className={cn(
            "rounded-full bg-white shadow-sm transition-all duration-200",
            thumbSize
          )}
        />
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
      </label>
    </div>
  );
}
