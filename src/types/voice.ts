import { z } from "zod";

export type VoiceCategory = "MALE" | "FEMALE" | "NEUTRAL";
export type VoiceProvider = "ELEVENLABS" | "EDGE_TTS" | "CUSTOM";

export interface Voice {
  id: string;
  name: string;
  category: VoiceCategory;
  provider: VoiceProvider;
  accent: string;
  previewUrl?: string;
  avatarUrl?: string;
}

export interface VoiceSettings {
  voiceId: string;
  speed: number; // 0.5 - 2.0
  pitch: number; // -20 to +20
  pitchEnabled: boolean;
}

export const voiceSettingsSchema = z.object({
  voiceId: z.string().min(1, "Voice selection is required"),
  speed: z.number().min(0.5).max(2.0),
  pitch: z.number().min(-20).max(20),
  pitchEnabled: z.boolean(),
});

export const defaultVoiceSettings: VoiceSettings = {
  voiceId: "",
  speed: 1.0,
  pitch: 0,
  pitchEnabled: false,
};
