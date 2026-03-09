"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Wand2,
  TrendingUp,
  GraduationCap,
  BookOpen,
  Loader2,
  Edit3,
  FileText,
  Check,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScriptWizardProps {
  onNext?: () => void;
  onCancel?: () => void;
}

interface GeneratedScript {
  id: string;
  content: string;
  wordCount: number;
  duration: number;
  tone: string;
  platform: string;
}

const NICHES = [
  { value: "technology", label: "Teknoloji" },
  { value: "health", label: "Sağlık & Fitness" },
  { value: "finance", label: "Finans" },
  { value: "education", label: "Eğitim" },
  { value: "entertainment", label: "Eğlence" },
  { value: "travel", label: "Seyahat" },
  { value: "food", label: "Yemek & Mutfak" },
  { value: "fashion", label: "Moda" },
  { value: "business", label: "İş & Girişimcilik" },
  { value: "lifestyle", label: "Yaşam Tarzı" },
];

const TONES = [
  { value: "educational", label: "Eğitici" },
  { value: "motivational", label: "Motivasyonel" },
  { value: "funny", label: "Eğlenceli" },
  { value: "professional", label: "Profesyonel" },
  { value: "casual", label: "Samimi" },
  { value: "dramatic", label: "Dramatik" },
];

const PLATFORMS = [
  { value: "tiktok", label: "TikTok / Reels (9:16)" },
  { value: "youtube_shorts", label: "YouTube Shorts (9:16)" },
  { value: "youtube_longform", label: "YouTube Longform (16:9)" },
  { value: "instagram_feed", label: "Instagram Feed (4:5)" },
  { value: "instagram_reels", label: "Instagram Reels (9:16)" },
];

const DURATIONS = [
  { value: 15, label: "15s" },
  { value: 30, label: "30s" },
  { value: 60, label: "60s" },
];

const SUGGESTION_TEMPLATES = [
  { icon: TrendingUp, label: "Trend", template: "Şu anda popüler olan [konu] hakkında bilgilendirici bir video yap" },
  { icon: GraduationCap, label: "Eğitici", template: "[Konu] hakkında temel bilgileri öğreten bir eğitim videosu" },
  { icon: BookOpen, label: "Hikaye", template: "[Konu] ile ilgili ilgi çekici bir hikaye anlat" },
];

