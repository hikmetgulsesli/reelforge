"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, User, LogOut, Settings, Sparkles, Search } from "lucide-react";

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  credits?: number;
  title?: string;
}

export function Header({ user, credits = 3, title }: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between border-b border-[var(--color-surface-hover)] px-6 py-4 bg-[var(--color-background-dark)]/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {title && (
          <h2 className="text-white text-2xl font-display font-bold hidden sm:block">
            {title}
          </h2>
        )}
      </div>
      <div className="flex items-center gap-4 sm:gap-6 flex-1 justify-end">
        {/* Search */}
        <div className="relative hidden md:block max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-[var(--color-text-muted-dark)]" />
          </div>
          <input
            type="text"
            placeholder="Proje veya video ara..."
            className="block w-full pl-10 pr-3 py-2 border border-[var(--color-surface-hover)] rounded-xl leading-5 bg-[var(--color-surface-dark)] text-[var(--color-text-main-dark)] placeholder-[var(--color-text-muted-dark)] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-colors"
          />
        </div>

        {/* Credit Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">{credits} Kredi</span>
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-full text-[var(--color-text-muted-dark)] hover:bg-[var(--color-surface-hover)] hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-secondary ring-2 ring-[var(--color-background-dark)]" />
        </button>

        {/* User Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-full p-1 hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="h-9 w-9 rounded-full object-cover border border-[var(--color-surface-hover)]"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
            )}
          </button>
          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-[var(--color-surface-dark)] border border-[var(--color-surface-hover)] rounded-lg shadow-lg overflow-hidden z-50">
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
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-muted-dark)] hover:bg-[var(--color-surface-hover)] hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                  Çıkış Yap
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}