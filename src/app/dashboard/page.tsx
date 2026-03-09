import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import {
  Sidebar,
  StatsCards,
  QuickActions,
  RecentVideos,
  RecentSeries,
  ActiveJobProgress,
} from "@/components/dashboard";

interface DashboardData {
  credits: {
    total: number;
    used: number;
    remaining: number;
    plan: string;
  };
  stats: {
    videosThisMonth: number;
    totalVideos: number;
  };
  recentVideos: Array<{
    id: string;
    title: string;
    thumbnailUrl: string | null;
    status: string;
    createdAt: string;
    duration: number;
    platform: string;
  }>;
  recentSeries: Array<{
    id: string;
    name: string;
    description: string | null;
    videoCount: number;
    isActive: boolean;
    createdAt: string;
    niche: string | null;
  }>;
  activeJobs: Array<{
    id: string;
    videoId: string;
    status: string;
    progress: number;
    stage: string | null;
    createdAt: string;
    video: {
      id: string;
      title: string;
      thumbnailUrl: string | null;
    };
  }>;
}

async function getDashboardData(): Promise<DashboardData | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/dashboard`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return null;
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const dashboardData = await getDashboardData();

  // Default data if fetch fails
  const data: DashboardData = dashboardData || {
    credits: { total: 3, used: 0, remaining: 3, plan: "free" },
    stats: { videosThisMonth: 0, totalVideos: 0 },
    recentVideos: [],
    recentSeries: [],
    activeJobs: [],
  };

  return (
    <div className="min-h-screen bg-[var(--color-background-dark)]">
      <Sidebar
        userEmail={session.user?.email}
        userName={session.user?.name}
      />

      {/* Main content area */}
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text-main-dark)] font-[family-name:var(--font-display)]">
                Hoş Geldiniz, {session.user?.name || session.user?.email?.split("@")[0]}!
              </h1>
              <p className="text-[var(--color-text-muted-dark)] mt-1">
                Video üretim merkezinize genel bakış
              </p>
            </div>
            <div className="text-sm text-[var(--color-text-muted-dark)]">
              {new Date().toLocaleDateString("tr-TR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          {/* Stats cards */}
          <StatsCards credits={data.credits} stats={data.stats} />

          {/* Quick actions */}
          <QuickActions />

          {/* Active jobs */}
          <ActiveJobProgress jobs={data.activeJobs} />

          {/* Recent content grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <RecentVideos videos={data.recentVideos} />
            <RecentSeries series={data.recentSeries} />
          </div>
        </div>
      </main>
    </div>
  );
}