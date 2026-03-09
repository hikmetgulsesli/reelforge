"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Voice {
  id: string;
  name: string;
  gender: "male" | "female" | "neutral";
  previewUrl?: string;
}

const MALE_VOICES: Voice[] = [
  { id: "m1", name: "Ahmet", gender: "male" },
  { id: "m2", name: "Mehmet", gender: "male" },
  { id: "m3", name: "Ali", gender: "male" },
  { id: "m4", name: "Ayhan", gender: "male" },
  { id: "m5", name: "Burak", gender: "male" },
  { id: "m6", name: "Can", gender: "male" },
];

const FEMALE_VOICES: Voice[] = [
  { id: "f1", name: "Ayşe", gender: "female" },
  { id: "f2", name: "Fatma", gender: "female" },
  { id: "f3", name: "Zeynep", gender: "female" },
  { id: "f4", name: "Elif", gender: "female" },
  { id: "f5", name: "Deniz", gender: "female" },
  { id: "f6", name: "Defne", gender: "female" },
];

const NEUTRAL_VOICES: Voice[] = [
  { id: "n1", name: "Not 1", gender: "neutral" },
  { id: "n2", name: "Not 2", gender: "neutral" },
  { id: "n3", name: "Not 3", gender: "neutral" },
  { id: "n4", name: "Not 4", gender: "neutral" },
];

type VoiceCategory = "male" | "female" | "neutral";