export function ScriptWizard({ onNext, onCancel }: ScriptWizardProps) {
  const [prompt, setPrompt] = useState("");
  const [niche, setNiche] = useState("");
  const [duration, setDuration] = useState(15);
  const [tone, setTone] = useState("educational");
  const [platform, setPlatform] = useState("tiktok");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const promptLength = prompt.length;
  const maxPromptLength = 1000;

  const handleGenerate = useCallback(async () => {
    if (promptLength < 10) {
      setError("Prompt en az 10 karakter olmalıdır");
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          niche: niche || undefined,
          duration,
          tone,
          platform,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || "Script oluşturulurken bir hata oluştu");
      }

      setGeneratedScript(result.data);
      setEditedContent(result.data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, niche, duration, tone, platform, promptLength]);

  const handleSaveEdit = useCallback(async () => {
    if (!generatedScript) return;

    try {
      const response = await fetch(`/api/scripts/${generatedScript.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedContent }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || "Script güncellenirken bir hata oluştu");
      }

      setGeneratedScript(result.data);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    }
  }, [generatedScript, editedContent]);

  const handleApplyTemplate = useCallback((template: string) => {
    setPrompt(template);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="font-[var(--font-display)] text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em] mb-2">
          Script Oluşturma
        </h1>
        <p className="text-[var(--text-muted)] text-base">
          Video konseptinizi tanımlayın, yapay zeka etkileyici bir script yazsın.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-2 text-red-400">
          <X className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Prompt Input */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
        <label className="flex flex-col w-full mb-4">
          <span className="text-[var(--text-main)] text-sm font-bold mb-2">
            Video Fikri
          </span>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Örn: Sürdürülebilir bir kahve markası için dinamik 30 saniyelik tanıtım, çevre dostu ambalajı ve zengin lezzet profilini öne çıkarıyor..."
            className="w-full resize-y rounded-lg text-[var(--text-main)] bg-[var(--background)] border-[var(--border)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] min-h-[160px] p-4 text-base placeholder:text-[var(--text-muted)]/60"
            maxLength={maxPromptLength}
          />
          <div className="flex justify-end mt-2">
            <span className={cn(
              "text-xs font-medium",
              promptLength > maxPromptLength * 0.9 ? "text-amber-400" : "text-[var(--text-muted)]"
            )}>
              {promptLength} / {maxPromptLength}
            </span>
          </div>
        </label>

        {/* Suggestion Templates */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {SUGGESTION_TEMPLATES.map((template) => (
              <button
                key={template.label}
                onClick={() => handleApplyTemplate(template.template)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors text-sm font-medium border",
                  prompt.includes(template.template.split("[")[0])
                    ? "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20"
                    : "bg-[var(--background)] text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/50 border-[var(--border)]"
                )}
              >
                <template.icon className="w-4 h-4" />
                {template.label}
              </button>
            ))}
          </div>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || promptLength < 10}
            className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Oluşturuluyor...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Script Oluştur
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Generated Script */}
      {generatedScript && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-sm relative">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-[var(--font-display)] font-bold text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-[var(--primary)]" />
              Oluşturulan Script
            </h4>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors flex items-center gap-1 text-sm font-medium"
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4" />
                  İptal
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  Düzenle
                </>
              )}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full resize-y rounded-lg text-[var(--text-main)] bg-[var(--background)] border-[var(--border)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] min-h-[200px] p-4 text-sm"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(generatedScript.content);
                  }}
                  className="border-[var(--border)]"
                >
                  İptal
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Kaydet
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--background)] rounded-lg p-5 border border-[var(--border)] text-[var(--text-main)] leading-relaxed h-[200px] overflow-y-auto font-[var(--font-body)] text-sm">
              <pre className="whitespace-pre-wrap font-[var(--font-body)]">
                {generatedScript.content}
              </pre>
            </div>
          )}

          <div className="flex items-center gap-4 mt-4 text-xs text-[var(--text-muted)]">
            <span>{generatedScript.wordCount} kelime</span>
            <span>•</span>
            <span>~{generatedScript.duration} saniye</span>
            <span>•</span>
            <span className="capitalize">{TONES.find(t => t.value === generatedScript.tone)?.label}</span>
          </div>
        </div>
      )}

      {/* Configuration Sidebar (shown inline on mobile, side by side on larger screens) */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
        <h4 className="font-[var(--font-display)] font-bold text-lg mb-4 border-b border-[var(--border)] pb-2">
          Yapılandırma
        </h4>
        <div className="flex flex-col gap-5">
          {/* Duration */}
          <div>
            <label className="text-sm font-bold text-[var(--text-main)] mb-2 block">
              Hedef Süre
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DURATIONS.map((d) => (
                <label key={d.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="duration"
                    value={d.value}
                    checked={duration === d.value}
                    onChange={() => setDuration(d.value)}
                    className="peer sr-only"
                  />
                  <div className={cn(
                    "text-center py-2 px-1 border rounded-lg text-sm font-medium transition-colors",
                    duration === d.value
                      ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                      : "border-[var(--border)] bg-[var(--background)] text-[var(--text-muted)] hover:border-[var(--primary)]/50"
                  )}>
                    {d.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Niche */}
          <div>
            <label className="text-sm font-bold text-[var(--text-main)] mb-2 block">
              Niche / Alan
            </label>
            <Select value={niche} onValueChange={setNiche}>
              <SelectTrigger className="w-full rounded-lg bg-[var(--background)] border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--primary)]">
                <SelectValue placeholder="Bir niche seçin (isteğe bağlı)" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--surface)] border-[var(--border)]">
                {NICHES.map((n) => (
                  <SelectItem 
                    key={n.value} 
                    value={n.value}
                    className="focus:bg-[var(--primary)]/10 focus:text-[var(--text-main)]"
                  >
                    {n.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tone */}
          <div>
            <label className="text-sm font-bold text-[var(--text-main)] mb-2 block">
              Script Tonu
            </label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="w-full rounded-lg bg-[var(--background)] border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--primary)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[var(--surface)] border-[var(--border)]">
                {TONES.map((t) => (
                  <SelectItem 
                    key={t.value} 
                    value={t.value}
                    className="focus:bg-[var(--primary)]/10 focus:text-[var(--text-main)]"
                  >
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Platform */}
          <div>
            <label className="text-sm font-bold text-[var(--text-main)] mb-2 block">
              Hedef Platform
            </label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-full rounded-lg bg-[var(--background)] border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--primary)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[var(--surface)] border-[var(--border)]">
                {PLATFORMS.map((p) => (
                  <SelectItem 
                    key={p.value} 
                    value={p.value}
                    className="focus:bg-[var(--primary)]/10 focus:text-[var(--text-main)]"
                  >
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-4 pt-6 border-t border-[var(--border)] flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="text-[var(--text-muted)] hover:text-[var(--text-main)]"
        >
          İptal
        </Button>
        <Button
          onClick={onNext}
          disabled={!generatedScript}
          className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
        >
          Sonraki: Görseller
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
