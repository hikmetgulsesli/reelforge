"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, PlusCircle, Video, Youtube, Instagram, X, Clock } from "lucide-react";

const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

const DAYS = [
  "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"
];

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: Date;
  platform: string;
  time: string;
}

interface DailyViewProps {
  currentDate: Date;
  today: Date;
  events: Event[];
  onDateChange: (date: Date) => void;
  onTodayClick: () => void;
  onEventClick: (event: Event) => void;
  onEmptyCellClick: (hour: number) => void;
  getPlatformIcon: (platform: string, size?: "sm" | "md") => React.ReactNode;
}

export function DailyView({
  currentDate,
  today,
  events,
  onDateChange,
  onTodayClick,
  onEventClick,
  onEmptyCellClick,
  getPlatformIcon,
}: DailyViewProps) {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  // Update current time every minute
  useState(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  });

  const isToday = useMemo(() => {
    return (
      currentDate.getDate() === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  }, [currentDate, today]);

  const formattedDate = useMemo(() => {
    const day = currentDate.getDate();
    const month = MONTHS[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    const dayName = DAYS[currentDate.getDay()];
    return `${day} ${month} ${year}, ${dayName}`;
  }, [currentDate]);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForHour = (hour: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      const eventHour = parseInt(event.time.split(":")[0], 10);
      return (
        eventDate.getDate() === currentDate.getDate() &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear() &&
        eventHour === hour
      );
    });
  };

  const navigateDay = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    onDateChange(newDate);
  };

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  // Calculate current time indicator position
  const currentTimePosition = useMemo(() => {
    if (!isToday) return null;
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    return hours * 60 + minutes; // Position in minutes from midnight
  }, [currentTime, isToday]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateDay(-1)}
            className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
            aria-label="Önceki gün"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-xl font-bold text-white font-[family-name:var(--font-display)]">
            {formattedDate}
          </h2>
          <button
            onClick={() => navigateDay(1)}
            className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
            aria-label="Sonraki gün"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          {!isToday && (
            <button
              onClick={onTodayClick}
              className="px-4 py-2 rounded-lg border border-[var(--border)] text-white hover:bg-[var(--color-surface-hover)] transition-colors text-sm font-medium"
            >
              Bugün
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors">
            <PlusCircle className="w-5 h-5" />
            Yeni Planlama
          </button>
        </div>
      </div>

      {/* Time Grid */}
      <div className="flex-1 overflow-y-auto border border-[var(--border)] rounded-lg">
        <div className="relative">
          {/* Current time indicator */}
          {isToday && currentTimePosition !== null && (
            <div
              className="absolute left-0 right-0 z-10 pointer-events-none"
              style={{ top: `${(currentTimePosition / 1440) * 100}%` }}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 -ml-1" />
                <div className="flex-1 h-0.5 bg-red-500" />
              </div>
            </div>
          )}

          {/* Hour rows */}
          {hours.map((hour) => {
            const hourEvents = getEventsForHour(hour);
            const isCurrentHour = isToday && currentTime.getHours() === hour;

            return (
              <div
                key={hour}
                className={`flex border-b border-[var(--border)] last:border-b-0 min-h-[80px] ${
                  isCurrentHour ? "bg-[var(--color-primary)]/5" : ""
                }`}
              >
                {/* Time label */}
                <div className="w-20 flex-shrink-0 p-3 border-r border-[var(--border)] bg-[var(--surface)]">
                  <span className={`text-sm ${isCurrentHour ? "text-[var(--color-primary)] font-bold" : "text-[var(--text-muted)]"}`}>
                    {formatHour(hour)}
                  </span>
                </div>

                {/* Event cell */}
                <div
                  className="flex-1 p-2 cursor-pointer hover:bg-[var(--color-surface-hover)]/30 transition-colors relative"
                  onClick={() => onEmptyCellClick(hour)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      onEmptyCellClick(hour);
                    }
                  }}
                  aria-label={`${formatHour(hour)} - Boş slot`}
                >
                  {hourEvents.length > 0 ? (
                    <div className="space-y-2">
                      {hourEvents.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 cursor-pointer hover:bg-[var(--color-primary)]/30 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick(event);
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.stopPropagation();
                              onEventClick(event);
                            }
                          }}
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            {getPlatformIcon(event.platform, "md")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium truncate">
                              {event.title}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                              <Clock className="w-3 h-3" />
                              <span>{event.time}</span>
                            </div>
                            {event.description && (
                              <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">
                                {event.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-[var(--text-muted)] opacity-0 hover:opacity-100 transition-opacity">
                      <PlusCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
