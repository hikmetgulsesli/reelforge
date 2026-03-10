"use client";
export const dynamic = "force-dynamic";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Header } from "../../components/layout/Header";
import { useAppStore, VideoProject } from "../../lib/store";
import { Video, PlayCircle, Trash2, MoreVertical, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Sample data initialized outside component to avoid impure function calls during render
const SAMPLE_VIDEOS: VideoProject[] = [
  {
    id: "sample-1",
    title: "Neon Nights Promo",
    script: "Sample script",
    style: "cyberpunk",
    status: "completed",
    createdAt: new Date("2026-03-09"),
    updatedAt: new Date("2026-03-09"),
    duration: 45,
    voiceId: null,
    voiceName: null,
    subtitlesEnabled: true,
    subtitleStyle: "modern",
    musicId: null,
    musicName: null,
  },
  {
    id: "sample-2",
    title: "Tech Startup Intro",
    script: "Sample script",
    style: "tech",
    status: "completed",
    createdAt: new Date("2026-03-08"),
    updatedAt: new Date("2026-03-08"),
    duration: 30,
    voiceId: null,
    voiceName: null,
    subtitlesEnabled: true,
    subtitleStyle: "modern",
    musicId: null,
    musicName: null,
  },
  {
    id: "sample-3",
    title: "Product Demo",
    script: "Sample script",
    style: "minimal",
    status: "rendering",
    createdAt: new Date("2026-03-07"),
    updatedAt: new Date("2026-03-07"),
    duration: 60,
    voiceId: null,
    voiceName: null,
    subtitlesEnabled: true,
    subtitleStyle: "modern",
    musicId: null,
    musicName: null,
  },
];

export default function LibraryPage() {
  const { videos, deleteVideo } = useAppStore();
  const [filter, setFilter] = useState<"all" | "completed" | "rendering" | "draft">("all");

  // Use sample videos if none exist
  const displayVideos = videos.length > 0 ? videos : SAMPLE_VIDEOS;

  const filteredVideos = displayVideos.filter((v) => {
    if (filter === "all") return true;
    return v.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "rendering":
        return "bg-yellow-500/20 text-yellow-400";
      case "failed":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Tamamlandı";
      case "rendering":
        return "İşleniyor";
      case "failed":
        return "Başarısız";
      default:
        return "Taslak";
    }
  };

  return (
    <DashboardLayout>
      <Header title="Video Kütüphanesi" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {["all", "completed", "rendering", "draft"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as typeof filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--surface)] text-[var(--text-muted)] hover:text-white"
                }`}
              >
                {f === "all" ? "Tümü" : f === "completed" ? "Tamamlanan" : f === "rendering" ? "İşlenen" : "Taslaklar"}
              </button>
            ))}
          </div>
          <Link
            href="/create"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Yeni Video
          </Link>
        </div>

        {/* Video Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="group bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden hover:border-[var(--color-primary)]/50 transition-all"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-[var(--color-primary)]/20 to-purple-600/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white/50 group-hover:text-white/80 transition-colors" />
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/60 text-white text-xs">
                    {video.duration ? `${Math.floor(video.duration / 60)}:${String(video.duration % 60).padStart(2, "0")}` : "0:45"}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-medium truncate">{video.title}</h3>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {new Date(video.createdAt).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                    <button className="text-[var(--text-muted)] hover:text-white">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(video.status)}`}>
                      {getStatusText(video.status)}
                    </span>
                    <button
                      onClick={() => deleteVideo(video.id)}
                      className="text-[var(--text-muted)] hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <Video className="w-16 h-16 text-[var(--text-muted)] mb-4" />
            <p className="text-[var(--text-muted)]">Henüz video yok</p>
            <Link
              href="/create"
              className="mt-4 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              İlk Videonuzu Oluşturun
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}