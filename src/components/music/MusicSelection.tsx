"use client";

import { useState, useEffect, useCallback } from "react";
import { VolumeX } from "lucide-react";
import { MusicTrack, MusicCategory, MusicSettings } from "@/types/music";
import { MusicTrackCard } from "./MusicTrackCard";
import { CategoryTabs } from "./CategoryTabs";
import { AudioMixer } from "./AudioMixer";

interface MusicSelectionProps {
  onSettingsChange?: (settings: MusicSettings) => void;
  initialSettings?: Partial<MusicSettings>;
}

export function MusicSelection({
  onSettingsChange,
  initialSettings,
}: MusicSelectionProps) {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [categories, setCategories] = useState<MusicCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(
    initialSettings?.trackId ?? null
  );
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Audio mixer settings
  const [voiceMusicBalance, setVoiceMusicBalance] = useState(
    initialSettings?.voiceMusicBalance ?? 70
  );
  const [fadeInDuration, setFadeInDuration] = useState(
    initialSettings?.fadeInDuration ?? 1.5
  );
  const [fadeOutDuration, setFadeOutDuration] = useState(
    initialSettings?.fadeOutDuration ?? 2.0
  );
  const [aiRecommended, setAiRecommended] = useState(
    initialSettings?.aiRecommended ?? false
  );

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/music/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch tracks
  useEffect(() => {
    const fetchTracks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = new URL("/api/music", window.location.origin);
        if (activeCategory && activeCategory !== "all") {
          url.searchParams.set("category", activeCategory);
        }
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Failed to fetch tracks");
        const data = await response.json();
        setTracks(data.data);
      } catch (err) {
        setError("Müzikler yüklenirken bir hata oluştu.");
        console.error("Error fetching tracks:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTracks();
  }, [activeCategory]);

  // Notify parent of settings changes
  useEffect(() => {
    if (onSettingsChange) {
      onSettingsChange({
        trackId: selectedTrackId,
        volume: 100 - voiceMusicBalance,
        fadeInDuration,
        fadeOutDuration,
        aiRecommended,
        voiceMusicBalance,
      });
    }
  }, [
    selectedTrackId,
    voiceMusicBalance,
    fadeInDuration,
    fadeOutDuration,
    aiRecommended,
    onSettingsChange,
  ]);

  const handleTrackSelect = useCallback((trackId: string) => {
    setSelectedTrackId(trackId);
  }, []);

  const handlePlayToggle = useCallback((trackId: string) => {
    setPlayingTrackId((current) => (current === trackId ? null : trackId));
  }, []);

  const isPlaying = playingTrackId === selectedTrackId && selectedTrackId !== null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      {/* Left Column: Music Selection */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* No Music Option */}
        <div
          onClick={() => setSelectedTrackId(null)}
          className={`flex items-center justify-between gap-4 rounded-xl p-5 shadow-sm border transition-all duration-200 cursor-pointer ${
            selectedTrackId === null
              ? "bg-primary/5 border-primary"
              : "bg-white dark:bg-slate-800 border-primary/10 hover:border-primary/30"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`rounded-full p-3 transition-colors duration-200 ${
                selectedTrackId === null
                  ? "bg-primary/10 text-primary"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-500"
              }`}
            >
              <VolumeX className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <p className="font-[family-name:var(--font-display)] font-bold text-lg">
                Müzik Yok
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Sadece seslendirme ile devam et
              </p>
            </div>
          </div>
          <div
            className={`w-6 h-6 rounded-full border-2 transition-colors duration-200 ${
              selectedTrackId === null
                ? "border-primary bg-primary"
                : "border-slate-300 dark:border-slate-600"
            }`}
          >
            {selectedTrackId === null && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Music Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tracks.map((track) => (
              <MusicTrackCard
                key={track.id}
                track={track}
                isSelected={selectedTrackId === track.id}
                isPlaying={playingTrackId === track.id}
                onSelect={() => handleTrackSelect(track.id)}
                onPlayToggle={() => handlePlayToggle(track.id)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && tracks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              Bu kategoride müzik bulunamadı.
            </p>
          </div>
        )}
      </div>

      {/* Right Column: Audio Mixer */}
      <div className="lg:col-span-1">
        <AudioMixer
          voiceMusicBalance={voiceMusicBalance}
          onVoiceMusicBalanceChange={setVoiceMusicBalance}
          fadeInDuration={fadeInDuration}
          onFadeInDurationChange={setFadeInDuration}
          fadeOutDuration={fadeOutDuration}
          onFadeOutDurationChange={setFadeOutDuration}
          aiRecommended={aiRecommended}
          onAiRecommendedChange={setAiRecommended}
          isPlaying={isPlaying}
        />
      </div>
    </div>
  );
}
