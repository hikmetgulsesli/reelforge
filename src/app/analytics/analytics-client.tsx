"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Mock data for charts
const viewsOverTimeData = [
  { date: "Sep 1", videos: 12, views: 2400 },
  { date: "Sep 8", videos: 19, views: 1398 },
  { date: "Sep 15", videos: 15, views: 9800 },
  { date: "Sep 22", videos: 28, views: 3908 },
  { date: "Sep 29", videos: 35, views: 4800 },
  { date: "Oct 6", videos: 42, views: 6500 },
  { date: "Oct 13", videos: 38, views: 5200 },
];

const videoPerformanceData = [
  { name: "Cyberpunk City", views: 4500, completion: 78 },
  { name: "Fantasy Realm", views: 3200, completion: 65 },
  { name: "Nature Doc", views: 2800, completion: 82 },
  { name: "Tech Promo", views: 2100, completion: 55 },
  { name: "Travel Vlog", views: 1800, completion: 70 },
];

const nicheDistributionData = [
  { name: "Anime", value: 45, color: "#e21d48" },
  { name: "Cinematic", value: 25, color: "#e21d48cc" },
  { name: "3D Render", value: 20, color: "#e21d4899" },
  { name: "Pixel Art", value: 10, color: "#e21d4866" },
];

const recentActivity = [
  {
    id: 1,
    type: "render",
    title: 'Video Rendered: "Cyberpunk Cityscape"',
    subtitle: "Render time: 2m 15s • Anime Style",
    time: "2 mins ago",
  },
  {
    id: 2,
    type: "purchase",
    title: "Credits Purchased",
    subtitle: "Added 500 credits to account",
    time: "2 hours ago",
  },
  {
    id: 3,
    type: "render",
    title: 'Video Rendered: "Fantasy Character Portrait"',
    subtitle: "Render time: 1m 30s • Cinematic Style",
    time: "5 hours ago",
  },
];

type DateRange = "7d" | "30d" | "90d" | "custom";

