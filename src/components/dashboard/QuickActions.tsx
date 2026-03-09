"use client";

import Link from "next/link";
import { Plus, Video, BarChart3, ShoppingCart } from "lucide-react";

const quickActions = [
  {
    label: "Yeni Video",
    href: "/dashboard/create",
    icon: Plus,
    primary: true,
  },
  {
    label: "Kütüphaneye Göz At",
    href: "/dashboard/library",
    icon: Video,
    primary: false,
  },
  {
    label: "Analizleri Görüntüle",
    href: "/dashboard/analytics",
    icon: BarChart3,
    primary: false,
  },
  {
    label: "Kredi Satın Al",
    href: "/pricing",
    icon: ShoppingCart,
    primary: false,
  },
];

export function QuickActions() {
  return (
    <div className="col-span-1 lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
      {quickActions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.href}
            href={action.href}
            className={`flex flex-col items-center justify-center gap-3 rounded-2xl p-6 transition-all group ${
              action.primary
                ? "bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/20"
                : "bg-[var(--color-surface-dark)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-surface-hover)]"
            }`}
          >
            <div
              className={`size-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${
                action.primary
                  ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)]"
                  : "bg-[var(--color-surface-hover)] text-[var(--color-secondary)]"
              }`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <span
              className={`text-sm font-medium ${
                action.primary
                  ? "text-white"
                  : "text-[var(--color-text-muted)] group-hover:text-white transition-colors"
              }`}
            >
              {action.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}