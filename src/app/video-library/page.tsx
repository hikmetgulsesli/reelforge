import Link from "next/link";
import { 
  Video, 
  LayoutDashboard, 
  Settings, 
  CreditCard,
  Plus,
  Search,
  Grid3X3,
  List,
  CheckCircle,
  MoreVertical,
  Globe,
  Menu,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2
} from "lucide-react";

// Mock video data
const mockVideos = [
  {
    id: "1",
    title: "Product Showcase Fall 2024",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvAyrk6keL4J1G6DipUp_vTEcoIZ1Uh1JhU71qXvW-Rf0-VT54O5i4Gx4IsMe5s-_5yt42LZowfb9deLO6l06MJRzIXhMpB1s6dlj5y--69EIPuDOMlHm-3zzfjweaJ0LuwkIQZuryAHS6i_LG7zNUEv0e1eHUASS82DVxKJQjAgMybpSt0PbpLhcjnUa-2ZMWX9HqB02B-NWEG-VuUi9nGBC_jmSzKgouJWIPF3IUZWasyp2wkkPXMib28StoqEuKPAi2XVe9",
    status: "completed" as const,
    duration: "0:45",
    date: "Oct 24, 2024",
    resolution: "1080p",
  },
  {
    id: "2",
    title: "Explainer Video - Tech Startup",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuAq3fg0HUIcb_srjroTjRSWT1gfU5-KHJ40r_J9gDXxoxE7gpxfGKESGe1Gh_9rPjIw9_c_48v2hoGLVNq0Z-17C4uRhFa7wq3sEV9FW08Xm-m9uho_F2JbZFKBfv3w0lRbv1wYRszAjk7fOQv_unUDjRnzTs8qG-nOO56N0z1YHyGpWkUpHgW12T_VOTMAV01J_YRAkUbzRE1ZA42hbOFV8QsjJ2qVl8GbEkGfPPD44T6HSM1u33yUvvIiQ2TzjgqBiqIpww5M",
    status: "rendering" as const,
    duration: "2:15",
    date: "Today, 10:42 AM",
    progress: 68,
  },
  {
    id: "3",
    title: "Social Media Ad Campaign",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMqaPSXu8D0GdLWfvxHTauU4rDgH2RGyD2luwZIsNDjS566CRvd91NqvtqAohiIgfUkmVjaoLbp_9JceJOJtGJQ-U80bHRCEh7-MGSNz_FodZ0laZFiDrThE4fUwyzi7_mhumz5efrpZLps2UVnwu9IsIavt3KAfYkA9sWM9ugbnsSk3xUYTFxDrK61dalODPmhTfpA81vAk5bd3wAMhA1SeWg54nff0jyYeUPWBftAuaoPnTIQXtj8wkCFhTenr_CzU_J7G9a",
    status: "published" as const,
    duration: "0:15",
    date: "Oct 20, 2024",
    views: "1.2k",
  },
];

type VideoStatus = "completed" | "rendering" | "published";
type FilterTab = "all" | "completed" | "rendering" | "published";
type ViewMode = "grid" | "list";

