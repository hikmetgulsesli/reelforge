"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  credits?: number;
  plan?: string;
  title?: string;
}

export function DashboardLayout({
  children,
  user,
  credits,
  plan,
  title,
}: DashboardLayoutProps) {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col lg:flex-row overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar user={user} credits={credits} plan={plan} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 bg-[var(--color-background-dark)]">
        {/* Desktop Header */}
        <div className="hidden lg:block">
          <Header user={user} credits={credits} title={title} />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:mt-0 mt-16 mb-16 lg:mb-0">
          {children}
        </main>
      </div>
    </div>
  );
}