"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "../../lib/store";
import {
  Home,
  Video,
  FolderOpen,
  BarChart3,
  Settings,
  Calendar,
  FlaskConical,
  TrendingUp,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  { name: "Ana Panel", href: "/dashboard", icon: <Home className="w-5 h-5" /> },
  { name: "Projeler", href: "/projects", icon: <FolderOpen className="w-5 h-5" /> },
  { name: "Video Oluştur", href: "/create", icon: <Sparkles className="w-5 h-5" /> },
  { name: "Kütüphane", href: "/library", icon: <Video className="w-5 h-5" /> },
  { name: "Seri Modu", href: "/series", icon: <FolderOpen className="w-5 h-5" /> },
  { name: "İçerik Takvimi", href: "/calendar", icon: <Calendar className="w-5 h-5" /> },
];

const analysisNavItems: NavItem[] = [
  { name: "Analizler", href: "/analytics", icon: <BarChart3 className="w-5 h-5" /> },
  { name: "A/B Testleri", href: "/ab-testing", icon: <FlaskConical className="w-5 h-5" /> },
  { name: "Niş Analizi", href: "/niche", icon: <TrendingUp className="w-5 h-5" /> },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, credits, plan } = useAppStore();
  const { data: session } = useSession();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const linkClasses = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
      active
        ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-medium"
        : "text-[var(--text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-white"
    }`;

  return (
    <div
      className={`flex flex-col h-screen border-r border-[var(--border)] bg-[var(--surface)] transition-all duration-300 ${
        sidebarCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex flex-col flex-1 p-4">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="bg-gradient-to-tr from-[var(--color-primary)] to-[var(--secondary)] aspect-square rounded-xl flex items-center justify-center w-10 h-10 flex-shrink-0">
            <Video className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <h1 className="text-white text-xl font-bold font-[family-name:var(--font-display)]">
              ReelForge
            </h1>
          )}
        </div>

        {/* Main Navigation */}
        <div className="flex flex-col gap-1">
          {!sidebarCollapsed && (
            <span className="text-xs uppercase text-[var(--text-muted)] px-3 mb-1">
              Ana Menü
            </span>
          )}
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkClasses(isActive(item.href))}
              title={sidebarCollapsed ? item.name : undefined}
            >
              {item.icon}
              {!sidebarCollapsed && <span className="text-sm">{item.name}</span>}
            </Link>
          ))}
        </div>

        {/* Analysis Section */}
        <div className="flex flex-col gap-1 mt-6">
          {!sidebarCollapsed && (
            <span className="text-xs uppercase text-[var(--text-muted)] px-3 mb-1">
              Analiz
            </span>
          )}
          {analysisNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkClasses(isActive(item.href))}
              title={sidebarCollapsed ? item.name : undefined}
            >
              {item.icon}
              {!sidebarCollapsed && <span className="text-sm">{item.name}</span>}
            </Link>
          ))}
        </div>

        {/* Settings */}
        <div className="flex flex-col gap-1 mt-6">
          <Link
            href="/settings"
            className={linkClasses(isActive("/settings"))}
            title={sidebarCollapsed ? "Ayarlar" : undefined}
          >
            <Settings className="w-5 h-5" />
            {!sidebarCollapsed && <span className="text-sm">Ayarlar</span>}
          </Link>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Plan Widget */}
        {!sidebarCollapsed && (
          <div className="rounded-xl bg-[var(--color-surface-hover)] p-4 border border-white/5 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-[var(--secondary)]" />
              <p className="text-white text-sm font-medium capitalize">{plan} Plan</p>
            </div>
            <p className="text-[var(--text-muted)] text-xs mb-3">
              {credits} kredi kaldı
            </p>
            <Link
              href="/pricing"
              className="block w-full py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-lg text-sm font-medium transition-colors text-center"
            >
              Planı Yükselt
            </Link>
          </div>
        )}

        {/* User & Logout */}
        {session && !sidebarCollapsed && (
          <div className="border-t border-[var(--border)] pt-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center text-sm font-medium text-white">
                {session.user?.name?.[0] || session.user?.email?.[0] || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{session.user?.name}</p>
                <p className="text-xs text-[var(--text-muted)] truncate">
                  {session.user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Çıkış Yap
            </button>
          </div>
        )}

        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className="mt-4 p-2 rounded-lg bg-[var(--color-surface-hover)] hover:bg-[var(--color-primary)]/20 transition-colors flex items-center justify-center"
          title={sidebarCollapsed ? "Genişlet" : "Daralt"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-[var(--text-muted)]" />
          )}
        </button>
      </div>
    </div>
  );
}