"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Film,
  FolderOpen,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  userEmail?: string | null;
  userName?: string | null;
}

const navItems = [
  { href: "/dashboard", label: "Ana Sayfa", icon: Home },
  { href: "/dashboard/videos", label: "Videolarım", icon: Film },
  { href: "/dashboard/series", label: "Seriler", icon: FolderOpen },
  { href: "/wizard", label: "Video Oluştur", icon: Sparkles, highlight: true },
  { href: "/dashboard/calendar", label: "İçerik Takvimi", icon: Calendar },
  { href: "/dashboard/analytics", label: "Analitik", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Ayarlar", icon: Settings },
];

export function Sidebar({ userEmail, userName }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[var(--color-surface-darker)] border-r border-[var(--color-border-dark)] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--color-border-dark)]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 text-[var(--color-primary)]">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
            </svg>
          </div>
          <span className="text-xl font-bold text-[var(--color-text-main-dark)] font-[family-name:var(--font-display)]">
            ReelForge
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/dashboard" 
            ? pathname === "/dashboard" 
            : pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                item.highlight
                  ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                  : isActive
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                  : "text-[var(--color-text-muted-dark)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-main-dark)]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-[var(--color-border-dark)]">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center">
            <span className="text-[var(--color-primary)] font-medium">
              {(userName || userEmail || "U")[0].toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--color-text-main-dark)] truncate">
              {userName || "Kullanıcı"}
            </p>
            <p className="text-xs text-[var(--color-text-muted-dark)] truncate">
              {userEmail}
            </p>
          </div>
          <Link
            href="/api/auth/signout"
            className="p-2 text-[var(--color-text-muted-dark)] hover:text-[var(--color-primary)] transition-colors"
            aria-label="Çıkış yap"
          >
            <LogOut className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}