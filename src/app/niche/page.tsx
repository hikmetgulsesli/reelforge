"use client";
export const dynamic = "force-dynamic";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Header } from "../../components/layout/Header";
import { TrendingUp, Hash, Lightbulb, ArrowUpRight } from "lucide-react";

interface NicheData {
  id: string;
  name: string;
  trend: "up" | "down" | "stable";
  growth: number;
  competition: "low" | "medium" | "high";
  avgViews: string;
  suggestions: string[];
}

export default function NichePage() {
  const niches: NicheData[] = [
    {
      id: "1",
      name: "AI ve Teknoloji",
      trend: "up",
      growth: 45,
      competition: "medium",
      avgViews: "125K",
      suggestions: ["AI araçları incelemeleri", "Teknoloji ipuçları", "Gelecek trendleri"],
    },
    {
      id: "2",
      name: "Kişisel Gelişim",
      trend: "up",
      growth: 32,
      competition: "high",
      avgViews: "85K",
      suggestions: ["Sabah rutinleri", "Verimlilik ipuçları", "Motivasyon"],
    },
    {
      id: "3",
      name: "Finans ve Yatırım",
      trend: "stable",
      growth: 12,
      competition: "medium",
      avgViews: "95K",
      suggestions: ["Tasarruf ipuçları", "Yatırım temelleri", "Kripto eğitimi"],
    },
    {
      id: "4",
      name: "Sağlık ve Fitness",
      trend: "up",
      growth: 28,
      competition: "high",
      avgViews: "110K",
      suggestions: ["Ev egzersizleri", "Beslenme önerileri", "Mental sağlık"],
    },
    {
      id: "5",
      name: "Oyun ve Eğlence",
      trend: "down",
      growth: -8,
      competition: "high",
      avgViews: "75K",
      suggestions: ["Oyun incelemeleri", "Easter egg videoları", "Speedrun"],
    },
  ];

  const trendingHashtags = [
    { tag: "#yapayzeka", views: "2.5M", growth: "+45%" },
    { tag: "#teknoloji", views: "1.8M", growth: "+23%" },
    { tag: "#motivasyon", views: "1.2M", growth: "+18%" },
    { tag: "#finans", views: "980K", growth: "+15%" },
    { tag: "#fitness", views: "850K", growth: "+12%" },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case "down":
        return <TrendingUp className="w-5 h-5 text-red-400 rotate-180" />;
      default:
        return <ArrowUpRight className="w-5 h-5 text-yellow-400 rotate-45" />;
    }
  };

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case "low":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "high":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <DashboardLayout>
      <Header title="Niş Analizi" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Trending Hashtags */}
        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Hash className="w-5 h-5 text-[var(--color-primary)]" />
            Trend Hashtag&apos;ler
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {trendingHashtags.map((item, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] hover:border-[var(--color-primary)]/50 transition-colors"
              >
                <p className="text-white font-medium">{item.tag}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-[var(--text-muted)]">{item.views}</span>
                  <span className="text-xs text-green-400">{item.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Niche Analysis */}
        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6">
          <h3 className="text-lg font-bold text-white mb-4">Niş Performans Analizi</h3>
          <div className="space-y-4">
            {niches.map((niche) => (
              <div
                key={niche.id}
                className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getTrendIcon(niche.trend)}
                    <div>
                      <h4 className="text-white font-medium">{niche.name}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className="text-[var(--text-muted)]">
                          Ort. Görüntülenme: <span className="text-white">{niche.avgViews}</span>
                        </span>
                        <span className="text-[var(--text-muted)]">
                          Rekabet:{" "}
                          <span className={getCompetitionColor(niche.competition)}>
                            {niche.competition === "low" ? "Düşük" : niche.competition === "medium" ? "Orta" : "Yüksek"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      niche.growth > 0 ? "text-green-400" : niche.growth < 0 ? "text-red-400" : "text-yellow-400"
                    }`}
                  >
                    {niche.growth > 0 ? "+" : ""}
                    {niche.growth}%
                  </span>
                </div>

                {/* Suggestions */}
                <div className="mt-3">
                  <p className="text-xs text-[var(--text-muted)] mb-2">İçerik Önerileri:</p>
                  <div className="flex flex-wrap gap-2">
                    {niche.suggestions.map((suggestion, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs"
                      >
                        {suggestion}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-br from-[var(--color-primary)]/20 to-purple-600/20 rounded-xl border border-[var(--color-primary)]/30 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/30 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">AI Önerisi</h3>
              <p className="text-[var(--text-muted)]">
                Analizlerimize göre, <span className="text-white font-medium">AI ve Teknoloji</span> nişi şu anda en yüksek
                büyüme oranına sahip ve rekabet düzeyi orta. Bu nişte içerik üretmek, hızla büyüme potansiyeli sunuyor.
              </p>
              <button className="mt-4 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors">
                Bu Nişte Video Oluştur
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}