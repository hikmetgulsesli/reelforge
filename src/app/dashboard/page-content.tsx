"use client";
export const dynamic = "force-dynamic";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Header } from "../../components/layout/Header";
import { useAppStore } from "../../lib/store";
import {
  PlusCircle,
  Video,
  Cpu,
  Palette,
  Clock,
  PlayCircle,
  CheckCircle,
  XCircle,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { credits, videos, plan } = useAppStore();

  // Calculate stats
  const totalVideos = videos.length;
  const renderCount = videos.filter((v) => v.status === "rendering").length;

  // Recent activity mock data
  const recentActivity = [
    {
      id: "1",
      title: "Neon Nights Promo",
      status: "completed",
      style: "Cyberpunk",
      duration: "0:45",
      date: "2 saat önce",
    },
    {
      id: "2",
      title: "Tech Startup Intro",
      status: "rendering",
      style: "Minimal",
      duration: "0:30",
      date: "5 saat önce",
    },
    {
      id: "3",
      title: "Product Demo",
      status: "completed",
      style: "3D Abstract",
      duration: "0:60",
      date: "1 gün önce",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rendering":
        return <Cpu className="w-4 h-4 text-yellow-500 animate-pulse" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-[var(--text-muted)]" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Tamamlandı";
      case "rendering":
        return "İşleniyor...";
      case "failed":
        return "Başarısız";
      default:
        return "Taslak";
    }
  };

  // Calculate credit percentage (based on plan limits)
  const planLimits = { free: 3, starter: 30, pro: 80, business: 200 };
  const creditLimit = planLimits[plan];
  const creditPercentage = Math.round(((creditLimit - credits) / creditLimit) * 100);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (creditPercentage / 100) * circumference;

  return (
    <DashboardLayout>
      <Header title="Ana Kontrol Paneli" />
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Top Section: Credits & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Credit Balance Widget */}
          <div className="col-span-1 bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Sparkles className="w-10 h-10 text-[var(--text-muted)]/50" />
            </div>
            <h3 className="text-[var(--text-muted)] text-sm font-medium mb-4 self-start">
              Kredi Bakiyesi
            </h3>
            <div className="relative flex items-center justify-center w-32 h-32 mb-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-[var(--color-surface-hover)]"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                />
                <circle
                  className="text-[var(--color-primary)]"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="currentColor"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white font-[family-name:var(--font-display)]">
                  {credits}
                </span>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              Bu ay %{creditPercentage} kullanıldı
            </p>
          </div>

          {/* Quick Actions */}
          <div className="col-span-1 lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/create"
              className="flex flex-col items-center justify-center gap-3 bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/20 rounded-2xl p-6 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlusCircle className="w-6 h-6" />
              </div>
              <span className="text-white text-sm font-medium">Yeni Video</span>
            </Link>

            <Link
              href="/library"
              className="flex flex-col items-center justify-center gap-3 bg-[var(--surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--border)] rounded-2xl p-6 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-[var(--color-surface-hover)] text-[var(--secondary)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <span className="text-white text-sm font-medium">Kütüphaneye Göz At</span>
            </Link>

            <Link
              href="/analytics"
              className="flex flex-col items-center justify-center gap-3 bg-[var(--surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--border)] rounded-2xl p-6 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-[var(--color-surface-hover)] text-[var(--text-muted)] flex items-center justify-center group-hover:text-white group-hover:scale-110 transition-all">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-[var(--text-muted)] group-hover:text-white text-sm font-medium transition-colors">
                Analizleri Görüntüle
              </span>
            </Link>

            <Link
              href="/pricing"
              className="flex flex-col items-center justify-center gap-3 bg-[var(--surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--border)] rounded-2xl p-6 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-[var(--color-surface-hover)] text-[var(--text-muted)] flex items-center justify-center group-hover:text-white group-hover:scale-110 transition-all">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-[var(--text-muted)] group-hover:text-white text-sm font-medium transition-colors">
                Kredi Satın Al
              </span>
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[var(--surface)] rounded-xl p-5 border border-[var(--border)] flex items-center justify-between">
            <div>
              <p className="text-[var(--text-muted)] text-sm mb-1">Toplam Video</p>
              <h4 className="text-white text-2xl font-bold font-[family-name:var(--font-display)]">
                {totalVideos || 128}
              </h4>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[var(--surface)] rounded-xl p-5 border border-[var(--border)] flex items-center justify-between">
            <div>
              <p className="text-[var(--text-muted)] text-sm mb-1">Bu Haftaki Renderlar</p>
              <h4 className="text-white text-2xl font-bold font-[family-name:var(--font-display)]">
                {renderCount || 14}
              </h4>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[var(--secondary)]/10 text-[var(--secondary)] flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[var(--surface)] rounded-xl p-5 border border-[var(--border)] flex items-center justify-between">
            <div>
              <p className="text-[var(--text-muted)] text-sm mb-1">Favori Stil</p>
              <h4 className="text-white text-lg font-bold font-[family-name:var(--font-display)]">
                Cyberpunk 2077
              </h4>
            </div>
            <div className="w-10 h-10 rounded-lg bg-fuchsia-500/10 text-fuchsia-400 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-white text-lg font-bold font-[family-name:var(--font-display)] mb-4">
            Son Aktiviteler
          </h3>
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden">
            <div className="divide-y divide-[var(--border)]">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 flex items-center gap-4 hover:bg-[var(--color-surface-hover)]/50 transition-colors cursor-pointer"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--secondary)]/20">
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <PlayCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">
                      {activity.title}
                    </h4>
                    <p className="text-[var(--text-muted)] text-xs flex items-center gap-2 mt-1">
                      <span>{activity.style}</span>
                      <span>•</span>
                      <span>{activity.duration}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(activity.status)}
                      <span className="text-xs text-[var(--text-muted)]">
                        {getStatusText(activity.status)}
                      </span>
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">
                      {activity.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-[var(--border)]">
              <Link
                href="/library"
                className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
              >
                Tüm videoları görüntüle →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}