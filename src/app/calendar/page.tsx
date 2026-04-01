"use client";
export const dynamic = "force-dynamic";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Header } from "../../components/layout/Header";
import { DailyView } from "../../components/DailyView";
import { ChevronLeft, ChevronRight, PlusCircle, Video, Youtube, Instagram, Search, X, Filter, Calendar as CalendarIcon, Clock } from "lucide-react";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";

const DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: Date;
  platform: string;
  time: string;
}

type ViewMode = "month" | "day";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [today] = useState(() => new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalHour, setCreateModalHour] = useState<number | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Sample events with descriptions
  const events: Event[] = [
    { 
      id: "1", 
      title: "Tech Tips #5", 
      description: "Yeni teknoloji ürünlerinin incelemesi ve kullanıcı yorumları",
      date: today, 
      platform: "youtube", 
      time: "14:00" 
    },
    { 
      id: "2", 
      title: "Motivasyon Günü", 
      description: "Haftalık motivasyon konuşması ve hedef belirleme",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15), 
      platform: "tiktok", 
      time: "18:00" 
    },
    { 
      id: "3", 
      title: "Ürün İnceleme", 
      description: "Son çıkan akıllı telefonların detaylı karşılaştırması",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20), 
      platform: "instagram", 
      time: "12:00" 
    },
  ];

  // Filter events based on search query and date range
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = searchQuery.trim() === "" ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      
      let matchesDateRange = true;
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        matchesDateRange = matchesDateRange && eventDate >= start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchesDateRange = matchesDateRange && eventDate <= end;
      }
      
      return matchesSearch && matchesDateRange;
    });
  }, [events, searchQuery, startDate, endDate]);

  // Search results for dropdown (only when searching)
  const searchResults = useMemo(() => {
    if (searchQuery.trim() === "") return [];
    return events.filter((event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [events, searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  const clearAllFilters = () => {
    clearSearch();
    clearDateFilter();
  };

  const handleEventClick = useCallback((event: Event) => {
    setSelectedEvent(event);
    setShowSearchResults(false);
  }, []);

  const handleEmptyCellClick = useCallback((hour: number) => {
    setCreateModalHour(hour);
    setShowCreateModal(true);
  }, []);

  const handleTodayClick = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const formatEventDate = (date: Date) => {
    return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  };

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
    return filteredEvents.filter(
      (e) =>
        e.date.getDate() === day &&
        e.date.getMonth() === currentDate.getMonth() &&
        e.date.getFullYear() === currentDate.getFullYear()
    );
  };

  const getPlatformIcon = (platform: string, size: "sm" | "md" = "sm") => {
    const sizeClass = size === "md" ? "w-5 h-5" : "w-3 h-3";
    switch (platform) {
      case "youtube":
        return <Youtube className={`${sizeClass} text-red-500`} />;
      case "tiktok":
        return <Video className={`${sizeClass} text-pink-500`} />;
      case "instagram":
        return <Instagram className={`${sizeClass} text-purple-500`} />;
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
          onClick={() => {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
            setViewMode("day");
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
              setViewMode("day");
            }
          }}
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

  const hasActiveFilters = searchQuery.trim() !== "" || startDate !== "" || endDate !== "";

  return (
    <DashboardLayout>
      <Header title="İçerik Takvimi" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6">
          {/* View Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 bg-[var(--background)] rounded-lg p-1">
              <button
                onClick={() => setViewMode("month")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "month"
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--text-muted)] hover:text-white"
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                Aylık
              </button>
              <button
                onClick={() => setViewMode("day")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "day"
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--text-muted)] hover:text-white"
                }`}
              >
                <Clock className="w-4 h-4" />
                Günlük
              </button>
            </div>
          </div>

          {viewMode === "month" ? (
            <>
              {/* Calendar Header */}
              <div className="flex flex-col gap-4 mb-6">
                {/* Top Row: Navigation and Add Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
                      aria-label="Önceki ay"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <h2 className="text-xl font-bold text-white font-[family-name:var(--font-display)]">
                      {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
                      aria-label="Sonraki ay"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors">
                    <PlusCircle className="w-5 h-5" />
                    Yeni Planlama
                  </button>
                </div>

                {/* Search and Filter Row */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search Input */}
                  <div className="relative flex-1" ref={searchRef}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="w-4 h-4 text-[var(--text-muted)]" />
                    </div>
                    <input
                      className="block w-full pl-10 pr-10 py-2 border border-[var(--border)] rounded-lg leading-5 bg-[var(--background)] text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm transition-colors"
                      placeholder="Etkinlik ara..."
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSearchResults(true);
                      }}
                      onFocus={() => setShowSearchResults(true)}
                    />
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <X className="w-4 h-4 text-[var(--text-muted)] hover:text-white" />
                      </button>
                    )}

                    {/* Search Results Dropdown */}
                    {showSearchResults && searchQuery.trim() !== "" && (
                      <div className="absolute z-20 mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg max-h-60 overflow-auto">
                        {searchResults.length > 0 ? (
                          searchResults.map((event) => (
                            <button
                              key={event.id}
                              onClick={() => handleEventClick(event)}
                              className="w-full px-4 py-3 text-left hover:bg-[var(--color-surface-hover)] border-b border-[var(--border)] last:border-0 flex items-center gap-3"
                            >
                              {getPlatformIcon(event.platform, "md")}
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">{event.title}</p>
                                <p className="text-sm text-[var(--text-muted)]">
                                  {formatEventDate(event.date)} - {event.time}
                                </p>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-[var(--text-muted)] text-sm">
                            Sonuç bulunamadı
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Filter Toggle Button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      showFilters || startDate || endDate
                        ? "bg-[var(--color-primary)]/20 border-[var(--color-primary)] text-white"
                        : "border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:bg-[var(--color-surface-hover)]"
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">Filtrele</span>
                  </button>

                  {/* Clear All Filters */}
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--color-surface-hover)] transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span className="text-sm">Temizle</span>
                    </button>
                  )}
                </div>

                {/* Date Range Filter Panel */}
                {showFilters && (
                  <div className="flex flex-col sm:flex-row gap-3 p-3 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                    <div className="flex-1">
                      <label className="block text-xs text-[var(--text-muted)] mb-1">Başlangıç Tarihi</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="block w-full px-3 py-2 border border-[var(--border)] rounded-lg leading-5 bg-[var(--surface)] text-white focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-[var(--text-muted)] mb-1">Bitiş Tarihi</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="block w-full px-3 py-2 border border-[var(--border)] rounded-lg leading-5 bg-[var(--surface)] text-white focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                      />
                    </div>
                    {(startDate || endDate) && (
                      <div className="flex items-end">
                        <button
                          onClick={clearDateFilter}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--color-surface-hover)] transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span className="text-sm">Tarih Filtresini Temizle</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
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
            </>
          ) : (
            <DailyView
              currentDate={currentDate}
              today={today}
              events={filteredEvents}
              onDateChange={setCurrentDate}
              onTodayClick={handleTodayClick}
              onEventClick={handleEventClick}
              onEmptyCellClick={handleEmptyCellClick}
              getPlatformIcon={getPlatformIcon}
            />
          )}
        </div>

        {/* Filter Status */}
        {hasActiveFilters && viewMode === "month" && (
          <div className="mt-4 text-sm text-[var(--text-muted)]">
            {filteredEvents.length} etkinlik gösteriliyor
            {searchQuery && ` (arama: "${searchQuery}")`}
            {(startDate || endDate) && ` (tarih aralığı: ${startDate || "başlangıç"} - ${endDate || "bitiş"})`}
          </div>
        )}

        {/* Upcoming Events - Only show in month view */}
        {viewMode === "month" && (
          <div className="mt-6 bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6">
            <h3 className="text-lg font-bold text-white mb-4">Yaklaşan Planlamalar</h3>
            <div className="space-y-3">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className="w-full flex items-center gap-4 p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--color-surface-hover)] transition-colors text-left"
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
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-[var(--text-muted)]">
                  <p>Etkinlik bulunamadı</p>
                  {(searchQuery || startDate || endDate) && (
                    <button
                      onClick={clearAllFilters}
                      className="mt-2 text-[var(--color-primary)] hover:underline"
                    >
                      Filtreleri temizle
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Etkinlik Detayı</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[var(--color-primary)]/20 flex items-center justify-center">
                  {getPlatformIcon(selectedEvent.platform, "md")}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white">{selectedEvent.title}</h4>
                  <p className="text-sm text-[var(--text-muted)] capitalize">{selectedEvent.platform}</p>
                </div>
              </div>

              {selectedEvent.description && (
                <div className="p-4 bg-[var(--background)] rounded-lg">
                  <p className="text-xs text-[var(--text-muted)] mb-1">Açıklama</p>
                  <p className="text-white">{selectedEvent.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 p-4 bg-[var(--background)] rounded-lg">
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Tarih</p>
                  <p className="text-white font-medium">
                    {formatEventDate(selectedEvent.date)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Saat</p>
                  <p className="text-white font-medium">{selectedEvent.time}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="flex-1 px-4 py-2 rounded-lg border border-[var(--border)] text-white hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  Kapat
                </button>
                <button className="flex-1 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors">
                  Düzenle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Yeni Etkinlik</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[var(--background)] rounded-lg">
                <p className="text-xs text-[var(--text-muted)] mb-1">Tarih</p>
                <p className="text-white font-medium">{formatEventDate(currentDate)}</p>
              </div>
              
              {createModalHour !== null && (
                <div className="p-4 bg-[var(--background)] rounded-lg">
                  <p className="text-xs text-[var(--text-muted)] mb-1">Saat</p>
                  <p className="text-white font-medium">{createModalHour.toString().padStart(2, "0")}:00</p>
                </div>
              )}

              <p className="text-sm text-[var(--text-muted)]">
                Bu özellik yakında eklenecektir.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-[var(--border)] text-white hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
