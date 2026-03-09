"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// Types
interface MusicTrack {
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

interface MusicCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  trackCount: number;
}

interface MusicSettings {
  selectedTrackId: string | null;
  volume: number;
  fadeIn: number;
  fadeOut: number;
  voiceBalance: number;
  aiRecommendEnabled: boolean;
}

// Helper to format duration
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Helper to convert linear value to dB display
function volumeToDb(volume: number): string {
  if (volume === 0) return "-∞ dB";
  const db = 20 * Math.log10(volume);
  return `${db.toFixed(1)} dB`;
}

// Material Icons component
function MaterialIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

// Waveform Visualizer
function WaveformVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const bars = 11;
  // Use deterministic heights based on index to avoid impure Math.random during render
  const getBarHeight = (index: number) => {
    // Deterministic pseudo-random pattern using sine
    return (Math.sin(index * 1.5) + 1) / 2;
  };
  
  return (
    <div className="flex items-end gap-1 h-12 w-full justify-center opacity-70">
      {Array.from({ length: bars }, (_, i) => {
        const height = getBarHeight(i);
        const opacity = 0.3 + (i % 3) * 0.2;
        return (
          <div
            key={i}
            className={`w-1.5 bg-primary rounded-t-sm transition-all duration-150 ${
              isPlaying ? "animate-pulse" : ""
            }`}
            style={{
              height: `${20 + height * 60}%`,
              opacity: isPlaying ? opacity + 0.3 : opacity,
            }}
          />
        );
      })}
    </div>
  );
}

// Category Tabs
function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
}: {
  categories: MusicCategory[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}) {
  return (
    <div className="flex overflow-x-auto pb-4 mb-6 border-b border-primary/20 gap-8 scrollbar-hide">
      <button
        onClick={() => onSelectCategory(null)}
        className={`flex flex-col items-center justify-center border-b-[3px] pb-3 min-w-max transition-colors ${
          selectedCategory === null
            ? "border-b-primary"
            : "border-b-transparent hover:border-b-primary/50"
        }`}
      >
        <p
          className={`text-sm font-bold ${
            selectedCategory === null
              ? "text-primary"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          All
        </p>
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`flex flex-col items-center justify-center border-b-[3px] pb-3 min-w-max transition-colors ${
            selectedCategory === category.id
              ? "border-b-primary"
              : "border-b-transparent hover:border-b-primary/50"
          }`}
        >
          <p
            className={`text-sm font-bold ${
              selectedCategory === category.id
                ? "text-primary"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            {category.name}
          </p>
        </button>
      ))}
    </div>
  );
}

// Music Track Card
function MusicTrackCard({
  track,
  isSelected,
  isPlaying,
  onSelect,
  onPlayPause,
}: {
  track: MusicTrack;
  isSelected: boolean;
  isPlaying: boolean;
  onSelect: () => void;
  onPlayPause: () => void;
}) {
  const duration = formatDuration(track.duration);

  return (
    <div
      onClick={onSelect}
      className={`flex flex-col gap-3 rounded-xl p-4 border shadow-sm cursor-pointer transition-colors ${
        isSelected
          ? "bg-primary/5 border-2 border-primary relative"
          : "bg-white dark:bg-slate-800 border-primary/10 hover:border-primary/30"
      }`}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center z-10 shadow-sm">
          <MaterialIcon name="check" className="text-sm" />
        </div>
      )}
      <div className="flex gap-4">
        <div
          className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0 shadow-sm bg-slate-200 dark:bg-slate-700"
          style={
            track.thumbnailUrl
              ? { backgroundImage: `url('${track.thumbnailUrl}')` }
              : {}
          }
        >
          {!track.thumbnailUrl && (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <MaterialIcon name="music_note" />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center flex-1 min-w-0">
          <p className="font-bold font-display text-base truncate">{track.title}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
            {track.artist}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{duration}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlayPause();
          }}
          className={`self-center rounded-full w-10 h-10 flex items-center justify-center shadow-sm flex-shrink-0 transition-colors ${
            isSelected
              ? "bg-white dark:bg-slate-700 text-primary"
              : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary"
          }`}
        >
          <MaterialIcon name={isPlaying ? "pause" : "play_arrow"} />
        </button>
      </div>
      {isSelected && (
        <div className="w-full h-8 flex items-end gap-0.5 opacity-80 mt-2 px-1">
          <div className="w-full h-1 bg-primary/30 rounded-full relative">
            <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-primary rounded-full"></div>
            <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-sm"></div>
          </div>
        </div>
      )}
    </div>
  );
}

