"use client";

import Link from "next/link";
import { Plus, Sparkles, Calendar, BarChart3 } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Yeni Video Oluştur",
      description: "AI ile profesyonel video",
      icon: Sparkles,
      href: "/wizard",
      primary: true,
    },
    {
      title: "Seri Yönetimi",
      description: "Video serilerinizi düzenleyin",
      icon: Plus,
      href: "/dashboard/series",
      primary: false,
    },
    {
      title: "İçerik Takvimi",
      description: "Planlama yapın",
      icon: Calendar,
      href: "/dashboard/calendar",
      primary: false,
    },
    {
      title: "Analitik",
      description: "Performans metrikleri",
      icon: BarChart3,
      href: "/dashboard/analytics",
      primary: false,
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[var(--color-text-main-dark)] font-[family-name:var(--font-display)]">
        Hızlı İşlemler
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className={`group flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                action.primary
                  ? "bg-[var(--color-primary)] border-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]"
                  : "bg-[var(--color-surface-dark)] border-[var(--color-border-dark)] hover:border-[var(--color-primary)]/50"
              }`}
            >
              <Icon
                className={`w-6 h-6 mb-2 ${
                  action.primary
                    ? "text-white"
                    : "text-[var(--color-text-muted-dark)] group-hover:text-[var(--color-primary)]"
                } transition-colors`}
              />
              <span
                className={`text-sm font-medium ${
                  action.primary
                    ? "text-white"
                    : "text-[var(--color-text-main-dark)]"
                }`}
              >
                {action.title}
              </span>
              <span
                className={`text-xs ${
                  action.primary
                    ? "text-white/70"
                    : "text-[var(--color-text-muted-dark)]"
                }`}
              >
                {action.description}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}