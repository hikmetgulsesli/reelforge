// Music Track Types
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  category: string;
  duration: number;
  audioUrl: string;
  thumbnailUrl: string | null;
  isAiRecommended: boolean;
  playCount: number;
}

export interface MusicCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  trackCount: number;
}

export interface MusicSettings {
  selectedTrackId: string | null;
  volume: number;
  fadeIn: number;
  fadeOut: number;
  voiceBalance: number;
  aiRecommendEnabled: boolean;
}

export interface MusicTrackResponse {
  data: MusicTrack[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface MusicCategoriesResponse {
  data: MusicCategory[];
}