"use client";

import React, { useState, useEffect } from "react";
import { SubtitleStyle, FONT_FAMILIES } from "@/types/subtitle";
import { fetchSubtitleStyles } from "@/lib/subtitle-api";
import { StylePresetGrid } from "./StylePresetGrid";
import { FontSelector } from "./FontSelector";
import { ColorPicker } from "./ColorPicker";
import { PositionSelector } from "./PositionSelector";
import { ToggleSwitch } from "./ToggleSwitch";
import { FontSizeSlider } from "./FontSizeSlider";
import { SubtitlePreview } from "./SubtitlePreview";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Subtitles } from "lucide-react";

// Default 10 preset styles to seed if API returns empty
const DEFAULT_PRESETS: Partial<SubtitleStyle>[] = [
  {
    id: "preset-youtube",
    name: "YouTube Classic",
    slug: "youtube-classic",
    presetType: "youtube-classic",
    fontFamily: "Roboto",
    fontSize: 36,
    fontWeight: "500",
    textColor: "#FFFFFF",
    backgroundColor: "#000000",
    backgroundOpacity: 0.7,
    position: "BOTTOM",
    shadowEnabled: true,
  },
  {
    id: "preset-tiktok",
    name: "TikTok Modern",
    slug: "tiktok-modern",
    presetType: "tiktok-modern",
    fontFamily: "Montserrat",
    fontSize: 42,
    fontWeight: "800",
    textTransform: "uppercase",
    textColor: "#FFFFFF",
    outlineColor: "#000000",
    outlineWidth: 3,
    position: "CENTER",
    shadowEnabled: true,
    animationEnabled: true,
    animationType: "bounce",
  },
  {
    id: "preset-cinematic",
    name: "Cinematic",
    slug: "cinematic",
    presetType: "cinematic",
    fontFamily: "Playfair Display",
    fontSize: 38,
    fontWeight: "normal",
    fontStyle: "italic",
    textColor: "#F5F5F5",
    shadowEnabled: true,
    position: "BOTTOM",
    letterSpacing: "0.1em",
  },
  {
    id: "preset-minimal",
    name: "Minimal",
    slug: "minimal",
    presetType: "minimal",
    fontFamily: "Inter",
    fontSize: 32,
    fontWeight: "300",
    textColor: "#FFFFFF",
    position: "BOTTOM",
    shadowEnabled: false,
  },
  {
    id: "preset-animated",
    name: "Animated",
    slug: "animated",
    presetType: "animated",
    fontFamily: "Poppins",
    fontSize: 40,
    fontWeight: "700",
    textColor: "#FFFFFF",
    highlightColor: "#E02485",
    position: "CENTER",
    animationEnabled: true,
    animationType: "fade",
  },
  {
    id: "preset-emoji",
    name: "Emoji Rich",
    slug: "emoji-rich",
    presetType: "emoji-rich",
    fontFamily: "DM Sans",
    fontSize: 36,
    fontWeight: "600",
    textColor: "#FFD700",
    backgroundColor: "#000000",
    backgroundOpacity: 0.5,
    emojiEnabled: true,
    position: "BOTTOM",
  },
  {
    id: "preset-highlight",
    name: "Highlight",
    slug: "highlight",
    presetType: "highlight",
    fontFamily: "Oswald",
    fontSize: 44,
    fontWeight: "bold",
    textColor: "#000000",
    backgroundColor: "#FFD700",
    backgroundOpacity: 1,
    textTransform: "uppercase",
    position: "CENTER",
  },
  {
    id: "preset-kinetic",
    name: "Kinetic",
    slug: "kinetic",
    presetType: "kinetic",
    fontFamily: "Bebas Neue",
    fontSize: 48,
    fontWeight: "normal",
    textColor: "#FFFFFF",
    highlightColor: "#00BFFF",
    textTransform: "uppercase",
    position: "BOTTOM",
    animationEnabled: true,
    animationType: "slide",
    letterSpacing: "0.15em",
  },
  {
    id: "preset-neon",
    name: "Neon Glow",
    slug: "neon-glow",
    presetType: "neon-glow",
    fontFamily: "Montserrat",
    fontSize: 40,
    fontWeight: "bold",
    textColor: "#00FFFF",
    outlineColor: "#00FFFF",
    outlineWidth: 2,
    position: "CENTER",
    shadowEnabled: true,
    backgroundColor: "#0a0a0a",
    backgroundOpacity: 0.8,
  },
  {
    id: "preset-custom",
    name: "Custom",
    slug: "custom",
    presetType: "custom",
    fontFamily: "Space Grotesk",
    fontSize: 36,
    fontWeight: "600",
    textColor: "#FFFFFF",
    position: "BOTTOM",
    shadowEnabled: true,
    isCustom: true,
  },
];

