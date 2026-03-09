export type VideoStatus = 'planned' | 'processing' | 'ready' | 'published';

export type Platform = 'youtube' | 'tiktok' | 'instagram';

export type CalendarView = 'month' | 'week' | 'list';

export interface ScheduledVideo {
  id: string;
  title: string;
  scheduledAt: Date;
  status: VideoStatus;
  platforms: Platform[];
  thumbnailUrl?: string;
}

export interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  videos: ScheduledVideo[];
}

export interface QuickAddFormData {
  date: string;
  time: string;
  videoId: string;
  platforms: Platform[];
}
