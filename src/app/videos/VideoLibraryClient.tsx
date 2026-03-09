"use client";

import { useState, useMemo, useCallback } from "react";

// Types
type VideoStatus = "all" | "completed" | "rendering" | "published";
type ViewMode = "grid" | "list";
type SortOption = "newest" | "oldest" | "name";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  status: "completed" | "rendering" | "published";
  createdAt: string;
  resolution: string;
  views?: number;
  progress?: number;
}

// Mock data
const mockVideos: Video[] = [
  {
    id: "1",
    title: "Product Showcase Fall 2024",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvAyrk6keL4J1G6DipUp_vTEcoIZ1Uh1JhU71qXvW-Rf0-VT54O5i4Gx4IsMe5s-_5yt42LZowfb9deLO6l06MJRzIXhMpB1s6dlj5y--6DOMlHm-9EIPu3zzfjweaJ0LuwkIQZuryAHS6i_LG7zNUEv0e1eHUASS82DVxKJQjAgMybpSt0PbpLhcjnUa-2ZMWX9HqB02B-NWEG-VuUi9nGBC_jmSzKgouJWIPF3IUZWasyp2wkkPXMib28StoqEuKPAi2XVe9",
    duration: "0:45",
    status: "completed",
    createdAt: "Oct 24, 2024",
    resolution: "1080p",
  },
  {
    id: "2",
    title: "Explainer Video - Tech Startup",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuAq3fg0HUIcb_srjroTjRSWT1gfU5-KHJ40r_J9gDXxoxE7gpxfGKESGe1Gh_9rPjIw9_c_48v2hoGLVNq0Z-17C4uRhFa7wq3sEV9FW08Xm-m9uho_F2JbZFKBfv3w0lRbv1wYRszAjk7fOQv_unUDjRnzTs8qG-nOO56N0z1YHyGpWkUpHgW12T_VOTMAV01J_YRAkUbzRE1ZA42hbOFV8QsjJ2qVl8GbEkGfPPD44T6HSM1u33yUvvIiQ2TzjgqBiqIpww5M",
    duration: "2:15",
    status: "rendering",
    createdAt: "Today, 10:42 AM",
    resolution: "1080p",
    progress: 68,
  },
  {
    id: "3",
    title: "Social Media Ad Campaign",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMqaPSXu8D0GdLWfvxHTauU4rDgH2RGyD2luwZIsNDjS566CRvd91NqvtqAohiIgfUkmVjaoLbp_9JceJOJtGJQ-U80bHRCEh7-MGSNz_FodZ0laZFiDrThE4fUwyzi7_mhumz5efrpZLps2UVnwu9IsIavt3KAfYkA9sWM9ugbnsSk3xUYTFxDrK61dalODPmhTfpA81vAk5bd3wAMhA1SeWg54nff0jyYeUPWBftAuaoPnTIQXtj8wkCFhTenr_CzU_J7G9a",
    duration: "0:15",
    status: "published",
    createdAt: "Oct 20, 2024",
    resolution: "1080p",
    views: 1200,
  },
  {
    id: "4",
    title: "Tech Review Q4 2024",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvAyrk6keL4J1G6DipUp_vTEcoIZ1Uh1JhU71qXvW-Rf0-VT54O5i4Gx4IsMe5s-_5yt42LZowfb9deLO6l06MJRzIXhMpB1s6dlj5y--6DOMlHm-9EIPu3zzfjweaJ0LuwkIQZuryAHS6i_LG7zNUEv0e1eHUASS82DVxKJQjAgMybpSt0PbpLhcjnUa-2ZMWX9HqB02B-NWEG-VuUi9nGBC_jmSzKgouJWIPF3IUZWasyp2wkkPXMib28StoqEuKPAi2XVe9",
    duration: "1:30",
    status: "completed",
    createdAt: "Oct 18, 2024",
    resolution: "1080p",
  },
  {
    id: "5",
    title: "Brand Story Video",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuAq3fg0HUIcb_srjroTjRSWT1gfU5-KHJ40r_J9gDXxoxE7gpxfGKESGe1Gh_9rPjIw9_c_48v2hoGLVNq0Z-17C4uRhFa7wq3sEV9FW08Xm-m9uho_F2JbZFKBfv3w0lRbv1wYRszAjk7fOQv_unUDjRnzTs8qG-nOO56N0z1YHyGpWkUpHgW12T_VOTMAV01J_YRAkUbzRE1ZA42hbOFV8QsjJ2qVl8GbEkGfPPD44T6HSM1u33yUvvIiQ2TzjgqBiqIpww5M",
    duration: "3:00",
    status: "completed",
    createdAt: "Oct 15, 2024",
    resolution: "4K",
  },
  {
    id: "6",
    title: "Product Launch Teaser",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMqaPSXu8D0GdLWfvxHTauU4rDgH2RGyD2luwZIsNDjS566CRvd91NqvtqAohiIgfUkmVjaoLbp_9JceJOJtGJQ-U80bHRCEh7-MGSNz_FodZ0laZFiDrThE4fUwyzi7_mhumz5efrpZLps2UVnwu9IsIavt3KAfYkA9sWM9ugbnsSk3xUYTFxDrK61dalODPmhTfpA81vAk5bd3wAMhA1SeWg54nff0jyYeUPWBftAuaoPnTIQXtj8wkCFhTenr_CzU_J7G9a",
    duration: "0:30",
    status: "rendering",
    createdAt: "Today, 11:15 AM",
    resolution: "1080p",
    progress: 35,
  },
];

