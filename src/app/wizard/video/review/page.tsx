"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WizardSummary {
  script: {
    preview: string;
  };
  visualStyle: {
    name: string;
    thumbnail: string;
  };
  voice: {
    name: string;
    language: string;
    tone: string;
  };
  subtitles: {
    style: string;
  };
  music: {
    name: string;
    volume: number;
  };
}

const DEFAULT_SUMMARY: WizardSummary = {
  script: {
    preview: "In a world where magic and technology intertwine, one young hero must discover the secret of the ancient code..."
  },
  visualStyle: {
    name: "Anime",
    thumbnail: "https://picsum.photos/seed/anime/100/100"
  },
  voice: {
    name: "Sarah",
    language: "English US",
    tone: "Friendly"
  },
  subtitles: {
    style: "Bold, Yellow Text, Black Outline"
  },
  music: {
    name: "Chill Lo-fi",
    volume: 15
  }
};

const CREDIT_COST = 5;
const USER_CREDITS = 15;

export default function ReviewPage() {
  const [summary] = useState<WizardSummary>(DEFAULT_SUMMARY);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);

  const hasEnoughCredits = USER_CREDITS >= CREDIT_COST;

  const handleStartRender = () => {
    setShowConfirmModal(false);
    setIsRendering(true);
    setRenderProgress(0);
    
    // Simulate render progress
    const interval = setInterval(() => {
      setRenderProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 500);
  };

  const handleCancelRender = () => {
    setIsRendering(false);
    setRenderProgress(0);
  };

  const handlePrev = () => {
    console.log("Navigate to Step 6 - Music");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const estimatedTimeRemaining = Math.round((100 - renderProgress) * 0.5); // seconds

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-body">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border-light dark:border-border-dark px-10 py-4 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-4 text-primary">
          <div className="size-6">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
            </svg>
          </div>
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100">ReelForge</h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <a className="text-slate-600 dark:text-slate-300 hover:text-primary text-sm font-medium" href="#">Dashboard</a>
            <a className="text-slate-600 dark:text-slate-300 hover:text-primary text-sm font-medium" href="#">Projects</a>
            <a className="text-slate-600 dark:text-slate-300 hover:text-primary text-sm font-medium" href="#">Pricing</a>
            <a className="text-slate-600 dark:text-slate-300 hover:text-primary text-sm font-medium" href="#">Settings</a>
          </div>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-slate-200 dark:bg-slate-700" />
        </div>
      </header>

      <div className="layout-container flex flex-col max-w-[1200px] mx-auto w-full px-6 py-8">
        {/* Page Header & Progress */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">Review and Render</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base mb-6">Step 7 of 7: Review your settings and generate your AI video.</p>
          
          <div className="max-w-2xl">
            <div className="flex justify-between items-end mb-2">
              <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">Wizard Progress</span>
              <span className="text-slate-700 dark:text-slate-300 text-sm font-bold">100%</span>
            </div>
            <div className="rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden h-2">
              <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: '100%' }}></div>
            </div>
            <p className="text-primary text-sm font-medium mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-base">check_circle</span>
              Step 7/7 Complete
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Project Summary */}
          <div className="col-span-1 lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">fact_check</span>
              Project Summary
            </h2>
            
            <div className="flex flex-col gap-4">
              {/* Script */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-primary mt-1">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold mb-1">Script Preview</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2">"{summary.script.preview}"</p>
                  <button className="text-primary text-xs font-medium mt-2 hover:underline">Edit Script</button>
                </div>
              </div>

              {/* Visual Style */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-primary mt-1">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold mb-1">Visual Style</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">{summary.visualStyle.name}</p>
                  </div>
                  <div className="w-12 h-12 rounded bg-cover bg-center" style={{ backgroundImage: `url('${summary.visualStyle.thumbnail}')` }} />
                </div>
              </div>

              {/* AI Voice */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-primary mt-1">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold mb-1">AI Voice</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-slate-400">record_voice_over</span>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">{summary.voice.name} ({summary.voice.language}, {summary.voice.tone})</p>
                  </div>
                </div>
              </div>

              {/* Subtitles */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-primary mt-1">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold mb-1">Subtitle Style</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-slate-400">subtitles</span>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">{summary.subtitles.style}</p>
                  </div>
                </div>
              </div>

              {/* Music */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-primary mt-1">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold mb-1">Background Music</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-slate-400">music_note</span>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">{summary.music.name} (Volume: {summary.music.volume}%)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Settings & Render */}
          <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
            {/* Video Settings */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">settings</span>
                Video Settings
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Duration</p>
                  <p className="text-slate-900 dark:text-slate-100 font-semibold">60 seconds</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Resolution</p>
                  <p className="text-slate-900 dark:text-slate-100 font-semibold">1080x1920 (9:16)</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Format</p>
                  <p className="text-slate-900 dark:text-slate-100 font-semibold">MP4</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">FPS</p>
                  <p className="text-slate-900 dark:text-slate-100 font-semibold">30</p>
                </div>
              </div>
            </div>

            {/* Credit Calculation */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">account_balance</span>
                Credit Calculation
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-700 dark:text-slate-300">Video Cost</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{CREDIT_COST} credits</span>
                </div>
                
                <div className={cn(
                  "flex justify-between items-center p-4 rounded-lg border",
                  hasEnoughCredits 
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" 
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                )}>
                  <span className={hasEnoughCredits ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}>
                    Current Balance
                  </span>
                  <span className={cn(
                    "font-bold text-lg",
                    hasEnoughCredits ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {USER_CREDITS} credits
                  </span>
                </div>

                {!hasEnoughCredits && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <span className="material-symbols-outlined text-red-600">warning</span>
                    <p className="text-sm text-red-700 dark:text-red-300">Insufficient credits. Please upgrade your plan.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Final Preview */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">visibility</span>
                Final Preview
              </h2>
              
              <div className="aspect-[9/16] bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-6xl text-slate-400 mb-2">play_circle</span>
                  <p className="text-slate-500 dark:text-slate-400">Preview will appear here</p>
                </div>
              </div>
            </div>

            {/* Render Button */}
            {!isRendering ? (
              <Button
                onClick={() => setShowConfirmModal(true)}
                disabled={!hasEnoughCredits}
                className={cn(
                  "w-full py-6 text-lg font-bold",
                  hasEnoughCredits 
                    ? "bg-primary hover:bg-primary/90 text-white" 
                    : "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
                )}
              >
                <span className="material-symbols-outlined mr-2">movie_creation</span>
                {hasEnoughCredits ? "Start Rendering" : "Insufficient Credits"}
              </Button>
            ) : (
              /* Render Progress */
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">Rendering in Progress</h3>
                  <span className="text-primary font-bold">{renderProgress}%</span>
                </div>
                
                <div className="rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden h-3 mb-4">
                  <div 
                    className="h-full rounded-full bg-primary transition-all duration-300" 
                    style={{ width: `${renderProgress}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    <span className="material-symbols-outlined text-base align-middle mr-1">schedule</span>
                    Estimated time remaining: {formatTime(estimatedTimeRemaining)}
                  </p>
                </div>
                
                <Button
                  onClick={handleCancelRender}
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                >
                  <span className="material-symbols-outlined mr-2">cancel</span>
                  Cancel Render
                </Button>
              </div>
            )}

            {/* Navigation */}
            {!isRendering && (
              <Button
                onClick={handlePrev}
                variant="outline"
                className="flex items-center gap-2"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Previous
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-3xl text-primary">movie_creation</span>
              <h3 className="font-display text-xl font-bold">Start Rendering?</h3>
            </div>
            
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              This will use <strong>{CREDIT_COST} credits</strong> from your balance. 
              The video will be generated and added to your library.
            </p>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowConfirmModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleStartRender}
                className="flex-1 bg-primary hover:bg-primary/90 text-white"
              >
                Confirm & Render
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
