"use client";

import Link from "next/link";
import { PlayCircle, ChevronRight } from "lucide-react";

interface Video {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  status: string;
  createdAt: string;
}

interface RecentVideosProps {
  videos: Video[];
  loading?: boolean;
}

export function RecentVideos({ videos, loading }: RecentVideosProps) {
  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-display font-bold">Son Videolar</h3>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-48 h-32 bg-[var(--color-surface-dark)] rounded-xl border border-[var(--color-surface-hover)] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div>
        <h3 className="text-white text-lg font-display font-bold mb-4">Son Videolar</h3>
        <div className="bg-[var(--color-surface-dark)] rounded-2xl border border-[var(--color-surface-hover)] p-8 text-center">
          <PlayCircle className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
          <p className="text-[var(--color-text-muted)] text-sm mb-4">
            Henüz video oluşturmadınız
          </p>
          <Link
            href="/dashboard/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-lg text-sm font-medium transition-colors"
          >
            İlk Videonuzu Oluşturun
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-display font-bold">Son Videolar</h3>
        <Link
          href="/dashboard/library"
          className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 font-medium transition-colors flex items-center gap-1"
        >
          Tümünü Gör
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
        {videos.map((video) => (
          <Link
            key={video.id}
            href={`/dashboard/videos/${video.id}`}
            className="flex-shrink-0 w-48 group"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--color-surface-dark)] border border-[var(--color-surface-hover)] group-hover:border-[var(--color-primary)]/50 transition-colors">
              {video.thumbnailUrl ? (
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[var(--color-surface-hover)]">
                  <PlayCircle className="w-8 h-8 text-[var(--color-text-muted)]" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle className="w-10 h-10 text-white" />
              </div>
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                  video.status === "completed"
                    ? "bg-green-500/20 text-green-400"
                    : video.status === "processing"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : video.status === "failed"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]"
                }`}>
                  {video.status === "completed"
                    ? "Tamamlandı"
                    : video.status === "processing"
                    ? "İşleniyor"
                    : video.status === "failed"
                    ? "Başarısız"
                    : "Taslak"}
                </span>
              </div>
            </div>
            <p className="text-white text-sm font-medium mt-2 truncate group-hover:text-[var(--color-primary)] transition-colors">
              {video.title}
            </p>
            <p className="text-[var(--color-text-muted)] text-xs mt-1">
              {new Date(video.createdAt).toLocaleDateString("tr-TR")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}