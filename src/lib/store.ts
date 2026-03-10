import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface VideoProject {
  id: string;
  title: string;
  script: string;
  style: string;
  voiceId: string | null;
  voiceName: string | null;
  subtitlesEnabled: boolean;
  subtitleStyle: string;
  musicId: string | null;
  musicName: string | null;
  status: "draft" | "rendering" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
  duration?: number;
}

export interface Series {
  id: string;
  name: string;
  description: string;
  niche: string;
  videos: VideoProject[];
  createdAt: Date;
}

export interface CalendarEvent {
  id: string;
  videoId: string;
  videoTitle: string;
  scheduledFor: Date;
  platform: "youtube" | "tiktok" | "instagram";
  status: "scheduled" | "published" | "failed";
}

interface AppState {
  // User
  credits: number;
  plan: "free" | "starter" | "pro" | "business";
  setCredits: (credits: number) => void;
  setPlan: (plan: "free" | "starter" | "pro" | "business") => void;
  
  // Video Wizard
  currentStep: number;
  videoDraft: Partial<VideoProject>;
  setCurrentStep: (step: number) => void;
  updateVideoDraft: (draft: Partial<VideoProject>) => void;
  resetVideoDraft: () => void;
  
  // Videos
  videos: VideoProject[];
  setVideos: (videos: VideoProject[]) => void;
  addVideo: (video: VideoProject) => void;
  updateVideo: (id: string, updates: Partial<VideoProject>) => void;
  deleteVideo: (id: string) => void;
  
  // Series
  series: Series[];
  setSeries: (series: Series[]) => void;
  
  // Calendar Events
  calendarEvents: CalendarEvent[];
  setCalendarEvents: (events: CalendarEvent[]) => void;
  
  // UI State
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  
  // Notification
  notificationCount: number;
  setNotificationCount: (count: number) => void;
}

const initialVideoDraft: Partial<VideoProject> = {
  title: "",
  script: "",
  style: "cinematic",
  voiceId: null,
  voiceName: null,
  subtitlesEnabled: true,
  subtitleStyle: "modern",
  musicId: null,
  musicName: null,
  status: "draft",
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // User
      credits: 3,
      plan: "free",
      setCredits: (credits) => set({ credits }),
      setPlan: (plan) => set({ plan }),
      
      // Video Wizard
      currentStep: 1,
      videoDraft: initialVideoDraft,
      setCurrentStep: (step) => set({ currentStep: step }),
      updateVideoDraft: (draft) =>
        set((state) => ({
          videoDraft: { ...state.videoDraft, ...draft },
        })),
      resetVideoDraft: () =>
        set({ videoDraft: initialVideoDraft, currentStep: 1 }),
      
      // Videos
      videos: [],
      setVideos: (videos) => set({ videos }),
      addVideo: (video) =>
        set((state) => ({ videos: [video, ...state.videos] })),
      updateVideo: (id, updates) =>
        set((state) => ({
          videos: state.videos.map((v) =>
            v.id === id ? { ...v, ...updates } : v
          ),
        })),
      deleteVideo: (id) =>
        set((state) => ({
          videos: state.videos.filter((v) => v.id !== id),
        })),
      
      // Series
      series: [],
      setSeries: (series) => set({ series }),
      
      // Calendar Events
      calendarEvents: [],
      setCalendarEvents: (calendarEvents) => set({ calendarEvents }),
      
      // UI State
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      // Notification
      notificationCount: 2,
      setNotificationCount: (count) => set({ notificationCount: count }),
    }),
    {
      name: "reelforge-storage",
      partialize: (state) => ({
        credits: state.credits,
        plan: state.plan,
        videos: state.videos,
        series: state.series,
        calendarEvents: state.calendarEvents,
      }),
    }
  )
);