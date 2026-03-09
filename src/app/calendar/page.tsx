"use client";

import { useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  MoreVertical,
  CirclePlay,
  Clock,
  Filter,
} from "lucide-react";
import { clsx } from "clsx";
import {
  getMonthName,
  generateCalendarDays,
  getStatusColor,
  getPlatformIcon,
  type ClockdVideo,
  type CalendarDay,
} from "@/components/calendar/calendar-utils";

// Demo data
const demoVideos: ClockdVideo[] = [
  {
    id: "1",
    title: "Top 10 AI Tools Every Creator Needs",
    scheduledTime: "10:00",
    platform: "youtube",
    status: "ready",
  },
  {
    id: "2",
    title: "Weekly Update & Behind the Scenes",
    scheduledTime: "14:00",
    platform: "instagram",
    status: "planned",
  },
  {
    id: "3",
    title: "Tech Review: The New Setup",
    scheduledTime: "11:30",
    platform: "youtube",
    status: "processing",
  },
  {
    id: "4",
    title: "Coding Tutorial",
    scheduledTime: "09:00",
    platform: "tiktok",
    status: "ready",
  },
];

// Sidebar Component
function UpcomingSidebar({ videos }: { videos: ClockdVideo[] }) {
  const todayVideos = videos;

  return (
    <aside className="w-80 border-l border-[var(--border)] bg-[var(--surface-darker)] flex flex-col shrink-0">
      <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
        <h3 className="text-lg font-bold font-display text-white">Upcoming Posts</h3>
        <button
          className="text-[var(--text-muted)] hover:text-white transition-colors"
          aria-label="Filter posts"
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="text-sm font-bold text-white uppercase tracking-wider">
            Today, Oct 5
          </div>
          <div className="h-px bg-[var(--border)] flex-1"></div>
        </div>

        {todayVideos.slice(0, 2).map((video) => (
          <div
            key={video.id}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 flex gap-3 hover:border-[var(--primary)]/50 transition-colors group cursor-pointer"
          >
            <div className="w-16 h-20 bg-[var(--background)] rounded-lg overflow-hidden shrink-0 border border-[var(--border)] relative">
              <div
                className={clsx(
                  "absolute inset-0 bg-gradient-to-br",
                  video.platform === "youtube" && "from-red-900/40 to-[var(--surface-darker)]",
                  video.platform === "instagram" && "from-purple-900/40 to-[var(--surface-darker)]",
                  video.platform === "tiktok" && "from-gray-800 to-black"
                )}
              />
              <CirclePlay className="absolute inset-0 m-auto w-fit h-fit text-white/50 group-hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col flex-1 justify-center py-1">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="text-sm font-semibold text-white leading-tight line-clamp-2">
                  {video.title}
                </h4>
                <button className="text-[var(--text-muted)] hover:text-white shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-auto">
                <span className="flex items-center gap-1 text-xs text-[var(--text-muted)] bg-[var(--surface-darker)] px-1.5 py-0.5 rounded">
                  <Clock className="w-3.5 h-3.5" /> {video.scheduledTime}
                </span>
                <div
                  className={clsx(
                    "size-4 rounded-full shrink-0 flex items-center justify-center text-white text-[10px] font-bold",
                    video.platform === "youtube" && "bg-red-500",
                    video.platform === "instagram" && "bg-purple-500",
                    video.platform === "tiktok" && "bg-black ring-1 ring-white/20"
                  )}
                >
                  {getPlatformIcon(video.platform)}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-2 mt-2">
          <div className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Mon, Oct 9
          </div>
          <div className="h-px bg-[var(--border)] flex-1"></div>
        </div>

        {todayVideos.slice(2, 3).map((video) => (
          <div
            key={video.id}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 flex gap-3 hover:border-[var(--primary)]/50 transition-colors group cursor-pointer"
          >
            <div className="w-16 h-20 bg-[var(--background)] rounded-lg overflow-hidden shrink-0 border border-[var(--border)] relative">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black" />
              <CirclePlay className="absolute inset-0 m-auto w-fit h-fit text-white/50 group-hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col flex-1 justify-center py-1">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="text-sm font-semibold text-white leading-tight line-clamp-2">
                  {video.title}
                </h4>
                <button className="text-[var(--text-muted)] hover:text-white shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-auto">
                <span className="flex items-center gap-1 text-xs text-[var(--text-muted)] bg-[var(--surface-darker)] px-1.5 py-0.5 rounded">
                  <Clock className="w-3.5 h-3.5" /> {video.scheduledTime}
                </span>
                <div className="size-4 rounded-full bg-black ring-1 ring-white/20 shrink-0 flex items-center justify-center text-white text-[10px] font-bold">
                  {getPlatformIcon(video.platform)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

// Quick Add Modal
function QuickAddModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedVideo, setSelectedVideo] = useState("");
  const [platforms, setPlatforms] = useState({
    youtube: true,
    tiktok: false,
    instagram: false,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[var(--surface-darker)] border border-[var(--border)] rounded-2xl w-full max-w-md shadow-2xl shadow-[var(--primary)]/10 overflow-hidden">
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="text-lg font-bold font-display text-white">Quick Clock</h3>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-white"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 flex flex-col gap-5">
          <div>
            <label
              htmlFor="schedule-date"
              className="block text-sm font-medium text-[var(--text-muted)] mb-1.5"
            >
              Date &amp; Time
            </label>
            <div className="flex gap-3">
              <input
                id="schedule-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-white w-full text-sm focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
              />
              <input
                id="schedule-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-white w-full text-sm focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="video-select"
              className="block text-sm font-medium text-[var(--text-muted)] mb-1.5"
            >
              Select Video from Library
            </label>
            <div className="relative">
              <select
                id="video-select"
                value={selectedVideo}
                onChange={(e) => setSelectedVideo(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg pl-3 pr-10 py-2.5 text-white text-sm appearance-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
              >
                <option value="">Select a generated video...</option>
                <option value="1">10 Tips for Productivity (Ready)</option>
                <option value="2">My Desk Setup Tour (Processing)</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
              Platforms
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={platforms.youtube}
                  onChange={(e) =>
                    setPlatforms({ ...platforms, youtube: e.target.checked })
                  }
                  className="rounded border-[var(--border)] bg-[var(--surface)] text-[var(--primary)] focus:ring-[var(--primary)] focus:ring-offset-[var(--background)]"
                />
                <span className="text-sm text-white">YouTube</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={platforms.tiktok}
                  onChange={(e) =>
                    setPlatforms({ ...platforms, tiktok: e.target.checked })
                  }
                  className="rounded border-[var(--border)] bg-[var(--surface)] text-[var(--primary)] focus:ring-[var(--primary)] focus:ring-offset-[var(--background)]"
                />
                <span className="text-sm text-white">TikTok</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={platforms.instagram}
                  onChange={(e) =>
                    setPlatforms({ ...platforms, instagram: e.target.checked })
                  }
                  className="rounded border-[var(--border)] bg-[var(--surface)] text-[var(--primary)] focus:ring-[var(--primary)] focus:ring-offset-[var(--background)]"
                />
                <span className="text-sm text-white">Instagram</span>
              </label>
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-[var(--border)] bg-[var(--surface)]/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white hover:bg-[var(--surface)] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button className="px-6 py-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-[var(--primary)]/20">
            Clock Post
          </button>
        </div>
      </div>
    </div>
  );
}

// Calendar Cell Component
function CalendarCell({
  day,
  onClick,
  onDragOver,
  onDrop,
}: {
  day: CalendarDay;
  onClick: (day: CalendarDay) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, day: CalendarDay) => void;
}) {
  const handleDragStart = (e: React.DragEvent, video: ClockdVideo) => {
    e.dataTransfer.setData("videoId", video.id);
  };

  return (
    <div
      className={clsx(
        "border-b border-r border-[var(--border)] p-2 min-h-[120px] cursor-pointer hover:bg-[var(--surface-darker)]/50 transition-colors group relative",
        !day.isCurrentMonth && "bg-[var(--surface-darker)]/30",
        day.isToday && "ring-1 ring-inset ring-[var(--primary)]/20 bg-[var(--primary)]/5"
      )}
      onClick={() => onClick(day)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, day)}
    >
      <span
        className={clsx(
          "text-sm font-medium",
          day.isCurrentMonth ? "text-white" : "text-[var(--text-muted)]/50"
        )}
      >
        {day.date}
      </span>

      {day.videos.map((video) => (
        <div
          key={video.id}
          draggable
          onDragStart={(e) => handleDragStart(e, video)}
          className="bg-[var(--surface)] rounded border border-[var(--border)] p-1.5 flex flex-col gap-1 cursor-grab hover:border-[var(--primary)]/50 transition-colors mt-1"
        >
          <div className="flex items-center gap-1.5">
            <div className={clsx("size-2 rounded-full shrink-0", getStatusColor(video.status))} />
            <span className="text-xs text-white truncate font-medium">
              {video.title}
            </span>
          </div>
          <span className="text-[10px] text-[var(--text-muted)] ml-3.5">
            {video.scheduledTime}
          </span>
        </div>
      ))}

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="material-symbols-outlined text-3xl text-[var(--primary)]/40">
          add_circle
        </span>
      </div>
    </div>
  );
}

// Main Calendar Page
export default function CalendarPage() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [view, setView] = useState<"month" | "week" | "list">("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [videos] = useState<ClockdVideo[]>(demoVideos);

  const calendarDays = generateCalendarDays(
    currentDate.year,
    currentDate.month,
    videos
  );

  const handlePrevMonth = useCallback(() => {
    setCurrentDate((prev) => ({
      year: prev.month === 0 ? prev.year - 1 : prev.year,
      month: prev.month === 0 ? 11 : prev.month - 1,
    }));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate((prev) => ({
      year: prev.month === 11 ? prev.year + 1 : prev.year,
      month: prev.month === 11 ? 0 : prev.month + 1,
    }));
  }, []);

  const handleToday = useCallback(() => {
    const now = new Date();
    setCurrentDate({
      year: now.getFullYear(),
      month: now.getMonth(),
    });
  }, []);

  const handleDayClick = useCallback((day: CalendarDay) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetDay: CalendarDay) => {
      e.preventDefault();
      const videoId = e.dataTransfer.getData("videoId");
      if (videoId) {
        // In a real app, this would update the video's scheduled date
        console.log(`Moved video ${videoId} to ${targetDay.date}/${targetDay.month + 1}/${targetDay.year}`);
      }
    },
    []
  );

  const filteredVideos = videos.filter((video) => {
    if (statusFilter !== "all" && video.status !== statusFilter) return false;
    if (searchQuery && !video.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 bg-[var(--surface-darker)] border-r border-[var(--border)] flex flex-col h-screen shrink-0 font-display">
        <div className="p-6 flex items-center gap-3">
          <div className="text-[var(--primary)] material-symbols-outlined text-3xl">
            movie_filter
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">ReelForge</h1>
        </div>
        <div className="px-4 py-2 flex items-center gap-3">
          <div className="bg-[var(--surface)] aspect-square bg-cover rounded-full size-10 border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)]">
            <span className="material-symbols-outlined text-xl">person</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-sm font-medium">Creator Studio</span>
            <span className="text-[var(--text-muted)] text-xs">Pro Plan</span>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-1 px-4 py-6 mt-4">
          <a
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-white transition-colors"
            href="/dashboard"
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span className="text-sm font-medium">Dashboard</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]"
            href="/calendar"
          >
            <span className="material-symbols-outlined text-[20px] font-variation-settings-[FILL:1]">
              calendar_month
            </span>
            <span className="text-sm font-medium">Calendar</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-white transition-colors"
            href="/library"
          >
            <span className="material-symbols-outlined text-[20px]">video_library</span>
            <span className="text-sm font-medium">Library</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-white transition-colors"
            href="/analytics"
          >
            <span className="material-symbols-outlined text-[20px]">bar_chart</span>
            <span className="text-sm font-medium">Analytics</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-white transition-colors"
            href="/settings"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </a>
        </nav>
        <div className="p-4 border-t border-[var(--border)]">
          <div className="bg-[var(--surface)] rounded-xl p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[var(--text-muted)]">Storage</span>
              <span className="text-white font-medium">75%</span>
            </div>
            <div className="h-1.5 bg-[var(--surface-darker)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--primary)] w-3/4 rounded-full"></div>
            </div>
            <span className="text-xs text-[var(--text-muted)]">15GB / 20GB used</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-[var(--border)] flex items-center justify-between px-8 bg-[var(--background)] shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold font-display text-white">
              {getMonthName(currentDate.month)} {currentDate.year}
            </h2>
            <div className="flex items-center gap-1 bg-[var(--surface)] rounded-lg p-1">
              <button
                onClick={handlePrevMonth}
                className="p-1 rounded text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-darker)] transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleToday}
                className="px-3 py-1 text-sm font-medium text-white hover:bg-[var(--surface-darker)] rounded transition-colors"
              >
                Today
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1 rounded text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-darker)] transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center bg-[var(--surface)] rounded-lg p-1">
              <button
                onClick={() => setView("month")}
                className={clsx(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                  view === "month"
                    ? "bg-[var(--surface-darker)] text-white shadow-sm"
                    : "text-[var(--text-muted)] hover:text-white"
                )}
              >
                Month
              </button>
              <button
                onClick={() => setView("week")}
                className={clsx(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                  view === "week"
                    ? "bg-[var(--surface-darker)] text-white shadow-sm"
                    : "text-[var(--text-muted)] hover:text-white"
                )}
              >
                Week
              </button>
              <button
                onClick={() => setView("list")}
                className={clsx(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                  view === "list"
                    ? "bg-[var(--surface-darker)] text-white shadow-sm"
                    : "text-[var(--text-muted)] hover:text-white"
                )}
              >
                List
              </button>
            </div>
            <div className="h-8 w-px bg-[var(--border)]"></div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
              <input
                type="text"
                placeholder="Search schedule..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors"
              />
            </div>
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--primary)]"
            >
              <option value="all">All Status</option>
              <option value="planned">Planned</option>
              <option value="processing">Processing</option>
              <option value="ready">Ready</option>
              <option value="published">Published</option>
            </select>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-lg shadow-[var(--primary)]/20"
            >
              <Plus className="w-5 h-5" />
              New Clock
            </button>
          </div>
        </header>

        {/* Calendar Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Calendar Grid */}
          <div className="flex-1 flex flex-col bg-[var(--background)] overflow-y-auto">
            {/* Days of Week */}
            <div className="grid grid-cols-7 border-b border-[var(--border)] bg-[var(--surface-darker)]/50 shrink-0">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="py-3 text-center text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider"
                >
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar Cells */}
            <div className="flex-1 grid grid-cols-7 grid-rows-6 auto-rows-fr">
              {calendarDays.map((day, idx) => (
                <CalendarCell
                  key={`${day.year}-${day.month}-${day.date}-${idx}`}
                  day={day}
                  onClick={handleDayClick}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                />
              ))}
            </div>
          </div>

          {/* Right Sidebar: Upcoming */}
          <UpcomingSidebar videos={filteredVideos} />
        </div>
      </main>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDay(null);
        }}
      />
    </div>
  );
}
