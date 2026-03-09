'use client';

import { useState, useCallback } from 'react';
import { Sparkles, Clock, MessageSquare, Target, Save, Edit3 } from 'lucide-react';

interface ScriptConfig {
  duration: number;
  tone: string;
  platform: string;
  niche: string;
}

interface Script {
  id: string;
  prompt: string;
  content: string | null;
  title: string | null;
  niche: string | null;
  duration: number;
  tone: string;
  platform: string;
  isGenerated: boolean;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

const TONE_OPTIONS = [
  { value: 'egitici', label: 'Egitici', description: 'Bilgi verici, net ve anlasilir' },
  { value: 'motivasyonel', label: 'Motivasyonel', description: 'Ilham verici, enerji dolu' },
  { value: 'eglenceli', label: 'Eglenceli', description: 'Samimi, dostane bir ton' },
  { value: 'profesyonel', label: 'Profesyonel', description: 'Ciddi, guvenilir, is odakli' },
];

const PLATFORM_OPTIONS = [
  { value: 'tiktok', label: 'TikTok / Reels (9:16)' },
  { value: 'youtube-shorts', label: 'YouTube Shorts (9:16)' },
  { value: 'youtube-long', label: 'YouTube Uzun (16:9)' },
  { value: 'instagram', label: 'Instagram Feed (4:5)' },
];

const DURATION_OPTIONS = [
  { value: 15, label: '15 saniye' },
  { value: 30, label: '30 saniye' },
  { value: 60, label: '60 saniye' },
];

const NICHE_OPTIONS = [
  'Teknoloji',
  'Egitim',
  'Saglik',
  'Finans',
  'Lifestyle',
  'Mutfak',
  'Seyahat',
  'Fitness',
  'Is Dunyasi',
  'Eglence',
];

const MAX_PROMPT_LENGTH = 1000;

export function ScriptWizard() {
  const [prompt, setPrompt] = useState('');
  const [config, setConfig] = useState<ScriptConfig>({
    duration: 15,
    tone: 'profesyonel',
    platform: 'tiktok',
    niche: '',
  });
  const [generatedScript, setGeneratedScript] = useState<Script | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const characterCount = prompt.length;
  const isOverLimit = characterCount > MAX_PROMPT_LENGTH;

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Lutfen bir video fikri girin');
      return;
    }

    if (isOverLimit) {
      setError('Prompt 1000 karakterden uzun olamaz');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/scripts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          ...config,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Senaryo olusturulamadi');
      }

      const script: Script = await response.json();
      setGeneratedScript(script);
      setEditedContent(script.content || '');
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata olustu');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, config, isOverLimit]);

  const handleSaveEdit = useCallback(async () => {
    if (!generatedScript) return;

    try {
      const response = await fetch(`/api/scripts/${generatedScript.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editedContent }),
      });

      if (!response.ok) {
        throw new Error('Kaydetme basarisiz');
      }

      const updated = await response.json();
      setGeneratedScript(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kaydetme basarisiz');
    }
  }, [generatedScript, editedContent]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            AI Senaryo Yazici
          </h1>
          <p className="text-muted-foreground text-base">
            Video fikrinizi yazin, AI sizin icin profesyonel bir senaryo olustursun.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <label className="flex flex-col w-full mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-foreground text-sm font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Video Fikri
              </span>
              <span className={`text-sm ${isOverLimit ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                {characterCount}/{MAX_PROMPT_LENGTH}
              </span>
            </div>
            <textarea
              className={`w-full resize-y rounded-lg bg-background border-2 min-h-[160px] p-4 text-base placeholder:text-muted-foreground/60 transition-colors ${
                isOverLimit 
                  ? 'border-destructive focus:ring-destructive' 
                  : 'border-border focus:border-primary focus:ring-1 focus:ring-primary'
              }`}
              placeholder="Ornek: Surdurulebilir bir kahve markasi icin 30 saniyelik tanitim videosu. Cevre dostu ambalaj ve zengin lezzet profili one cikarilacak..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </label>

          {/* Niche Selector */}
          <div className="mb-6">
            <label className="text-sm font-bold text-foreground mb-2 block flex items-center gap-2">
              <Target className="w-4 h-4" />
              Nis Secin
            </label>
            <select
              className="w-full rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary py-2.5 px-3"
              value={config.niche}
              onChange={(e) => setConfig(prev => ({ ...prev, niche: e.target.value }))}
            >
              <option value="">Nis secin (istege bagli)</option>
              {NICHE_OPTIONS.map((niche) => (
                <option key={niche} value={niche}>{niche}</option>
              ))}
            </select>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim() || isOverLimit}
            className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-5 h-5" />
            {isLoading ? 'Olusturuluyor...' : 'Senaryo Olustur'}
          </button>

          {/* Error Message */}
          {error && (
            <div className="text-destructive text-sm mt-4 p-3 bg-destructive/10 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Generated Script Display */}
        {generatedScript && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm relative">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-lg flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-primary" />
                Olusturulan Senaryo
              </h4>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {generatedScript.duration}s
                </span>
                <span className="text-sm text-muted-foreground">
                  {generatedScript.wordCount} kelime
                </span>
              </div>
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  className="w-full resize-y rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary min-h-[300px] p-4 text-sm"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Kaydet
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Iptal
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-background rounded-lg p-5 border border-border text-foreground leading-relaxed max-h-[400px] overflow-y-auto text-sm whitespace-pre-wrap">
                  {generatedScript.content || 'Icerik olusturulamadi'}
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
                >
                  <Edit3 className="w-4 h-4" />
                  Duzenle
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Configuration Sidebar */}
      <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h4 className="font-bold text-lg mb-4 border-b border-border pb-2">Ayarlar</h4>
          <div className="flex flex-col gap-5">
            {/* Duration Selection */}
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Sure
              </label>
              <div className="grid grid-cols-3 gap-2">
                {DURATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setConfig(prev => ({ ...prev, duration: opt.value }))}
                    className={`text-center py-2 px-1 border rounded-lg text-sm font-medium transition-colors ${
                      config.duration === opt.value
                        ? 'bg-primary text-white border-primary'
                        : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    {opt.value}s
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selection */}
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block">Ton</label>
              <div className="space-y-2">
                {TONE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setConfig(prev => ({ ...prev, tone: opt.value }))}
                    className={`w-full text-left p-3 border rounded-lg text-sm transition-colors ${
                      config.tone === opt.value
                        ? 'bg-primary/10 border-primary/20 text-primary'
                        : 'bg-background border-border hover:border-primary/50 text-foreground'
                    }`}
                  >
                    <div className="font-medium">{opt.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{opt.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Selection */}
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block">Platform</label>
              <select
                className="w-full rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary py-2.5 px-3"
                value={config.platform}
                onChange={(e) => setConfig(prev => ({ ...prev, platform: e.target.value }))}
              >
                {PLATFORM_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScriptWizard;