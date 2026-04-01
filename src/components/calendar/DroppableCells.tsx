"use client";

import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

interface DroppableDayCellProps {
  date: Date;
  children: ReactNode;
  isToday?: boolean;
  className?: string;
}

export function DroppableDayCell({
  date,
  children,
  isToday = false,
  className = "",
}: DroppableDayCellProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `day-${date.toISOString().split("T")[0]}`,
    data: { date },
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        h-24 border border-[var(--border)] p-2 
        transition-all duration-150
        ${isToday ? "bg-[var(--color-primary)]/10" : "bg-[var(--surface)]"}
        ${isOver 
          ? "bg-[var(--color-primary)]/20 ring-2 ring-[var(--color-primary)] ring-inset shadow-[inset_0_0_20px_rgba(224,36,133,0.2)]" 
          : "hover:bg-[var(--color-surface-hover)]/50"
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface DroppableTimeSlotProps {
  date: Date;
  time: string;
  children: ReactNode;
  className?: string;
}

export function DroppableTimeSlot({
  date,
  time,
  children,
  className = "",
}: DroppableTimeSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `slot-${date.toISOString().split("T")[0]}-${time}`,
    data: { date, time },
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[60px] border-b border-[var(--border)] p-2
        transition-all duration-150
        ${isOver 
          ? "bg-[var(--color-primary)]/20 ring-2 ring-[var(--color-primary)] ring-inset shadow-[inset_0_0_20px_rgba(224,36,133,0.2)]" 
          : "hover:bg-[var(--color-surface-hover)]/30"
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}