// Icons as inline SVGs
const Icons = {
  dashboard: () => (
    <svg className="text-[20px]" fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  videoLibrary: () => (
    <svg className="text-[20px]" fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24">
      <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  credits: () => (
    <svg className="text-[20px]" fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  ),
  settings: () => (
    <svg className="text-[20px]" fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  ),
  search: () => (
    <svg className="text-[20px]" fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  ),
  add: () => (
    <svg className="text-[20px]" fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  gridView: () => (
    <svg className="text-[20px]" fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  viewList: () => (
    <svg className="text-[20px]" fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  ),
  checkCircle: () => (
    <svg className="text-[12px]" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  ),
  public: () => (
    <svg className="text-[12px]" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  ),
  moreVert: () => (
    <svg className="text-[20px]" fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24">
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  ),
  visibility: () => (
    <svg className="text-[14px]" fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  chevronLeft: () => (
    <svg className="text-[20px]" fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  chevronRight: () => (
    <svg className="text-[20px]" fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24">
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  menu: () => (
    <svg className="text-[20px]" fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24">
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  ),
  movieEdit: () => (
    <svg className="text-[100px]" fill="none" height="24" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M10 12l-2 2 2 2M14 12l2 2-2 2" />
    </svg>
  ),
  addCircle: () => (
    <svg className="text-[20px]" fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  ),
};

// Status badge component
function StatusBadge({ status }: { status: Video["status"] }) {
  const config = {
    completed: {
      bg: "bg-emerald-500/90",
      icon: <Icons.checkCircle />,
      text: "Ready",
    },
    rendering: {
      bg: "bg-amber-500/90",
      icon: null,
      text: "Rendering",
    },
    published: {
      bg: "bg-blue-500/90",
      icon: <Icons.public />,
      text: "Published",
    },
  };

  const { bg, icon, text } = config[status];

  return (
    <div className={`${bg} backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1`}>
      {icon}
      {text}
    </div>
  );
}

// Video card component
function VideoCard({ video, isSelected, onSelect }: { video: Video; isSelected: boolean; onSelect: (id: string) => void }) {
  return (
    <div className="group flex flex-col bg-surface border border-border rounded-xl overflow-hidden hover:border-border/80 hover:shadow-lg transition-all">
      <div className="relative aspect-video bg-border">
        <img
          alt={video.title}
          className={`w-full h-full object-cover ${video.status === "rendering" ? "opacity-60 grayscale-[30%]" : ""}`}
          src={video.thumbnail}
        />
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-1.5 py-0.5 rounded">
          {video.duration}
        </div>
        {/* Checkbox */}
        <div className={`absolute top-2 left-2 transition-opacity ${isSelected || "opacity-0 group-hover:opacity-100"}`}>
          <input
            checked={isSelected}
            className="size-4 rounded border-slate-500 bg-black/50 text-primary focus:ring-primary focus:ring-offset-0"
            onChange={() => onSelect(video.id)}
            type="checkbox"
          />
        </div>
        {/* Status Badge */}
        {video.status !== "rendering" && (
          <div className="absolute top-2 right-2">
            <StatusBadge status={video.status} />
          </div>
        )}
        {/* Rendering Overlay */}
        {video.status === "rendering" && video.progress && (
          <div className="absolute inset-0 bg-background/40 flex flex-col items-center justify-center p-4">
            <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mb-2" />
            <span className="text-amber-400 font-medium text-sm drop-shadow-md">Rendering {video.progress}%</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`font-display font-semibold text-white truncate text-base ${video.status === "rendering" ? "text-slate-300" : ""}`} title={video.title}>
            {video.title}
          </h3>
          <button className="text-text-muted hover:text-white transition-colors shrink-0" aria-label="More options">
            <Icons.moreVert />
          </button>
        </div>
        <div className="flex items-center text-xs text-text-muted gap-2">
          <span>{video.createdAt}</span>
          {video.resolution && (
            <>
              <span className="size-1 rounded-full bg-border" />
              <span>{video.resolution}</span>
            </>
          )}
          {video.views && (
            <span className="flex items-center gap-1">
              <Icons.visibility /> {video.views.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Empty state component
function EmptyState() {
  return (
    <div className="hidden flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-border rounded-2xl mt-8">
      <div className="size-48 mb-6 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-full blur-xl" />
        <span className="material-symbols-outlined text-[100px] text-border-dark relative z-10 block text-center leading-[192px]">
          movie_edit
        </span>
      </div>
      <h3 className="font-display text-2xl font-bold text-white mb-2">No videos found</h3>
      <p className="text-text-muted max-w-md mx-auto mb-8">
        You haven&apos;t created any videos matching these filters. Start generating your first AI video to populate your library.
      </p>
      <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-colors">
        <Icons.addCircle />
        <span>Create Your First Video</span>
      </button>
    </div>
  );
}

// Sidebar component
function Sidebar() {
  return (
    <aside className="w-64 bg-surface-dark border-r border-border flex flex-col justify-between hidden md:flex shrink-0">
      <div className="p-4 flex flex-col gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="size-10 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-display font-bold text-xl shadow-lg">
            R
          </div>
          <div className="flex flex-col">
            <h1 className="font-display text-lg font-bold leading-tight text-white">ReelForge</h1>
            <p className="text-text-muted text-xs font-medium uppercase tracking-wider">Video Library</p>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-border-dark transition-colors group" href="/dashboard">
            <span className="group-hover:text-primary transition-colors"><Icons.dashboard /></span>
            <span className="text-sm font-medium">Dashboard</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary group" href="/videos">
            <span><Icons.videoLibrary /></span>
            <span className="text-sm font-medium">My Videos</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-border-dark transition-colors group" href="#">
            <span className="group-hover:text-primary transition-colors"><Icons.credits /></span>
            <span className="text-sm font-medium">Credits</span>
            <span className="ml-auto bg-border-dark text-xs py-0.5 px-2 rounded-full text-slate-300">1,250</span>
          </a>
        </nav>
      </div>
      {/* Settings / User */}
      <div className="p-4 flex flex-col gap-1 border-t border-border-dark">
        <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-border-dark transition-colors group" href="#">
          <span className="group-hover:text-primary transition-colors"><Icons.settings /></span>
          <span className="text-sm font-medium">Settings</span>
        </a>
        <div className="mt-4 flex items-center gap-3 px-3 py-2">
          <img
            alt="User Avatar"
            className="size-8 rounded-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmYzGyL5PqOdlx5kDTC89bI2aBa8o7rRzI71R4D5hIDoFr9PNKnYRFV6Y7xph_HIh3tCxyUN-FzcJKBvfjGiHPHgRYMD0kYDDfY7hzursBSPyc6lSvX_pubPf5yB4V3VXn_-rJiP0AR8D5L9dd1lYBfnpssouqvNKAZnOfZ_dUSv93cuHmUonbg7SOgHcAhFkKvUgYShIPWQGWCe-KhV8kWTj07CfWSE1FPWOBl_hPgwFk56qxsxwM64gpRxDrVfynBrE4BwSF"
          />
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium text-white truncate">Alex Designer</span>
            <span className="text-xs text-text-muted truncate">Pro Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

// Main component
export default function VideoLibraryClient() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [statusFilter, setStatusFilter] = useState<VideoStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  
  // Simple debounce effect
  useState(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  });

  // Filter and sort videos
  const filteredVideos = useMemo(() => {
    let result = [...mockVideos];

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((v) => v.status === statusFilter);
    }

    // Filter by search
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter((v) => v.title.toLowerCase().includes(query));
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [statusFilter, debouncedSearch, sortOption]);

  // Pagination
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleSelectVideo = useCallback((id: string) => {
    setSelectedVideos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedVideos.size === paginatedVideos.length) {
      setSelectedVideos(new Set());
    } else {
      setSelectedVideos(new Set(paginatedVideos.map((v) => v.id)));
    }
  }, [paginatedVideos, selectedVideos.size]);

  const totalVideos = filteredVideos.length;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalVideos);

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 lg:px-8 bg-surface/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-300 hover:text-white" aria-label="Menu">
              <Icons.menu />
            </button>
            <h2 className="font-display text-xl font-bold text-white tracking-tight hidden sm:block">My Videos</h2>
          </div>
          <div className="flex items-center gap-4 flex-1 justify-end max-w-2xl">
            {/* Search */}
            <div className="relative w-full max-w-md hidden sm:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[20px]">
                <Icons.search />
              </span>
              <input
                className="w-full bg-surface-dark border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos..."
                type="text"
                value={searchQuery}
              />
            </div>
            {/* Create Button */}
            <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors whitespace-nowrap">
              <Icons.add />
              <span>Create Video</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* Filters & Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
              <button
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
                  statusFilter === "all"
                    ? "bg-border text-white border-transparent"
                    : "bg-surface-dark text-slate-300 hover:text-white hover:bg-border-dark border-border-dark"
                }`}
                onClick={() => setStatusFilter("all")}
              >
                All Videos
              </button>
              <button
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors flex items-center gap-1.5 ${
                  statusFilter === "completed"
                    ? "bg-border text-white border-transparent"
                    : "bg-surface-dark text-slate-300 hover:text-white hover:bg-border-dark border-border-dark"
                }`}
                onClick={() => setStatusFilter("completed")}
              >
                Completed
              </button>
              <button
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors flex items-center gap-1.5 ${
                  statusFilter === "rendering"
                    ? "bg-border text-white border-transparent"
                    : "bg-surface-dark text-slate-300 hover:text-white hover:bg-border-dark border-border-dark"
                }`}
                onClick={() => setStatusFilter("rendering")}
              >
                Rendering <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
              </button>
              <button
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
                  statusFilter === "published"
                    ? "bg-border text-white border-transparent"
                    : "bg-surface-dark text-slate-300 hover:text-white hover:bg-border-dark border-border-dark"
                }`}
                onClick={() => setStatusFilter("published")}
              >
                Published
              </button>
            </div>

            {/* View Toggles & Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Sort */}
              <select
                className="bg-surface-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-primary"
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                value={sortOption}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name</option>
              </select>

              {/* Bulk Actions */}
              {selectedVideos.size > 0 && (
                <button className="flex items-center gap-2 bg-primary/90 hover:bg-primary text-white px-3 py-2 rounded-lg text-sm font-medium">
                  Delete ({selectedVideos.size})
                </button>
              )}

              <div className="hidden sm:flex items-center bg-surface-dark border border-border-dark rounded-lg p-0.5">
                <button
                  aria-label="Grid View"
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "grid" ? "bg-border-dark text-white shadow-sm" : "text-text-muted hover:text-white"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <Icons.gridView />
                </button>
                <button
                  aria-label="List View"
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "list" ? "bg-border-dark text-white shadow-sm" : "text-text-muted hover:text-white"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <Icons.viewList />
                </button>
              </div>
            </div>
          </div>

          {/* Video Grid */}
          {paginatedVideos.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}>
              {paginatedVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isSelected={selectedVideos.has(video.id)}
                  onSelect={handleSelectVideo}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}

          {/* Pagination */}
          {totalVideos > 0 && (
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
              <p className="text-sm text-text-muted hidden sm:block">
                Showing <span className="font-medium text-white">{startItem}</span> to{" "}
                <span className="font-medium text-white">{endItem}</span> of{" "}
                <span className="font-medium text-white">{totalVideos}</span> results
              </p>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  className="px-3 py-1.5 rounded-lg border border-border-dark bg-surface-dark text-slate-300 hover:text-white hover:bg-border-dark text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </button>
                <div className="flex items-center gap-1 hidden sm:flex">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`size-8 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
                        currentPage === page
                          ? "bg-primary text-white"
                          : "hover:bg-surface-dark text-slate-300 hover:text-white"
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  {totalPages > 5 && (
                    <>
                      <span className="text-text-muted px-1">...</span>
                      <button
                        className="size-8 rounded-lg hover:bg-surface-dark text-slate-300 hover:text-white text-sm font-medium flex items-center justify-center transition-colors"
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
                <button
                  className="px-3 py-1.5 rounded-lg border border-border-dark bg-surface-dark text-slate-300 hover:text-white hover:bg-border-dark text-sm font-medium transition-colors"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
