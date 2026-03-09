"use client";

import { useState } from "react";
import { ColorPalette, DEFAULT_COLOR_PALETTE, FONT_PAIRS } from "@/types/style";
import { ColorPaletteSelector } from "./ColorPaletteSelector";
import { FontPairSelector } from "./FontPairSelector";

interface CustomStyleCreatorProps {
  isPro: boolean;
  onSave?: (style: {
    name: string;
    description: string;
    palette: ColorPalette;
    fontPair: string;
  }) => void;
}

export function CustomStyleCreator({ isPro, onSave }: CustomStyleCreatorProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [palette, setPalette] = useState<ColorPalette>(DEFAULT_COLOR_PALETTE);
  const [fontPair, setFontPair] = useState(FONT_PAIRS[0].value);
  const [showForm, setShowForm] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave?.({
      name: name.trim(),
      description: description.trim(),
      palette,
      fontPair,
    });
    // Reset form
    setName("");
    setDescription("");
    setPalette(DEFAULT_COLOR_PALETTE);
    setFontPair(FONT_PAIRS[0].value);
    setShowForm(false);
  };

  if (!isPro) {
    return (
      <div className="p-6 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-amber-500/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-amber-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-amber-500 mb-1">Pro Özelliği</h4>
            <p className="text-sm text-[var(--color-text-muted)]">
              Özel stiller oluşturmak için Pro plana yükseltin. Kendi renk paletinizi ve font çiftlerinizi
              tanımlayabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full p-6 rounded-xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all group"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-full bg-[var(--color-surface-dark)] group-hover:bg-[var(--color-primary)]/20 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <span className="font-medium text-[var(--color-text-main)]">Yeni Özel Stil Oluştur</span>
        </div>
      </button>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-[var(--color-surface-dark)] border border-[var(--color-border)] space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-[var(--color-text-main)]">Yeni Özel Stil</h4>
        <button
          onClick={() => setShowForm(false)}
          className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Stil Adı</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Örn: Benim Özel Stilim"
            className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface-darker)] border border-[var(--color-border)] text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Açıklama (İsteğe bağlı)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Bu stilin kısa açıklaması"
            className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface-darker)] border border-[var(--color-border)] text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Renk Paleti</label>
          <ColorPaletteSelector palette={palette} onChange={setPalette} />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Font Çifti</label>
          <FontPairSelector value={fontPair} onChange={setFontPair} />
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-[var(--color-border)]">
        <button
          onClick={() => setShowForm(false)}
          className="flex-1 px-4 py-3 rounded-lg bg-[var(--color-surface-hover)] text-[var(--color-text-main)] font-medium hover:bg-[var(--color-surface-darker)] transition-colors"
        >
          İptal
        </button>
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="flex-1 px-4 py-3 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Stili Kaydet
        </button>
      </div>
    </div>
  );
}
