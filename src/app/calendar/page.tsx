"use client";
export const dynamic = "force-dynamic";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Header } from "../../components/layout/Header";
import { ChevronLeft, ChevronRight, PlusCircle, Video, Youtube, Instagram } from "lucide-react";
import { useState, useEffect } from "react";

const DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    setToday(new Date());
  }, []);

  // Sample events
  const events = [
    { id: "1", title: "Tech Tips #5", date: today, platform: "youtube", time: "14:00" },
    { id: "2", title: "Motivasyon Günü", date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15), platform: "tiktok", time: "18:00" },
    { id: "3", title: "Ürün İnceleme", date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20), platform: "instagram", time: "12:00" },
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; // Adjust for Monday start
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const getEventsForDay = (day: number) => {
    return events.filter(
      (e) =>
        e.date.getDate() === day &&
        e.date.getMonth() === currentDate.getMonth() &&
        e.date.getFullYear() === currentDate.getFullYear()
    );
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "youtube":
        return <Youtube className="w-3 h-3 text-red-500" />;
      case "tiktok":
        return <Video className="w-3 h-3 text-pink-500" />;
      case "instagram":
        return <Instagram className="w-3 h-3 text-purple-500" />;
      default:
        return null;
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDay(day);
      const isToday = day === today.getDate() &&
                      currentDate.getMonth() === today.getMonth() &&
                      currentDate.getFullYear() === today.getFullYear();

      days.push(
        <div
          key={day}
          className={`h-24 border border-[var(--border)] p-2 cursor-pointer hover:bg-[var(--color-surface-hover)]/50 transition-colors ${
            isToday ? "bg-[var(--color-primary)]/10" : ""
          }`}
        >
          <span className={`text-sm ${isToday ? "text-[var(--color-primary)] font-bold" : "text-white"}`}>
            {day}
          </span>
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-1 px-1 py-0.5 rounded text-xs bg-[var(--color-primary)]/20 text-white truncate"
              >
                {getPlatformIcon(event.platform)}
                <span className="truncate">{event.title}</span>
              </div>
            ))}
            {dayEvents.length > 2 && (
              <span className="text-xs text-[var(--text-muted)]">+{dayEvents.length - 2} daha</span>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <DashboardLayout>
      <Header title="İçerik Takvimi" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-xl font-bold text-white font-[family-name:var(--font-display)]">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors">
              <PlusCircle className="w-5 h-5" />
              Yeni Planlama
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-[var(--border)] rounded-lg overflow-hidden">
            {/* Day Headers */}
            {DAYS.map((day) => (
              <div
                key={day}
                className="bg-[var(--surface)] p-3 text-center text-sm font-medium text-[var(--text-muted)]"
              >
                {day}
              </div>
            ))}
            {/* Calendar Days */}
            {renderCalendar()}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mt-6 bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6">
          <h3 className="text-lg font-bold text-white mb-4">Yaklaşan Planlamalar</h3>
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-4 p-3 rounded-lg border border-[var(--border)] bg-[var(--background)]"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/20 flex items-center justify-center">
                  {getPlatformIcon(event.platform)}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{event.title}</p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {event.date.toLocaleDateString("tr-TR")} - {event.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}