interface SubtitleWizardProps {
  onNext?: () => void;
  onBack?: () => void;
  initialConfig?: Partial<SubtitleStyle>;
  onConfigChange?: (config: Partial<SubtitleStyle>) => void;
}

export function SubtitleWizard({
  onNext,
  onBack,
  initialConfig,
  onConfigChange,
}: SubtitleWizardProps) {
  const [styles, setStyles] = useState<SubtitleStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [config, setConfig] = useState<Partial<SubtitleStyle>>(
    initialConfig || {
      fontFamily: "Space Grotesk",
      fontSize: 42,
      fontWeight: "bold",
      textColor: "#FFFFFF",
      position: "BOTTOM",
      animationEnabled: false,
      karaokeStyle: false,
      shadowEnabled: true,
      emojiEnabled: false,
    }
  );

  useEffect(() => {
    loadStyles();
  }, []);

  useEffect(() => {
    onConfigChange?.(config);
  }, [config, onConfigChange]);

  async function loadStyles() {
    try {
      setLoading(true);
      const data = await fetchSubtitleStyles();
      // If no presets in DB, use defaults
      if (data.length === 0) {
        setStyles(DEFAULT_PRESETS as SubtitleStyle[]);
      } else {
        setStyles(data);
      }
    } catch (err) {
      setErrorState(err instanceof Error ? err.message : "Failed to load styles");
      // Fallback to defaults
      setStyles(DEFAULT_PRESETS as SubtitleStyle[]);
    } finally {
      setLoading(false);
    }
  }

  function handleStyleSelect(style: SubtitleStyle) {
    setConfig({
      ...config,
      ...style,
    });
  }

  function updateConfig(updates: Partial<SubtitleStyle>) {
    setConfig((prev) => ({ ...prev, ...updates }));
  }

  const selectedStyle = styles.find((s) => s.id === config.id);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]">
      {/* Left Panel: Configuration */}
      <aside className="w-full lg:w-[420px] xl:w-[480px] bg-white dark:bg-[var(--color-surface-darker)] border-r border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] flex flex-col h-full overflow-y-auto shrink-0">
        <div className="p-6 lg:p-8 flex flex-col gap-8">
          {/* Section Header */}
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-[var(--color-text-main-light)] dark:text-[var(--color-text-main-dark)]">
              Subtitles
            </h2>
            <p className="text-sm text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)]">
              Configure how text appears on your video.
            </p>
          </div>

          {/* Enable Subtitles */}
          <div className="flex items-center justify-between bg-[var(--color-slate-100)] dark:bg-[var(--color-surface-dark)]/50 p-4 rounded-xl border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
            <div className="flex items-center gap-3">
              <div className="text-[var(--color-primary)] bg-[var(--color-primary)]/10 p-2 rounded-lg flex items-center justify-center">
                <Subtitles className="w-5 h-5" />
              </div>
              <span className="font-medium text-[var(--color-text-main-light)] dark:text-white">
                Enable Subtitles
              </span>
            </div>
            <ToggleSwitch
              label=""
              checked={config.enabled !== false}
              onChange={(checked) => updateConfig({ enabled: checked })}
              size="md"
            />
          </div>

          {/* Position Selector */}
          <PositionSelector
            value={config.position || "BOTTOM"}
            onChange={(pos) => updateConfig({ position: pos })}
          />

          {/* Typography Settings */}
          <div className="grid grid-cols-2 gap-4">
            <FontSelector
              value={config.fontFamily || "Space Grotesk"}
              onChange={(font) => updateConfig({ fontFamily: font })}
              options={[...FONT_FAMILIES]}
            />
            <FontSizeSlider
              value={config.fontSize || 42}
              onChange={(size) => updateConfig({ fontSize: size })}
            />
          </div>

          {/* Colors & Styles */}
          <div className="flex flex-col gap-6">
            <ColorPicker
              label="Text Color"
              value={config.textColor || "#FFFFFF"}
              onChange={(color) => updateConfig({ textColor: color })}
            />

            <div className="h-px bg-[var(--color-border-light)] dark:bg-[var(--color-border-dark)] w-full" />

            {/* Toggles */}
            <div className="flex flex-col gap-4">
              <ToggleSwitch
                label="Solid Background"
                description="Add a backing block for legibility"
                checked={!!config.backgroundColor}
                onChange={(checked) =>
                  updateConfig({
                    backgroundColor: checked ? "#000000" : undefined,
                    backgroundOpacity: checked ? 0.7 : undefined,
                  })
                }
                size="sm"
              />
              {config.backgroundColor && (
                <ColorPicker
                  label="Background Color"
                  value={config.backgroundColor}
                  onChange={(color) => updateConfig({ backgroundColor: color })}
                />
              )}
              <ToggleSwitch
                label="Karaoke Style"
                description="Highlight words as they are spoken"
                checked={config.karaokeStyle || false}
                onChange={(checked) => updateConfig({ karaokeStyle: checked })}
                size="sm"
              />
              {config.karaokeStyle && (
                <ColorPicker
                  label="Highlight Color"
                  value={config.highlightColor || "#E02485"}
                  onChange={(color) => updateConfig({ highlightColor: color })}
                />
              )}
              <ToggleSwitch
                label="Animation"
                description="Add entrance animations"
                checked={config.animationEnabled || false}
                onChange={(checked) => updateConfig({ animationEnabled: checked })}
                size="sm"
              />
              <ToggleSwitch
                label="Text Outline"
                description="Add outline for better visibility"
                checked={!!config.outlineColor}
                onChange={(checked) =>
                  updateConfig({
                    outlineColor: checked ? "#000000" : undefined,
                    outlineWidth: checked ? 2 : undefined,
                  })
                }
                size="sm"
              />
              {config.outlineColor && (
                <ColorPicker
                  label="Outline Color"
                  value={config.outlineColor}
                  onChange={(color) => updateConfig({ outlineColor: color })}
                />
              )}
            </div>
          </div>

          {/* Presets */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)]">
              Style Presets ({styles.length} available)
            </label>
            {loading ? (
              <div className="text-sm text-[var(--color-text-muted-light)]">
                Loading presets...
              </div>
            ) : (
              <StylePresetGrid
                styles={styles}
                selectedStyleId={config.id}
                onSelect={handleStyleSelect}
              />
            )}
          </div>
        </div>
      </aside>

      {/* Right Panel: Preview & Actions */}
      <section className="flex-1 flex flex-col bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] min-h-[500px]">
        {/* Preview Container */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-10 relative">
          <SubtitlePreview
            config={config}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
          />
        </div>

        {/* Bottom Action Bar */}
        <div className="bg-white dark:bg-[var(--color-surface-darker)] border-t border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] p-4 lg:px-10 lg:py-5 flex items-center justify-between z-10">
          <Button
            variant="outline"
            onClick={onBack}
            className="px-6 py-2.5 text-sm font-bold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={onNext}
            className="px-8 py-2.5 text-sm font-bold bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white shadow-sm shadow-[var(--color-primary)]/20"
          >
            Next: Final Export
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
