"use client";

import Link from "next/link";
import { Folder, ChevronRight, Video } from "lucide-react";

interface RecentSeriesItem {
  id: string;
  name: string;
  description: string | null;
  videoCount: number;
  isActive: boolean;
  createdAt: Date | string;
  niche: string | null;
}

interface RecentSeriesProps {
  series: RecentSeriesItem[];
}

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function RecentSeries({ series }: RecentSeriesProps) {
  if (series.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--color-text-main-dark)] font-[family-name:var(--font-display)]">
          Son Seriler
        </h2>
        <div className="bg-[var(--color-surface-dark)] rounded-xl border border-[var(--color-border-dark)] p-8 text-center">
          <Folder className="w-12 h-12 text-[var(--color-text-muted-dark)] mx-auto mb-4" />
          <p className="text-[var(--color-text-muted-dark)] mb-4">
            Henüz seri oluşturmadınız
          </p>
          <Link
            href="/dashboard/series/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            <Folder className="w-4 h-4" />
            Yeni Seri Oluşturun
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--color-text-main-dark)] font-[family-name:var(--font-display)]">
          Son Seriler
        </h2>
        <Link
          href="/dashboard/series"
          className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors flex items-center gap-1"
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
            className="flex items-center justify-between p-4 bg-[var(--color-surface-dark)] rounded-xl border border-[var(--color-border-dark)] hover:border-[var(--color-primary)]/50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[var(--color-surface-darker)]">
                <Folder className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div>
                <h3 className="font-medium text-[var(--color-text-main-dark)] group-hover:text-[var(--color-primary)] transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm text-[var(--color-text-muted-dark)]">
                  {item.description || item.niche || "Açıklama yok"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted-dark)]">
                <Video className="w-4 h-4" />
                <span>{item.videoCount} video</span>
              </div>
              {item.isActive && (
                <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                  Aktif
                </span>
              )}
              <span className="text-xs text-[var(--color-text-muted-dark)]">
                {formatDate(item.createdAt)}
              </span>
              <ChevronRight className="w-4 h-4 text-[var(--color-text-muted-dark)] group-hover:text-[var(--color-primary)] transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}