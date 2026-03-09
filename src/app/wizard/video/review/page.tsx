'use client';

import { useWizardStore, calculateCreditCost, voiceDisplayNames, styleDisplayNames, musicDisplayNames } from '@/lib/wizard-store';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const MaterialSymbol = ({ name, className }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className || ''}`}>{name}</span>
);

export default function WizardReviewStep() {
  const {
    script,
    selectedStyle,
    selectedVoice,
    subtitleStyle,
    subtitleColor,
    musicGenre,
    musicVolume,
    aspectRatio,
    quality,
    duration,
    agreeToTerms,
    isRendering,
    renderProgress,
    setAgreeToTerms,
    setIsRendering,
    setRenderProgress,
    setAspectRatio,
    setQuality,
    setStep,
  } = useWizardStore();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const creditCost = calculateCreditCost(duration);

  // Simulate rendering progress
  useEffect(() => {
    if (isRendering && renderProgress < 100) {
      const timer = setInterval(() => {
        setRenderProgress(Math.min(renderProgress + 5, 100));
      }, 2000);
      return () => clearInterval(timer);
    }
  }, [isRendering, renderProgress, setRenderProgress]);

  const handleStartRender = () => {
    if (!agreeToTerms) return;
    setShowConfirmModal(true);
  };

  const confirmRender = () => {
    setShowConfirmModal(false);
    setIsRendering(true);
    setRenderProgress(0);
  };

  const handleCancelRender = () => {
    setIsRendering(false);
    setRenderProgress(0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const estimatedTime = isRendering 
    ? Math.max(1, Math.ceil((100 - renderProgress) * 0.04)) 
    : 2;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 px-10 py-4 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-4 text-[var(--primary)]">
          <div className="size-6">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-[-0.015em]">
            ReelForge
          </h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <a className="text-slate-600 dark:text-slate-300 hover:text-[var(--primary)] transition-colors text-sm font-medium" href="#">
              Dashboard
            </a>
            <a className="text-slate-600 dark:text-slate-300 hover:text-[var(--primary)] transition-colors text-sm font-medium" href="#">
              Projects
            </a>
            <a className="text-slate-600 dark:text-slate-300 hover:text-[var(--primary)] transition-colors text-sm font-medium" href="#">
              Pricing
            </a>
            <a className="text-slate-600 dark:text-slate-300 hover:text-[var(--primary)] transition-colors text-sm font-medium" href="#">
              Settings
            </a>
          </div>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-40 flex flex-1 justify-center py-8">
        <div className="layout-content-container flex flex-col w-full max-w-[1200px] flex-1">
          {/* Page Header & Progress */}
          <div className="flex flex-col gap-6 mb-8">
            <div>
              <h1 className="text-slate-900 dark:text-slate-100 tracking-tight text-[36px] font-bold leading-tight mb-2">
                Review and Render
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base">
                Step 7 of 7: Review your settings and generate your AI video.
              </p>
            </div>
            <div className="flex flex-col gap-3 max-w-2xl">
              <div className="flex gap-6 justify-between items-end">
                <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">Wizard Progress</p>
                <p className="text-slate-700 dark:text-slate-300 text-sm font-bold">100%</p>
              </div>
              <div className="rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden h-2">
                <div 
                  className="h-full rounded-full bg-[var(--primary)] transition-all duration-500" 
                  style={{ width: '100%' }}
                ></div>
              </div>
              <p className="text-[var(--primary)] text-sm font-medium flex items-center gap-1">
                <MaterialSymbol name="check_circle" className="text-[16px]" />
                Step 7/7 Complete
              </p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Project Summary */}
            <div className="col-span-1 lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h2 className="text-slate-900 dark:text-slate-100 text-[20px] font-bold leading-tight mb-6 flex items-center gap-2">
                <MaterialSymbol name="fact_check" />
                Project Summary
              </h2>
              <div className="flex flex-col gap-4">
                {/* Script */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[var(--primary)] mt-1">
                    <MaterialSymbol name="check_circle" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold mb-1">Script Preview</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2">&#34;{script}&#34;</p>
                    <button 
                      onClick={() => setStep('script')}
                      className="text-[var(--primary)] text-xs font-medium mt-2 hover:underline"
                    >
                      Edit Script
                    </button>
                  </div>
                </div>

                {/* Visual Style */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[var(--primary)] mt-1">
                    <MaterialSymbol name="check_circle" />
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold mb-1">Visual Style</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">{styleDisplayNames[selectedStyle]}</p>
                    </div>
                    <button 
                      onClick={() => setStep('visuals')}
                      className="text-[var(--primary)] text-xs font-medium hover:underline"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* AI Voice */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[var(--primary)] mt-1">
                    <MaterialSymbol name="check_circle" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold mb-1">AI Voice</p>
                    <div className="flex items-center gap-2">
                      <MaterialSymbol name="record_voice_over" className="text-[16px] text-slate-400" />
                      <p className="text-slate-500 dark:text-slate-400 text-xs">
                        {voiceDisplayNames[selectedVoice].name} ({voiceDisplayNames[selectedVoice].lang}, {voiceDisplayNames[selectedVoice].vibe})
                      </p>
                    </div>
                    <button 
                      onClick={() => setStep('voice')}
                      className="text-[var(--primary)] text-xs font-medium mt-2 hover:underline"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Subtitles */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[var(--primary)] mt-1">
                    <MaterialSymbol name="check_circle" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold mb-1">Subtitle Style</p>
                    <div className="flex items-center gap-2">
                      <MaterialSymbol name="subtitles" className="text-[16px] text-slate-400" />
                      <p className="text-slate-500 dark:text-slate-400 text-xs">
                        {subtitleStyle.charAt(0).toUpperCase() + subtitleStyle.slice(1)}, {subtitleColor} Text
                      </p>
                    </div>
                    <button 
                      onClick={() => setStep('subtitles')}
                      className="text-[var(--primary)] text-xs font-medium mt-2 hover:underline"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Music */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[var(--primary)] mt-1">
                    <MaterialSymbol name="check_circle" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold mb-1">Background Music</p>
                    <div className="flex items-center gap-2">
                      <MaterialSymbol name="music_note" className="text-[16px] text-slate-400" />
                      <p className="text-slate-500 dark:text-slate-400 text-xs">
                        {musicDisplayNames[musicGenre]} (Volume: {musicVolume}%)
                      </p>
                    </div>
                    <button 
                      onClick={() => setStep('music')}
                      className="text-[var(--primary)] text-xs font-medium mt-2 hover:underline"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Settings & Render */}
            <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
              {/* Video Settings */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <h2 className="text-slate-900 dark:text-slate-100 text-[20px] font-bold leading-tight mb-6 flex items-center gap-2">
                  <MaterialSymbol name="settings" />
                  Video Settings
                </h2>
                <div className="flex flex-col gap-6">
                  {/* Quality */}
                  <div>
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium mb-3">Resolution Quality</p>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="cursor-pointer">
                        <input
                          checked={quality === '1080p'}
                          onChange={() => setQuality('1080p')}
                          name="quality"
                          type="radio"
                          className="peer sr-only"
                        />
                        <div className={`rounded-lg border-2 border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 peer-checked:border-[var(--primary)] peer-checked:bg-[var(--primary)]/5 transition-all`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-slate-900 dark:text-slate-100 font-bold">1080p Full HD</span>
                            <MaterialSymbol 
                              name="check_circle" 
                              className={`text-[var(--primary)] peer-checked:block hidden`} 
                            />
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs">Standard high quality, faster render.</p>
                        </div>
                      </label>
                      <label className="cursor-pointer">
                        <input
                          checked={quality === '4k'}
                          onChange={() => setQuality('4k')}
                          name="quality"
                          type="radio"
                          className="peer sr-only"
                        />
                        <div className={`rounded-lg border-2 border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 peer-checked:border-[var(--primary)] peer-checked:bg-[var(--primary)]/5 transition-all`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-slate-900 dark:text-slate-100 font-bold">4K Ultra HD</span>
                            <MaterialSymbol 
                              name="check_circle" 
                              className={`text-[var(--primary)] hidden peer-checked:block`} 
                            />
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs">Highest quality, slower render.</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Aspect Ratio */}
                  <div>
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium mb-3">Aspect Ratio</p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setAspectRatio('9:16')}
                        className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-lg border-2 ${
                          aspectRatio === '9:16' 
                            ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]' 
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                        } transition-all`}
                      >
                        <MaterialSymbol name="smartphone" className="text-[32px]" />
                        <span className="text-sm font-semibold">9:16</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Reels / TikTok</span>
                      </button>
                      <button
                        onClick={() => setAspectRatio('16:9')}
                        className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-lg border-2 ${
                          aspectRatio === '16:9' 
                            ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]' 
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                        } transition-all`}
                      >
                        <MaterialSymbol name="desktop_windows" className="text-[32px]" />
                        <span className="text-sm font-semibold">16:9</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">YouTube</span>
                      </button>
                      <button
                        onClick={() => setAspectRatio('1:1')}
                        className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-lg border-2 ${
                          aspectRatio === '1:1' 
                            ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]' 
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                        } transition-all`}
                      >
                        <MaterialSymbol name="crop_square" className="text-[32px]" />
                        <span className="text-sm font-semibold">1:1</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Instagram Feed</span>
                      </button>
                    </div>
                  </div>

                  {/* Duration Estimate */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg flex items-center justify-between border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <MaterialSymbol name="schedule" className="text-slate-400" />
                      <div>
                        <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Estimated Duration</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">Based on script length</p>
                      </div>
                    </div>
                    <p className="text-slate-900 dark:text-slate-100 font-bold text-lg">~{formatDuration(duration)}</p>
                  </div>
                </div>
              </div>

              {/* Render Action Area */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col gap-6">
                <label className="flex gap-x-3 items-start cursor-pointer">
                  <input
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-slate-300 dark:border-slate-600 bg-transparent text-[var(--primary)] focus:ring-[var(--primary)] focus:ring-offset-0 focus:outline-none"
                  />
                  <p className="text-slate-600 dark:text-slate-300 text-sm font-normal">
                    I agree to the Terms and Conditions and understand that rendering this video will consume credits from my account balance.
                  </p>
                </label>

                {!isRendering && (
                  <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6">
                    <div className="flex items-center gap-2 bg-[var(--primary)]/10 px-3 py-1.5 rounded-full text-[var(--primary)]">
                      <MaterialSymbol name="monetization_on" className="text-[18px]" />
                      <span className="text-sm font-semibold">Cost: {creditCost} Credit{creditCost > 1 ? 's' : ''}</span>
                    </div>
                    <Button
                      onClick={handleStartRender}
                      disabled={!agreeToTerms}
                      className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-[var(--primary)]/30 transition-all flex items-center gap-2"
                    >
                      <MaterialSymbol name="movie" />
                      Start Render
                    </Button>
                  </div>
                )}

                {/* Render State */}
                {isRendering && (
                  <div className="mt-4 p-5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2 text-[var(--primary)]">
                        <MaterialSymbol name="sync" className="animate-spin">sync</MaterialSymbol>
                        <span className="font-bold text-sm">Rendering Video...</span>
                      </div>
                      <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">ETA: ~{estimatedTime} mins</span>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden h-3">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-rose-400 transition-all duration-300" 
                          style={{ width: `${renderProgress}%` }}
                        ></div>
                      </div>
                      <span className="text-slate-900 dark:text-slate-100 font-bold text-sm min-w-[3ch]">{renderProgress}%</span>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleCancelRender}
                        className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-medium px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md transition-colors"
                      >
                        Cancel Render
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Previous Navigation */}
              <div className="flex justify-start">
                <button
                  onClick={() => setStep('music')}
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[var(--primary)] transition-colors"
                >
                  <MaterialSymbol name="arrow_back" />
                  <span className="text-sm font-medium">Back to Music Selection</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Confirm Render</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              You are about to render a {duration >= 60 ? Math.floor(duration/60) + ' minute' : duration + ' second'} video in {quality} {aspectRatio} format. 
              This will consume <strong>{creditCost} credit{creditCost > 1 ? 's' : ''}</strong> from your account.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRender}
                className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary)]/90 transition-colors"
              >
                Confirm & Start
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
