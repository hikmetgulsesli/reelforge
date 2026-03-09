'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Check,
  Type,
  Palette,
  Play,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

interface SubtitlesStepProps {
  initialData?: SubtitlesStepData;
  onDataChange?: (data: SubtitlesStepData) => void;
}

export interface SubtitlesStepData {
  selectedPreset: string;
  fontFamily: string;
  textColor: string;
  backgroundColor: string;
  outlineColor: string;
  animationEnabled: boolean;
  position: 'top' | 'center' | 'bottom';
}

export const SUBTITLE_PRESETS = [
  {
    id: 'modern-bold',
    name: 'Modern Kalin',
    preview: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', background: 'rgba(0,0,0,0.6)' },
  },
  {
    id: 'classic-yellow',
    name: 'Klasik Sari',
    preview: { fontSize: 22, fontWeight: 'bold', color: '#FFD700', background: 'transparent' },
  },
  {
    id: 'neon-glow',
    name: 'Neon Parilti',
    preview: { fontSize: 24, fontWeight: 'bold', color: '#00FFFF', background: 'transparent', textShadow: '0 0 10px #00FFFF' },
  },
  {
    id: 'minimal-white',
    name: 'Minimal Beyaz',
    preview: { fontSize: 18, fontWeight: 'normal', color: '#FFFFFF', background: 'rgba(0,0,0,0.4)' },
  },
  {
    id: 'cinematic',
    name: 'Sinematik',
    preview: { fontSize: 20, fontWeight: '500', color: '#F5F5F5', background: 'transparent', letterSpacing: '0.05em' },
  },
  {
    id: 'tiktok-style',
    name: 'TikTok Tarzi',
    preview: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF', background: 'transparent', textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000' },
  },
  {
    id: 'youtube-cc',
    name: 'YouTube CC',
    preview: { fontSize: 20, fontWeight: 'normal', color: '#FFFFFF', background: 'rgba(0,0,0,0.75)', borderRadius: '4px' },
  },
  {
    id: 'retro-caption',
    name: 'Retro Altyazi',
    preview: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', background: '#1a1a2e', border: '2px solid #e02485' },
  },
  {
    id: 'gradient-pop',
    name: 'Gradient Pop',
    preview: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', background: 'linear-gradient(90deg, #e02485, #22d3ee)', borderRadius: '8px' },
  },
  {
    id: 'outline-only',
    name: 'Sadece Cerceve',
    preview: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', background: 'transparent', textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000' },
  },
];

export const FONT_FAMILIES = [
  { id: 'inter', name: 'Inter', cssValue: '"Inter", sans-serif' },
  { id: 'roboto', name: 'Roboto', cssValue: '"Roboto", sans-serif' },
  { id: 'montserrat', name: 'Montserrat', cssValue: '"Montserrat", sans-serif' },
  { id: 'poppins', name: 'Poppins', cssValue: '"Poppins", sans-serif' },
  { id: 'opensans', name: 'Open Sans', cssValue: '"Open Sans", sans-serif' },
  { id: 'lato', name: 'Lato', cssValue: '"Lato", sans-serif' },
  { id: 'nunito', name: 'Nunito', cssValue: '"Nunito", sans-serif' },
  { id: 'raleway', name: 'Raleway', cssValue: '"Raleway", sans-serif' },
];

const PREVIEW_TEXT = 'Bu bir ornek altyazi metnidir.';

