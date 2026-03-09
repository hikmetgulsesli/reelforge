import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";
import { DashboardLayout } from "@/components/dashboard/Sidebar";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-8">
        {/* Top Section: Credits & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Credit Balance Widget */}
          <div className="col-span-1 bg-[var(--color-surface-dark)] rounded-2xl p-6 border border-[var(--color-surface-hover)] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <svg
                className="w-10 h-10 text-[var(--color-text-muted)]/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-[var(--color-text-muted)] text-sm font-medium mb-4 self-start">
              Kredi Bakiyesi
            </h3>
            <div className="relative flex items-center justify-center size-32 mb-2">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
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
                  strokeDasharray="251.2"
                  strokeDashoffset="62.8"
                  strokeWidth="8"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white font-[family-name:var(--font-display)]">
                  450
                </span>
              </div>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-2">
              Bu ay %75 kullanıldı
            </p>
          </div>

          {/* Quick Actions */}
          <div className="col-span-1 lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/wizard"
              className="flex flex-col items-center justify-center gap-3 bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/20 rounded-2xl p-6 transition-all group"
            >
              <div className="size-12 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <span className="text-white text-sm font-medium">Yeni Video</span>
            </a>
            <a
              href="/dashboard/videos"
              className="flex flex-col items-center justify-center gap-3 bg-[var(--color-surface-dark)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-surface-hover)] rounded-2xl p-6 transition-all group"
            >
              <div className="size-12 rounded-full bg-[var(--color-surface-hover)] text-[var(--color-secondary)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-white text-sm font-medium">Kütüphaneye Göz At</span>
            </a>
            <a
              href="/dashboard/analytics"
              className="flex flex-col items-center justify-center gap-3 bg-[var(--color-surface-dark)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-surface-hover)] rounded-2xl p-6 transition-all group"
            >
              <div className="size-12 rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] flex items-center justify-center group-hover:text-white group-hover:scale-110 transition-all">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <span className="text-[var(--color-text-muted)] group-hover:text-white text-sm font-medium transition-colors">
                Analizleri Görüntüle
              </span>
            </a>
            <a
              href="/dashboard/settings/billing"
              className="flex flex-col items-center justify-center gap-3 bg-[var(--color-surface-dark)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-surface-hover)] rounded-2xl p-6 transition-all group"
            >
              <div className="size-12 rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] flex items-center justify-center group-hover:text-white group-hover:scale-110 transition-all">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <span className="text-[var(--color-text-muted)] group-hover:text-white text-sm font-medium transition-colors">
                Kredi Satın Al
              </span>
            </a>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[var(--color-surface-dark)] rounded-xl p-5 border border-[var(--color-surface-hover)] flex items-center justify-between">
            <div>
              <p className="text-[var(--color-text-muted)] text-sm mb-1">
                Toplam Video
              </p>
              <h4 className="text-white text-2xl font-bold font-[family-name:var(--font-display)]">
                128
              </h4>
            </div>
            <div className="size-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <div className="bg-[var(--color-surface-dark)] rounded-xl p-5 border border-[var(--color-surface-hover)] flex items-center justify-between">
            <div>
              <p className="text-[var(--color-text-muted)] text-sm mb-1">
                Bu Haftaki Renderlar
              </p>
              <h4 className="text-white text-2xl font-bold font-[family-name:var(--font-display)]">
                14
              </h4>
            </div>
            <div className="size-10 rounded-lg bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
            </div>
          </div>
          <div className="bg-[var(--color-surface-dark)] rounded-xl p-5 border border-[var(--color-surface-hover)] flex items-center justify-between">
            <div>
              <p className="text-[var(--color-text-muted)] text-sm mb-1">
                Favori Stil
              </p>
              <h4 className="text-white text-lg font-bold font-[family-name:var(--font-display)]">
                Cyberpunk 2077
              </h4>
            </div>
            <div className="size-10 rounded-lg bg-fuchsia-500/10 text-fuchsia-400 flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-white text-lg font-bold font-[family-name:var(--font-display)] mb-4">
            Son Aktiviteler
          </h3>
          <div className="bg-[var(--color-surface-dark)] rounded-2xl border border-[var(--color-surface-hover)] overflow-hidden">
            <div className="divide-y divide-[var(--color-surface-hover)]">
              {/* Activity Item 1 */}
              <div className="p-4 flex items-center gap-4 hover:bg-[var(--color-surface-hover)]/50 transition-colors">
                <div className="relative size-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500">
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-medium truncate">
                    Neon Nights Promo Video
                  </h4>
                  <p className="text-[var(--color-text-muted)] text-xs flex items-center gap-2 mt-1">
                    <span>Render tamamlandı</span>
                    <span>•</span>
                    <span>2 saat önce</span>
                  </p>
                </div>
                <span className="text-[var(--color-primary)] text-xs font-medium px-2 py-1 bg-[var(--color-primary)]/10 rounded-full">
                  Tamamlandı
                </span>
              </div>

              {/* Activity Item 2 */}
              <div className="p-4 flex items-center gap-4 hover:bg-[var(--color-surface-hover)]/50 transition-colors">
                <div className="relative size-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-cyan-500">
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-medium truncate">
                    Tech Review Serisi - Bölüm 5
                  </h4>
                  <p className="text-[var(--color-text-muted)] text-xs flex items-center gap-2 mt-1">
                    <span>Render ediliyor</span>
                    <span>•</span>
                    <span>5 saat önce</span>
                  </p>
                </div>
                <span className="text-[var(--color-secondary)] text-xs font-medium px-2 py-1 bg-[var(--color-secondary)]/10 rounded-full">
                  İşleniyor
                </span>
              </div>

              {/* Activity Item 3 */}
              <div className="p-4 flex items-center gap-4 hover:bg-[var(--color-surface-hover)]/50 transition-colors">
                <div className="relative size-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-orange-500 to-red-500">
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-medium truncate">
                    Daily Motivation Clips
                  </h4>
                  <p className="text-[var(--color-text-muted)] text-xs flex items-center gap-2 mt-1">
                    <span>Hata oluştu</span>
                    <span>•</span>
                    <span>1 gün önce</span>
                  </p>
                </div>
                <span className="text-red-400 text-xs font-medium px-2 py-1 bg-red-400/10 rounded-full">
                  Hata
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
