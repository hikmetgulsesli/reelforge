export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  platform: "youtube" | "tiktok" | "instagram" | "other";
  description?: string;
  duration?: number; // in minutes
}

export type CalendarView = "month" | "week" | "day";

export interface DragItem {
  event: CalendarEvent;
  originalDate: Date;
  originalTime: string;
}

export interface NotificationSchedule {
  eventId: string;
  notifyAt: Date;
  type: "email" | "push" | "sms";
}
