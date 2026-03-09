'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  Mic,
  Upload,
  Gauge,
  X,
  FileAudio,
  Crown,
  Loader2,
} from 'lucide-react';

interface VoiceStepProps {
  initialData?: VoiceStepData;
  onDataChange?: (data: VoiceStepData) => void;
  scriptContent?: string;
}

export interface VoiceStepData {
  selectedVoice: string | null;
  voiceCategory: 'male' | 'female' | 'neutral';
  speed: number;
  pitch: number;
  customVoiceFile: File | null;
  testResult: string | null;
}

export const VOICE_CATEGORIES = [
  { id: 'male', label: 'Erkek', description: 'Erkek sesleri' },
  { id: 'female', label: 'Kadin', description: 'Kadin sesleri' },
  { id: 'neutral', label: 'Notr', description: 'Notr sesler' },
] as const;

export const VOICES = {
  male: [
    { id: 'male-1', name: 'Ahmet', description: 'Guclu, otoriter', preview: 'Merhaba, bu bir test mesajidir.' },
    { id: 'male-2', name: 'Mehmet', description: 'Sicak, samimi', preview: 'Merhaba, bu bir test mesajidir.' },
    { id: 'male-3', name: 'Can', description: 'Genc, enerjik', preview: 'Merhaba, bu bir test mesajidir.' },
    { id: 'male-4', name: 'Burak', description: 'Profesyonel, ciddi', preview: 'Merhaba, bu bir test mesajidir.' },
  ],
  female: [
    { id: 'female-1', name: 'Ayse', description: 'Nazik, sicak', preview: 'Merhaba, bu bir test mesajidir.' },
    { id: 'female-2', name: 'Zeynep', description: 'Dinamik, canli', preview: 'Merhaba, bu bir test mesajidir.' },
    { id: 'female-3', name: 'Elif', description: 'Sakin, guven verici', preview: 'Merhaba, bu bir test mesajidir.' },
    { id: 'female-4', name: 'Selin', description: 'Cesur, etkileyici', preview: 'Merhaba, bu bir test mesajidir.' },
  ],
  neutral: [
    { id: 'neutral-1', name: 'Alex', description: 'Modern, teknolojik', preview: 'Merhaba, bu bir test mesajidir.' },
    { id: 'neutral-2', name: 'Taylor', description: 'Dengeli, net', preview: 'Merhaba, bu bir test mesajidir.' },
    { id: 'neutral-3', name: 'Jordan', description: 'Huzurlu, sakin', preview: 'Merhaba, bu bir test mesajidir.' },
  ],
};

const SPEED_RANGE = { min: 0.5, max: 2.0, step: 0.1, default: 1.0 };
const PITCH_RANGE = { min: 0.5, max: 2.0, step: 0.1, default: 1.0 };

