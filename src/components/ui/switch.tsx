"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps {
  id?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({ id, checked, onCheckedChange, disabled }: SwitchProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "relative inline-flex items-center cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <input
        id={id}
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        disabled={disabled}
      />
      <div
        className={cn(
          "w-11 h-6 rounded-full peer transition-colors",
          "bg-slate-200 dark:bg-slate-700",
          "peer-checked:bg-primary",
          "peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50"
        )}
      />
      <div
        className={cn(
          "absolute left-[2px] top-[2px] bg-white rounded-full h-5 w-5 transition-transform",
          "border border-slate-300",
          checked && "translate-x-full border-white"
        )}
      />
    </label>
  );
}