// Audio Mixer Panel
function AudioMixer({
  settings,
  onSettingsChange,
  isPlaying,
}: {
  settings: MusicSettings;
  onSettingsChange: (updates: Partial<MusicSettings>) => void;
  isPlaying: boolean;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-primary/10 sticky top-24">
      <div className="flex items-center gap-2 mb-6 text-primary">
        <MaterialIcon name="tune" />
        <h3 className="font-display font-bold text-xl text-slate-900 dark:text-slate-100">
          Audio Mixer
        </h3>
      </div>
      <div className="flex flex-col gap-8">
        {/* Volume Slider */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Music Volume
            </label>
            <span className="text-sm font-mono text-primary">
              {volumeToDb(settings.volume)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.volume * 100}
            onChange={(e) =>
              onSettingsChange({ volume: parseInt(e.target.value) / 100 })
            }
            className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Voice/Music Balance */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <MaterialIcon name="mic" className="text-sm" /> Voice
            </span>
            <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
              Music <MaterialIcon name="music_note" className="text-sm" />
            </span>
          </div>
          <div className="relative pt-1">
            <input
              type="range"
              min="0"
              max="100"
              value={settings.voiceBalance * 100}
              onChange={(e) =>
                onSettingsChange({ voiceBalance: parseInt(e.target.value) / 100 })
              }
              className="w-full h-1 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
              <span>{Math.round(settings.voiceBalance * 100)}%</span>
              <span>{Math.round((1 - settings.voiceBalance) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Fade Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Fade In (ms)
            </label>
            <input
              type="number"
              min="0"
              max="10000"
              step="100"
              value={settings.fadeIn}
              onChange={(e) =>
                onSettingsChange({ fadeIn: parseInt(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 rounded-lg border border-primary/10 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Fade Out (ms)
            </label>
            <input
              type="number"
              min="0"
              max="10000"
              step="100"
              value={settings.fadeOut}
              onChange={(e) =>
                onSettingsChange({ fadeOut: parseInt(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 rounded-lg border border-primary/10 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* AI Recommendation Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              AI Recommendations
            </span>
            <span className="text-xs text-slate-400">
              Get personalized music suggestions
            </span>
          </div>
          <button
            onClick={() =>
              onSettingsChange({ aiRecommendEnabled: !settings.aiRecommendEnabled })
            }
            className={`relative w-12 h-6 rounded-full transition-colors ${
              settings.aiRecommendEnabled ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                settings.aiRecommendEnabled ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* Waveform Visualizer */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-primary/5 flex flex-col items-center justify-center gap-2 h-32">
          <WaveformVisualizer isPlaying={isPlaying} />
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-2 flex items-center gap-1">
            {isPlaying ? (
              <>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Previewing Mix
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                Ready to Preview
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

// No Music Option Card
function NoMusicCard({ isSelected, onSelect }: { isSelected: boolean; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className="flex items-center justify-between gap-4 rounded-xl bg-white dark:bg-slate-800 p-5 shadow-sm border border-primary/10 hover:border-primary/30 transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className="bg-slate-100 dark:bg-slate-700 rounded-full p-3 text-slate-500 group-hover:text-primary transition-colors">
          <MaterialIcon name="volume_off" />
        </div>
        <div className="flex flex-col">
          <p className="font-display font-bold text-lg">No Music</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Play video with voiceover only
          </p>
        </div>
      </div>
      <div
        className={`w-6 h-6 rounded-full border-2 transition-colors ${
          isSelected
            ? "border-primary bg-primary"
            : "border-slate-300 dark:border-slate-600 group-hover:border-primary"
        }`}
      >
        {isSelected && (
          <MaterialIcon name="check" className="text-white text-sm" />
        )}
      </div>
    </div>
  );
}

// Main Music Wizard Component
export function MusicWizard() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [categories, setCategories] = useState<MusicCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [settings, setSettings] = useState<MusicSettings>({
    selectedTrackId: null,
    volume: 0.7,
    fadeIn: 0,
    fadeOut: 0,
    voiceBalance: 0.7,
    aiRecommendEnabled: true,
  });

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/music/categories");
        const data = await res.json();
        setCategories(data.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategories();
  }, []);

  // Fetch tracks
  useEffect(() => {
    async function fetchTracks() {
      setIsLoading(true);
      try {
        const url = selectedCategory
          ? `/api/music?category=${encodeURIComponent(selectedCategory)}`
          : "/api/music";
        const res = await fetch(url);
        const data = await res.json();
        setTracks(data.data || []);
      } catch (error) {
        console.error("Failed to fetch tracks:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTracks();
  }, [selectedCategory]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlayPause = useCallback((track: MusicTrack) => {
    if (playingTrackId === track.id) {
      // Pause current track
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingTrackId(null);
    } else {
      // Play new track
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(track.audioUrl);
      audioRef.current.volume = settings.volume;
      audioRef.current.play();
      audioRef.current.onended = () => setPlayingTrackId(null);
      setPlayingTrackId(track.id);
    }
  }, [playingTrackId, settings.volume]);

  const handleSelectTrack = useCallback((trackId: string | null) => {
    setSettings((prev) => ({ ...prev, selectedTrackId: trackId }));
    if (!trackId && audioRef.current) {
      audioRef.current.pause();
      setPlayingTrackId(null);
    }
  }, []);

  const handleSettingsChange = useCallback((updates: Partial<MusicSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  // AI recommended tracks
  const aiRecommendedTracks = tracks.filter((t) => t.isAiRecommended);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      {/* Left Column: Music Selection */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* No Music Option */}
        <NoMusicCard
          isSelected={settings.selectedTrackId === null}
          onSelect={() => handleSelectTrack(null)}
        />

        {/* Category Tabs */}
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Music Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tracks.map((track) => (
                <MusicTrackCard
                  key={track.id}
                  track={track}
                  isSelected={settings.selectedTrackId === track.id}
                  isPlaying={playingTrackId === track.id}
                  onSelect={() => handleSelectTrack(track.id)}
                  onPlayPause={() => handlePlayPause(track)}
                />
              ))}
            </div>

            {/* Empty State */}
            {tracks.length === 0 && (
              <div className="text-center py-12">
                <MaterialIcon name="music_off" className="text-4xl text-slate-400 mb-4" />
                <p className="text-slate-500">No tracks found in this category</p>
              </div>
            )}

            {/* AI Recommended Section */}
            {settings.aiRecommendEnabled && aiRecommendedTracks.length > 0 && (
              <div className="mt-4">
                <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <MaterialIcon name="auto_awesome" className="text-primary" />
                  AI Recommended
                </h3>
                <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                  {aiRecommendedTracks.slice(0, 5).map((track) => (
                    <div
                      key={track.id}
                      onClick={() => handleSelectTrack(track.id)}
                      className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 pr-4 rounded-full border border-primary/10 min-w-max shadow-sm cursor-pointer hover:border-primary/30 transition-colors"
                    >
                      <div
                        className="w-8 h-8 rounded-full bg-cover bg-center flex-shrink-0 bg-slate-200 dark:bg-slate-700"
                        style={
                          track.thumbnailUrl
                            ? { backgroundImage: `url('${track.thumbnailUrl}')` }
                            : {}
                        }
                      />
                      <span className="text-sm font-medium">{track.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Right Column: Audio Mixer */}
      <div className="lg:col-span-1">
        <AudioMixer
          settings={settings}
          onSettingsChange={handleSettingsChange}
          isPlaying={playingTrackId !== null}
        />
      </div>
    </div>
  );
}

export default MusicWizard;