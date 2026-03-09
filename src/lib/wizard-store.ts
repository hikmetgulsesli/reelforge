import { create } from 'zustand';

export type WizardStep = 'script' | 'visuals' | 'voice' | 'subtitles' | 'music' | 'review';

export type VisualStyle = 'anime' | 'cinematic' | '3d-render' | 'photorealistic' | 'illustration' | 'abstract' | 'pixel-art' | 'watercolor' | 'comic' | 'minimalist';

export type VoiceId = 'sarah' | 'marcus' | 'emma' | 'james' | 'sofia' | 'alex';

export type SubtitleStyle = 'bold' | 'shadow' | 'outline' | 'background';

export type MusicGenre = 'chill-lofi' | 'upbeat' | 'cinematic' | 'electronic' | 'ambient' | 'rock' | 'pop';

export type AspectRatio = '9:16' | '16:9' | '1:1';

export type Quality = '1080p' | '4k';

export interface WizardState {
  step: WizardStep;
  script: string;
  selectedStyle: VisualStyle;
  selectedVoice: VoiceId;
  voiceSettings: {
    speed: number;
    pitch: number;
  };
  subtitleStyle: SubtitleStyle;
  subtitleColor: string;
  musicGenre: MusicGenre;
  musicVolume: number;
  aspectRatio: AspectRatio;
  quality: Quality;
  duration: number;
  agreeToTerms: boolean;
  isRendering: boolean;
  renderProgress: number;
  
  // Actions
  setStep: (step: WizardStep) => void;
  setScript: (script: string) => void;
  setSelectedStyle: (style: VisualStyle) => void;
  setSelectedVoice: (voice: VoiceId) => void;
  setVoiceSettings: (settings: { speed?: number; pitch?: number }) => void;
  setSubtitleStyle: (style: SubtitleStyle) => void;
  setSubtitleColor: (color: string) => void;
  setMusicGenre: (genre: MusicGenre) => void;
  setMusicVolume: (volume: number) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  setQuality: (quality: Quality) => void;
  setDuration: (duration: number) => void;
  setAgreeToTerms: (agree: boolean) => void;
  setIsRendering: (rendering: boolean) => void;
  setRenderProgress: (progress: number) => void;
  reset: () => void;
}

const initialState = {
  step: 'script' as WizardStep,
  script: 'In a world where magic and technology intertwine, one young hero must discover the secret of the ancient code...',
  selectedStyle: 'anime' as VisualStyle,
  selectedVoice: 'sarah' as VoiceId,
  voiceSettings: {
    speed: 1,
    pitch: 1,
  },
  subtitleStyle: 'bold' as SubtitleStyle,
  subtitleColor: '#FFFF00',
  musicGenre: 'chill-lofi' as MusicGenre,
  musicVolume: 15,
  aspectRatio: '9:16' as AspectRatio,
  quality: '1080p' as Quality,
  duration: 45,
  agreeToTerms: false,
  isRendering: false,
  renderProgress: 0,
};

export const useWizardStore = create<WizardState>((set) => ({
  ...initialState,
  
  setStep: (step) => set({ step }),
  setScript: (script) => set({ script }),
  setSelectedStyle: (selectedStyle) => set({ selectedStyle }),
  setSelectedVoice: (selectedVoice) => set({ selectedVoice }),
  setVoiceSettings: (voiceSettings) => set((state) => ({ 
    voiceSettings: { ...state.voiceSettings, ...voiceSettings } 
  })),
  setSubtitleStyle: (subtitleStyle) => set({ subtitleStyle }),
  setSubtitleColor: (subtitleColor) => set({ subtitleColor }),
  setMusicGenre: (musicGenre) => set({ musicGenre }),
  setMusicVolume: (musicVolume) => set({ musicVolume }),
  setAspectRatio: (aspectRatio) => set({ aspectRatio }),
  setQuality: (quality) => set({ quality }),
  setDuration: (duration) => set({ duration }),
  setAgreeToTerms: (agreeToTerms) => set({ agreeToTerms }),
  setIsRendering: (isRendering) => set({ isRendering }),
  setRenderProgress: (renderProgress) => set({ renderProgress }),
  reset: () => set(initialState),
}));

// Helper to calculate credit cost based on duration
export function calculateCreditCost(durationSeconds: number): number {
  if (durationSeconds <= 15) return 1;
  if (durationSeconds <= 30) return 2;
  return 3;
}

// Voice display names
export const voiceDisplayNames: Record<VoiceId, { name: string; lang: string; vibe: string }> = {
  sarah: { name: 'Sarah', lang: 'English US', vibe: 'Friendly' },
  marcus: { name: 'Marcus', lang: 'English US', vibe: 'Professional' },
  emma: { name: 'Emma', lang: 'English UK', vibe: 'Warm' },
  james: { name: 'James', lang: 'English US', vibe: 'Deep' },
  sofia: { name: 'Sofia', lang: 'Spanish', vibe: 'Energetic' },
  alex: { name: 'Alex', lang: 'English US', vibe: 'Casual' },
};

// Style display names
export const styleDisplayNames: Record<VisualStyle, string> = {
  'anime': 'Anime',
  'cinematic': 'Cinematic',
  '3d-render': '3D Render',
  'photorealistic': 'Photorealistic',
  'illustration': 'Illustration',
  'abstract': 'Abstract',
  'pixel-art': 'Pixel Art',
  'watercolor': 'Watercolor',
  'comic': 'Comic',
  'minimalist': 'Minimalist',
};

// Music display names
export const musicDisplayNames: Record<MusicGenre, string> = {
  'chill-lofi': 'Chill Lo-fi',
  'upbeat': 'Upbeat',
  'cinematic': 'Cinematic',
  'electronic': 'Electronic',
  'ambient': 'Ambient',
  'rock': 'Rock',
  'pop': 'Pop',
};
