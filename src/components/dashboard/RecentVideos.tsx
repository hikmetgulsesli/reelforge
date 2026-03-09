"use client";

import Link from "next/link";
import { Film, Clock, ExternalLink } from "lucide-react";
import type { VideoStatus } from "@/generated/prisma";

interface RecentVideo {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  status: VideoStatus;
  createdAt: Date | string;
  duration: number;
  platform: string;
}

interface RecentVideosProps {
  videos: RecentVideo[];
}

function getStatusBadge(status: VideoStatus) {
  const styles: Record<VideoStatus, { bg: string; text: string; label: string }> = {
    draft: { bg: "bg-gray-500/20", text: "text-gray-400", label: "Taslak" },
    processing: { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "İşleniyor" },
    completed: { bg: "bg-green-500/20", text: "text-green-400", label: "Tamamlandı" },
    failed: { bg: "bg-red-500/20", text: "text-red-400", label: "Başarısız" },
    published: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Yayınlandı" },
  };
  return styles[status];
}

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
  });
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function RecentVideos({ videos }: RecentVideosProps) {
  if (videos.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--color-text-main-dark)] font-[family-name:var(--font-display)]">
          Son Videolar
        </h2>
        <div className="bg-[var(--color-surface-dark)] rounded-xl border border-[var(--color-border-dark)] p-8 text-center">
          <Film className="w-12 h-12 text-[var(--color-text-muted-dark)] mx-auto mb-4" />
          <p className="text-[var(--color-text-muted-dark)] mb-4">
            Henüz video oluşturmadınız
          </p>
          <Link
            href="/wizard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            <Film className="w-4 h-4" />
            İlk Videonuzu Oluşturun
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--color-text-main-dark)] font-[family-name:var(--font-display)]">
          Son Videolar
        </h2>
        <Link
          href="/dashboard/videos"
          className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors flex items-center gap-1"
        >
          Tümünü Gör
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-thin">
        {videos.map((video) => {
          const status = getStatusBadge(video.status);
          return (
            <Link
              key={video.id}
              href={`/dashboard/videos/${video.id}`}
              className="flex-shrink-0 w-48 bg-[var(--color-surface-dark)] rounded-xl border border-[var(--color-border-dark)] overflow-hidden hover:border-[var(--color-primary)]/50 transition-colors group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[9/16] bg-[var(--color-surface-darker)]">
                {video.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film className="w-8 h-8 text-[var(--color-text-muted-dark)]" />
                  </div>
                )}
                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/70 rounded text-xs text-white">
                  <Clock className="w-3 h-3" />
                  {formatDuration(video.duration)}
                </div>
                {/* Status badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded text-xs ${status.bg} ${status.text}`}>
                    {status.label}
                  </span>
                </div>
              </div>
              {/* Info */}
              <div className="p-3">
                <p className="text-sm font-medium text-[var(--color-text-main-dark)] truncate group-hover:text-[var(--color-primary)] transition-colors">
                  {video.title}
                </p>
                <p className="text-xs text-[var(--color-text-muted-dark)]">
                  {formatDate(video.createdAt)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}