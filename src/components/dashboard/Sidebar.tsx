"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";

interface SidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  credits?: number;
  plan?: string;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "home" },
  { href: "/dashboard/videos", label: "Videolarım", icon: "video" },
  { href: "/dashboard/create", label: "Video Oluştur", icon: "plus" },
  { href: "/dashboard/series", label: "Seriler", icon: "folder" },
  { href: "/dashboard/calendar", label: "Takvim", icon: "calendar" },
  { href: "/dashboard/analytics", label: "Analizler", icon: "chart" },
  { href: "/dashboard/niche", label: "Niş Analizi", icon: "target" },
  { href: "/dashboard/ab-tests", label: "A/B Testler", icon: "test" },
];

const settingsItems = [
  { href: "/dashboard/settings", label: "Genel", icon: "settings" },
  { href: "/dashboard/settings/profile", label: "Profil", icon: "user" },
  { href: "/dashboard/settings/account", label: "Hesap", icon: "account" },
  { href: "/dashboard/settings/notifications", label: "Bildirimler", icon: "bell" },
  { href: "/dashboard/settings/billing", label: "Faturalama", icon: "card" },
];

const icons: Record<string, React.ReactNode> = {
  home: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  video: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  plus: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  folder: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  chart: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  target: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  test: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  user: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  account: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  bell: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  card: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  menu: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
};

export function Sidebar({ user, credits = 3, plan = "Free" }: SidebarProps) {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const isSettingsActive = pathname.startsWith("/dashboard/settings");

  const renderNavItem = (item: { href: string; label: string; icon: string }) => {
    const isActive = pathname === item.href || 
      (item.href !== "/dashboard" && pathname.startsWith(item.href));
    
    return (
      <li key={item.href}>
        <Link
          href={item.href}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? "bg-[var(--color-primary)] text-white"
              : "text-[var(--color-text-muted-dark)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-main-dark)]"
          }`}
          aria-current={isActive ? "page" : undefined}
        >
          {icons[item.icon]}
          {item.label}
        </Link>
      </li>
    );
  };

  const renderMobileNavItem = (item: { href: string; label: string; icon: string }) => {
    const isActive = pathname === item.href || 
      (item.href !== "/dashboard" && pathname.startsWith(item.href));
    
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${
          isActive
            ? "text-[var(--color-primary)]"
            : "text-[var(--color-text-muted-dark)]"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        {icons[item.icon]}
        <span className="text-xs">{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileDrawerOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-lg bg-[var(--color-surface-dark)] border border-[var(--color-border-dark)] text-[var(--color-text-muted-dark)] hover:text-white transition-colors"
        aria-label="Menüyü aç"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Drawer Backdrop */}
      {mobileDrawerOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out bg-[var(--color-surface-dark)] border-r border-[var(--color-border-dark)] ${
          mobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigasyon menüsü"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--color-border-dark)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 text-[var(--color-primary)]">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
              </svg>
            </div>
            <span className="text-xl font-bold text-[var(--color-text-main-dark)] font-[family-name:var(--font-display)]">
              ReelForge
            </span>
          </div>
          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="p-2 rounded-lg text-[var(--color-text-muted-dark)] hover:bg-[var(--color-surface-hover)] hover:text-white transition-colors"
            aria-label="Menüyü kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map(renderNavItem)}
            
            {/* Collapsible Settings Section */}
            <li>
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left ${
                  isSettingsActive
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text-muted-dark)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-main-dark)]"
                }`}
                aria-expanded={settingsOpen}
                aria-controls="mobile-settings-submenu"
              >
                <div className="flex items-center gap-3">
                  {icons.settings}
                  Ayarlar
                </div>
                {settingsOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              {settingsOpen && (
                <ul id="mobile-settings-submenu" className="ml-4 mt-1 space-y-1">
                  {settingsItems.map(renderNavItem)}
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-[var(--color-surface-dark)] border-r border-[var(--color-border-dark)] fixed left-0 top-0">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-[var(--color-border-dark)]">
          <div className="w-8 h-8 text-[var(--color-primary)]">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
            </svg>
          </div>
          <span className="text-xl font-bold text-[var(--color-text-main-dark)] font-[family-name:var(--font-display)]">
            ReelForge
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map(renderNavItem)}
            
            {/* Collapsible Settings Section */}
            <li>
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left ${
                  isSettingsActive
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text-muted-dark)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-main-dark)]"
                }`}
                aria-expanded={settingsOpen}
                aria-controls="settings-submenu"
              >
                <div className="flex items-center gap-3">
                  {icons.settings}
                  Ayarlar
                </div>
                {settingsOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              {settingsOpen && (
                <ul id="settings-submenu" className="ml-4 mt-1 space-y-1">
                  {settingsItems.map(renderNavItem)}
                </ul>
              )}
            </li>
          </ul>
        </nav>

        {/* User Info */}
        <div className="px-4 py-4 border-t border-[var(--color-border-dark)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold">
              {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-text-main-dark)] truncate">
                {user?.name || user?.email || "Kullanıcı"}
              </p>
              <p className="text-xs text-[var(--color-text-muted-dark)]">
                {plan} Plan • {credits} Kredi
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-surface-dark)] border-t border-[var(--color-border-dark)] z-30" role="navigation" aria-label="Mobil navigasyon">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 5).map(renderMobileNavItem)}
        </div>
      </nav>
    </>
  );
}