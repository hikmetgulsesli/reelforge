"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Video,
  Folder,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  CreditCard,
} from "lucide-react";
import { clsx } from "clsx";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const mainNavItems: NavItem[] = [
  { name: "Ana Panel", href: "/dashboard", icon: Home },
  { name: "Yeni Video", href: "/wizard", icon: Video },
  { name: "Video Kütüphanesi", href: "/dashboard/videos", icon: Folder },
  { name: "Seri Yönetimi", href: "/dashboard/series", icon: Video },
  { name: "İçerik Takvimi", href: "/dashboard/calendar", icon: Folder },
  { name: "Analitik", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "A/B Testleri", href: "/dashboard/ab-testing", icon: BarChart3 },
  { name: "Niş Analizi", href: "/dashboard/niche-analysis", icon: BarChart3 },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 z-50 h-full w-64 bg-[var(--color-surface-dark)] border-r border-[var(--color-surface-hover)] flex flex-col transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-6 border-b border-[var(--color-surface-hover)]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
            <Video className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white font-[family-name:var(--font-display)]">
            ReelForge
          </h1>
        </div>

        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[var(--color-text-muted)] hover:text-white lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                      isActive
                        ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-medium"
                        : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-white"
                    )}
                    onClick={onClose}
                  >
                    <item.icon
                      className={clsx(
                        "w-5 h-5",
                        !isActive && "group-hover:text-white"
                      )}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Settings Section */}
          <div className="mt-6">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={clsx(
                "flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-colors",
                settingsOpen || pathname?.startsWith("/dashboard/settings")
                  ? "bg-[var(--color-surface-hover)] text-white"
                  : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5" />
                <span className="text-sm font-medium">Ayarlar</span>
              </div>
              <ChevronDown
                className={clsx(
                  "w-4 h-4 transition-transform",
                  settingsOpen && "rotate-180"
                )}
              />
            </button>
            {settingsOpen && (
              <ul className="mt-1 ml-4 space-y-1">
                <li>
                  <Link
                    href="/dashboard/settings"
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      pathname === "/dashboard/settings"
                        ? "text-[var(--color-primary)]"
                        : "text-[var(--color-text-muted)] hover:text-white"
                    )}
                    onClick={onClose}
                  >
                    Hesap
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/settings/billing"
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      pathname === "/dashboard/settings/billing"
                        ? "text-[var(--color-primary)]"
                        : "text-[var(--color-text-muted)] hover:text-white"
                    )}
                    onClick={onClose}
                  >
                    Faturalama
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-[var(--color-surface-hover)]">
          <div className="bg-[var(--color-surface-hover)] rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <CreditCard className="w-4 h-4 text-[var(--color-secondary)]" />
              <p className="text-white text-sm font-medium">Pro Plan</p>
            </div>
            <p className="text-[var(--color-text-muted)] text-xs mb-4">
              Gelişmiş AI özellikleri ve daha hızlı render süreleri.
            </p>
            <button className="w-full py-2 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-lg text-sm font-medium transition-opacity">
              Planı Yükselt
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

interface HeaderProps {
  onMenuClick: () => void;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function Header({ onMenuClick, user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--color-surface-hover)] bg-[var(--color-background-dark)]/80 backdrop-blur-md px-6 py-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-white transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-white text-2xl font-bold font-[family-name:var(--font-display)] hidden sm:block">
          Ana Kontrol Paneli
        </h2>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 flex-1 justify-end">
        {/* Search */}
        <div className="relative hidden md:block max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-[var(--color-text-muted)]" />
          </div>
          <input
            type="text"
            placeholder="Proje veya video ara..."
            className="block w-full pl-10 pr-3 py-2 border border-[var(--color-surface-hover)] rounded-xl bg-[var(--color-surface-dark)] text-white placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm transition-colors"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-[var(--color-secondary)] ring-2 ring-[var(--color-background-dark)]" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 rounded-full p-1 hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            <div className="h-9 w-9 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-medium">
              {user?.name?.[0] || user?.email?.[0] || "U"}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-background-dark)]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
        />
        
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--color-surface-dark)] border-t border-[var(--color-surface-hover)] p-2 lg:hidden z-30">
        <nav className="flex justify-around">
          {[
            { name: "Ana Panel", href: "/dashboard", icon: Home },
            { name: "Video Oluştur", href: "/wizard", icon: Video },
            { name: "Kütüphane", href: "/dashboard/videos", icon: Folder },
            { name: "Ayarlar", href: "/dashboard/settings", icon: Settings },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center gap-1 p-2 text-[var(--color-text-muted)] hover:text-white transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default DashboardLayout;
