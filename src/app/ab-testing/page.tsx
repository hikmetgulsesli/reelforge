"use client";
export const dynamic = "force-dynamic";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Header } from "../../components/layout/Header";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

interface ABTest {
  id: string;
  name: string;
  variantA: { name: string; views: number; engagement: number };
  variantB: { name: string; views: number; engagement: number };
  status: "running" | "completed" | "draft";
  winner: "A" | "B" | null;
  createdAt: Date;
}

// Sample data initialized outside component to avoid impure function calls during render
const INITIAL_TESTS: ABTest[] = [
  {
    id: "1",
    name: "Açılış Hook Testi",
    variantA: { name: "Soru ile başla", views: 1250, engagement: 4.2 },
    variantB: { name: "İstatistik ile başla", views: 1180, engagement: 3.8 },
    status: "running",
    winner: null,
    createdAt: new Date("2026-03-09"),
  },
  {
    id: "2",
    name: "CTA Buton Rengi",
    variantA: { name: "Kırmızı CTA", views: 2500, engagement: 5.1 },
    variantB: { name: "Yeşil CTA", views: 2480, engagement: 4.7 },
    status: "completed",
    winner: "A",
    createdAt: new Date("2026-03-06"),
  },
];

export default function ABTestingPage() {
  const [tests, setTests] = useState<ABTest[]>(INITIAL_TESTS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTestName, setNewTestName] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-yellow-500/20 text-yellow-400";
      case "completed":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "running":
        return "Devam Ediyor";
      case "completed":
        return "Tamamlandı";
      default:
        return "Taslak";
    }
  };

  return (
    <DashboardLayout>
      <Header title="A/B Testleri" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[var(--text-muted)]">
              Video varyasyonlarınızı test edin ve en iyi performansı bulun
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Yeni Test
          </button>
        </div>

        {/* Tests List */}
        <div className="space-y-4">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-white">{test.name}</h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    {new Date(test.createdAt).toLocaleDateString("tr-TR")}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(test.status)}`}>
                  {getStatusText(test.status)}
                </span>
              </div>

              {/* Variants */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Variant A */}
                <div
                  className={`p-4 rounded-xl border-2 ${
                    test.winner === "A"
                      ? "border-green-500 bg-green-500/10"
                      : "border-[var(--border)] bg-[var(--background)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-medium">Varyant A</span>
                    {test.winner === "A" && (
                      <span className="text-xs text-green-400">🏆 Kazanan</span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--text-muted)] mb-3">{test.variantA.name}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[var(--text-muted)]">Görüntülenme</p>
                      <p className="text-white font-medium">{test.variantA.views.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-muted)]">Etkileşim</p>
                      <p className="text-white font-medium">{test.variantA.engagement}%</p>
                    </div>
                  </div>
                </div>

                {/* Variant B */}
                <div
                  className={`p-4 rounded-xl border-2 ${
                    test.winner === "B"
                      ? "border-green-500 bg-green-500/10"
                      : "border-[var(--border)] bg-[var(--background)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-medium">Varyant B</span>
                    {test.winner === "B" && (
                      <span className="text-xs text-green-400">🏆 Kazanan</span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--text-muted)] mb-3">{test.variantB.name}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[var(--text-muted)]">Görüntülenme</p>
                      <p className="text-white font-medium">{test.variantB.views.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-muted)]">Etkileşim</p>
                      <p className="text-white font-medium">{test.variantB.engagement}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {test.status === "running" && (
                <div className="mt-4 flex items-center justify-end gap-2">
                  <button className="px-4 py-2 rounded-lg border border-[var(--border)] text-white hover:bg-[var(--color-surface-hover)] transition-colors text-sm">
                    Durdur
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors text-sm">
                    Sonuçları İncele
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-4">Yeni A/B Testi Oluştur</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white mb-1">Test Adı</label>
                  <input
                    type="text"
                    value={newTestName}
                    onChange={(e) => setNewTestName(e.target.value)}
                    placeholder="Örn: Başlık Testi"
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
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
                  onClick={() => {
                    if (newTestName) {
                      setTests([
                        ...tests,
                        {
                          id: `test-${Date.now()}`,
                          name: newTestName,
                          variantA: { name: "Varyant A", views: 0, engagement: 0 },
                          variantB: { name: "Varyant B", views: 0, engagement: 0 },
                          status: "draft",
                          winner: null,
                          createdAt: new Date(),
                        },
                      ]);
                      setShowCreateModal(false);
                      setNewTestName("");
                    }
                  }}
                  disabled={!newTestName}
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