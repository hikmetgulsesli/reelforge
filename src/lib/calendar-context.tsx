"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type { CalendarEvent, NotificationSchedule } from "@/types/calendar";

interface CalendarContextType {
  events: CalendarEvent[];
  updateEvent: (event: CalendarEvent) => void;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  deleteEvent: (id: string) => void;
  getEventsForDate: (date: Date) => CalendarEvent[];
  invalidateNotifications: (eventId: string) => void;
  notificationSchedules: NotificationSchedule[];
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

const STORAGE_KEY = "reelforge-calendar-events";
const NOTIFICATIONS_KEY = "reelforge-notification-schedules";

// Sample initial events
const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Tech Tips #5",
    date: new Date(),
    platform: "youtube",
    time: "14:00",
    description: "Yeni tech ipuçları videosu",
    duration: 15,
  },
  {
    id: "2",
    title: "Motivasyon Günü",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
    platform: "tiktok",
    time: "18:00",
    description: "Haftalık motivasyon içeriği",
    duration: 60,
  },
  {
    id: "3",
    title: "Ürün İnceleme",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 20),
    platform: "instagram",
    time: "12:00",
    description: "Yeni ürün incelemesi",
    duration: 30,
  },
];

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [notificationSchedules, setNotificationSchedules] = useState<
    NotificationSchedule[]
  >([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load events from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedNotifications = localStorage.getItem(NOTIFICATIONS_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);
        // Revive Date objects from JSON
        const revived = parsed.map((e: CalendarEvent) => ({
          ...e,
          date: new Date(e.date),
        }));
        setEvents(revived);
      } else {
        // Use sample events if no stored data
        setEvents(sampleEvents);
      }

      if (storedNotifications) {
        const parsed = JSON.parse(storedNotifications);
        const revived = parsed.map((n: NotificationSchedule) => ({
          ...n,
          notifyAt: new Date(n.notifyAt),
        }));
        setNotificationSchedules(revived);
      }
    } catch (error) {
      console.error("Failed to load calendar data:", error);
      setEvents(sampleEvents);
    }

    setIsLoaded(true);
  }, []);

  // Persist events to localStorage
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (error) {
      console.error("Failed to save events:", error);
    }
  }, [events, isLoaded]);

  // Persist notifications to localStorage
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;

    try {
      localStorage.setItem(
        NOTIFICATIONS_KEY,
        JSON.stringify(notificationSchedules)
      );
    } catch (error) {
      console.error("Failed to save notifications:", error);
    }
  }, [notificationSchedules, isLoaded]);

  const updateEvent = useCallback((updatedEvent: CalendarEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
    );
    // Invalidate notifications for this event
    invalidateNotifications(updatedEvent.id);
  }, []);

  const addEvent = useCallback((event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Math.random().toString(36).substring(2, 9),
    };
    setEvents((prev) => [...prev, newEvent]);
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    invalidateNotifications(id);
  }, []);

  const getEventsForDate = useCallback(
    (date: Date) => {
      return events.filter(
        (e) =>
          e.date.getDate() === date.getDate() &&
          e.date.getMonth() === date.getMonth() &&
          e.date.getFullYear() === date.getFullYear()
      );
    },
    [events]
  );

  const invalidateNotifications = useCallback((eventId: string) => {
    setNotificationSchedules((prev) =>
      prev.filter((n) => n.eventId !== eventId)
    );
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <CalendarContext.Provider
      value={{
        events,
        updateEvent,
        addEvent,
        deleteEvent,
        getEventsForDate,
        invalidateNotifications,
        notificationSchedules,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
}