export function VoiceStep({ 
  initialData, 
  onDataChange,
  scriptContent 
}: VoiceStepProps) {
  const [voiceCategory, setVoiceCategory] = useState<'male' | 'female' | 'neutral'>(
    initialData?.voiceCategory || 'male'
  );
  const [selectedVoice, setSelectedVoice] = useState<string | null>(
    initialData?.selectedVoice || null
  );
  const [speed, setSpeed] = useState(initialData?.speed || SPEED_RANGE.default);
  const [pitch, setPitch] = useState(initialData?.pitch || PITCH_RANGE.default);
  const [customVoiceFile, setCustomVoiceFile] = useState<File | null>(
    initialData?.customVoiceFile || null
  );
  const [testResult, setTestResult] = useState<string | null>(initialData?.testResult || null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const voices = VOICES[voiceCategory];
  const selectedVoiceData = useMemo(() => {
    return voices.find((v) => v.id === selectedVoice);
  }, [voices, selectedVoice]);

  const handleCategoryChange = useCallback(
    (category: 'male' | 'female' | 'neutral') => {
      setVoiceCategory(category);
      setSelectedVoice(null);
      onDataChange?.({
        selectedVoice: null,
        voiceCategory: category,
        speed,
        pitch,
        customVoiceFile,
        testResult: null,
      });
    },
    [speed, pitch, customVoiceFile, onDataChange]
  );

  const handleVoiceSelect = useCallback(
    (voiceId: string) => {
      setSelectedVoice(voiceId);
      setTestResult(null);
      onDataChange?.({
        selectedVoice: voiceId,
        voiceCategory,
        speed,
        pitch,
        customVoiceFile,
        testResult: null,
      });
    },
    [voiceCategory, speed, pitch, customVoiceFile, onDataChange]
  );

  const handleSpeedChange = useCallback(
    (value: number) => {
      setSpeed(value);
      onDataChange?.({
        selectedVoice,
        voiceCategory,
        speed: value,
        pitch,
        customVoiceFile,
        testResult,
      });
    },
    [selectedVoice, voiceCategory, pitch, customVoiceFile, testResult, onDataChange]
  );

  const handlePitchChange = useCallback(
    (value: number) => {
      setPitch(value);
      onDataChange?.({
        selectedVoice,
        voiceCategory,
        speed,
        pitch: value,
        customVoiceFile,
        testResult,
      });
    },
    [selectedVoice, voiceCategory, speed, customVoiceFile, testResult, onDataChange]
  );

  const handlePlayPreview = useCallback(
    (voiceId: string) => {
      if (isPlaying === voiceId) {
        setIsPlaying(null);
        return;
      }
      setIsPlaying(voiceId);
      // Simulate audio playback - in real app, this would play actual audio
      setTimeout(() => setIsPlaying(null), 2000);
    },
    [isPlaying]
  );

  const handleFileDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && (file.type.startsWith('audio/') || file.name.endsWith('.wav') || file.name.endsWith('.mp3'))) {
        setCustomVoiceFile(file);
        onDataChange?.({
          selectedVoice,
          voiceCategory,
          speed,
          pitch,
          customVoiceFile: file,
          testResult,
        });
      }
    },
    [selectedVoice, voiceCategory, speed, pitch, testResult, onDataChange]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setCustomVoiceFile(file);
        onDataChange?.({
          selectedVoice,
          voiceCategory,
          speed,
          pitch,
          customVoiceFile: file,
          testResult,
        });
      }
    },
    [selectedVoice, voiceCategory, speed, pitch, testResult, onDataChange]
  );

  const handleRemoveFile = useCallback(() => {
    setCustomVoiceFile(null);
    onDataChange?.({
      selectedVoice,
      voiceCategory,
      speed,
      pitch,
      customVoiceFile: null,
      testResult,
    });
  }, [selectedVoice, voiceCategory, speed, pitch, testResult, onDataChange]);

  const handleTestVoice = useCallback(async () => {
    if (!selectedVoice && !customVoiceFile) return;
    
    setIsTestingVoice(true);
    // Simulate voice testing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const result = `Ses testi tamamlandi. Hiz: ${speed}x, Perde: ${pitch}x`;
    setTestResult(result);
    setIsTestingVoice(false);
    
    onDataChange?.({
      selectedVoice,
      voiceCategory,
      speed,
      pitch,
      customVoiceFile,
      testResult: result,
    });
  }, [selectedVoice, customVoiceFile, speed, pitch, voiceCategory, onDataChange]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1
            className="text-4xl font-black leading-tight tracking-tight mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Seslendirme Secimi
          </h1>
          <p className="text-muted-foreground text-base">
            Videonuz icin sesi secin veya kendi sesinizi yukleyin.
          </p>
        </div>

        {/* Voice Category Tabs */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3
            className="font-bold text-lg mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Ses Kategorisi
          </h3>
          <div className="flex gap-2" role="tablist" aria-label="Ses kategorisi secimi">
            {VOICE_CATEGORIES.map((category) => {
              const isActive = voiceCategory === category.id;
              return (
                <button
                  key={category.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all border-2 ${
                    isActive
                      ? 'bg-primary text-white border-primary shadow-md'
                      : 'bg-background text-foreground border-border hover:border-primary/40'
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Voice Cards Grid */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3
            className="font-bold text-lg mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Mevcut Sesler
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {voices.map((voice) => {
              const isSelected = selectedVoice === voice.id;
              const isCurrentlyPlaying = isPlaying === voice.id;
              return (
                <div
                  key={voice.id}
                  className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border bg-background hover:border-primary/40'
                  }`}
                  onClick={() => handleVoiceSelect(voice.id)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onKeyDown={(e) => e.key === 'Enter' && handleVoiceSelect(voice.id)}
                >
                  {/* Voice Icon */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-primary text-white' : 'bg-surface text-muted-foreground'
                    }`}
                  >
                    <Mic className="w-5 h-5" />
                  </div>

                  {/* Voice Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-bold text-sm ${isSelected ? 'text-primary' : 'text-foreground'}`}
                    >
                      {voice.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{voice.description}</p>
                  </div>

                  {/* Play Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPreview(voice.id);
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isCurrentlyPlaying
                        ? 'bg-primary text-white'
                        : 'bg-surface hover:bg-primary/10 text-muted-foreground hover:text-primary'
                    }`}
                    aria-label={isCurrentlyPlaying ? 'Durdur' : 'Onizle'}
                  >
                    {isCurrentlyPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Speed and Pitch Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Speed Slider */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-bold text-foreground flex items-center gap-2">
                <Gauge className="w-4 h-4 text-primary" />
                Hiz
              </label>
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                {speed.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min={SPEED_RANGE.min}
              max={SPEED_RANGE.max}
              step={SPEED_RANGE.step}
              value={speed}
              onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-primary"
              aria-label="Ses hizi"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Yavas ({SPEED_RANGE.min}x)</span>
              <span>Normal (1.0x)</span>
              <span>Hizli ({SPEED_RANGE.max}x)</span>
            </div>
          </div>

          {/* Pitch Slider */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-bold text-foreground flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-primary" />
                Perde
              </label>
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                {pitch.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min={PITCH_RANGE.min}
              max={PITCH_RANGE.max}
              step={PITCH_RANGE.step}
              value={pitch}
              onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-primary"
              aria-label="Ses perdesi"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Derin ({PITCH_RANGE.min}x)</span>
              <span>Normal (1.0x)</span>
              <span>Yuksek ({PITCH_RANGE.max}x)</span>
            </div>
          </div>
        </div>

        {/* Script Preview */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3
            className="font-bold text-lg mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Senaryo Onizleme
          </h3>
          <div className="bg-background rounded-lg p-4 border border-border min-h-[120px] max-h-[200px] overflow-y-auto text-sm leading-relaxed text-muted-foreground"
               style={{ fontFamily: 'var(--font-body)' }}>
            {scriptContent || 'Onceki adimda olusturulan senaryo burada gorunecek. Senaryo icin seslendirme yapilacak metin.'}
          </div>
          
          {/* Test Voice Button */}
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={handleTestVoice}
              disabled={(!selectedVoice && !customVoiceFile) || isTestingVoice}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTestingVoice ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Test Ediliyor...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Sesi Test Et
                </>
              )}
            </button>
            
            {testResult && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                <Volume2 className="w-4 h-4" />
                {testResult}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar - Voice Cloning (Pro+) */}
      <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
        {/* Voice Cloning Upload */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm relative">
          <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">
            <Crown className="w-3 h-3" />
            Pro+
          </div>
          
          <h3
            className="font-bold text-lg mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Ses Klonlama
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Kendi sesinizi yukleyerek benzersiz bir seslendirme elde edin.
          </p>

          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/40'
            }`}
          >
            {customVoiceFile ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileAudio className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-foreground truncate">
                    {customVoiceFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(customVoiceFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="w-8 h-8 rounded-full hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Dosyayi kaldir"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,.wav,.mp3"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Ses dosyasi yukle"
                />
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Dosyayi buraya surukleyin veya{' '}
                  <span className="text-primary font-medium">secmek icin tiklayin</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  WAV, MP3 - Max 10MB
                </p>
              </>
            )}
          </div>
        </div>

        {/* Selected Voice Info */}
        {selectedVoiceData && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3
              className="font-bold text-lg mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Secili Ses
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-foreground">{selectedVoiceData.name}</p>
                <p className="text-sm text-muted-foreground">{selectedVoiceData.description}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hiz:</span>
                <span className="font-medium">{speed.toFixed(1)}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Perde:</span>
                <span className="font-medium">{pitch.toFixed(1)}x</span>
              </div>
              {customVoiceFile && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ozel Ses:</span>
                  <span className="font-medium text-green-600">Yuklendi</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VoiceStep;