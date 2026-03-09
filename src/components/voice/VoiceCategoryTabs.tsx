"use client";

import { cn } from "@/lib/utils";
import type { VoiceCategory } from "@/types/voice";

interface VoiceCategoryTabsProps {
  activeCategory: VoiceCategory | "ALL";
  onCategoryChange: (category: VoiceCategory | "ALL") => void;
  counts?: Record<VoiceCategory | "ALL", number>;
}

const categories: { value: VoiceCategory | "ALL"; label: string }[] = [
  { value: "ALL", label: "Tümü" },
  { value: "MALE", label: "Erkek" },
  { value: "FEMALE", label: "Kadın" },
  { value: "NEUTRAL", label: "Nötr" },
];

export function VoiceCategoryTabs({
  activeCategory,
  onCategoryChange,
  counts,
}: VoiceCategoryTabsProps) {
  return (
    <div className="flex border-b border-primary/20 dark:border-primary/10 gap-2 sm:gap-4 overflow-x-auto">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={cn(
            "flex items-center justify-center border-b-[3px] pb-3 pt-2 px-2 sm:px-4 group whitespace-nowrap transition-colors",
            activeCategory === category.value
              ? "border-b-primary"
              : "border-b-transparent"
          )}
          aria-pressed={activeCategory === category.value}
        >
          <span
            className={cn(
              "font-display text-sm font-bold leading-normal tracking-[0.015em] transition-colors",
              activeCategory === category.value
                ? "text-slate-900 dark:text-slate-100"
                : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100"
            )}
          >
            {category.label}
            {counts && counts[category.value] !== undefined && (
              <span
                className={cn(
                  "ml-2 text-xs px-1.5 py-0.5 rounded-full",
                  activeCategory === category.value
                    ? "bg-primary/10 text-primary"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                )}
              >
                {counts[category.value]}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
