"use client";

import { Film, Cpu, Palette } from "lucide-react";

interface StatsCardsProps {
  totalVideos: number;
  weeklyRenders: number;
  favoriteStyle: string | null;
  loading?: boolean;
}

export function StatsCards({ totalVideos, weeklyRenders, favoriteStyle, loading }: StatsCardsProps) {
  const stats = [
    {
      label: "Toplam Video",
      value: totalVideos,
      icon: Film,
      iconColor: "text-[var(--color-primary)]",
      iconBg: "bg-[var(--color-primary)]/10",
    },
    {
      label: "Bu Haftaki Renderlar",
      value: weeklyRenders,
      icon: Cpu,
      iconColor: "text-[var(--color-secondary)]",
      iconBg: "bg-[var(--color-secondary)]/10",
    },
    {
      label: "Favori Stil",
      value: favoriteStyle || "Henüz yok",
      isText: true,
      icon: Palette,
      iconColor: "text-fuchsia-400",
      iconBg: "bg-fuchsia-500/10",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-[var(--color-surface-dark)] rounded-xl p-5 border border-[var(--color-surface-hover)] animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="h-3 w-24 bg-[var(--color-surface-hover)] rounded mb-2" />
                <div className="h-7 w-16 bg-[var(--color-surface-hover)] rounded" />
              </div>
              <div className="size-10 rounded-lg bg-[var(--color-surface-hover)]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-[var(--color-surface-dark)] rounded-xl p-5 border border-[var(--color-surface-hover)] flex items-center justify-between"
          >
            <div>
              <p className="text-[var(--color-text-muted)] text-sm mb-1">
                {stat.label}
              </p>
              <h4 className={`text-white font-display font-bold ${stat.isText ? "text-lg" : "text-2xl"}`}>
                {stat.value}
              </h4>
            </div>
            <div className={`size-10 rounded-lg ${stat.iconBg} ${stat.iconColor} flex items-center justify-center`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}