import { create } from "zustand";
import { VoiceSettings, defaultVoiceSettings } from "@/types/voice";

export type WizardStep = "script" | "visuals" | "assets" | "voice" | "music" | "subtitles" | "review";

export interface ScriptData {
  topic: string;
  script: string;
  targetPlatform: "youtube" | "tiktok" | "instagram";
  duration: number; // seconds
}

export interface VisualStyle {
  id: string;
  name: string;
  thumbnailUrl?: string;
}

export interface AssetData {
  images: string[];
  clips: string[];
}

export interface SubtitleSettings {
  enabled: boolean;
  style: "default" | "modern" | "minimal";
  fontSize: number;
  position: "bottom" | "top";
}

export interface MusicSettings {
  trackId: string;
  volume: number;
  fadeIn: number;
  fadeOut: number;
}

export interface WizardState {
  // Current step
  currentStep: WizardStep;
  
  // Step data
  script: ScriptData;
  visuals: VisualStyle | null;
  assets: AssetData;
  voice: VoiceSettings;
  music: MusicSettings;
  subtitles: SubtitleSettings;
  
  // Actions
  setStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  setScriptData: (data: Partial<ScriptData>) => void;
  setVisualStyle: (style: VisualStyle | null) => void;
  setAssetData: (data: Partial<AssetData>) => void;
  setVoiceSettings: (settings: Partial<VoiceSettings>) => void;
  setMusicSettings: (settings: Partial<MusicSettings>) => void;
  setSubtitleSettings: (settings: Partial<SubtitleSettings>) => void;
  
  reset: () => void;
}

const stepOrder: WizardStep[] = ["script", "visuals", "assets", "voice", "music", "subtitles", "review"];

const stepIndex = (step: WizardStep) => stepOrder.indexOf(step);

export const useWizardStore = create<WizardState>((set, get) => ({
  currentStep: "script",
  
  script: {
    topic: "",
    script: "",
    targetPlatform: "youtube",
    duration: 60,
  },
  
  visuals: null,
  
  assets: {
    images: [],
    clips: [],
  },
  
  voice: defaultVoiceSettings,
  
  music: {
    trackId: "",
    volume: 0.5,
    fadeIn: 0,
    fadeOut: 0,
  },
  
  subtitles: {
    enabled: true,
    style: "default",
    fontSize: 24,
    position: "bottom",
  },
  
  setStep: (step) => set({ currentStep: step }),
  
  nextStep: () => {
    const { currentStep } = get();
    const currentIdx = stepIndex(currentStep);
    if (currentIdx < stepOrder.length - 1) {
      set({ currentStep: stepOrder[currentIdx + 1] });
    }
  },
  
  prevStep: () => {
    const { currentStep } = get();
    const currentIdx = stepIndex(currentStep);
    if (currentIdx > 0) {
      set({ currentStep: stepOrder[currentIdx - 1] });
    }
  },
  
  setScriptData: (data) => set((state) => ({ 
    script: { ...state.script, ...data } 
  })),
  
  setVisualStyle: (style) => set({ visuals: style }),
  
  setAssetData: (data) => set((state) => ({ 
    assets: { ...state.assets, ...data } 
  })),
  
  setVoiceSettings: (settings) => set((state) => ({ 
    voice: { ...state.voice, ...settings } 
  })),
  
  setMusicSettings: (settings) => set((state) => ({ 
    music: { ...state.music, ...settings } 
  })),
  
  setSubtitleSettings: (settings) => set((state) => ({ 
    subtitles: { ...state.subtitles, ...settings } 
  })),
  
  reset: () => set({
    currentStep: "script",
    script: {
      topic: "",
      script: "",
      targetPlatform: "youtube",
      duration: 60,
    },
    visuals: null,
    assets: { images: [], clips: [] },
    voice: defaultVoiceSettings,
    music: { trackId: "", volume: 0.5, fadeIn: 0, fadeOut: 0 },
    subtitles: { enabled: true, style: "default", fontSize: 24, position: "bottom" },
  }),
}));
