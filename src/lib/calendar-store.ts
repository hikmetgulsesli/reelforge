import { create } from 'zustand';
import { CalendarView, ScheduledVideo, VideoStatus } from '@/types/calendar';

interface CalendarState {
  currentDate: Date;
  view: CalendarView;
  selectedDate: Date | null;
  videos: ScheduledVideo[];
  statusFilter: VideoStatus | 'all';
  
  // Actions
  setView: (view: CalendarView) => void;
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date | null) => void;
  setStatusFilter: (status: VideoStatus | 'all') => void;
  addVideo: (video: ScheduledVideo) => void;
  updateVideo: (id: string, updates: Partial<ScheduledVideo>) => void;
  removeVideo: (id: string) => void;
  moveVideo: (id: string, newDate: Date) => void;
  goToToday: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
}

// Demo data
const demoVideos: ScheduledVideo[] = [
  {
    id: '1',
    title: 'Top 10 AI Tools Every Creator Needs',
    scheduledAt: new Date(2026, 9, 5, 10, 0),
    status: 'ready',
    platforms: ['youtube'],
    thumbnailUrl: undefined,
  },
  {
    id: '2',
    title: 'Weekly Update & Behind the Scenes',
    scheduledAt: new Date(2026, 9, 5, 14, 0),
    status: 'processing',
    platforms: ['instagram'],
    thumbnailUrl: undefined,
  },
  {
    id: '3',
    title: 'Tech Review: The New Setup',
    scheduledAt: new Date(2026, 9, 9, 11, 30),
    status: 'planned',
    platforms: ['tiktok'],
    thumbnailUrl: undefined,
  },
  {
    id: '4',
    title: 'Coding Tutorial',
    scheduledAt: new Date(2026, 9, 13, 9, 0),
    status: 'published',
    platforms: ['youtube', 'tiktok'],
    thumbnailUrl: undefined,
  },
];

export const useCalendarStore = create<CalendarState>((set) => ({
  currentDate: new Date(2026, 9, 1), // October 2026
  view: 'month',
  selectedDate: null,
  videos: demoVideos,
  statusFilter: 'all',

  setView: (view) => set({ view }),
  
  setCurrentDate: (date) => set({ currentDate: date }),
  
  setSelectedDate: (date) => set({ selectedDate: date }),
  
  setStatusFilter: (status) => set({ statusFilter: status }),
  
  addVideo: (video) => set((state) => ({ 
    videos: [...state.videos, video] 
  })),
  
  updateVideo: (id, updates) => set((state) => ({
    videos: state.videos.map((v) => 
      v.id === id ? { ...v, ...updates } : v
    ),
  })),
  
  removeVideo: (id) => set((state) => ({
    videos: state.videos.filter((v) => v.id !== id),
  })),
  
  moveVideo: (id, newDate) => set((state) => ({
    videos: state.videos.map((v) => 
      v.id === id ? { ...v, scheduledAt: newDate } : v
    ),
  })),
  
  goToToday: () => set({ currentDate: new Date() }),
  
  goToPrevious: () => set((state) => {
    const newDate = new Date(state.currentDate);
    if (state.view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (state.view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    }
    return { currentDate: newDate };
  }),
  
  goToNext: () => set((state) => {
    const newDate = new Date(state.currentDate);
    if (state.view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (state.view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    }
    return { currentDate: newDate };
  }),
}));
