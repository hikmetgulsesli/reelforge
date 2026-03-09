"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  PlusCircle,
  Video,
  FileVideo,
  Calendar,
  BarChart3,
  FlaskConical,
  TrendingUp,
  Settings,
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LogOut,
  User,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  title?: string;
  items: NavItem[];
  collapsible?: boolean;
  defaultOpen?: boolean;
}

const mainNavSections: NavSection[] = [
  {
    items: [
      { name: "Ana Panel", href: "/dashboard", icon: Home },
      { name: "Yeni Video", href: "/dashboard/create", icon: PlusCircle },
      { name: "Video Kütüphanesi", href: "/dashboard/library", icon: FileVideo },
      { name: "Seriler", href: "/dashboard/series", icon: Video },
      { name: "İçerik Takvimi", href: "/dashboard/calendar", icon: Calendar },
    ],
  },
  {
    items: [
      { name: "Analitik", href: "/dashboard/analytics", icon: BarChart3 },
      { name: "A/B Testleri", href: "/dashboard/ab-tests", icon: FlaskConical },
      { name: "Niş Analizi", href: "/dashboard/niche", icon: TrendingUp },
    ],
  },
];

const settingsItems: NavItem[] = [
  { name: "Profil Ayarları", href: "/dashboard/settings/profile", icon: User },
  { name: "Hesap", href: "/dashboard/settings/account", icon: Settings },
  { name: "Faturalama", href: "/dashboard/settings/billing", icon: CreditCard },
];

interface SidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  credits?: number;
  plan?: string;
}

export function Sidebar({ user, credits = 3, plan = "Free" }: SidebarProps) {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    return (
      <Link
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
          active
            ? "bg-primary/20 text-primary font-medium"
            : "text-[var(--color-text-muted-dark)] hover:bg-[var(--color-surface-hover)] hover:text-white"
        )}
      >
        <Icon className="w-5 h-5" />
        <span className="text-sm">{item.name}</span>
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full min-h-[700px] justify-between p-4">
      <div className="flex flex-col gap-8">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 px-2">
          <div className="bg-gradient-to-tr from-primary to-secondary aspect-square rounded-xl flex items-center justify-center size-10">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-white text-xl font-display font-bold leading-normal">
            ReelForge
          </h1>
        </Link>

        {/* Main Navigation */}
        <div className="flex flex-col gap-2">
          {mainNavSections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              {section.title && (
                <span className="px-3 text-xs font-medium text-[var(--color-text-muted-dark)] uppercase tracking-wider mb-1">
                  {section.title}
                </span>
              )}
              {section.items.map((item) => (
                <NavItemComponent key={item.href} item={item} />
              ))}
            </div>
          ))}

          {/* Settings Section (Collapsible) */}
          <div className="mt-2">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-colors",
                pathname.startsWith("/dashboard/settings")
                  ? "bg-primary/20 text-primary font-medium"
                  : "text-[var(--color-text-muted-dark)] hover:bg-[var(--color-surface-hover)] hover:text-white"
              )}
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm flex-1 text-left">Ayarlar</span>
              {settingsOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            {settingsOpen && (
              <div className="ml-4 mt-1 flex flex-col gap-1">
                {settingsItems.map((item) => (
                  <NavItemComponent key={item.href} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upgrade Card */}
      <div className="mt-8">
        <div className="rounded-xl bg-[var(--color-surface-hover)] p-4 border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-5 h-5 text-secondary" />
            <p className="text-white text-sm font-medium">{plan} Plan</p>
          </div>
          <p className="text-[var(--color-text-muted-dark)] text-xs mb-4">
            Gelişmiş AI özellikleri ve daha hızlı render süreleri.
          </p>
          <Link
            href="/dashboard/pricing"
            className="block w-full py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors text-center"
          >
            Planı Yükselt
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-64 border-r border-[var(--color-surface-hover)] bg-[var(--color-surface-dark)] flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[var(--color-surface-dark)] border border-[var(--color-surface-hover)] text-white"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-[var(--color-surface-dark)] border-r border-[var(--color-surface-hover)] transform transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg text-[var(--color-text-muted-dark)] hover:text-white"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent />
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-surface-dark)] border-t border-[var(--color-surface-hover)] z-30">
        <div className="flex items-center justify-around py-2">
          <Link
            href="/dashboard"
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1",
              pathname === "/dashboard" ? "text-primary" : "text-[var(--color-text-muted-dark)]"
            )}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Ana Panel</span>
          </Link>
          <Link
            href="/dashboard/create"
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1",
              pathname.startsWith("/dashboard/create") ? "text-primary" : "text-[var(--color-text-muted-dark)]"
            )}
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-[10px]">Yeni Video</span>
          </Link>
          <Link
            href="/dashboard/library"
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1",
              pathname.startsWith("/dashboard/library") ? "text-primary" : "text-[var(--color-text-muted-dark)]"
            )}
          >
            <FileVideo className="w-5 h-5" />
            <span className="text-[10px]">Kütüphane</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1",
              pathname.startsWith("/dashboard/settings") ? "text-primary" : "text-[var(--color-text-muted-dark)]"
            )}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px]">Ayarlar</span>
          </Link>
        </div>
      </div>

      {/* Header for Mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[var(--color-surface-dark)]/80 backdrop-blur-md border-b border-[var(--color-surface-hover)] z-20 px-4 py-3">
        <div className="flex items-center justify-end gap-4 ml-14">
          {/* Credit Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">{credits}</span>
          </div>

          {/* Notification Bell */}
          <button className="relative p-2 rounded-full text-[var(--color-text-muted-dark)] hover:bg-[var(--color-surface-hover)] hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-secondary ring-2 ring-[var(--color-background-dark)]" />
          </button>

          {/* User Avatar */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-full p-0.5 hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="h-8 w-8 rounded-full object-cover border border-[var(--color-surface-hover)]"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
              )}
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[var(--color-surface-dark)] border border-[var(--color-surface-hover)] rounded-lg shadow-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-[var(--color-surface-hover)]">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.name || "Kullanıcı"}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted-dark)] truncate">
                    {user?.email}
                  </p>
                </div>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-muted-dark)] hover:bg-[var(--color-surface-hover)] hover:text-white"
                >
                  <Settings className="w-4 h-4" />
                  Ayarlar
                </Link>
                <Link
                  href="/api/auth/signout"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-muted-dark)] hover:bg-[var(--color-surface-hover)] hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                  Çıkış Yap
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}