export default function VideoLibraryPage() {
  const activeFilter: FilterTab = "all";
  const viewMode: ViewMode = "grid";

  const getStatusBadge = (status: VideoStatus, progress?: number) => {
    switch (status) {
      case "completed":
        return (
          <span className="absolute top-2 right-2 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Ready
          </span>
        );
      case "rendering":
        return (
          <span className="absolute top-2 right-2 bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Rendering {progress}%
          </span>
        );
      case "published":
        return (
          <span className="absolute top-2 right-2 bg-blue-500/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
            <Globe className="w-3 h-3" />
            Published
          </span>
        );
    }
  };

  const filters: { id: FilterTab; label: string; showPulse?: boolean }[] = [
    { id: "all", label: "All Videos" },
    { id: "completed", label: "Completed" },
    { id: "rendering", label: "Rendering", showPulse: true },
    { id: "published", label: "Published" },
  ];

  return (
    <div className="flex min-h-screen bg-background-dark">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-dark border-r border-border-dark flex flex-col justify-between hidden md:flex shrink-0">
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
            <Link 
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-border-dark transition-colors group"
            >
              <LayoutDashboard className="w-5 h-5 group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <Link 
              href="/video-library"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary group"
            >
              <Video className="w-5 h-5" />
              <span className="text-sm font-medium">My Videos</span>
            </Link>
            <Link 
              href="/credits"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-border-dark transition-colors group"
            >
              <CreditCard className="w-5 h-5 group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium">Credits</span>
              <span className="ml-auto bg-border-dark text-xs py-0.5 px-2 rounded-full text-slate-300">1,250</span>
            </Link>
          </nav>
        </div>
        
        {/* Settings / User */}
        <div className="p-4 flex flex-col gap-1 border-t border-border-dark">
          <Link 
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-border-dark transition-colors group"
          >
            <Settings className="w-5 h-5 group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium">Settings</span>
          </Link>
          <div className="mt-4 flex items-center gap-3 px-3 py-2">
            <img 
              alt="User Avatar" 
              className="w-8 h-8 rounded-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmYzGyL5PqOdlx5kDTC89bI2aBa8o7rRzI71R4D5hIDoFr9PNKnYRFV6Y7xph_HIh3tCxyUN-FzcJKBvfjGiHPHgRYMD0kYDDfY7hzursBSPyc6lSvX_pubPf5yB4V3VXn_-rJiP0AR8D5L9dd1lYBfnpssouqvNKAZnOfZ_dUSv93cuHmUonbg7SOgHcAhFkKvUgYShIPWQGWCe-KhV8kWTj07CfWSE1FPWOBl_hPgwFk56qxsxwM64gpRxDrVfynBrE4BwSF"
            />
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium text-white truncate">Alex Designer</span>
              <span className="text-xs text-text-muted truncate">Pro Plan</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border-dark flex items-center justify-between px-6 lg:px-8 bg-surface-dark/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-300 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="font-display text-xl font-bold text-white tracking-tight hidden sm:block">My Videos</h2>
          </div>
          <div className="flex items-center gap-4 flex-1 justify-end max-w-2xl">
            {/* Search */}
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
              <input 
                className="w-full bg-surface-dark border border-border-dark rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                placeholder="Search videos..."
                type="text"
              />
            </div>
            {/* Create Button */}
            <Link 
              href="/wizard"
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              <span>Create Video</span>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* Filters & Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
                    activeFilter === filter.id
                      ? "bg-border-dark text-white border-transparent"
                      : "bg-surface-dark text-slate-300 hover:text-white hover:bg-border-dark border-border-dark"
                  }`}
                >
                  {filter.label}
                  {filter.showPulse && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse ml-1.5 inline-block" />
                  )}
                </button>
              ))}
            </div>
            
            {/* View Toggles & Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <div className="hidden sm:flex items-center bg-surface-dark border border-border-dark rounded-lg p-0.5">
                <button 
                  aria-label="Grid View"
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "grid" 
                      ? "bg-border-dark text-white shadow-sm" 
                      : "text-text-muted hover:text-white"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button 
                  aria-label="List View"
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "list" 
                      ? "bg-border-dark text-white shadow-sm" 
                      : "text-text-muted hover:text-white"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockVideos.map((video) => (
              <div 
                key={video.id}
                className="group flex flex-col bg-surface-dark border border-border-dark rounded-xl overflow-hidden hover:border-border-dark/80 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="relative aspect-video bg-border-dark">
                  <img 
                    alt="Video Thumbnail" 
                    className={`w-full h-full object-cover ${
                      video.status === "rendering" ? "opacity-60 grayscale-[30%]" : ""
                    }`}
                    src={video.thumbnail}
                  />
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-1.5 py-0.5 rounded">
                    {video.duration}
                  </div>
                  
                  {/* Checkbox (Hover) */}
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <input 
                      className="w-4 h-4 rounded border-slate-500 bg-black/50 text-primary focus:ring-primary focus:ring-offset-0" 
                      type="checkbox"
                    />
                  </div>
                  
                  {/* Status Badge */}
                  {getStatusBadge(video.status, video.progress)}
                  
                  {/* Progress Overlay for Rendering */}
                  {video.status === "rendering" && video.progress && (
                    <div className="absolute inset-0 bg-background-dark/40 flex flex-col items-center justify-center p-4">
                      <Loader2 className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mb-2" />
                      <span className="text-amber-400 font-medium text-sm drop-shadow-md">Rendering {video.progress}%</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4 flex flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 
                      className={`font-display font-semibold text-white truncate text-base ${
                        video.status === "rendering" ? "text-slate-300" : ""
                      }`}
                      title={video.title}
                    >
                      {video.title}
                    </h3>
                    <button className="text-text-muted hover:text-white transition-colors shrink-0">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center text-xs text-text-muted gap-2">
                    <span>{video.date}</span>
                    {video.status === "published" && video.views && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-border-dark" />
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> 
                          {video.views}
                        </span>
                      </>
                    )}
                    {!video.views && video.resolution && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-border-dark" />
                        <span>{video.resolution}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State (hidden when videos exist) */}
          <div className="hidden flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-border-dark rounded-2xl mt-8">
            <div className="size-48 mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-full blur-xl" />
              <Video className="w-24 h-24 text-border-dark relative z-10 block mx-auto" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">No videos found</h3>
            <p className="text-text-muted max-w-md mx-auto mb-8">
              You haven&apos;t created any videos matching these filters. Start generating your first AI video to populate your library.
            </p>
            <Link 
              href="/wizard"
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Video</span>
            </Link>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-12 pt-6 border-t border-border-dark">
            <p className="text-sm text-text-muted hidden sm:block">
              Showing <span className="font-medium text-white">1</span> to <span className="font-medium text-white">12</span> of <span className="font-medium text-white">48</span> results
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <button className="px-3 py-1.5 rounded-lg border border-border-dark bg-surface-dark text-slate-300 hover:text-white hover:bg-border-dark text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1 hidden sm:flex">
                <button className="w-8 h-8 rounded-lg bg-primary text-white text-sm font-medium flex items-center justify-center">1</button>
                <button className="w-8 h-8 rounded-lg hover:bg-surface-dark text-slate-300 hover:text-white text-sm font-medium flex items-center justify-center transition-colors">2</button>
                <button className="w-8 h-8 rounded-lg hover:bg-surface-dark text-slate-300 hover:text-white text-sm font-medium flex items-center justify-center transition-colors">3</button>
                <span className="text-text-muted px-1">...</span>
                <button className="w-8 h-8 rounded-lg hover:bg-surface-dark text-slate-300 hover:text-white text-sm font-medium flex items-center justify-center transition-colors">8</button>
              </div>
              <button className="px-3 py-1.5 rounded-lg border border-border-dark bg-surface-dark text-slate-300 hover:text-white hover:bg-border-dark text-sm font-medium transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
