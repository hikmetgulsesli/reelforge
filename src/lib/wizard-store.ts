import { create } from 'zustand';

export interface WizardState {
  // Step 1: Script
  script: string;
  setScript: (script: string) => void;
  
  // Step 2: Visual Style
  visualStyle: string;
  visualStyleName: string;
  setVisualStyle: (id: string, name: string) => void;
  
  // Step 3: Assets
  assets: string[];
  addAsset: (asset: string) => void;
  removeAsset: (asset: string) => void;
  clearAssets: () => void;
  
  // Step 4: Voice
  voiceId: string;
  voiceName: string;
  voiceGender: 'male' | 'female' | 'neutral';
  voiceSpeed: number;
  voicePitch: number;
  setVoice: (id: string, name: string, gender: 'male' | 'female' | 'neutral') => void;
  setVoiceSpeed: (speed: number) => void;
  setVoicePitch: (pitch: number) => void;
  
  // Step 5: Subtitles
  subtitleStyle: 'bold' | 'normal' | 'animated';
  subtitleColor: string;
  subtitleOutline: boolean;
  setSubtitleStyle: (style: 'bold' | 'normal' | 'animated') => void;
  setSubtitleColor: (color: string) => void;
  setSubtitleOutline: (outline: boolean) => void;
  
  // Step 6: Music
  musicTrack: string;
  musicVolume: number;
  setMusicTrack: (track: string) => void;
  setMusicVolume: (volume: number) => void;
  
  // Step 7: Video Settings
  quality: '1080p' | '4k';
  aspectRatio: '9:16' | '16:9' | '1:1';
  setQuality: (quality: '1080p' | '4k') => void;
  setAspectRatio: (ratio: '9:16' | '16:9' | '1:1') => void;
  
  // Render State
  isRendering: boolean;
  renderProgress: number;
  renderCancelled: boolean;
  startRender: () => void;
  updateProgress: (progress: number) => void;
  cancelRender: () => void;
  resetRender: () => void;
  
  // Credit System
  userCredits: number;
  videoCost: number;
  setUserCredits: (credits: number) => void;
  
  // Terms
  agreedToTerms: boolean;
  setAgreedToTerms: (agreed: boolean) => void;
  
  // Reset
  reset: () => void;
}

const initialState = {
  script: '',
  visualStyle: '',
  visualStyleName: '',
  assets: [],
  voiceId: '',
  voiceName: '',
  voiceGender: 'neutral' as const,
  voiceSpeed: 1.0,
  voicePitch: 1.0,
  subtitleStyle: 'bold' as const,
  subtitleColor: '#FFFF00',
  subtitleOutline: true,
  musicTrack: '',
  musicVolume: 15,
  quality: '1080p' as const,
  aspectRatio: '9:16' as const,
  isRendering: false,
  renderProgress: 0,
  renderCancelled: false,
  userCredits: 10,
  videoCost: 1,
  agreedToTerms: false,
};

export const useWizardStore = create<WizardState>((set) => ({
  ...initialState,
  
  setScript: (script) => set({ script }),
  
  setVisualStyle: (id, name) => set({ visualStyle: id, visualStyleName: name }),
  
  addAsset: (asset) => set((state) => ({ 
    assets: [...state.assets, asset] 
  })),
  removeAsset: (asset) => set((state) => ({ 
    assets: state.assets.filter((a) => a !== asset) 
  })),
  clearAssets: () => set({ assets: [] }),
  
  setVoice: (id, name, gender) => set({ 
    voiceId: id, 
    voiceName: name, 
    voiceGender: gender 
  }),
  setVoiceSpeed: (speed) => set({ voiceSpeed: speed }),
  setVoicePitch: (pitch) => set({ voicePitch: pitch }),
  
  setSubtitleStyle: (style) => set({ subtitleStyle: style }),
  setSubtitleColor: (color) => set({ subtitleColor: color }),
  setSubtitleOutline: (outline) => set({ subtitleOutline: outline }),
  
  setMusicTrack: (track) => set({ musicTrack: track }),
  setMusicVolume: (volume) => set({ musicVolume: volume }),
  
  setQuality: (quality) => set({ quality }),
  setAspectRatio: (ratio) => set({ aspectRatio: ratio }),
  
  startRender: () => set({ 
    isRendering: true, 
    renderProgress: 0, 
    renderCancelled: false 
  }),
  updateProgress: (progress) => set({ renderProgress: progress }),
  cancelRender: () => set({ 
    isRendering: false, 
    renderCancelled: true 
  }),
  resetRender: () => set({ 
    isRendering: false, 
    renderProgress: 0, 
    renderCancelled: false 
  }),
  
  setUserCredits: (credits) => set({ userCredits: credits }),
  
  setAgreedToTerms: (agreed) => set({ agreedToTerms: agreed }),
  
  reset: () => set(initialState),
}));
