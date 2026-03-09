/**
 * Subtitle Style Types
 * Based on Prisma SubtitleStyle model
 */

export type SubtitlePosition = "TOP" | "CENTER" | "BOTTOM";

export interface SubtitleStyle {
  id: string;
  name: string;
  slug: string;
  description?: string;
  presetType: string;

  // Typography
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle?: string; // normal, italic
  textTransform?: string;
  letterSpacing?: string;

  // Colors
  textColor: string;
  backgroundColor?: string;
  backgroundOpacity?: number;
  outlineColor?: string;
  outlineWidth?: number;
  highlightColor?: string;

  // Layout
  position: SubtitlePosition;
  padding?: string;
  borderRadius?: string;

  // Animation
  animationEnabled: boolean;
  animationType?: string;

  // Features
  karaokeStyle: boolean;
  shadowEnabled: boolean;
  emojiEnabled: boolean;
  enabled?: boolean;

  // Meta
  isPreset: boolean;
  isCustom: boolean;
  previewText?: string;
  previewGradient?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface SubtitleStylesResponse {
  success: boolean;
  data: SubtitleStyle[];
  count: number;
  error?: string;
}

// 10 Preset Types
export const PRESET_TYPES = [
  "youtube-classic",
  "tiktok-modern",
  "cinematic",
  "minimal",
  "animated",
  "emoji-rich",
  "highlight",
  "kinetic",
  "neon-glow",
  "custom",
] as const;

export type PresetType = (typeof PRESET_TYPES)[number];

// Available font families
export const FONT_FAMILIES = [
  "Space Grotesk",
  "DM Sans",
  "Inter",
  "Oswald",
  "Roboto",
  "Poppins",
  "Montserrat",
  "Bebas Neue",
  "Playfair Display",
] as const;

// Available font weights
export const FONT_WEIGHTS = [
  { value: "normal", label: "Normal" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semi Bold" },
  { value: "bold", label: "Bold" },
  { value: "800", label: "Extra Bold" },
] as const;

// Animation types
export const ANIMATION_TYPES = [
  { value: "fade", label: "Fade In" },
  { value: "slide", label: "Slide Up" },
  { value: "bounce", label: "Bounce" },
  { value: "typewriter", label: "Typewriter" },
  { value: "zoom", label: "Zoom" },
] as const;

// Position options
export const POSITION_OPTIONS = [
  { value: "TOP", label: "Top", icon: "align_vertical_top" },
  { value: "CENTER", label: "Middle", icon: "align_vertical_center" },
  { value: "BOTTOM", label: "Bottom", icon: "align_vertical_bottom" },
] as const;
