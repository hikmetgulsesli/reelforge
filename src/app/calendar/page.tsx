"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from "@dnd-kit/core";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Header";
import {
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";
import { CalendarProvider, useCalendar } from "@/lib/calendar-context";
import { DraggableEvent } from "@/components/calendar/DraggableEvent";
import { DroppableDayCell, DroppableTimeSlot } from "@/components/calendar/DroppableCells";
import { CalendarEvent, CalendarView } from "@/types/calendar";

const DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

const HOURS = Array.from({ length: 24 }, (_, i) =>
  `${i.toString().padStart(2, "0")}:00`
);

function CalendarContent() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [today] = useState(() => new Date());
  const [view, setView] = useState<CalendarView>("month");
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);
  const { events, updateEvent, getEventsForDate } = useCalendar();

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const navigateDay = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const draggedEvent = event.active.data.current?.event as CalendarEvent;
    if (draggedEvent) {
      setActiveEvent(draggedEvent);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveEvent(null);

    if (!over) return;

    const draggedEvent = active.data.current?.event as CalendarEvent;
    if (!draggedEvent) return;

    const overData = over.data.current;
    if (!overData) return;

    // Handle drop on day cell (month view)
    if (over.id.toString().startsWith("day-")) {
      const newDate = overData.date as Date;
      const updatedEvent: CalendarEvent = {
        ...draggedEvent,
        date: newDate,
      };
      updateEvent(updatedEvent);
    }

    // Handle drop on time slot (week/day view)
    if (over.id.toString().startsWith("slot-")) {
      const newDate = overData.date as Date;
      const newTime = overData.time as string;
      const updatedEvent: CalendarEvent = {
        ...draggedEvent,
        date: newDate,
        time: newTime,
      };
      updateEvent(updatedEvent);
    }
  };

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-[var(--surface)]/50" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday =
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

      days.push(
        <DroppableDayCell key={day} date={date} isToday={isToday}>
          <span
            className={`text-sm ${
              isToday
                ? "text-[var(--color-primary)] font-bold"
                : "text-white"
            }`}
          >
            {day}
          </span>
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 3).map((event) => (
              <DraggableEvent key={event.id} event={event} isCompact />
            ))}
            {dayEvents.length > 3 && (
              <span className="text-xs text-[var(--text-muted)]">
                +{dayEvents.length - 3} daha
              </span>
            )}
          </div>
        </DroppableDayCell>
      );
    }

    return days;
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });

    return (
      <div className="flex flex-col">
        {/* Day headers */}
        <div className="grid grid-cols-8 gap-px bg-[var(--border)]">
          <div className="bg-[var(--surface)] p-3" />
          {weekDays.map((date, i) => {
            const isToday =
              date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear();
            return (
              <div
                key={i}
                className={`bg-[var(--surface)] p-3 text-center ${
                  isToday ? "text-[var(--color-primary)] font-bold" : "text-white"
                }`}
              >
                <div className="text-sm">{DAYS[i]}</div>
                <div className="text-lg">{date.getDate()}</div>
              </div>
            );
          })}
        </div>

        {/* Time slots */}
        <div className="flex-1 overflow-y-auto">
          {HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-8 gap-px bg-[var(--border)]">
              <div className="bg-[var(--surface)] p-2 text-xs text-[var(--text-muted)] text-right">
                {hour}
              </div>
              {weekDays.map((date) => {
                const slotEvents = events.filter(
                  (e) =>
                    e.date.getDate() === date.getDate() &&
                    e.date.getMonth() === date.getMonth() &&
                    e.date.getFullYear() === date.getFullYear() &&
                    e.time.startsWith(hour.split(":")[0])
                );
                return (
                  <DroppableTimeSlot key={`${date}-${hour}`} date={date} time={hour}>
                    <div className="space-y-1">
                      {slotEvents.map((event) => (
                        <DraggableEvent key={event.id} event={event} isCompact />
                      ))}
                    </div>
                  </DroppableTimeSlot>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    return (
      <div className="flex flex-col">
        <div className="p-4 bg-[var(--surface)] border-b border-[var(--border)]">
          <h3 className="text-xl font-bold text-white">
            {currentDate.toLocaleDateString("tr-TR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {HOURS.map((hour) => {
            const slotEvents = events.filter(
              (e) =>
                e.date.getDate() === currentDate.getDate() &&
                e.date.getMonth() === currentDate.getMonth() &&
                e.date.getFullYear() === currentDate.getFullYear() &&
                e.time.startsWith(hour.split(":")[0])
            );
            return (
              <div key={hour} className="grid grid-cols-[80px_1fr] gap-px bg-[var(--border)]">
                <div className="bg-[var(--surface)] p-3 text-sm text-[var(--text-muted)] text-right border-r border-[var(--border)]">
                  {hour}
                </div>
                <DroppableTimeSlot date={currentDate} time={hour}>
                  <div className="space-y-2">
                    {slotEvents.map((event) => (
                      <DraggableEvent key={event.id} event={event} />
                    ))}
                  </div>
                </DroppableTimeSlot>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const navigate = (direction: number) => {
    switch (view) {
      case "month":
        navigateMonth(direction);
        break;
      case "week":
        navigateWeek(direction);
        break;
      case "day":
        navigateDay(direction);
        break;
    }
  };

  const getViewTitle = () => {
    switch (view) {
      case "month":
        return `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
      case "week":
        const startOfWeek = new Date(currentDate);
        const dayOfWeek = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString("tr-TR", { day: "numeric", month: "short" })} - ${endOfWeek.toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}`;
      case "day":
        return currentDate.toLocaleDateString("tr-TR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <DashboardLayout>
        <Header title="İçerik Takvimi" />
        <div className="flex-1 overflow-hidden flex flex-col p-6">
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] flex flex-col h-full overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <h2 className="text-xl font-bold text-white font-[family-name:var(--font-display)] min-w-[280px] text-center">
                  {getViewTitle()}
                </h2>
                <button
                  onClick={() => navigate(1)}
                  className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* View switcher */}
                <div className="flex items-center bg-[var(--background)] rounded-lg p-1">
                  <button
                    onClick={() => setView("month")}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      view === "month"
                        ? "bg-[var(--color-primary)] text-white"
                        : "text-[var(--text-muted)] hover:text-white"
                    }`}
                  >
                    Ay
                  </button>
                  <button
                    onClick={() => setView("week")}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      view === "week"
                        ? "bg-[var(--color-primary)] text-white"
                        : "text-[var(--text-muted)] hover:text-white"
                    }`}
                  >
                    Hafta
                  </button>
                  <button
                    onClick={() => setView("day")}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      view === "day"
                        ? "bg-[var(--color-primary)] text-white"
                        : "text-[var(--text-muted)] hover:text-white"
                    }`}
                  >
                    Gün
                  </button>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors">
                  <PlusCircle className="w-5 h-5" />
                  Yeni Planlama
                </button>
              </div>
            </div>

            {/* Calendar Content */}
            <div className="flex-1 overflow-hidden">
              {view === "month" && (
                <>
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-px bg-[var(--border)]">
                    {DAYS.map((day) => (
                      <div
                        key={day}
                        className="bg-[var(--surface)] p-3 text-center text-sm font-medium text-[var(--text-muted)]"
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-px bg-[var(--border)] overflow-y-auto">
                    {renderMonthView()}
                  </div>
                </>
              )}

              {view === "week" && renderWeekView()}
              {view === "day" && renderDayView()}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mt-4 bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4">
            <h3 className="text-lg font-bold text-white mb-3">Yaklaşan Planlamalar</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {events
                .filter((e) => e.date >= new Date())
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 5)
                .map((event) => (
                  <DraggableEvent key={event.id} event={event} />
                ))}
              {events.filter((e) => e.date >= new Date()).length === 0 && (
                <p className="text-[var(--text-muted)] text-sm">
                  Yaklaşan planlama bulunmuyor.
                </p>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* Drag Overlay */}
      <DragOverlay dropAnimation={dropAnimation}>
        {activeEvent ? (
          <div className="flex items-center gap-2 p-2 rounded-lg border-2 border-[var(--color-primary)] bg-[var(--surface)] shadow-2xl opacity-90">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/20 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">{activeEvent.title}</p>
              <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {activeEvent.time}
              </p>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default function CalendarPage() {
  return (
    <CalendarProvider>
      <CalendarContent />
    </CalendarProvider>
  );
}