export function SubtitlesStep({ initialData, onDataChange }: SubtitlesStepProps) {
  const [selectedPreset, setSelectedPreset] = useState(initialData?.selectedPreset || 'modern-bold');
  const [fontFamily, setFontFamily] = useState(initialData?.fontFamily || 'inter');
  const [textColor, setTextColor] = useState(initialData?.textColor || '#FFFFFF');
  const [backgroundColor, setBackgroundColor] = useState(initialData?.backgroundColor || 'rgba(0,0,0,0.6)');
  const [outlineColor, setOutlineColor] = useState(initialData?.outlineColor || '#000000');
  const [animationEnabled, setAnimationEnabled] = useState(initialData?.animationEnabled ?? true);
  const [position, setPosition] = useState<'top' | 'center' | 'bottom'>(initialData?.position || 'bottom');
  const [showFontDropdown, setShowFontDropdown] = useState(false);

  const selectedPresetData = useMemo(() => {
    return SUBTITLE_PRESETS.find((p) => p.id === selectedPreset);
  }, [selectedPreset]);

  const selectedFont = useMemo(() => {
    return FONT_FAMILIES.find((f) => f.id === fontFamily);
  }, [fontFamily]);

  const notifyChange = useCallback(
    (updates: Partial<SubtitlesStepData>) => {
      onDataChange?.({
        selectedPreset,
        fontFamily,
        textColor,
        backgroundColor,
        outlineColor,
        animationEnabled,
        position,
        ...updates,
      });
    },
    [selectedPreset, fontFamily, textColor, backgroundColor, outlineColor, animationEnabled, position, onDataChange]
  );

  const handlePresetSelect = useCallback(
    (presetId: string) => {
      setSelectedPreset(presetId);
      notifyChange({ selectedPreset: presetId });
    },
    [notifyChange]
  );

  const handleFontChange = useCallback(
    (fontId: string) => {
      setFontFamily(fontId);
      setShowFontDropdown(false);
      notifyChange({ fontFamily: fontId });
    },
    [notifyChange]
  );

  const handleTextColorChange = useCallback(
    (color: string) => {
      setTextColor(color);
      notifyChange({ textColor: color });
    },
    [notifyChange]
  );

  const handleBackgroundColorChange = useCallback(
    (color: string) => {
      setBackgroundColor(color);
      notifyChange({ backgroundColor: color });
    },
    [notifyChange]
  );

  const handleOutlineColorChange = useCallback(
    (color: string) => {
      setOutlineColor(color);
      notifyChange({ outlineColor: color });
    },
    [notifyChange]
  );

  const handleAnimationToggle = useCallback(() => {
    const newValue = !animationEnabled;
    setAnimationEnabled(newValue);
    notifyChange({ animationEnabled: newValue });
  }, [animationEnabled, notifyChange]);

  const handlePositionChange = useCallback(
    (newPosition: 'top' | 'center' | 'bottom') => {
      setPosition(newPosition);
      notifyChange({ position: newPosition });
    },
    [notifyChange]
  );

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'items-start pt-8';
      case 'center':
        return 'items-center';
      case 'bottom':
        return 'items-end pb-8';
      default:
        return 'items-end pb-8';
    }
  };

  const getSubtitleStyle = (): React.CSSProperties => {
    const preset = selectedPresetData?.preview;
    return {
      fontFamily: selectedFont?.cssValue || 'sans-serif',
      fontSize: `${preset?.fontSize || 24}px`,
      fontWeight: preset?.fontWeight || 'bold',
      color: textColor,
      backgroundColor: backgroundColor === 'transparent' ? undefined : backgroundColor,
      textShadow: outlineColor !== 'transparent' 
        ? `-1px -1px 0 ${outlineColor}, 1px -1px 0 ${outlineColor}, -1px 1px 0 ${outlineColor}, 1px 1px 0 ${outlineColor}`
        : undefined,
      letterSpacing: preset?.letterSpacing,
      borderRadius: preset?.borderRadius,
      padding: backgroundColor !== 'transparent' ? '8px 16px' : undefined,
    };
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h1
          className="text-3xl md:text-4xl font-bold leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Altyazi Yapilandirma
        </h1>
        <p className="text-muted-foreground text-lg">
          Videonuz icin altyazi stilini secin ve ozellestirin. Canli onizleme ile sonuclari gorun.
        </p>
      </div>

      {/* Preset Style Cards */}
      <div>
        <h3
          className="font-bold text-lg mb-4 flex items-center gap-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <Sparkles className="w-5 h-5 text-primary" />
          Hazir Stiller
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {SUBTITLE_PRESETS.map((preset) => {
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset.id)}
                className={`relative flex flex-col gap-2 p-3 rounded-xl border-2 transition-all hover:shadow-md ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border bg-card hover:border-primary/40'
                }`}
                aria-pressed={isSelected}
                aria-label={`${preset.name} stili sec`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 z-10 bg-primary rounded-full size-5 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}

                {/* Mini Preview */}
                <div className="w-full aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <span
                    className="text-xs text-center px-2"
                    style={{
                      fontFamily: 'sans-serif',
                      color: preset.preview.color,
                      backgroundColor: preset.preview.background,
                      fontWeight: preset.preview.fontWeight as React.CSSProperties['fontWeight'],
                      textShadow: preset.preview.textShadow,
                    }}
                  >
                    Aa
                  </span>
                </div>

                {/* Name */}
                <p
                  className={`text-sm font-bold text-left truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}
                >
                  {preset.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Play className="w-5 h-5 text-primary" />
          <h3
            className="font-bold text-lg"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Canli Onizleme
          </h3>
        </div>
        <div className="relative w-full aspect-video max-w-2xl mx-auto rounded-lg overflow-hidden border border-border bg-gradient-to-br from-slate-800 via-slate-900 to-black">
          {/* Mock video background */}
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
            <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          
          {/* Subtitle overlay */}
          <div className={`absolute inset-x-0 flex justify-center ${getPositionClasses()} px-4`}>
            <p
              className={`text-center max-w-[90%] ${animationEnabled ? 'animate-pulse' : ''}`}
              style={getSubtitleStyle()}
            >
              {PREVIEW_TEXT}
            </p>
          </div>
        </div>
      </div>

      {/* Customization Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Font Family Dropdown */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
            <Type className="w-4 h-4 text-primary" />
            Font Ailesi
          </label>
          <div className="relative">
            <button
              onClick={() => setShowFontDropdown(!showFontDropdown)}
              className="w-full rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary py-2.5 px-3 text-left flex items-center justify-between"
              aria-expanded={showFontDropdown}
              aria-haspopup="listbox"
            >
              <span className="text-foreground">{selectedFont?.name}</span>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${showFontDropdown ? 'rotate-180' : ''}`}
              />
            </button>
            {showFontDropdown && (
              <div
                className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-10 max-h-[240px] overflow-y-auto"
                role="listbox"
              >
                {FONT_FAMILIES.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => handleFontChange(font.id)}
                    className={`w-full text-left px-3 py-2.5 hover:bg-surface-hover transition-colors ${
                      fontFamily === font.id ? 'text-primary bg-primary/10' : 'text-foreground'
                    }`}
                    role="option"
                    aria-selected={fontFamily === font.id}
                    style={{ fontFamily: font.cssValue }}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Text Color Picker */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
            <Palette className="w-4 h-4 text-primary" />
            Metin Rengi
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={textColor}
              onChange={(e) => handleTextColorChange(e.target.value)}
              className="w-12 h-10 rounded-lg border border-border cursor-pointer"
              aria-label="Metin rengi secici"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => handleTextColorChange(e.target.value)}
              className="flex-1 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 text-sm uppercase"
              placeholder="#FFFFFF"
            />
          </div>
        </div>

        {/* Background Color Picker */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
            <Palette className="w-4 h-4 text-primary" />
            Arka Plan Rengi
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={backgroundColor.startsWith('rgba') ? '#000000' : backgroundColor}
              onChange={(e) => handleBackgroundColorChange(e.target.value)}
              className="w-12 h-10 rounded-lg border border-border cursor-pointer"
              aria-label="Arka plan rengi secici"
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => handleBackgroundColorChange(e.target.value)}
              className="flex-1 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 text-sm"
              placeholder="rgba(0,0,0,0.6)"
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleBackgroundColorChange('transparent')}
              className={`text-xs px-2 py-1 rounded border transition-colors ${
                backgroundColor === 'transparent' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              Seffaf
            </button>
            <button
              onClick={() => handleBackgroundColorChange('rgba(0,0,0,0.6)')}
              className={`text-xs px-2 py-1 rounded border transition-colors ${
                backgroundColor === 'rgba(0,0,0,0.6)' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              Yari Saydam
            </button>
          </div>
        </div>

        {/* Outline Color Picker */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
            <Palette className="w-4 h-4 text-primary" />
            Cerceve Rengi
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={outlineColor}
              onChange={(e) => handleOutlineColorChange(e.target.value)}
              className="w-12 h-10 rounded-lg border border-border cursor-pointer"
              aria-label="Cerceve rengi secici"
            />
            <input
              type="text"
              value={outlineColor}
              onChange={(e) => handleOutlineColorChange(e.target.value)}
              className="flex-1 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 text-sm uppercase"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Animation Toggle */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            Animasyon
          </label>
          <button
            onClick={handleAnimationToggle}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              animationEnabled ? 'bg-primary' : 'bg-muted'
            }`}
            role="switch"
            aria-checked={animationEnabled}
            aria-label="Altyazi animasyonunu ac/kapat"
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                animationEnabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
          <p className="text-xs text-muted-foreground mt-2">
            {animationEnabled ? 'Animasyon acik - metin canli gorunecek' : 'Animasyon kapali - statik metin'}
          </p>
        </div>

        {/* Position Selector */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
            <AlignEndVertical className="w-4 h-4 text-primary" />
            Konum
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => handlePositionChange('top')}
              className={`flex-1 flex flex-col items-center gap-1 py-2 px-3 rounded-lg border-2 transition-all ${
                position === 'top'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/40'
              }`}
              aria-pressed={position === 'top'}
            >
              <AlignStartVertical className="w-4 h-4" />
              <span className="text-xs font-medium">Ust</span>
            </button>
            <button
              onClick={() => handlePositionChange('center')}
              className={`flex-1 flex flex-col items-center gap-1 py-2 px-3 rounded-lg border-2 transition-all ${
                position === 'center'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/40'
              }`}
              aria-pressed={position === 'center'}
            >
              <AlignCenterVertical className="w-4 h-4" />
              <span className="text-xs font-medium">Orta</span>
            </button>
            <button
              onClick={() => handlePositionChange('bottom')}
              className={`flex-1 flex flex-col items-center gap-1 py-2 px-3 rounded-lg border-2 transition-all ${
                position === 'bottom'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/40'
              }`}
              aria-pressed={position === 'bottom'}
            >
              <AlignEndVertical className="w-4 h-4" />
              <span className="text-xs font-medium">Alt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubtitlesStep;