"use client";

import { StyleOption } from "@/types/style";
import { StyleCard } from "./StyleCard";

interface StyleGridProps {
  styles: StyleOption[];
  selectedStyle: string | null;
  onSelectStyle: (styleValue: string) => void;
}

export function StyleGrid({ styles, selectedStyle, onSelectStyle }: StyleGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {styles.map((style) => (
        <StyleCard
          key={style.value}
          style={style}
          isSelected={selectedStyle === style.value}
          onClick={() => onSelectStyle(style.value)}
        />
      ))}
    </div>
  );
}
