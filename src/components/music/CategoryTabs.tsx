"use client";

import { MusicCategory } from "@/types/music";

interface CategoryTabsProps {
  categories: MusicCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  // Add "All" category at the beginning
  const allCategories = [
    { id: "all", name: "Tümü", count: categories.reduce((sum, cat) => sum + cat.count, 0) },
    ...categories,
  ];

  return (
    <div className="flex overflow-x-auto pb-4 mb-6 border-b border-primary/20 gap-2 scrollbar-hide">
      {allCategories.map((category) => {
        const isActive = activeCategory === category.id;
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-3 min-w-max px-4 transition-colors duration-200 ${
              isActive
                ? "border-b-primary"
                : "border-b-transparent hover:border-b-primary/50"
            }`}
          >
            <p
              className={`text-sm font-bold transition-colors duration-200 ${
                isActive
                  ? "text-primary"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              {category.name}
            </p>
          </button>
        );
      })}
    </div>
  );
}
