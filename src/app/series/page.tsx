"use client";
export const dynamic = "force-dynamic";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Header } from "../../components/layout/Header";
import { useAppStore, Series } from "../../lib/store";
import { FolderOpen, PlusCircle, Video, MoreVertical } from "lucide-react";
import { useState } from "react";

// Sample data initialized outside component to avoid impure function calls during render
const SAMPLE_SERIES: Series[] = [
  {
    id: "series-1",
    name: "Teknoloji İpuçları",
    description: "Günlük teknoloji ipuçları serisi",
    niche: "Teknoloji",
    videos: [],
    createdAt: new Date("2026-03-09"),
  },
  {
    id: "series-2",
    name: "Motivasyon Videoları",
    description: "Günlük motivasyon içerikleri",
    niche: "Kişisel Gelişim",
    videos: [],
    createdAt: new Date("2026-03-04"),
  },
];

export default function SeriesPage() {
  const { series, setSeries } = useAppStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSeriesName, setNewSeriesName] = useState("");
  const [newSeriesNiche, setNewSeriesNiche] = useState("");

  // Use sample series if none exist
  const displaySeries: Series[] = series.length > 0 ? series : SAMPLE_SERIES;

  const handleCreateSeries = () => {
    if (newSeriesName && newSeriesNiche) {
      const newSeries: Series = {
        id: `series-${Date.now()}`,
        name: newSeriesName,
        description: "",
        niche: newSeriesNiche,
        videos: [],
        createdAt: new Date(),
      };
      setSeries([...displaySeries, newSeries]);
      setShowCreateModal(false);
      setNewSeriesName("");
      setNewSeriesNiche("");
    }
  };

  return (
    <DashboardLayout>
      <Header title="Seri Modu" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[var(--text-muted)]">
              Seri modu ile otomatik video üretimi yapın
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Yeni Seri
          </button>
        </div>

        {/* Series Grid */}
        {displaySeries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displaySeries.map((s) => (
              <div
                key={s.id}
                className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6 hover:border-[var(--color-primary)]/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-white" />
                  </div>
                  <button className="text-[var(--text-muted)] hover:text-white">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="text-white font-medium text-lg mb-1">{s.name}</h3>
                <p className="text-sm text-[var(--text-muted)] mb-4">{s.description}</p>
                <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    {s.videos.length} video
                  </span>
                  <span className="px-2 py-1 rounded bg-[var(--color-surface-hover)] text-xs">
                    {s.niche}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <FolderOpen className="w-16 h-16 text-[var(--text-muted)] mb-4" />
            <p className="text-[var(--text-muted)]">Henüz seri yok</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              İlk Serinizi Oluşturun
            </button>
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-4">Yeni Seri Oluştur</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white mb-1">Seri Adı</label>
                  <input
                    type="text"
                    value={newSeriesName}
                    onChange={(e) => setNewSeriesName(e.target.value)}
                    placeholder="Örn: Günlük Teknoloji İpuçları"
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white mb-1">Niş</label>
                  <select
                    value={newSeriesNiche}
                    onChange={(e) => setNewSeriesNiche(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    <option value="">Seçin</option>
                    <option value="Teknoloji">Teknoloji</option>
                    <option value="Kişisel Gelişim">Kişisel Gelişim</option>
                    <option value="Finans">Finans</option>
                    <option value="Sağlık">Sağlık</option>
                    <option value="Eğlence">Eğlence</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-[var(--border)] text-white hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleCreateSeries}
                  disabled={!newSeriesName || !newSeriesNiche}
                  className="flex-1 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
                >
                  Oluştur
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}