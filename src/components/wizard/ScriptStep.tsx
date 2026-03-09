'use client';

import { useState, useCallback, useMemo } from 'react';
import { 
  Sparkles, 
  Clock, 
  MessageSquare, 
  Target, 
  Edit3, 
  Save, 
  TrendingUp, 
  GraduationCap, 
  BookOpen,
  Zap,
  FileText,
  ChevronDown
} from 'lucide-react';

interface ScriptStepProps {
  initialData?: {
    prompt?: string;
    duration?: number;
    tone?: string;
    platform?: string;
    niche?: string;
    generatedScript?: string;
  };
  onDataChange?: (data: ScriptStepData) => void;
  onNext?: () => void;
}

export interface ScriptStepData {
  prompt: string;
  duration: number;
  tone: string;
  platform: string;
  niche: string;
  generatedScript: string | null;
  wordCount: number;
}

const TONE_OPTIONS = [
  { value: 'professional', label: 'Profesyonel', icon: TrendingUp, description: 'Ciddi, guvenilir, is odakli' },
  { value: 'casual', label: 'Samimi & Dostane', icon: Zap, description: 'Rahat, sicak bir anlatim' },
  { value: 'dramatic', label: 'Dramatik & Sinematik', icon: BookOpen, description: 'Etkileyici, duygusal' },
  { value: 'humorous', label: 'Eglenceli', icon: Sparkles, description: 'Komik, neseli bir ton' },
  { value: 'inspirational', label: 'Ilham Verici', icon: GraduationCap, description: 'Motive edici, yureklendirici' },
];

const PLATFORM_OPTIONS = [
  { value: 'tiktok', label: 'TikTok / Reels (9:16)' },
  { value: 'youtube-shorts', label: 'YouTube Shorts (9:16)' },
  { value: 'youtube-long', label: 'YouTube Uzun (16:9)' },
  { value: 'instagram', label: 'Instagram Feed (4:5)' },
];

