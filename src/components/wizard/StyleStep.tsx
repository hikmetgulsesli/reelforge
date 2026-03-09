'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Check,
  Palette,
  Type,
  ChevronDown,
  ChevronUp,
  Eye,
  Wand2,
} from 'lucide-react';

interface StyleStepProps {
  initialData?: StyleStepData;
  onDataChange?: (data: StyleStepData) => void;
}

export interface StyleStepData {
  selectedStyle: string | null;
  colorPalette: string;
  fontPair: string;
  advancedCustomization: {
    saturation: number;
    contrast: number;
    brightness: number;
  };
}

export const VISUAL_STYLES = [
  {
    id: 'anime',
    name: 'Anime',
    description: 'Canli Japon animasyon stili',
    gradient: 'from-pink-500 to-rose-300',
  },
  {
    id: 'cinematic',
    name: 'Sinematik',
    description: 'Dramatik isik ve derinlik',
    gradient: 'from-blue-900 to-slate-900',
  },
  {
    id: 'comic-book',
    name: 'Cizgi Roman',
    description: 'Koyu cerceveler ve pop-art renkleri',
    gradient: 'from-yellow-400 via-red-500 to-blue-500',
  },
  {
    id: 'realistic',
    name: 'Realistik',
    description: 'Gercekci, fotograf kalitesi',
    gradient: 'from-stone-400 to-amber-700',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon isikli, futuristik estetik',
    gradient: 'from-purple-600 via-fuchsia-500 to-cyan-400',
  },
  {
    id: 'ghibli',
    name: 'Studio Ghibli',
    description: 'Yumusak, boyanmis fantezi stili',
    gradient: 'from-emerald-300 to-yellow-200',
  },
  {
    id: 'pixel-art',
    name: 'Pixel Art',
    description: 'Retro 8-bit / 16-bit grafikler',
    gradient: 'from-blue-500 to-indigo-600',
    isPixel: true,
  },
  {
    id: 'dark-noir',
    name: 'Kara Film',
    description: 'Yuksek kontrast siyah-beyaz',
    gradient: 'from-gray-900 to-gray-400',
  },
  {
    id: 'watercolor',
    name: 'Sulu Boya',
    description: 'Akin, pastel yikama dokuleri',
    gradient: 'from-blue-200 via-pink-200 to-yellow-200',
  },
  {
    id: '3d-render',
    name: '3D Render',
    description: 'Temiz, modern Pixar benzeri 3D',
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
  },
  {
    id: 'oil-painting',
    name: 'Yagli Boya',
    description: 'Klasik sanat tablo etkisi',
    gradient: 'from-amber-600 to-orange-800',
  },
  {
    id: 'neon-glow',
    name: 'Neon Glow',
    description: 'Parlayan neon cizgiler ve renkler',
    gradient: 'from-cyan-400 via-pink-500 to-yellow-400',
  },
];

export const COLOR_PALETTES = [
  { id: 'vibrant', name: 'Canli', colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'] },
  { id: 'pastel', name: 'Pastel', colors: ['#FFB5E8', '#B5DEFF', '#DCD6F7', '#F6E58D', '#7FDBDA'] },
  { id: 'dark', name: 'Koyu', colors: ['#2D3436', '#636E72', '#B2BEC3', '#DFE6E9', '#74B9FF'] },
  { id: 'warm', name: 'Sicak', colors: ['#E17055', '#FDCB6E', '#FAB1A0', '#FF7675', '#FD79A8'] },
  { id: 'cool', name: 'Soguk', colors: ['#0984E3', '#6C5CE7', '#A29BFE', '#74B9FF', '#81ECEC'] },
  { id: 'earth', name: 'Dogal', colors: ['#A0522D', '#CD853F', '#DEB887', '#F5DEB3', '#8B4513'] },
  { id: 'monochrome', name: 'Monokrom', colors: ['#1A1A1A', '#4A4A4A', '#7A7A7A', '#AAAAAA', '#E0E0E0'] },
  { id: 'sunset', name: 'Gun Batimi', colors: ['#FF6B35', '#F7C59F', '#EFEFD0', '#004E89', '#1A659E'] },
];

export const FONT_PAIRS = [
  { id: 'modern', name: 'Modern', heading: 'Space Grotesk', body: 'DM Sans', description: 'Temiz ve cagdas' },
  { id: 'elegant', name: 'Zarif', heading: 'Playfair Display', body: 'Lato', description: 'Zarif ve profesyonel' },
  { id: 'bold', name: 'Dikkat Cekici', heading: 'Bebas Neue', body: 'Open Sans', description: 'Guclu basliklar' },
  { id: 'friendly', name: 'Arkadas Canlisi', heading: 'Nunito', body: 'Source Sans 3', description: 'Yumusak ve samimi' },
  { id: 'tech', name: 'Teknoloji', heading: 'JetBrains Mono', body: 'Inter', description: 'Teknik ve modern' },
  { id: 'classic', name: 'Klasik', heading: 'Merriweather', body: 'Open Sans', description: 'Zaman tasimayan' },
];

export function StyleStep({ initialData, onDataChange }: StyleStepProps) {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(initialData?.selectedStyle || null);
  const [colorPalette, setColorPalette] = useState(initialData?.colorPalette || 'vibrant');
  const [fontPair, setFontPair] = useState(initialData?.fontPair || 'modern');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedSettings, setAdvancedSettings] = useState(
    initialData?.advancedCustomization || {
      saturation: 100,
      contrast: 100,
      brightness: 100,
    }
  );
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showPaletteDropdown, setShowPaletteDropdown] = useState(false);

  const selectedStyleData = useMemo(() => {
    return VISUAL_STYLES.find((s) => s.id === selectedStyle);
  }, [selectedStyle]);

  const selectedFontPair = useMemo(() => {
    return FONT_PAIRS.find((f) => f.id === fontPair);
  }, [fontPair]);

  const selectedPalette = useMemo(() => {
    return COLOR_PALETTES.find((p) => p.id === colorPalette);
  }, [colorPalette]);

  const handleStyleSelect = useCallback(
    (styleId: string) => {
      setSelectedStyle(styleId);
      onDataChange?.({
        selectedStyle: styleId,
        colorPalette,
        fontPair,
        advancedCustomization: advancedSettings,
      });
    },
    [colorPalette, fontPair, advancedSettings, onDataChange]
  );

  const handlePaletteChange = useCallback(
    (paletteId: string) => {
      setColorPalette(paletteId);
      setShowPaletteDropdown(false);
      onDataChange?.({
        selectedStyle,
        colorPalette: paletteId,
        fontPair,
        advancedCustomization: advancedSettings,
      });
    },
    [selectedStyle, fontPair, advancedSettings, onDataChange]
  );

  const handleFontChange = useCallback(
    (fontId: string) => {
      setFontPair(fontId);
      setShowFontDropdown(false);
      onDataChange?.({
        selectedStyle,
        colorPalette,
        fontPair: fontId,
        advancedCustomization: advancedSettings,
      });
    },
    [selectedStyle, colorPalette, advancedSettings, onDataChange]
  );

  const handleAdvancedChange = useCallback(
    (key: keyof typeof advancedSettings, value: number) => {
      const newSettings = { ...advancedSettings, [key]: value };
      setAdvancedSettings(newSettings);
      onDataChange?.({
        selectedStyle,
        colorPalette,
        fontPair,
        advancedCustomization: newSettings,
      });
    },
    [selectedStyle, colorPalette, fontPair, advancedSettings, onDataChange]
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h1
          className="text-3xl md:text-4xl font-bold leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Gorsel Stil Secimi
        </h1>
        <p className="text-muted-foreground text-lg">
          AI videonuz icin sanatsal yonu secin. Bu, olusturulan cercevelerin genel gorunumunu ve
          hissini tanimlayacak.
        </p>
      </div>

      {/* Style Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {VISUAL_STYLES.map((style) => {
          const isSelected = selectedStyle === style.id;
          return (
            <button
              key={style.id}
              onClick={() => handleStyleSelect(style.id)}
              className={`relative flex flex-col gap-2 p-3 rounded-xl border-2 transition-all hover:shadow-md ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
              aria-pressed={isSelected}
              aria-label={`${style.name} stili sec`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 z-10 bg-primary rounded-full size-5 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}

              {/* Thumbnail */}
              <div
                className={`w-full aspect-video rounded-lg overflow-hidden relative ${
                  style.isPixel ? 'bg-slate-800' : ''
                }`}
              >
                {style.isPixel ? (
                  <div
                    className="absolute inset-0 opacity-70"
                    style={{
                      backgroundImage:
                        'linear-gradient(45deg, #3b82f6 25%, transparent 25%, transparent 75%, #3b82f6 75%, #3b82f6), linear-gradient(45deg, #3b82f6 25%, transparent 25%, transparent 75%, #3b82f6 75%, #3b82f6)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 10px 10px',
                    }}
                  />
                ) : (
                  <div
                    className={`absolute inset-0 bg-gradient-to-tr ${style.gradient} opacity-80`}
                  />
                )}
              </div>

              {/* Info */}
              <div className="text-left">
                <p
                  className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}
                >
                  {style.name}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-1">{style.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Live Preview */}
      {selectedStyleData && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-primary" />
            <h3
              className="font-bold text-lg"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Canli Onizleme
            </h3>
          </div>
          <div className="relative w-full aspect-video max-w-md mx-auto rounded-lg overflow-hidden border border-border">
            {selectedStyleData.isPixel ? (
              <div
                className="absolute inset-0 opacity-70"
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #3b82f6 25%, transparent 25%, transparent 75%, #3b82f6 75%, #3b82f6), linear-gradient(45deg, #3b82f6 25%, transparent 25%, transparent 75%, #3b82f6 75%, #3b82f6)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 10px 10px',
                }}
              />
            ) : (
              <div
                className={`absolute inset-0 bg-gradient-to-tr ${selectedStyleData.gradient}`}
                style={{
                  filter: `saturate(${advancedSettings.saturation}%) contrast(${advancedSettings.contrast}%) brightness(${advancedSettings.brightness}%)`,
                }}
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4">
                <p
                  className="text-xl font-bold text-white drop-shadow-lg"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {selectedStyleData.name}
                </p>
                <p className="text-sm text-white/80 drop-shadow">{selectedStyleData.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Color Palette & Font Pair */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Color Palette */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
            <Palette className="w-4 h-4 text-primary" />
            Renk Paleti
          </label>
          <div className="relative">
            <button
              onClick={() => setShowPaletteDropdown(!showPaletteDropdown)}
              className="w-full rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary py-2.5 px-3 text-left flex items-center justify-between"
              aria-expanded={showPaletteDropdown}
              aria-haspopup="listbox"
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {selectedPalette?.colors.slice(0, 3).map((color, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-foreground">{selectedPalette?.name}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  showPaletteDropdown ? 'rotate-180' : ''
                }`}
              />
            </button>
            {showPaletteDropdown && (
              <div
                className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-10 max-h-[240px] overflow-y-auto"
                role="listbox"
              >
                {COLOR_PALETTES.map((palette) => (
                  <button
                    key={palette.id}
                    onClick={() => handlePaletteChange(palette.id)}
                    className={`w-full text-left px-3 py-2.5 text-sm hover:bg-surface-hover transition-colors flex items-center gap-3 ${
                      colorPalette === palette.id ? 'text-primary bg-primary/10' : 'text-foreground'
                    }`}
                    role="option"
                    aria-selected={colorPalette === palette.id}
                  >
                    <div className="flex gap-0.5">
                      {palette.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span>{palette.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Font Pair */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
            <Type className="w-4 h-4 text-primary" />
            Font Cifti
          </label>
          <div className="relative">
            <button
              onClick={() => setShowFontDropdown(!showFontDropdown)}
              className="w-full rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary py-2.5 px-3 text-left flex items-center justify-between"
              aria-expanded={showFontDropdown}
              aria-haspopup="listbox"
            >
              <div className="flex flex-col">
                <span className="text-foreground font-medium">{selectedFontPair?.name}</span>
                <span className="text-xs text-muted-foreground">
                  {selectedFontPair?.heading} + {selectedFontPair?.body}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  showFontDropdown ? 'rotate-180' : ''
                }`}
              />
            </button>
            {showFontDropdown && (
              <div
                className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-10 max-h-[240px] overflow-y-auto"
                role="listbox"
              >
                {FONT_PAIRS.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => handleFontChange(font.id)}
                    className={`w-full text-left px-3 py-2.5 hover:bg-surface-hover transition-colors ${
                      fontPair === font.id ? 'text-primary bg-primary/10' : 'text-foreground'
                    }`}
                    role="option"
                    aria-selected={fontPair === font.id}
                  >
                    <span className="font-medium">{font.name}</span>
                    <p className="text-xs text-muted-foreground">
                      {font.heading} + {font.body}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Customization Accordion */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-4 hover:bg-surface-hover transition-colors"
          aria-expanded={showAdvanced}
        >
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" />
            <span className="font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              Gelismis Ozellestirme
            </span>
          </div>
          {showAdvanced ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        {showAdvanced && (
          <div className="border-t border-border p-4 space-y-5">
            {/* Saturation */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-foreground">Doygunluk</label>
                <span className="text-sm text-muted-foreground">{advancedSettings.saturation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={advancedSettings.saturation}
                onChange={(e) => handleAdvancedChange('saturation', parseInt(e.target.value))}
                className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Contrast */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-foreground">Kontrast</label>
                <span className="text-sm text-muted-foreground">{advancedSettings.contrast}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={advancedSettings.contrast}
                onChange={(e) => handleAdvancedChange('contrast', parseInt(e.target.value))}
                className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Brightness */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-foreground">Parlaklik</label>
                <span className="text-sm text-muted-foreground">{advancedSettings.brightness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={advancedSettings.brightness}
                onChange={(e) => handleAdvancedChange('brightness', parseInt(e.target.value))}
                className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                const defaults = { saturation: 100, contrast: 100, brightness: 100 };
                setAdvancedSettings(defaults);
                onDataChange?.({
                  selectedStyle,
                  colorPalette,
                  fontPair,
                  advancedCustomization: defaults,
                });
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Varsayilana Sifirla
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default StyleStep;