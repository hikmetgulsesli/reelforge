"use client";

import { MusicWizard } from "@/components/music";
import { Button } from "@/components/ui/button";

export default function MusicWizardPage() {
  return (
    <main className="flex-1 flex flex-col max-w-[1200px] w-full mx-auto px-4 py-8 md:px-8">
      {/* Progress Stepper */}
      <div className="flex flex-col gap-3 mb-8 w-full max-w-3xl mx-auto">
        <div className="flex gap-6 justify-between items-end">
          <p className="font-display text-lg font-semibold">Step 6: Background Music</p>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">6 of 7</p>
        </div>
        <div className="rounded-full bg-primary/20 h-2.5 w-full overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all duration-500 ease-out" style={{ width: "85%" }}></div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="font-display tracking-tight text-3xl md:text-4xl font-bold mb-2">
          Select Background Music
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Choose a track to set the mood for your video, or upload your own.
        </p>
      </div>

      {/* Music Wizard Component */}
      <MusicWizard />

      {/* Navigation Buttons */}
      <div className="mt-auto pt-8 border-t border-primary/20 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Button
          variant="outline"
          className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-primary/20 text-slate-700 dark:text-slate-300 font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back
        </Button>
        <Button
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
        >
          Next: Final Export
          <span className="material-symbols-outlined">arrow_forward</span>
        </Button>
      </div>
    </main>
  );
}