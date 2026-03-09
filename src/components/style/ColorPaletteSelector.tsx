"use client";

import { useState } from "react";
import { ColorPalette, DEFAULT_COLOR_PALETTE } from "@/types/style";

interface ColorPaletteSelectorProps {
  palette?: ColorPalette;
  onChange?: (palette: ColorPalette) => void;
  readOnly?: boolean;
}

const PRESET_PALETTES: ColorPalette[] = [
  { primary: "#e02485", secondary: "#22d3ee", accent: "#f472b6", background: "#211119", text: "#f9fafb" },
  { primary: "#1a1a1a", secondary: "#666666", accent: "#e02485", background: "#ffffff", text: "#1a1a1a" },
  { primary: "#e94560", secondary: "#0f3460", accent: "#e02485", background: "#0a0a0a", text: "#ffffff" },
  { primary: "#6b4c35", secondary: "#e9c46a", accent: "#f4a261", background: "#faedcd", text: "#5c4b37" },
  { primary: "#00ff88", secondary: "#ff00ff", accent: "#00ffff", background: "#0f0f23", text: "#ffffff" },
  { primary: "#283618", secondary: "#dda15e", accent: "#bc6c25", background: "#fefae0", text: "#283618" },
  { primary: "#212529", secondary: "#495057", accent: "#e02485", background: "#f8f9fa", text: "#212529" },
  { primary: "#ff6b6b", secondary: "#4ecdc4", accent: "#ffe66d", background: "#ffffff", text: "#2d3436" },
  { primary: "#c9b037", secondary: "#1a1a1a", accent: "#d4af37", background: "#1a1a1a", text: "#c9b037" },
  { primary: "#764ba2", secondary: "#667eea", accent: "#f093fb", background: "#f8f9fa", text: "#764ba2" },
];

export function ColorPaletteSelector({
  palette = DEFAULT_COLOR_PALETTE,
  onChange,
  readOnly = false,
}: ColorPaletteSelectorProps) {
  const [localPalette, setLocalPalette] = useState<ColorPalette>(palette);
  const [activeTab, setActiveTab] = useState<"presets" | "custom">("presets");

  const currentPalette = onChange ? palette : localPalette;
  const setPalette = onChange || setLocalPalette;

  const handleColorChange = (key: keyof ColorPalette, value: string) => {
    const newPalette = { ...currentPalette, [key]: value };
    setPalette(newPalette);
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("presets")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "presets"
              ? "bg-[var(--color-primary)] text-white"
              : "bg-[var(--color-surface-dark)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
          }`}
        >
          Hazır Paletler
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "custom"
              ? "bg-[var(--color-primary)] text-white"
              : "bg-[var(--color-surface-dark)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
          }`}
        >
          Özel Renkler
        </button>
      </div>

      {activeTab === "presets" && (
        <div className="grid grid-cols-5 gap-3">
          {PRESET_PALETTES.map((preset, index) => (
            <button
              key={index}
              onClick={() => setPalette(preset)}
              className={`p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                currentPalette.primary === preset.primary
                  ? "border-[var(--color-primary)]"
                  : "border-transparent"
              }`}
            >
              <div className="flex gap-1 justify-center">
                <div
                  className="w-6 h-6 rounded-full border border-white/20"
                  style={{ backgroundColor: preset.primary }}
                />
                <div
                  className="w-6 h-6 rounded-full border border-white/20"
                  style={{ backgroundColor: preset.secondary }}
                />
                <div
                  className="w-6 h-6 rounded-full border border-white/20"
                  style={{ backgroundColor: preset.accent }}
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {activeTab === "custom" && (
        <div className="space-y-3">
          {[
            { key: "primary", label: "Birincil Renk" },
            { key: "secondary", label: "İkincil Renk" },
            { key: "accent", label: "Vurgu Rengi" },
            { key: "background", label: "Arka Plan" },
            { key: "text", label: "Metin Rengi" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-sm text-[var(--color-text-muted)]">{label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentPalette[key as keyof ColorPalette]}
                  onChange={(e) => handleColorChange(key as keyof ColorPalette, e.target.value)}
                  disabled={readOnly}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={currentPalette[key as keyof ColorPalette]}
                  onChange={(e) => handleColorChange(key as keyof ColorPalette, e.target.value)}
                  disabled={readOnly}
                  className="w-24 px-3 py-2 rounded-lg bg-[var(--color-surface-dark)] border border-[var(--color-border)] text-sm uppercase"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview */}
      <div
        className="p-4 rounded-lg border border-[var(--color-border)]"
        style={{
          backgroundColor: currentPalette.background,
          color: currentPalette.text,
        }}
      >
        <h4 style={{ color: currentPalette.primary }} className="font-bold mb-2">
          Önizleme
        </h4>
        <p style={{ color: currentPalette.secondary }} className="text-sm mb-3">
          Bu renk paleti ile videonuz nasıl görünecek
        </p>
        <span
          className="inline-block px-3 py-1 rounded-full text-sm"
          style={{
            backgroundColor: currentPalette.accent,
            color: "#ffffff",
          }}
        >
          Vurgu Örneği
        </span>
      </div>
    </div>
  );
}
