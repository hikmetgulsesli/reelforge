"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CalendarEvent } from "@/types/calendar";
import { Youtube, Video, Instagram, FileVideo } from "lucide-react";

interface DraggableEventProps {
  event: CalendarEvent;
  isCompact?: boolean;
}

export function DraggableEvent({ event, isCompact = false }: DraggableEventProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
    data: { event },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const getPlatformIcon = () => {
    switch (event.platform) {
      case "youtube":
        return <Youtube className="w-3 h-3 text-red-500 flex-shrink-0" />;
      case "tiktok":
        return <Video className="w-3 h-3 text-pink-500 flex-shrink-0" />;
      case "instagram":
        return <Instagram className="w-3 h-3 text-purple-500 flex-shrink-0" />;
      default:
        return <FileVideo className="w-3 h-3 text-gray-400 flex-shrink-0" />;
    }
  };

  if (isCompact) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={`
          flex items-center gap-1 px-1.5 py-0.5 text-xs 
          bg-[var(--color-primary)]/20 text-white 
          cursor-grab active:cursor-grabbing
          transition-all duration-150
          ${isDragging 
            ? "opacity-50 scale-105 shadow-lg ring-2 ring-[var(--color-primary)] z-50" 
            : "hover:bg-[var(--color-primary)]/30"
          }
        `}
      >
        {getPlatformIcon()}
        <span className="truncate">{event.title}</span>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        flex items-center gap-2 p-2 rounded-lg border border-[var(--border)] 
        bg-[var(--background)] cursor-grab active:cursor-grabbing
        transition-all duration-200
        ${isDragging 
          ? "opacity-60 scale-105 shadow-2xl ring-2 ring-[var(--color-primary)] z-50" 
          : "hover:border-[var(--color-primary)]/50 hover:bg-[var(--surface)]"
        }
      `}
    >
      <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0">
        {getPlatformIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm truncate">{event.title}</p>
        <p className="text-xs text-[var(--text-muted)]">
          {event.date.toLocaleDateString("tr-TR")} - {event.time}
        </p>
      </div>
    </div>
  );
}
