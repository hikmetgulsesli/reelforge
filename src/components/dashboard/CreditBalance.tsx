"use client";

import { Coins } from "lucide-react";

interface CreditBalanceProps {
  totalCredits: number;
  usedCredits: number;
  loading?: boolean;
}

export function CreditBalance({ totalCredits, usedCredits, loading }: CreditBalanceProps) {
  const remainingCredits = totalCredits - usedCredits;
  const usagePercentage = totalCredits > 0 ? (usedCredits / totalCredits) * 100 : 0;
  
  // Calculate stroke dash for circular progress
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (usagePercentage / 100) * circumference;

  if (loading) {
    return (
      <div className="col-span-1 bg-[var(--color-surface-dark)] rounded-2xl p-6 border border-[var(--color-surface-hover)] flex flex-col items-center justify-center relative overflow-hidden animate-pulse">
        <div className="absolute top-0 right-0 p-4">
          <div className="w-10 h-10 bg-[var(--color-surface-hover)] rounded-lg" />
        </div>
        <div className="h-4 w-24 bg-[var(--color-surface-hover)] rounded mb-4 self-start" />
        <div className="size-32 rounded-full bg-[var(--color-surface-hover)] mb-2" />
        <div className="h-3 w-32 bg-[var(--color-surface-hover)] rounded mt-2" />
      </div>
    );
  }

  return (
    <div className="col-span-1 bg-[var(--color-surface-dark)] rounded-2xl p-6 border border-[var(--color-surface-hover)] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <Coins className="w-10 h-10 text-[var(--color-text-muted)]/50" />
      </div>
      
      <h3 className="text-[var(--color-text-muted)] text-sm font-medium mb-4 self-start">
        Kredi Bakiyesi
      </h3>
      
      <div className="relative flex items-center justify-center size-32 mb-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            className="text-[var(--color-surface-hover)]"
            cx="50"
            cy="50"
            fill="transparent"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
          />
          <circle
            className="text-[var(--color-primary)]"
            cx="50"
            cy="50"
            fill="transparent"
            r={radius}
            stroke="currentColor"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-display font-bold text-white">
            {remainingCredits}
          </span>
        </div>
      </div>
      
      <p className="text-xs text-[var(--color-text-muted)] mt-2">
        Bu ay %{Math.round(usagePercentage)} kullanıldı
      </p>
    </div>
  );
}