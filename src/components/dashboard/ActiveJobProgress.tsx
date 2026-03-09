"use client";

import { Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react";
import type { JobStatus } from "@/generated/prisma";

interface ActiveJob {
  id: string;
  videoId: string;
  status: JobStatus;
  progress: number;
  stage: string | null;
  createdAt: Date | string;
  video: {
    id: string;
    title: string;
    thumbnailUrl: string | null;
  };
}

interface ActiveJobProgressProps {
  jobs: ActiveJob[];
}

function getStageLabel(stage: string | null): string {
  if (!stage) return "İşleniyor...";
  
  const stages: Record<string, string> = {
    script: "Senaryo Oluşturuluyor",
    visuals: "Görseller Oluşturuluyor",
    voice: "Seslendirme Yapılıyor",
    subtitles: "Altyazı Ekleniyor",
    music: "Müzik Ekleniyor",
    render: "Video Render Ediliyor",
    finalizing: "Son Dokunuşlar",
  };
  
  return stages[stage] || stage;
}

export function ActiveJobProgress({ jobs }: ActiveJobProgressProps) {
  if (jobs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Loader2 className="w-5 h-5 text-[var(--color-primary)] animate-spin" />
        <h2 className="text-lg font-semibold text-[var(--color-text-main-dark)] font-[family-name:var(--font-display)]">
          Aktif İşlemler
        </h2>
        <span className="px-2 py-0.5 text-xs bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-full">
          {jobs.length} aktif
        </span>
      </div>
      <div className="space-y-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-[var(--color-surface-dark)] rounded-xl border border-[var(--color-border-dark)] p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-darker)] flex items-center justify-center">
                  {job.status === "processing" ? (
                    <Loader2 className="w-5 h-5 text-[var(--color-primary)] animate-spin" />
                  ) : job.status === "completed" ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : job.status === "failed" ? (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-[var(--color-text-main-dark)]">
                    {job.video.title}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted-dark)]">
                    {getStageLabel(job.stage)}
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium text-[var(--color-primary)]">
                {job.progress}%
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-2 bg-[var(--color-surface-darker)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transition-all duration-500 ease-out"
                style={{ width: `${job.progress}%` }}
              />
            </div>
            {/* Stage indicators */}
            <div className="flex justify-between mt-3 text-xs text-[var(--color-text-muted-dark)]">
              <span className={job.progress >= 0 ? "text-[var(--color-primary)]" : ""}>
                Senaryo
              </span>
              <span className={job.progress >= 20 ? "text-[var(--color-primary)]" : ""}>
                Görseller
              </span>
              <span className={job.progress >= 40 ? "text-[var(--color-primary)]" : ""}>
                Ses
              </span>
              <span className={job.progress >= 60 ? "text-[var(--color-primary)]" : ""}>
                Altyazı
              </span>
              <span className={job.progress >= 80 ? "text-[var(--color-primary)]" : ""}>
                Render
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}