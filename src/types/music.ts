export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  category: string;
  duration: number;
  url: string;
  coverArt?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MusicCategory {
  id: string;
  name: string;
  count: number;
}

export interface MusicSettings {
  trackId: string | null;
  volume: number;
  fadeInDuration: number;
  fadeOutDuration: number;
  aiRecommended: boolean;
  voiceMusicBalance: number;
}

export const MUSIC_CATEGORIES = [
  "Upbeat",
  "Dramatic",
  "Chill",
  "Epic",
  "Lo-fi",
  "Corporate",
  "Funny",
  "Emotional",
] as const;

export type MusicCategoryType = (typeof MUSIC_CATEGORIES)[number];