export default function AnalyticsClient() {
  const [dateRange, setDateRange] = useState<DateRange>("30d");

  // KPI Cards data
  const kpiCards = [
    {
      label: "Total Videos",
      value: "142",
      trend: "+12%",
      trendUp: true,
      icon: "movie",
    },
    {
      label: "Credits Used",
      value: "310",
      trend: null,
      trendUp: null,
      icon: "toll",
    },
    {
      label: "Avg. Render Time",
      value: "1m 45s",
      trend: null,
      trendUp: null,
      icon: "timer",
    },
    {
      label: "Popular Style",
      value: "Anime",
      trend: null,
      trendUp: null,
      icon: "brush",
    },
  ];

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ["Date", "Videos", "Views"];
    const rows = viewsOverTimeData.map((d) => [d.date, d.videos, d.views]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    // Simple PDF-like print - opens print dialog with optimized styling
    window.print();
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-surface dark:bg-surface-dark border-r border-border-light dark:border-border-dark flex flex-col justify-between hidden md:flex">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 dark:text-white text-base font-display font-medium">
                ReelForge Analytics
              </h1>
              <p className="text-primary text-sm font-normal">Pro Plan</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-border-light dark:hover:bg-border-dark transition-colors"
            >
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">
                dashboard
              </span>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <Link
              href="/analytics"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary"
            >
              <span className="material-symbols-outlined text-primary">analytics</span>
              <span className="text-sm font-medium">Analytics</span>
            </Link>
            <Link
              href="/videos"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-border-light dark:hover:bg-border-dark transition-colors"
            >
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">
                video_library
              </span>
              <span className="text-sm font-medium">My Videos</span>
            </Link>
            <Link
              href="/series"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-border-light dark:hover:bg-border-dark transition-colors"
            >
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">
                view_quilt
              </span>
              <span className="text-sm font-medium">Templates</span>
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-border-light dark:hover:bg-border-dark transition-colors"
            >
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">
                settings
              </span>
              <span className="text-sm font-medium">Settings</span>
            </Link>
            <Link
              href="/help"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-border-light dark:hover:bg-border-dark transition-colors"
            >
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">
                help
              </span>
              <span className="text-sm font-medium">Help</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border-light dark:border-border-dark px-8 py-4 bg-surface-light dark:bg-surface-dark sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <button className="p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:hover:text-white">
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
            <div className="size-6 text-primary">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
              </svg>
            </div>
            <h2 className="text-slate-900 dark:text-white text-xl font-display font-bold tracking-[-0.015em] hidden sm:block">
              ReelForge
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined mr-2 text-sm">download</span>
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center justify-center rounded-lg h-10 px-4 border border-border-dark text-slate-300 text-sm font-bold hover:bg-surface-dark transition-colors"
            >
              <span className="material-symbols-outlined mr-2 text-sm">picture_as_pdf</span>
              <span>Export PDF</span>
            </button>
            <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hidden sm:block">
              <span className="material-symbols-outlined">person</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
          {/* Title & Date Range */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-slate-900 dark:text-white text-3xl font-display font-black tracking-[-0.033em]">
              Insights & Analytics
            </h2>
            <div className="flex bg-surface-light dark:bg-surface-dark rounded-lg border border-border-light dark:border-border-dark p-1">
              <button
                onClick={() => setDateRange("7d")}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  dateRange === "7d"
                    ? "bg-border-light dark:bg-border-dark text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setDateRange("30d")}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  dateRange === "30d"
                    ? "bg-border-light dark:bg-border-dark text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setDateRange("90d")}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  dateRange === "90d"
                    ? "bg-border-light dark:bg-border-dark text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                90 Days
              </button>
              <button
                onClick={() => setDateRange("custom")}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  dateRange === "custom"
                    ? "bg-border-light dark:bg-border-dark text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Custom
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((card, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 rounded-xl p-6 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    {card.label}
                  </p>
                  <span className="material-symbols-outlined text-slate-400 text-sm">
                    {card.icon}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-slate-900 dark:text-white text-3xl font-bold">
                    {card.value}
                  </p>
                  {card.trend && (
                    <p
                      className={`text-sm font-medium flex items-center ${
                        card.trendUp ? "text-emerald-500" : "text-red-500"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {card.trendUp ? "trending_up" : "trending_down"}
                      </span>
                      {card.trend}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Line Chart - Video Production Over Time */}
            <div className="lg:col-span-2 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-slate-900 dark:text-white font-display font-bold text-lg">
                  Video Production Over Time
                </h3>
                <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <span className="material-symbols-outlined">more_horiz</span>
                </button>
              </div>
              <div className="flex-1 min-h-[300px] w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={viewsOverTimeData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--color-border-dark)"
                    />
                    <XAxis
                      dataKey="date"
                      stroke="var(--color-text-muted-dark)"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="var(--color-text-muted-dark)"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-surface-dark)",
                        border: "1px solid var(--color-border-dark)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="videos"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-primary)" }}
                      name="Videos Created"
                    />
                    <Line
                      type="monotone"
                      dataKey="views"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: "#10b981" }}
                      name="Total Views"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart - Popular Styles */}
            <div className="rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-slate-900 dark:text-white font-display font-bold text-lg">
                  Popular Styles
                </h3>
              </div>
              <div className="flex-1 flex flex-col gap-4 justify-center">
                {nicheDistributionData.map((item, index) => (
                  <div key={index} className="flex flex-col gap-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-700 dark:text-slate-300">
                        {item.name}
                      </span>
                      <span className="font-bold">{item.value}%</span>
                    </div>
                    <div className="w-full bg-border-light dark:bg-border-dark rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Video Performance Table & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Performance Bar Chart */}
            <div className="lg:col-span-2 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-slate-900 dark:text-white font-display font-bold text-lg">
                  Video Performance Comparison
                </h3>
              </div>
              <div className="flex-1 min-h-[250px] w-full">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={videoPerformanceData} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--color-border-dark)"
                    />
                    <XAxis type="number" stroke="var(--color-text-muted-dark)" fontSize={12} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="var(--color-text-muted-dark)"
                      fontSize={12}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-surface-dark)",
                        border: "1px solid var(--color-border-dark)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="views"
                      fill="var(--color-primary)"
                      name="Views"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-6 shadow-sm">
              <h3 className="text-slate-900 dark:text-white font-display font-bold text-lg mb-6">
                Recent Activity
              </h3>
              <div className="flex flex-col gap-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 pb-4 border-b border-border-light dark:border-border-dark last:border-0"
                  >
                    <div
                      className={`size-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === "render"
                          ? "bg-primary/10 dark:bg-primary/20 text-primary"
                          : "bg-emerald-500/10 text-emerald-500"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {activity.type === "render"
                          ? "play_circle"
                          : "shopping_cart"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900 dark:text-white font-medium text-sm">
                        {activity.title}
                      </p>
                      <p className="text-slate-500 text-xs mt-1">
                        {activity.subtitle}
                      </p>
                    </div>
                    <span className="text-slate-400 text-xs whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
