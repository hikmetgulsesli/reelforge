"use client";

import { Cpu } from "lucide-react";

interface ActiveJob {
  id: string;
  videoId: string;
  videoTitle: string;
  progress: number;
  stage: string | null;
  startedAt: string | null;
}

interface ActiveJobProgressProps {
  job: ActiveJob | null;
  loading?: boolean;
}

const stageLabels: Record<string, string> = {
  script_generation: "Senaryo Oluşturma",
  image_generation: "Görsel Oluşturma",
  voice_synthesis: "Ses Sentezi",
  subtitle_generation: "Altyazı Oluşturma",
  video_assembly: "Video Birleştirme",
  quality_check: "Kalite Kontrolü",
  s3_upload: "Yükleme",
};

export function ActiveJobProgress({ job, loading }: ActiveJobProgressProps) {
  if (loading) {
    return (
      <div className="bg-[var(--color-surface-dark)] rounded-2xl border border-[var(--color-surface-hover)] p-6 animate-pulse">
        <div className="flex items-center gap-4 mb-4">
          <div className="size-10 rounded-lg bg-[var(--color-surface-hover)]" />
          <div className="flex-1">
            <div className="h-4 w-32 bg-[var(--color-surface-hover)] rounded mb-2" />
            <div className="h-3 w-24 bg-[var(--color-surface-hover)] rounded" />
          </div>
        </div>
        <div className="h-3 bg-[var(--color-surface-hover)] rounded-full" />
      </div>
    );
  }

  if (!job) {
    return null;
  }

  const currentStage = job.stage ? stageLabels[job.stage] || job.stage : "İşleniyor";

  return (
    <div className="bg-[var(--color-surface-dark)] rounded-2xl border border-[var(--color-primary)]/30 p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="size-10 rounded-lg bg-[var(--color-primary)]/20 flex items-center justify-center">
          <Cpu className="w-5 h-5 text-[var(--color-primary)] animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white text-sm font-medium truncate">
            {job.videoTitle}
          </h4>
          <p className="text-[var(--color-primary)] text-xs mt-1">
            {currentStage} — %{job.progress}
          </p>
        </div>
      </div>
      
      <div className="relative">
        <div className="h-2 bg-[var(--color-surface-hover)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full transition-all duration-300"
            style={{ width: `${job.progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[var(--color-text-muted)] text-xs">
            {currentStage}
          </span>
          <span className="text-[var(--color-text-muted)] text-xs">
            %{job.progress}
          </span>
        </div>
      </div>
    </div>
  );
}