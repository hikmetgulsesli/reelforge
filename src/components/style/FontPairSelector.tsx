"use client";

import { useState } from "react";
import { FONT_PAIRS, FontPair } from "@/types/style";

interface FontPairSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function FontPairSelector({ value, onChange, disabled = false }: FontPairSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || FONT_PAIRS[0].value);

  const currentValue = onChange ? value : selectedValue;
  const setValue = onChange || setSelectedValue;

  const selectedPair = FONT_PAIRS.find((p) => p.value === currentValue) || FONT_PAIRS[0];

  const handleSelect = (pair: FontPair) => {
    setValue(pair.value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-4 py-3 rounded-lg border
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-[var(--color-primary)]"}
          bg-[var(--color-surface-dark)] border-[var(--color-border)] text-left
          transition-colors
        `}
      >
        <div>
          <p className="font-medium text-[var(--color-text-main)]">{selectedPair.label}</p>
          <p className="text-sm text-[var(--color-text-muted)]">
            {selectedPair.heading} başlık, {selectedPair.body} metin
          </p>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 text-[var(--color-text-muted)] transition-transform ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[var(--color-surface-dark)] border border-[var(--color-border)] rounded-lg shadow-xl max-h-80 overflow-y-auto">
            {FONT_PAIRS.map((pair) => (
              <button
                key={pair.value}
                onClick={() => handleSelect(pair)}
                className={`
                  w-full px-4 py-3 text-left transition-colors border-b border-[var(--color-border)] last:border-0
                  ${currentValue === pair.value ? "bg-[var(--color-primary)]/10" : "hover:bg-[var(--color-surface-hover)]"}
                `}
              >
                <p
                  className={`font-medium ${
                    currentValue === pair.value ? "text-[var(--color-primary)]" : "text-[var(--color-text-main)]"
                  }`}
                >
                  {pair.label}
                </p>
                <div className="flex items-center gap-4 mt-1">
                  <span style={{ fontFamily: pair.heading }} className="text-lg text-[var(--color-text-main)]">
                    Aa
                  </span>
                  <span style={{ fontFamily: pair.body }} className="text-sm text-[var(--color-text-muted)]">
                    Başlık: {pair.heading}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span style={{ fontFamily: pair.body }} className="text-sm text-[var(--color-text-muted)]">
                    Metin: {pair.body}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
