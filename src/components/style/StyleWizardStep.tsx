"use client";

import { useState, useEffect } from "react";
import { StyleOption, PREDEFINED_STYLES } from "@/types/style";
import { StyleGrid } from "./StyleGrid";
import { StylePreview } from "./StylePreview";

interface StyleWizardStepProps {
  onNext?: () => void;
  onBack?: () => void;
  onStyleSelect?: (style: StyleOption) => void;
  selectedStyleValue?: string | null;
}

export function StyleWizardStep({
  onNext,
  onBack,
  onStyleSelect,
  selectedStyleValue,
}: StyleWizardStepProps) {
  const [styles, setStyles] = useState<StyleOption[]>(PREDEFINED_STYLES);
  const [selectedStyle, setSelectedStyle] = useState<StyleOption | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch styles from API
  useEffect(() => {
    const fetchStyles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/styles");
        const data = await response.json();

        if (data.success && data.data.length > 0) {
          setStyles(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch styles:", err);
        setError("Stiller yüklenirken hata oluştu, varsayılan stiller kullanılıyor");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStyles();
  }, []);

  // Set initial selected style
  useEffect(() => {
    if (selectedStyleValue) {
      const style = styles.find((s) => s.value === selectedStyleValue);
      if (style) {
        setSelectedStyle(style);
      }
    } else if (styles.length > 0 && !selectedStyle) {
      setSelectedStyle(styles[0]);
    }
  }, [styles, selectedStyleValue, selectedStyle]);

  const handleSelectStyle = (styleValue: string) => {
    const style = styles.find((s) => s.value === styleValue);
    if (style) {
      setSelectedStyle(style);
      onStyleSelect?.(style);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight text-[var(--color-text-main)]">
          Görsel Stil Seçin
        </h1>
        <p className="text-[var(--color-text-muted)] text-lg">
          AI videonuz için sanatsal yönü seçin. Bu, oluşturulacak karelerin genel görünümünü ve hissini tanımlayacak.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
          {error}
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Style Grid */}
          <StyleGrid
            styles={styles}
            selectedStyle={selectedStyle?.value || null}
            onSelectStyle={handleSelectStyle}
          />

          {/* Preview Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">Seçilen Stil Önizlemesi</h3>
            <StylePreview
              style={selectedStyle}
              sampleText="Bu, seçtiğiniz stil ile videonuzda görünecek metnin bir örneğidir."
            />
          </div>

          {/* Navigation */}
          <div className="mt-auto border-t border-[var(--color-border)] pt-6">
            <div className="flex justify-between items-center">
              <button
                onClick={onBack}
                className="flex items-center justify-center gap-2 rounded-lg h-12 px-8 bg-[var(--color-surface-dark)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-main)] font-bold transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span>Geri</span>
              </button>
              <button
                onClick={onNext}
                disabled={!selectedStyle}
                className="flex items-center justify-center gap-2 rounded-lg h-12 px-10 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-lg shadow-[var(--color-primary)]/30 transition-all"
              >
                <span>Sonraki Adım</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
