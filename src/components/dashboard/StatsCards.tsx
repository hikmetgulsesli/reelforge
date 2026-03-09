"use client";

import { Film, CreditCard, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  credits: {
    remaining: number;
    plan: string;
  };
  stats: {
    videosThisMonth: number;
    totalVideos: number;
  };
}

export function StatsCards({ credits, stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Kalan Kredi",
      value: credits.remaining,
      icon: CreditCard,
      color: "text-[var(--color-primary)]",
      bgColor: "bg-[var(--color-primary)]/10",
      subtitle: credits.plan === "free" ? "Ücretsiz Plan" : `${credits.plan.charAt(0).toUpperCase() + credits.plan.slice(1)} Plan`,
    },
    {
      title: "Bu Ayki Videolar",
      value: stats.videosThisMonth,
      icon: TrendingUp,
      color: "text-[var(--color-secondary)]",
      bgColor: "bg-[var(--color-secondary)]/10",
      subtitle: "Bu ay oluşturulan",
    },
    {
      title: "Toplam Video",
      value: stats.totalVideos,
      icon: Film,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      subtitle: "Tüm zamanlar",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-[var(--color-surface-dark)] rounded-xl p-6 border border-[var(--color-border-dark)] hover:border-[var(--color-primary)]/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <span className="text-xs text-[var(--color-text-muted-dark)]">
                {card.subtitle}
              </span>
            </div>
            <h3 className="text-sm font-medium text-[var(--color-text-muted-dark)] mb-1">
              {card.title}
            </h3>
            <p className={`text-3xl font-bold ${card.color} font-[family-name:var(--font-display)]`}>
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}