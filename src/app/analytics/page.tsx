"use client";
export const dynamic = "force-dynamic";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Header } from "../../components/layout/Header";
import { TrendingUp, Eye, Heart, Share2, Youtube, Instagram } from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const viewsData = [
  { name: "Pzt", views: 4000 },
  { name: "Sal", views: 3000 },
  { name: "Çar", views: 5000 },
  { name: "Per", views: 2780 },
  { name: "Cum", views: 1890 },
  { name: "Cmt", views: 2390 },
  { name: "Paz", views: 3490 },
];

const platformData = [
  { name: "YouTube", views: 45000, color: "#FF0000" },
  { name: "TikTok", views: 32000, color: "#00F2EA" },
  { name: "Instagram", views: 28000, color: "#E1306C" },
];

const engagementData = [
  { name: "1. Hafta", likes: 400, shares: 240, comments: 120 },
  { name: "2. Hafta", likes: 450, shares: 280, comments: 140 },
  { name: "3. Hafta", likes: 520, shares: 320, comments: 160 },
  { name: "4. Hafta", likes: 580, shares: 380, comments: 200 },
];

export default function AnalyticsPage() {
  const stats = [
    { label: "Toplam Görüntülenme", value: "105K", change: "+12%", icon: <Eye className="w-5 h-5" /> },
    { label: "Toplam Beğeni", value: "8.2K", change: "+8%", icon: <Heart className="w-5 h-5" /> },
    { label: "Paylaşımlar", value: "1.4K", change: "+15%", icon: <Share2 className="w-5 h-5" /> },
    { label: "Büyüme Oranı", value: "23%", change: "+5%", icon: <TrendingUp className="w-5 h-5" /> },
  ];

  return (
    <DashboardLayout>
      <Header title="Analizler" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                  {stat.icon}
                </div>
                <span className="text-sm text-green-400">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">
                {stat.value}
              </p>
              <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Views Chart */}
        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6">
          <h3 className="text-lg font-bold text-white mb-4">Haftalık Görüntülenme</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="var(--color-primary)"
                  fill="var(--color-primary)"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Stats & Engagement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Platform Distribution */}
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6">
            <h3 className="text-lg font-bold text-white mb-4">Platform Dağılımı</h3>
            <div className="space-y-4">
              {platformData.map((platform, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${platform.color}20` }}
                  >
                    {platform.name === "YouTube" ? (
                      <Youtube className="w-5 h-5" style={{ color: platform.color }} />
                    ) : platform.name === "Instagram" ? (
                      <Instagram className="w-5 h-5" style={{ color: platform.color }} />
                    ) : (
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: platform.color }} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-sm">{platform.name}</span>
                      <span className="text-white text-sm font-medium">
                        {platform.views.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--color-surface-hover)]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(platform.views / 45000) * 100}%`,
                          backgroundColor: platform.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement Chart */}
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6">
            <h3 className="text-lg font-bold text-white mb-4">Etkileşim Dağılımı</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="likes" fill="var(--color-primary)" name="Beğeniler" />
                  <Bar dataKey="shares" fill="var(--secondary)" name="Paylaşımlar" />
                  <Bar dataKey="comments" fill="#8B5CF6" name="Yorumlar" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}