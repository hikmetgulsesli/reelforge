"use client";

import { StyleOption } from "@/types/style";

interface StylePreviewProps {
  style: StyleOption | null;
  sampleText?: string;
}

export function StylePreview({ style, sampleText = "Örnek Metin" }: StylePreviewProps) {
  if (!style) {
    return (
      <div className="rounded-xl bg-[var(--color-surface-dark)] border border-[var(--color-border)] p-6 h-64 flex items-center justify-center">
        <p className="text-[var(--color-text-muted)]">Önizleme için bir stil seçin</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden border border-[var(--color-border)] h-64 flex flex-col"
      style={{ background: style.previewGradient }}
    >
      {/* Preview Content */}
      <div className="flex-1 p-6 flex flex-col justify-center items-center">
        <h3
          className="text-2xl font-bold mb-2"
          style={{
            color: style.colors.primary,
            fontFamily: style.fonts.heading,
          }}
        >
          {style.label}
        </h3>
        <p
          className="text-base text-center max-w-xs"
          style={{
            color: style.colors.secondary,
            fontFamily: style.fonts.body,
          }}
        >
          {sampleText}
        </p>
        <div className="mt-4 flex gap-2">
          <span
            className="px-3 py-1 rounded-full text-sm"
            style={{
              backgroundColor: style.colors.accent,
              color: "#ffffff",
              fontFamily: style.fonts.body,
            }}
          >
            Vurgu Rengi
          </span>
        </div>
      </div>

      {/* Color Palette */}
      <div className="bg-[var(--color-surface-dark)]/80 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <div
              className="w-8 h-8 rounded-full border-2 border-white/20"
              style={{ backgroundColor: style.colors.primary }}
              title="Primary"
            />
            <div
              className="w-8 h-8 rounded-full border-2 border-white/20"
              style={{ backgroundColor: style.colors.secondary }}
              title="Secondary"
            />
            <div
              className="w-8 h-8 rounded-full border-2 border-white/20"
              style={{ backgroundColor: style.colors.accent }}
              title="Accent"
            />
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--color-text-muted)]">Font Çifti</p>
            <p className="text-sm text-[var(--color-text-main)]">
              {style.fonts.heading} + {style.fonts.body}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
