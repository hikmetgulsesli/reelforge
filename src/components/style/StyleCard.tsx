"use client";

import { StyleOption } from "@/types/style";

interface StyleCardProps {
  style: StyleOption;
  isSelected: boolean;
  onClick: () => void;
}

export function StyleCard({ style, isSelected, onClick }: StyleCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        flex flex-col gap-3 pb-3 group cursor-pointer relative rounded-xl border-2 p-3 transition-all hover:shadow-md
        ${
          isSelected
            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
            : "border-transparent bg-white dark:bg-[var(--color-surface-dark)] shadow-sm hover:border-[var(--color-primary)]/40"
        }
      `}
    >
      {/* Checkmark for selected */}
      {isSelected && (
        <div className="absolute top-4 right-4 z-10 bg-[var(--color-primary)] rounded-full size-6 flex items-center justify-center text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}

      {/* Preview */}
      <div
        className="w-full aspect-video rounded-lg overflow-hidden relative border border-[var(--color-border)]"
        style={{ background: style.previewGradient }}
      >
        {/* Gradient is already applied via background style */}
      </div>

      {/* Info */}
      <div className="flex items-start justify-between mt-1">
        <div>
          <p
            className={`text-base font-bold ${
              isSelected ? "text-[var(--color-primary)]" : "group-hover:text-[var(--color-primary)] transition-colors"
            }`}
          >
            {style.label}
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">{style.description}</p>
        </div>
      </div>
    </div>
  );
}
