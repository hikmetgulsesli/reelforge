"use client";

import { useAppStore } from "../../lib/store";
import { Search, Bell, ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { notificationCount } = useAppStore();
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4 bg-[var(--background)]/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-white text-2xl font-bold font-[family-name:var(--font-display)] hidden sm:block">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-4 sm:gap-6 flex-1 justify-end">
        {/* Search */}
        <div className="relative hidden md:block max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-[var(--text-muted)]" />
          </div>
          <input
            className="block w-full pl-10 pr-3 py-2 border border-[var(--border)] rounded-xl leading-5 bg-[var(--surface)] text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm transition-colors"
            placeholder="Proje veya video ara..."
            type="text"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-full text-[var(--text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-[var(--secondary)] ring-2 ring-[var(--background)]" />
          )}
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-full p-1 hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--secondary)] flex items-center justify-center text-sm font-medium text-white">
              {session?.user?.name?.[0] || session?.user?.email?.[0] || "U"}
            </div>
            <ChevronDown className="w-4 h-4 text-[var(--text-muted)] hidden sm:block" />
          </button>
        </div>
      </div>
    </header>
  );
}