export default function VoicePage() {
  const [activeCategory, setActiveCategory] = useState<VoiceCategory>("male");
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const voices = activeCategory === "male" ? MALE_VOICES 
    : activeCategory === "female" ? FEMALE_VOICES 
    : NEUTRAL_VOICES;

  const handlePlayPreview = (voiceId: string) => {
    if (playingVoice === voiceId) {
      setPlayingVoice(null);
    } else {
      setPlayingVoice(voiceId);
      // In a real app, this would play audio
      setTimeout(() => setPlayingVoice(null), 2000);
    }
  };

  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoice(voiceId === selectedVoice ? null : voiceId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    alert("Voice cloning upload would be handled here. This is a Pro+ feature.");
  };

  const handleTestVoice = () => {
    alert("Test voice would play with current settings (Speed: " + speed + ", Pitch: " + pitch + ")");
  };

  const handlePrev = () => {
    console.log("Navigate to Step 3 - Assets");
  };

  const handleNext = () => {
    console.log("Navigate to Step 5 - Subtitles");
  };

  const scriptPreview = `Bu bir örnek metin burada görüntülenecek. 
Video içeriği için hazırlanan senaryo buraya gelecek.
Seslendirme ayarları yapıldıktan sonra önizleme yapılabilir.`;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-body">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border-light dark:border-border-dark px-10 py-3 bg-background-light dark:bg-background-dark z-10 sticky top-0">
        <div className="flex items-center gap-4 text-primary">
          <div className="size-6">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
            </svg>
          </div>
          <h2 className="font-display text-xl font-bold text-text-light dark:text-text-dark">ReelForge</h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <a className="text-text-light dark:text-text-dark text-sm font-medium hover:text-primary" href="#">Dashboard</a>
            <a className="text-text-light dark:text-text-dark text-sm font-medium hover:text-primary" href="#">Projects</a>
            <a className="text-text-light dark:text-text-dark text-sm font-medium hover:text-primary" href="#">Templates</a>
          </div>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-border-light dark:border-border-dark" />
        </div>
      </header>

      <div className="layout-container flex flex-col max-w-[1200px] mx-auto w-full px-6 py-8">
        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-xl font-bold text-text-light dark:text-text-dark">Project Creation Wizard</h3>
            <span className="text-sm text-text-muted font-medium">Step 4 of 7</span>
          </div>
          <div className="flex items-center w-full">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center relative z-10">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">✓</div>
                </div>
                {step < 3 && <div className="flex-1 h-1 bg-primary/20 mx-2 rounded-full"><div className="h-full bg-primary rounded-full w-full"></div></div>}
              </div>
            ))}
            {/* Step 4 - Current */}
            <div className="flex items-center">
              <div className="flex flex-col items-center relative z-10">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md">4</div>
                <span className="absolute top-10 text-xs font-medium text-primary whitespace-nowrap">Voice</span>
              </div>
              <div className="flex-1 h-1 bg-primary/20 mx-2 rounded-full"></div>
            </div>
            {[5, 6, 7].map((step) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center relative z-10">
                  <div className="w-8 h-8 rounded-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-muted flex items-center justify-center font-bold text-sm">{step}</div>
                </div>
                {step < 7 && <div className="flex-1 h-1 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark mx-2 rounded-full"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-3xl font-display font-bold text-text-light dark:text-text-dark mb-6">Select Voice</h1>

          {/* Voice Category Tabs */}
          <div className="flex gap-2 mb-6">
            {(["male", "female", "neutral"] as VoiceCategory[]).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-6 py-3 rounded-lg font-medium transition-colors",
                  activeCategory === category
                    ? "bg-primary text-white"
                    : "bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark hover:bg-primary/10"
                )}
              >
                {category === "male" ? "Erkek" : category === "female" ? "Kadın" : "Notr"}
              </button>
            ))}
          </div>

          {/* Voice Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {voices.map((voice) => (
              <div
                key={voice.id}
                onClick={() => handleVoiceSelect(voice.id)}
                className={cn(
                  "p-4 rounded-xl border-2 cursor-pointer transition-all",
                  selectedVoice === voice.id
                    ? "border-primary bg-primary/5"
                    : "border-border-light dark:border-border-dark hover:border-primary/50"
                )}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-text-light dark:text-text-dark">{voice.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPreview(voice.id);
                    }}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                      playingVoice === voice.id
                        ? "bg-primary text-white"
                        : "bg-surface-light dark:bg-surface-dark hover:bg-primary/20"
                    )}
                  >
                    {playingVoice === voice.id ? (
                      <span className="material-symbols-outlined text-xl">stop</span>
                    ) : (
                      <span className="material-symbols-outlined text-xl">play_arrow</span>
                    )}
                  </button>
                </div>
                <span className="text-xs text-text-muted capitalize">{voice.gender}</span>
              </div>
            ))}
          </div>

          {/* Speed and Pitch Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 border border-border-light dark:border-border-dark">
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium text-text-light dark:text-text-dark">Speed</label>
                <span className="text-primary font-bold">{speed}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-2 bg-border-light dark:bg-border-dark rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-text-muted mt-1">
                <span>0.5x</span>
                <span>2x</span>
              </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 border border-border-light dark:border-border-dark">
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium text-text-light dark:text-text-dark">Pitch</label>
                <span className="text-primary font-bold">{pitch > 0 ? "+" : ""}{pitch}</span>
              </div>
              <input
                type="range"
                min="-12"
                max="12"
                step="1"
                value={pitch}
                onChange={(e) => setPitch(parseInt(e.target.value))}
                className="w-full h-2 bg-border-light dark:bg-border-dark rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-text-muted mt-1">
                <span>-12</span>
                <span>+12</span>
              </div>
            </div>
          </div>

          {/* Voice Cloning (Pro+) */}
          <div 
            className={cn(
              "border-2 border-dashed rounded-xl p-6 mb-6 text-center transition-colors",
              isDragging ? "border-primary bg-primary/5" : "border-border-light dark:border-border-dark"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <span className="material-symbols-outlined text-4xl text-text-muted mb-2">mic</span>
            <p className="text-text-light dark:text-text-dark font-medium mb-1">
              Voice Cloning (Pro+)
            </p>
            <p className="text-sm text-text-muted">
              Upload audio sample (WAV, MP3) to clone your voice
            </p>
          </div>

          {/* Script Preview */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 mb-6 border border-border-light dark:border-border-dark">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-text-light dark:text-text-dark">Script Preview</h2>
              <Button 
                onClick={handleTestVoice}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Test Voice
              </Button>
            </div>
            <div className="p-4 bg-background-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark">
              <p className="text-text-light dark:text-text-dark whitespace-pre-line">{scriptPreview}</p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button 
              variant="outline"
              onClick={handlePrev}
              className="flex items-center gap-2"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Previous
            </Button>
            <Button 
              onClick={handleNext}
              className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
            >
              Next Step
              <span className="material-symbols-outlined">arrow_forward</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
