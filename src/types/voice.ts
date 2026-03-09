export type VoiceCategory = "MALE" | "FEMALE" | "NEUTRAL";
export type VoiceProvider = "ELEVENLABS" | "EDGE_TTS" | "CUSTOM";

export interface Voice {
  id: string;
  name: string;
  slug: string;
  category: VoiceCategory;
  provider: VoiceProvider;
  accent: string | null;
  language: string;
  previewUrl: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  isPremium: boolean;
  metadata: {
    pitchRange?: { min: number; max: number };
    speedRange?: { min: number; max: number };
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface VoiceSettings {
  voiceId: string;
  speed: number;
  pitch: number;
  usePitchAdjustment: boolean;
}

export interface CustomVoice {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  sampleUrl: string;
  voiceId: string | null;
  provider: VoiceProvider;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
