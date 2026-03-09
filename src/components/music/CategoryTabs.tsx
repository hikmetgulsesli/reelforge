"use client";

import { MusicCategory } from "@/types/music";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  categories: MusicCategory[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const DEFAULT_CATEGORIES = [
  { id: "all", name: "Tümü", count: 0 },
  { id: "upbeat", name: "Upbeat", count: 0 },
  { id: "dramatic", name: "Dramatic", count: 0 },
  { id: "chill", name: "Chill", count: 0 },
  { id: "epic", name: "Epic", count: 0 },
  { id: "lo-fi", name: "Lo-fi", count: 0 },
];

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  const displayCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <div className="flex overflow-x-auto pb-4 mb-6 border-b border-primary/20 gap-8 scrollbar-hide">
      {displayCategories.map((category) => {
        const isActive = activeCategory === category.id;
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "flex flex-col items-center justify-center border-b-[3px] pb-3 min-w-max transition-colors",
              isActive
                ? "border-b-primary"
                : "border-b-transparent hover:border-b-primary/50"
            )}
            aria-label={`${category.name} kategorisini seç${category.count > 0 ? ` (${category.count} müzik)` : ""}`}
          >
            <span
              className={cn(
                "text-sm font-bold transition-colors",
                isActive
                  ? "text-primary"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              )}
            >
              {category.name}
              {category.count > 0 && (
                <span className="ml-1 text-xs opacity-60">
                  ({category.count})
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}