const DURATION_OPTIONS = [
  { value: 15, label: '15s' },
  { value: 30, label: '30s' },
  { value: 60, label: '60s' },
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

const QUICK_TEMPLATES = [
  { label: 'Trending', icon: TrendingUp, template: 'Trending bir konu icin kisa ve etkileyici bir video...' },
  { label: 'Egitici', icon: GraduationCap, template: 'Bir konuyu basit ve anlasilir bir sekilde anlatan...' },
  { label: 'Hikaye', icon: BookOpen, template: 'Izleyiciyi icine ceken bir hikaye anlatimi ile...' },
];

const MAX_PROMPT_LENGTH = 1000;

export function ScriptStep({ initialData, onDataChange }: ScriptStepProps) {
  const [prompt, setPrompt] = useState(initialData?.prompt || '');
  const [duration, setDuration] = useState(initialData?.duration || 15);
  const [tone, setTone] = useState(initialData?.tone || 'professional');
  const [platform, setPlatform] = useState(initialData?.platform || 'tiktok');
  const [niche, setNiche] = useState(initialData?.niche || '');
  const [generatedScript, setGeneratedScript] = useState(initialData?.generatedScript || '');
  const [editedContent, setEditedContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNicheDropdown, setShowNicheDropdown] = useState(false);

  const characterCount = prompt.length;
  const wordCount = useMemo(() => {
    if (!generatedScript) return 0;
    return generatedScript.trim().split(/\s+/).filter(Boolean).length;
  }, [generatedScript]);
  const isOverLimit = characterCount > MAX_PROMPT_LENGTH;

  const handlePromptChange = useCallback((value: string) => {
    setPrompt(value);
    setError(null);
  }, []);

  const handleTemplateClick = useCallback((template: string) => {
    setPrompt(template);
    setError(null);
  }, []);

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
      // Mock script generation for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockScript = `Bu bir ornek senaryo metnidir.\n\nVideo fikriniz: ${prompt.substring(0, 100)}...\n\nBu senaryo ${duration} saniyelik bir video icin optimize edilmistir.\n\nHedef platform: ${PLATFORM_OPTIONS.find(p => p.value === platform)?.label}\nTon: ${TONE_OPTIONS.find(t => t.value === tone)?.label}`;

      setGeneratedScript(mockScript);
      setEditedContent(mockScript);
      setIsEditing(false);

      onDataChange?.({
        prompt,
        duration,
        tone,
        platform,
        niche,
        generatedScript: mockScript,
        wordCount: mockScript.split(/\s+/).filter(Boolean).length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata olustu');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, duration, tone, platform, niche, isOverLimit, onDataChange]);

  const handleSaveEdit = useCallback(() => {
    if (!editedContent.trim()) return;
    
    setGeneratedScript(editedContent);
    setIsEditing(false);
    
    onDataChange?.({
      prompt,
      duration,
      tone,
      platform,
      niche,
      generatedScript: editedContent,
      wordCount: editedContent.trim().split(/\s+/).filter(Boolean).length,
    });
  }, [editedContent, prompt, duration, tone, platform, niche, onDataChange]);

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
            Senaryo Olusturma
          </h1>
          <p className="text-muted-foreground text-base">
            Video fikrinizi tanimlayin, AI sizin icin etkileyici bir senaryo olustursun.
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
              <span 
                className={`text-sm font-medium ${
                  isOverLimit ? 'text-destructive font-bold' : 'text-muted-foreground'
                }`}
              >
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
              onChange={(e) => handlePromptChange(e.target.value)}
            />
          </label>

          {/* Quick Template Buttons */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex gap-2 flex-wrap">
              {QUICK_TEMPLATES.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleTemplateClick(item.template)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium border border-primary/20"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim() || isOverLimit}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5" />
              {isLoading ? 'Olusturuluyor...' : 'Senaryo Olustur'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-destructive text-sm p-3 bg-destructive/10 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Generated Script Display */}
        {generatedScript && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm relative">
            <div className="flex justify-between items-center mb-4">
              <h4 
                className="font-bold text-lg flex items-center gap-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <FileText className="w-5 h-5 text-primary" />
                Olusturulan Senaryo
              </h4>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {duration}s
                </span>
                <span className="text-sm text-muted-foreground">
                  {wordCount} kelime
                </span>
                {!isEditing && (
                  <button
                    onClick={() => {
                      setEditedContent(generatedScript);
                      setIsEditing(true);
                    }}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium"
                  >
                    <Edit3 className="w-4 h-4" />
                    Duzenle
                  </button>
                )}
              </div>
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  className="w-full resize-y rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary min-h-[200px] p-4 text-sm leading-relaxed"
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
              <div className="bg-background rounded-lg p-5 border border-border text-foreground leading-relaxed h-[200px] overflow-y-auto text-sm whitespace-pre-wrap"
                   style={{ fontFamily: 'var(--font-body)' }}>
                {generatedScript}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Configuration Sidebar */}
      <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h4 
            className="font-bold text-lg mb-4 border-b border-border pb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Yapilandirma
          </h4>
          <div className="flex flex-col gap-5">
            {/* Duration Selection */}
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Hedef Sure
              </label>
              <div className="grid grid-cols-3 gap-2">
                {DURATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDuration(opt.value)}
                    className={`text-center py-2 px-1 border rounded-lg text-sm font-medium transition-colors ${
                      duration === opt.value
                        ? 'bg-primary text-white border-primary'
                        : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selection */}
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block" htmlFor="tone-select">
                Senaryo Tonu
              </label>
              <select
                id="tone-select"
                className="w-full rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary py-2.5 px-3 appearance-none cursor-pointer"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                {TONE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                {TONE_OPTIONS.find(o => o.value === tone)?.description}
              </p>
            </div>

            {/* Niche Selection */}
            <div className="relative">
              <label className="text-sm font-bold text-foreground mb-2 block flex items-center gap-2">
                <Target className="w-4 h-4" />
                Nis
              </label>
              <button
                onClick={() => setShowNicheDropdown(!showNicheDropdown)}
                className="w-full rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary py-2.5 px-3 text-left flex items-center justify-between"
              >
                <span className={niche ? 'text-foreground' : 'text-muted-foreground'}>
                  {niche || 'Nis secin (istege bagli)'}
                </span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showNicheDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showNicheDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-10 max-h-[200px] overflow-y-auto">
                  <button
                    onClick={() => {
                      setNiche('');
                      setShowNicheDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-surface-hover transition-colors"
                  >
                    Nis secin (istege bagli)
                  </button>
                  {NICHE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setNiche(opt);
                        setShowNicheDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-hover transition-colors ${
                        niche === opt ? 'text-primary bg-primary/10' : 'text-foreground'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Platform Selection */}
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block" htmlFor="platform-select">
                Hedef Platform
              </label>
              <select
                id="platform-select"
                className="w-full rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary py-2.5 px-3 appearance-none cursor-pointer"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
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

      {/* Navigation - will be rendered by parent */}
    </div>
  );
}

export default ScriptStep;