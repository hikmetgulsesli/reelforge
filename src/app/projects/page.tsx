"use client";

import { useState } from "react";
import { useAppStore, VideoProject } from "../../lib/store";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Header } from "../../components/layout/Header";
import { 
  Play, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Filter,
  Grid3X3,
  List,
  MoreVertical,
  Trash2,
  Edit,
  Eye
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "../../lib/utils";

type FilterTab = "all" | "rendering" | "completed" | "draft" | "failed";

const filterTabs: { value: FilterTab; label: string; count?: number }[] = [
  { value: "all", label: "Tümü" },
  { value: "rendering", label: "İşleniyor" },
  { value: "completed", label: "Tamamlandı" },
  { value: "draft", label: "Taslak" },
  { value: "failed", label: "Başarısız" },
];

const getStatusIcon = (status: VideoProject["status"]) => {
  switch (status) {
    case "rendering":
      return <Clock className="w-4 h-4 animate-pulse text-[var(--secondary)]" />;
    case "completed":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "failed":
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    case "draft":
      return <Edit className="w-4 h-4 text-[var(--text-muted)]" />;
    default:
      return null;
  }
};

const getStatusLabel = (status: VideoProject["status"]) => {
  switch (status) {
    case "rendering":
      return "İşleniyor";
    case "completed":
      return "Tamamlandı";
    case "failed":
      return "Başarısız";
    case "draft":
      return "Taslak";
    default:
      return status;
  }
};

const getStatusColor = (status: VideoProject["status"]) => {
  switch (status) {
    case "rendering":
      return "bg-[var(--secondary)]/10 text-[var(--secondary)] border-[var(--secondary)]/20";
    case "completed":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "failed":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "draft":
      return "bg-[var(--text-muted)]/10 text-[var(--text-muted)] border-[var(--text-muted)]/20";
    default:
      return "bg-[var(--surface)] text-[var(--text-main)]";
  }
};

export default function ProjectsPage() {
  const { videos, deleteVideo } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filteredVideos = videos.filter((video) => {
    if (activeFilter === "all") return true;
    return video.status === activeFilter;
  });

  const getProjectCount = (filter: FilterTab) => {
    if (filter === "all") return videos.length;
    return videos.filter((v) => v.status === filter).length;
  };

  const handleDelete = (id: string) => {
    deleteVideo(id);
    setOpenMenuId(null);
  };

  return (
    <DashboardLayout>
      <Header title="Projeler" />
      
      <div className="p-6 space-y-6">
        {/* Filter Tabs and View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-[var(--surface)] rounded-xl p-1 overflow-x-auto">
            <Filter className="w-4 h-4 text-[var(--text-muted)] ml-3 flex-shrink-0" />
            {filterTabs.map((tab) => {
              const count = getProjectCount(tab.value);
              return (
                <button
                  key={tab.value}
                  data-testid={`filter-tab-${tab.value}`}
                  onClick={() => setActiveFilter(tab.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeFilter === tab.value
                      ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)]"
                      : "text-[var(--text-muted)] hover:text-white hover:bg-[var(--color-surface-hover)]"
                  }`}
                >
                  {tab.label}
                  <span
                    data-testid={`project-count-${tab.value}`}
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      activeFilter === tab.value
                        ? "bg-[var(--color-primary)]/30 text-[var(--color-primary)]"
                        : "bg-[var(--color-surface-hover)] text-[var(--text-muted)]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-[var(--surface)] rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              data-testid="view-mode-grid"
              aria-label="Grid view"
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)]"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              data-testid="view-mode-list"
              aria-label="List view"
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)]"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Projects Grid/List */}
        {filteredVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center mb-4">
              <Play className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              Henüz proje yok
            </h3>
            <p className="text-[var(--text-muted)] mb-6 max-w-sm">
              İlk videonuzu oluşturmak için Video Oluştur sayfasına gidin.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-xl font-medium transition-colors"
            >
              <Play className="w-5 h-5" />
              Video Oluştur
            </Link>
          </div>
        ) : viewMode === "grid" ? (
          <div 
            data-testid="projects-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                data-testid={`project-card-${video.id}`}
                className="group bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden hover:border-[var(--color-primary)]/30 transition-all"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-[var(--color-surface-hover)] overflow-hidden">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-12 h-12 text-[var(--text-muted)]" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(video.status)}`}>
                      {getStatusIcon(video.status)}
                      {getStatusLabel(video.status)}
                    </span>
                  </div>

                  {/* Actions Menu */}
                  <div className="absolute top-3 right-3">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === video.id ? null : video.id)}
                        className="p-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {openMenuId === video.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 mt-1 w-40 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-lg z-20 py-1">
                            <Link
                              href={`/library/${video.id}`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--color-surface-hover)] transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              Görüntüle
                            </Link>
                            <button
                              onClick={() => handleDelete(video.id)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors w-full text-left"
                            >
                              <Trash2 className="w-4 h-4" />
                              Sil
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Play Overlay for completed videos */}
                  {video.status === "completed" && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-white font-medium truncate mb-1" title={video.title}>
                    {video.title || "İsimsiz Proje"}
                  </h3>
                  <p className="text-[var(--text-muted)] text-sm mb-3">
                    {video.style}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span>{formatDistanceToNow(video.createdAt)}</span>
                    {video.duration && (
                      <span>{Math.round(video.duration)}s</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div 
            data-testid="projects-list"
            className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden"
          >
            <div className="divide-y divide-[var(--border)]">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  data-testid={`project-list-item-${video.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-[var(--color-surface-hover)]/50 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="relative w-24 h-16 rounded-lg bg-[var(--color-surface-hover)] overflow-hidden flex-shrink-0">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-[var(--text-muted)]" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">
                      {video.title || "İsimsiz Proje"}
                    </h3>
                    <p className="text-[var(--text-muted)] text-sm">
                      {video.style} • {formatDistanceToNow(video.createdAt)}
                    </p>
                  </div>

                  {/* Status */}
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(video.status)}`}>
                    {getStatusIcon(video.status)}
                    {getStatusLabel(video.status)}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/library/${video.id}`}
                      className="p-2 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--color-surface-hover)] transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Summary */}
        {filteredVideos.length > 0 && (
          <div className="text-center text-sm text-[var(--text-muted)]">
            {filteredVideos.length} proje gösteriliyor
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
