"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Home,
  Film,
  FolderOpen,
  BarChart3,
  Settings,
  Diamond,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Ana Panel", icon: Home, active: true },
  { href: "/dashboard/videos", label: "Projeler", icon: Film },
  { href: "/dashboard/library", label: "Kütüphane", icon: FolderOpen },
  { href: "/dashboard/analytics", label: "Analizler", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Ayarlar", icon: Settings },
];

export function Sidebar() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col w-full lg:w-64 border-r border-[var(--color-surface-hover)] bg-[var(--color-surface-dark)] flex-shrink-0">
      <div className="flex h-full min-h-[700px] flex-col justify-between p-4">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] aspect-square rounded-xl flex items-center justify-center size-10">
              <Film className="text-white w-5 h-5" />
            </div>
            <h1 className="text-white text-xl font-display font-bold leading-normal">
              ReelForge
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.active;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-medium"
                      : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="mt-8">
          {/* Plan Card */}
          <div className="rounded-xl bg-[var(--color-surface-hover)] p-4 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <Diamond className="w-5 h-5 text-[var(--color-secondary)]" />
              <p className="text-white text-sm font-medium">Pro Plan</p>
            </div>
            <p className="text-[var(--color-text-muted)] text-xs mb-4">
              Gelişmiş AI özellikleri ve daha hızlı render süreleri.
            </p>
            <Link
              href="/pricing"
              className="block w-full py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-lg text-sm font-medium transition-colors text-center"
            >
              Planı Yükselt
            </Link>
          </div>

          {/* User Section */}
          {session?.user && (
            <div className="mt-4 flex items-center gap-3 px-2">
              <div className="size-9 rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center overflow-hidden border border-[var(--color-surface-hover)]">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[var(--color-text-muted)] text-sm font-medium">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {session.user.name || session.user.email}
                </p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-white transition-colors"
                title="Çıkış Yap"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}