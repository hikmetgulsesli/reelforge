'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  Mic,
  Sparkles,
  Clock,
  Check,
} from 'lucide-react';

interface MusicStepProps {
  initialData?: MusicStepData;
  onDataChange?: (data: MusicStepData) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export interface MusicStepData {
  selectedMusicId: string | null;
  category: string;
  volume: number;
  voiceDucking: number;
  fadeIn: number;
  fadeOut: number;
  aiRecommendation: boolean;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  durationSeconds: number;
  coverUrl: string;
  category: string;
  waveform?: number[];
}

export const MUSIC_CATEGORIES = [
  { id: 'upbeat', label: 'Upbeat' },
  { id: 'dramatic', label: 'Dramatic' },
  { id: 'chill', label: 'Chill' },
  { id: 'epic', label: 'Epic' },
  { id: 'lofi', label: 'Lo-fi' },
];

export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'neon-horizon',
    title: 'Neon Horizon',
    artist: 'Synthwave Collective',
    duration: '2:45',
    durationSeconds: 165,
    coverUrl: 'https://picsum.photos/seed/neon/200/200',
    category: 'upbeat',
    waveform: [0.3, 0.5, 0.8, 0.6, 0.4, 0.5, 0.7, 0.9, 0.6, 0.3, 0.5, 0.8, 0.4, 0.2],
  },
  {
    id: 'summer-vibes',
    title: 'Summer Vibes',
    artist: 'DJ Ocean',
    duration: '3:12',
    durationSeconds: 192,
    coverUrl: 'https://picsum.photos/seed/summer/200/200',
    category: 'upbeat',
    waveform: [0.4, 0.6, 0.5, 0.7, 0.8, 0.5, 0.3, 0.6, 0.4, 0.7, 0.5, 0.8, 0.6, 0.4],
  },
  {
    id: 'city-lights',
    title: 'City Lights',
    artist: 'Urban Beat',
    duration: '1:58',
    durationSeconds: 118,
    coverUrl: 'https://picsum.photos/seed/city/200/200',
    category: 'chill',
    waveform: [0.2, 0.4, 0.6, 0.5, 0.3, 0.7, 0.4, 0.5, 0.6, 0.8, 0.5, 0.3, 0.4, 0.6],
  },
  {
    id: 'morning-run',
    title: 'Morning Run',
    artist: 'Active Life',
    duration: '2:20',
    durationSeconds: 140,
    coverUrl: 'https://picsum.photos/seed/morning/200/200',
    category: 'upbeat',
    waveform: [0.5, 0.7, 0.4, 0.8, 0.6, 0.5, 0.7, 0.4, 0.6, 0.8, 0.7, 0.5, 0.4, 0.6],
  },
  {
    id: 'epic-journey',
    title: 'Epic Journey',
    artist: 'Orchestral Dreams',
    duration: '4:15',
    durationSeconds: 255,
    coverUrl: 'https://picsum.photos/seed/epic/200/200',
    category: 'epic',
    waveform: [0.3, 0.5, 0.7, 0.9, 0.7, 0.5, 0.8, 0.6, 0.4, 0.7, 0.9, 0.6, 0.4, 0.5],
  },
  {
    id: 'coffee-shop',
    title: 'Coffee Shop',
    artist: 'Lo-fi Beats',
    duration: '2:50',
    durationSeconds: 170,
    coverUrl: 'https://picsum.photos/seed/coffee/200/200',
    category: 'lofi',
    waveform: [0.4, 0.3, 0.5, 0.4, 0.6, 0.5, 0.3, 0.4, 0.5, 0.6, 0.4, 0.3, 0.5, 0.4],
  },
];

export const RECENTLY_USED: MusicTrack[] = [
  {
    id: 'epic-journey',
    title: 'Epic Journey',
    artist: 'Orchestral Dreams',
    duration: '4:15',
    durationSeconds: 255,
    coverUrl: 'https://picsum.photos/seed/epic/200/200',
    category: 'epic',
  },
  {
    id: 'coffee-shop',
    title: 'Coffee Shop',
    artist: 'Lo-fi Beats',
    duration: '2:50',
    durationSeconds: 170,
    coverUrl: 'https://picsum.photos/seed/coffee/200/200',
    category: 'lofi',
  },
  {
    id: 'corporate-tech',
    title: 'Corporate Tech',
    artist: 'Business Audio',
    duration: '3:00',
    durationSeconds: 180,
    coverUrl: 'https://picsum.photos/seed/corporate/200/200',
    category: 'upbeat',
  },
];

