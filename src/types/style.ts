/**
 * Style Types - ReelForge Visual Style Module
 */

export interface Style {
  id: string;
  name: string;
  slug: string;
  description: string;
  previewGradient: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontPair: string;
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomStyle {
  id: string;
  userId: string;
  name: string;
  description?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontHeading: string;
  fontBody: string;
  createdAt: string;
  updatedAt: string;
}

export interface StyleOption {
  value: string;
  label: string;
  description: string;
  previewGradient: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

export interface FontPair {
  value: string;
  label: string;
  heading: string;
  body: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export const PREDEFINED_STYLES: StyleOption[] = [
  {
    value: "minimalist-clean",
    label: "Minimalist Clean",
    description: "Sade ve temiz tasarım, beyaz arka plan",
    previewGradient: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
    colors: { primary: "#1a1a1a", secondary: "#666666", accent: "#e02485" },
    fonts: { heading: "Space Grotesk", body: "DM Sans" },
  },
  {
    value: "dark-cinematic",
    label: "Dark Cinematic",
    description: "Dramatik aydınlatma ve sinematik görünüm",
    previewGradient: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
    colors: { primary: "#e94560", secondary: "#0f3460", accent: "#e02485" },
    fonts: { heading: "Playfair Display", body: "Inter" },
  },
  {
    value: "vintage-retro",
    label: "Vintage Retro",
    description: "Nostaljik 70'ler ve 80'ler estetiği",
    previewGradient: "linear-gradient(135deg, #d4a373 0%, #faedcd 50%, #f4a261 100%)",
    colors: { primary: "#6b4c35", secondary: "#e9c46a", accent: "#f4a261" },
    fonts: { heading: "Abril Fatface", body: "Lato" },
  },
  {
    value: "neon-cyber",
    label: "Neon Cyber",
    description: "Parlak neon renkler ve cyberpunk havası",
    previewGradient: "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b69 100%)",
    colors: { primary: "#00ff88", secondary: "#ff00ff", accent: "#00ffff" },
    fonts: { heading: "Orbitron", body: "Rajdhani" },
  },
  {
    value: "nature-organic",
    label: "Nature Organic",
    description: "Doğal tonlar ve organik his",
    previewGradient: "linear-gradient(135deg, #606c38 0%, #283618 50%, #fefae0 100%)",
    colors: { primary: "#283618", secondary: "#dda15e", accent: "#bc6c25" },
    fonts: { heading: "Merriweather", body: "Source Sans Pro" },
  },
  {
    value: "corporate-pro",
    label: "Corporate Pro",
    description: "Profesyonel iş dünyası estetiği",
    previewGradient: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)",
    colors: { primary: "#212529", secondary: "#495057", accent: "#e02485" },
    fonts: { heading: "Montserrat", body: "Open Sans" },
  },
  {
    value: "playful-cartoon",
    label: "Playful Cartoon",
    description: "Eğlenceli ve renkli çizgi film tarzı",
    previewGradient: "linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #ffe66d 100%)",
    colors: { primary: "#ff6b6b", secondary: "#4ecdc4", accent: "#ffe66d" },
    fonts: { heading: "Fredoka One", body: "Nunito" },
  },
  {
    value: "luxury-gold",
    label: "Luxury Gold",
    description: "Lüks altın ve siyah kombinasyonu",
    previewGradient: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #c9b037 100%)",
    colors: { primary: "#c9b037", secondary: "#1a1a1a", accent: "#d4af37" },
    fonts: { heading: "Cinzel", body: "Cormorant Garamond" },
  },
  {
    value: "gradient-modern",
    label: "Gradient Modern",
    description: "Modern gradyan arka planlar",
    previewGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    colors: { primary: "#764ba2", secondary: "#667eea", accent: "#f093fb" },
    fonts: { heading: "Poppins", body: "Roboto" },
  },
  {
    value: "ai-photorealistic",
    label: "AI Photorealistic",
    description: "Yapay zeka ile gerçekçi görüntüler",
    previewGradient: "linear-gradient(135deg, #2c3e50 0%, #3498db 50%, #ecf0f1 100%)",
    colors: { primary: "#2c3e50", secondary: "#3498db", accent: "#e74c3c" },
    fonts: { heading: "Space Grotesk", body: "DM Sans" },
  },
  {
    value: "paper-collage",
    label: "Paper Collage",
    description: "Kağıt kolaj ve scrapbook estetiği",
    previewGradient: "linear-gradient(135deg, #f5f0e6 0%, #e8e1d5 50%, #d4c4b0 100%)",
    colors: { primary: "#5c4b37", secondary: "#8b7355", accent: "#d4a373" },
    fonts: { heading: "Special Elite", body: "Courier Prime" },
  },
  {
    value: "motion-graphics",
    label: "Motion Graphics",
    description: "Dinamik hareket grafikleri tarzı",
    previewGradient: "linear-gradient(135deg, #ff0055 0%, #ff5500 50%, #ffaa00 100%)",
    colors: { primary: "#ff0055", secondary: "#ff5500", accent: "#ffaa00" },
    fonts: { heading: "Bebas Neue", body: "Inter" },
  },
];

export const FONT_PAIRS: FontPair[] = [
  { value: "space-dm", label: "Space Grotesk + DM Sans", heading: "Space Grotesk", body: "DM Sans" },
  { value: "playfair-inter", label: "Playfair Display + Inter", heading: "Playfair Display", body: "Inter" },
  { value: "abril-lato", label: "Abril Fatface + Lato", heading: "Abril Fatface", body: "Lato" },
  { value: "orbitron-rajdhani", label: "Orbitron + Rajdhani", heading: "Orbitron", body: "Rajdhani" },
  { value: "merriweather-source", label: "Merriweather + Source Sans", heading: "Merriweather", body: "Source Sans Pro" },
  { value: "montserrat-open", label: "Montserrat + Open Sans", heading: "Montserrat", body: "Open Sans" },
  { value: "fredoka-nunito", label: "Fredoka One + Nunito", heading: "Fredoka One", body: "Nunito" },
  { value: "cinzel-cormorant", label: "Cinzel + Cormorant", heading: "Cinzel", body: "Cormorant Garamond" },
  { value: "poppins-roboto", label: "Poppins + Roboto", heading: "Poppins", body: "Roboto" },
  { value: "special-courier", label: "Special Elite + Courier", heading: "Special Elite", body: "Courier Prime" },
  { value: "bebas-inter", label: "Bebas Neue + Inter", heading: "Bebas Neue", body: "Inter" },
];

export const DEFAULT_COLOR_PALETTE: ColorPalette = {
  primary: "#e02485",
  secondary: "#22d3ee",
  accent: "#f472b6",
  background: "#211119",
  text: "#f9fafb",
};
