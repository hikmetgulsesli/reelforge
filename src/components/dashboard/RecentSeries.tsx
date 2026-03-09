"use client";

import Link from "next/link";
import { FolderOpen, ChevronRight, Video } from "lucide-react";

interface Series {
  id: string;
  name: string;
  description: string | null;
  videoCount: number;
  createdAt: string;
}

interface RecentSeriesProps {
  series: Series[];
  loading?: boolean;
}

export function RecentSeries({ series, loading }: RecentSeriesProps) {
  if (loading) {
    return (
      <div>
        <h3 className="text-white text-lg font-display font-bold mb-4">Son Seriler</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[var(--color-surface-dark)] rounded-xl p-4 border border-[var(--color-surface-hover)] animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-lg bg-[var(--color-surface-hover)]" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-[var(--color-surface-hover)] rounded mb-2" />
                  <div className="h-3 w-24 bg-[var(--color-surface-hover)] rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (series.length === 0) {
    return (
      <div>
        <h3 className="text-white text-lg font-display font-bold mb-4">Son Seriler</h3>
        <div className="bg-[var(--color-surface-dark)] rounded-2xl border border-[var(--color-surface-hover)] p-8 text-center">
          <FolderOpen className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
          <p className="text-[var(--color-text-muted)] text-sm mb-4">
            Henüz seri oluşturmadınız
          </p>
          <Link
            href="/dashboard/series/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-lg text-sm font-medium transition-colors"
          >
            İlk Serinizi Oluşturun
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-display font-bold">Son Seriler</h3>
        <Link
          href="/dashboard/series"
          className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 font-medium transition-colors flex items-center gap-1"
        >
          Tümünü Gör
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-3">
        {series.map((item) => (
          <Link
            key={item.id}
            href={`/dashboard/series/${item.id}`}
            className="block bg-[var(--color-surface-dark)] rounded-xl p-4 border border-[var(--color-surface-hover)] hover:border-[var(--color-primary)]/50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-lg bg-[var(--color-surface-hover)] flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-[var(--color-secondary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white text-sm font-medium truncate group-hover:text-[var(--color-primary)] transition-colors">
                  {item.name}
                </h4>
                <p className="text-[var(--color-text-muted)] text-xs mt-1 flex items-center gap-2">
                  <Video className="w-3 h-3" />
                  {item.videoCount} video
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}