export const AI_SUGGESTED_TRACKS: MusicTrack[] = [
  {
    id: 'ai-suggested-1',
    title: 'Digital Dreams',
    artist: 'AI Composer',
    duration: '2:30',
    durationSeconds: 150,
    coverUrl: 'https://picsum.photos/seed/digital/200/200',
    category: 'upbeat',
    waveform: [0.5, 0.6, 0.4, 0.7, 0.8, 0.5, 0.6, 0.4, 0.7, 0.5, 0.8, 0.6, 0.4, 0.5],
  },
  {
    id: 'ai-suggested-2',
    title: 'Future Forward',
    artist: 'Neural Beats',
    duration: '3:05',
    durationSeconds: 185,
    coverUrl: 'https://picsum.photos/seed/future/200/200',
    category: 'epic',
    waveform: [0.6, 0.4, 0.7, 0.5, 0.8, 0.6, 0.4, 0.7, 0.5, 0.6, 0.8, 0.5, 0.7, 0.4],
  },
];

export function MusicStep({ initialData, onDataChange }: MusicStepProps) {
  const [selectedMusicId, setSelectedMusicId] = useState<string | null>(
    initialData?.selectedMusicId || null
  );
  const [category, setCategory] = useState(initialData?.category || 'upbeat');
  const [volume, setVolume] = useState(initialData?.volume ?? 70);
  const [voiceDucking, setVoiceDucking] = useState(initialData?.voiceDucking ?? 30);
  const [fadeIn, setFadeIn] = useState(initialData?.fadeIn ?? 0);
  const [fadeOut, setFadeOut] = useState(initialData?.fadeOut ?? 0);
  const [aiRecommendation, setAiRecommendation] = useState(initialData?.aiRecommendation ?? false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [playProgress, setPlayProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const handleDataChange = useCallback(() => {
    onDataChange?.({
      selectedMusicId,
      category,
      volume,
      voiceDucking,
      fadeIn,
      fadeOut,
      aiRecommendation,
    });
  }, [selectedMusicId, category, volume, voiceDucking, fadeIn, fadeOut, aiRecommendation, onDataChange]);

  const filteredTracks = useMemo(() => {
    return MUSIC_TRACKS.filter((track) => track.category === category);
  }, [category]);

  // selectedTrack available for future use (e.g., displaying selected track info)
  const _selectedTrack = useMemo(() => {
    return MUSIC_TRACKS.find((t) => t.id === selectedMusicId) || null;
  }, [selectedMusicId]);

  const handleTrackSelect = useCallback(
    (trackId: string | null) => {
      setSelectedMusicId(trackId);
      setIsPlaying(null);
      setPlayProgress(0);
      
      // Update data after selection
      setTimeout(() => {
        onDataChange?.({
          selectedMusicId: trackId,
          category,
          volume,
          voiceDucking,
          fadeIn,
          fadeOut,
          aiRecommendation,
        });
      }, 0);
    },
    [category, volume, voiceDucking, fadeIn, fadeOut, aiRecommendation, onDataChange]
  );

  const handlePlayPreview = useCallback((trackId: string) => {
    if (isPlaying === trackId) {
      setIsPlaying(null);
      setPlayProgress(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    } else {
      setIsPlaying(trackId);
      setPlayProgress(0);
      
      // Simulate playback progress
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      progressIntervalRef.current = setInterval(() => {
        setPlayProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(null);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
  }, [isPlaying]);

  const handleVolumeChange = useCallback(
    (value: number) => {
      setVolume(value);
      setVoiceDucking(100 - value);
      handleDataChange();
    },
    [handleDataChange]
  );

  const handleFadeChange = useCallback(
    (type: 'in' | 'out', value: number) => {
      if (type === 'in') {
        setFadeIn(value);
      } else {
        setFadeOut(value);
      }
      handleDataChange();
    },
    [handleDataChange]
  );

  const handleAiToggle = useCallback(() => {
    setAiRecommendation((prev) => !prev);
    handleDataChange();
  }, [handleDataChange]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1
          className="text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Arka Plan Muzigi Secin
        </h1>
        <p className="text-muted-foreground text-base">
          Videonuzun havasini belirleyecek bir parca secin veya kendinizinkini yukleyin.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-4 border-b border-primary/20 gap-6 scrollbar-hide">
        {MUSIC_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-3 min-w-max transition-colors ${
              category === cat.id
                ? 'border-b-primary'
                : 'border-b-transparent hover:border-b-primary/50'
            }`}
            aria-label={`${cat.label} kategorisi`}
          >
            <span
              className={`text-sm font-bold ${
                category === cat.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Music Selection */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* No Music Option */}
          <button
            onClick={() => handleTrackSelect(null)}
            className={`flex items-center justify-between gap-4 rounded-xl p-5 shadow-sm border transition-colors cursor-pointer group ${
              selectedMusicId === null
                ? 'bg-primary/5 border-2 border-primary'
                : 'bg-card border-primary/10 hover:border-primary/30'
            }`}
            aria-pressed={selectedMusicId === null}
            aria-label="Muzik olmadan devam et"
          >
            <div className="flex items-center gap-4">
              <div
                className={`rounded-full p-3 transition-colors ${
                  selectedMusicId === null
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground group-hover:text-primary'
                }`}
              >
                <VolumeX className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                  Muzik Yok
                </span>
                <span className="text-sm text-muted-foreground">
                  Videoyu sadece seslendirme ile oynat
                </span>
              </div>
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 transition-colors ${
                selectedMusicId === null
                  ? 'border-primary bg-primary'
                  : 'border-muted-foreground/50 group-hover:border-primary'
              }`}
            >
              {selectedMusicId === null && (
                <Check className="w-4 h-4 text-white m-auto" />
              )}
            </div>
          </button>

          {/* Music Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTracks.map((track) => {
              const isSelected = selectedMusicId === track.id;
              const isThisPlaying = isPlaying === track.id;
              
              return (
                <div
                  key={track.id}
                  onClick={() => handleTrackSelect(track.id)}
                  className={`flex flex-col gap-3 rounded-xl p-4 shadow-sm cursor-pointer relative transition-colors ${
                    isSelected
                      ? 'bg-primary/5 border-2 border-primary'
                      : 'bg-card border border-primary/10 hover:border-primary/30'
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`${track.title} parcasini sec`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleTrackSelect(track.id);
                    }
                  }}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center z-10 shadow-sm">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                  
                  <div className="flex gap-4">
                    {/* Album Cover */}
                    <div
                      className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0 shadow-sm"
                      style={{ backgroundImage: `url('${track.coverUrl}')` }}
                      role="img"
                      aria-label={`${track.title} album kapagi`}
                    />
                    
                    {/* Track Info */}
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <span
                        className={`font-bold text-base truncate ${
                          isSelected ? 'text-primary' : 'text-foreground'
                        }`}
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {track.title}
                      </span>
                      <span className="text-sm text-muted-foreground truncate">
                        {track.artist}
                      </span>
                      <span className="text-xs text-muted-foreground/70 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {track.duration}
                      </span>
                    </div>
                    
                    {/* Play Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayPreview(track.id);
                      }}
                      className={`self-center rounded-full w-10 h-10 flex items-center justify-center shadow-sm transition-all flex-shrink-0 ${
                        isThisPlaying
                          ? 'bg-primary text-white'
                          : 'bg-muted text-muted-foreground hover:text-primary hover:scale-105'
                      }`}
                      aria-label={isThisPlaying ? 'Duraklat' : 'Onizle'}
                    >
                      {isThisPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </button>
                  </div>
                  
                  {/* Waveform / Progress Bar */}
                  {(isSelected || isThisPlaying) && (
                    <div className="w-full h-8 flex items-end gap-0.5 opacity-80 mt-2 px-1">
                      <div className="w-full h-1 bg-primary/30 rounded-full relative">
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-primary rounded-full transition-all duration-100"
                          style={{ width: isThisPlaying ? `${playProgress}%` : '33%' }}
                        />
                        {isThisPlaying && (
                          <div
                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-sm transition-all duration-100"
                            style={{ left: `calc(${playProgress}% - 6px)` }}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Recently Used */}
          <div className="mt-2">
            <h3
              className="font-bold text-lg mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Son Kullanilanlar
            </h3>
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
              {RECENTLY_USED.map((track) => (
                <button
                  key={track.id}
                  onClick={() => handleTrackSelect(track.id)}
                  className={`flex items-center gap-3 p-2 pr-4 rounded-full border min-w-max shadow-sm cursor-pointer transition-colors ${
                    selectedMusicId === track.id
                      ? 'bg-primary/5 border-primary'
                      : 'bg-card border-primary/10 hover:border-primary/30'
                  }`}
                  aria-label={`${track.title} sec`}
                >
                  <div
                    className="w-8 h-8 rounded-full bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url('${track.coverUrl}')` }}
                    role="img"
                    aria-label={`${track.title} album kapagi`}
                  />
                  <span className="text-sm font-medium">{track.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Audio Mixer */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-primary/10 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <Music className="w-5 h-5" />
              <h3
                className="font-bold text-xl text-foreground"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Ses Mikseri
              </h3>
            </div>

            <div className="flex flex-col gap-8">
              {/* Volume Balancer */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Mic className="w-4 h-4" />
                    Ses
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    Muzik
                    <Music className="w-4 h-4" />
                  </span>
                </div>
                <div className="relative pt-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                    className="w-full h-1 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
                    aria-label="Ses seviyesi"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                    <span>{volume}%</span>
                    <span>{voiceDucking}%</span>
                  </div>
                </div>
              </div>

              {/* Voice Ducking Visualization */}
              <div className="bg-surface-darker rounded-xl p-4 border border-primary/5 flex flex-col items-center justify-center gap-2 h-32">
                <div className="flex items-end gap-1 h-12 w-full justify-center opacity-70">
                  {[45, 65, 85, 55, 70, 60, 80, 50, 75, 90, 55].map((height, i) => (
                    <div
                      key={i}
                      className="w-1.5 rounded-t-sm transition-all duration-300"
                      style={{
                        backgroundColor: 'var(--color-primary)',
                        height: `${height}%`,
                        opacity: isPlaying ? 1 : 0.6,
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-2 flex items-center gap-1">
                  {isPlaying ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Onizleme Oynatiliyor
                    </>
                  ) : (
                    'Miks Onizleme'
                  )}
                </span>
              </div>

              {/* Fade Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-1">
                    <Volume2 className="w-4 h-4" />
                    Fade In
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={fadeIn}
                      onChange={(e) => handleFadeChange('in', Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 text-sm"
                      aria-label="Fade in suresi"
                    />
                    <span className="text-sm text-muted-foreground">sn</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-1">
                    <VolumeX className="w-4 h-4" />
                    Fade Out
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={fadeOut}
                      onChange={(e) => handleFadeChange('out', Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 text-sm"
                      aria-label="Fade out suresi"
                    />
                    <span className="text-sm text-muted-foreground">sn</span>
                  </div>
                </div>
              </div>

              {/* AI Recommendation Toggle */}
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="font-medium text-sm">AI Onerileri</span>
                </div>
                <button
                  onClick={handleAiToggle}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    aiRecommendation ? 'bg-primary' : 'bg-muted'
                  }`}
                  role="switch"
                  aria-checked={aiRecommendation}
                  aria-label="AI onerilerini aktif et"
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                      aiRecommendation ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* AI Suggested Tracks */}
              {aiRecommendation && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-foreground">Onerilen Parcalar</h4>
                  {AI_SUGGESTED_TRACKS.map((track) => (
                    <button
                      key={track.id}
                      onClick={() => handleTrackSelect(track.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        selectedMusicId === track.id
                          ? 'bg-primary/10 border-primary'
                          : 'bg-background border-border hover:border-primary/50'
                      }`}
                      aria-label={`${track.title} sec`}
                    >
                      <div
                        className="w-10 h-10 rounded-lg bg-cover bg-center flex-shrink-0"
                        style={{ backgroundImage: `url('${track.coverUrl}')` }}
                      />
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium truncate">{track.title}</p>
                        <p className="text-xs text-muted-foreground">{track.artist}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{track.duration}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MusicStep;