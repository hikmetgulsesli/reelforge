"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
  options: string[];
  label?: string;
}

export function FontSelector({
  value,
  onChange,
  options,
  label = "Font Family",
}: FontSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)]">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full appearance-none border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent cursor-pointer",
            "bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)]",
            "border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]",
            "text-[var(--color-text-main-light)] dark:text-white"
          )}
          style={{ fontFamily: value }}
        >
          {options.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)] pointer-events-none" />
      </div>
    </div>
  );
}
