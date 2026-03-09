'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWizardStore } from '@/lib/wizard-store';
import { 
  CheckCircle, 
  Settings, 
  Mic,
  Subtitles,
  Music,
  Clock,
  Coins,
  Film,
  RotateCcw,
  Smartphone,
  Monitor,
  Square,
  ChevronLeft
} from 'lucide-react';

export default function ReviewStep() {
  const {
    script,
    visualStyle,
    visualStyleName,
    voiceName,
    voiceGender,
    subtitleStyle,
    subtitleColor,
    subtitleOutline,
    musicTrack,
    musicVolume,
    quality,
    aspectRatio,
    isRendering,
    renderProgress,
    agreedToTerms,
    userCredits,
    videoCost,
    startRender,
    updateProgress,
    cancelRender,
    setQuality,
    setAspectRatio,
    setAgreedToTerms,
  } = useWizardStore();

  const [estimatedDuration, setEstimatedDuration] = useState('~00:45');

  // Calculate estimated duration based on script length
  useEffect(() => {
    if (script) {
      const wordCount = script.split(/\s+/).length;
      const minutes = Math.max(1, Math.ceil(wordCount / 150));
      setEstimatedDuration(`~0${minutes}:00`);
    } else {
      setEstimatedDuration('~00:45');
    }
  }, [script]);

  // Simulate render progress
  useEffect(() => {
    if (isRendering && renderProgress < 100) {
      const interval = setInterval(() => {
        const currentProgress = useWizardStore.getState().renderProgress;
        updateProgress(Math.min(100, currentProgress + Math.random() * 5));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRendering, renderProgress, updateProgress]);

  const hasEnoughCredits = userCredits >= videoCost;
  const canRender = agreedToTerms && hasEnoughCredits && !isRendering;

  const handleStartRender = () => {
    if (!agreedToTerms) {
      alert('Lütfen şartları kabul edin.');
      return;
    }
    if (!hasEnoughCredits) {
      alert('Yetersiz kredi! Lütfen kredi satın alın.');
      return;
    }
    startRender();
  };

  const handleCancelRender = () => {
    cancelRender();
  };

  const getSubtitleStyleText = () => {
    const styleText = subtitleStyle === 'bold' ? 'Bold' : subtitleStyle === 'normal' ? 'Normal' : 'Animated';
    const colorText = subtitleColor === '#FFFF00' ? 'Yellow' : subtitleColor === '#FFFFFF' ? 'White' : subtitleColor;
    const outlineText = subtitleOutline ? ', Black Outline' : '';
    return `${styleText}, ${colorText} Text${outlineText}`;
  };

  const getVoiceText = () => {
    const genderText = voiceGender === 'male' ? 'Erkek' : voiceGender === 'female' ? 'Kadın' : 'Nötr';
    return `${voiceName || 'Seçilmedi'} (${genderText})`;
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <header
        className="flex items-center justify-between whitespace-nowrap border-b px-10 py-4"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="flex items-center gap-4" style={{ color: 'var(--primary)' }}>
          <div className="size-6">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
            ReelForge
          </h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <Link href="/dashboard" className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
              Dashboard
            </Link>
            <Link href="/projects" className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
              Projects
            </Link>
            <Link href="/pricing" className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
              Pricing
            </Link>
            <Link href="/settings" className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
              Settings
            </Link>
          </div>
          <div
            className="size-10 rounded-full"
            style={{ background: 'var(--surface-hover)' }}
          ></div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-40 flex flex-1 justify-center py-8">
        <div className="layout-content-container flex flex-col w-full max-w-[1200px] flex-1">
          {/* Page Header & Progress */}
          <div className="flex flex-col gap-6 mb-8">
            <div>
              <h1 className="text-[36px] font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
                İnceleme ve Render
              </h1>
              <p className="text-base" style={{ color: 'var(--text-muted)' }}>
                Adım 7/7: Ayarlarınızı inceleyin ve AI videonuzu oluşturun.
              </p>
            </div>
            <div className="flex flex-col gap-3 max-w-2xl">
              <div className="flex gap-6 justify-between items-end">
                <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Wizard İlerlemesi</p>
                <p className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>100%</p>
              </div>
              <div className="rounded-full h-2 overflow-hidden" style={{ background: 'var(--border)' }}>
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ width: '100%', background: 'var(--primary)' }}
                ></div>
              </div>
              <p className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--primary)' }}>
                <CheckCircle size={16} /> Adım 7/7 Tamamlandı
              </p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Project Summary */}
            <div 
              className="col-span-1 lg:col-span-5 rounded-xl border p-6 shadow-sm"
              style={{ 
                background: 'var(--surface)', 
                borderColor: 'var(--border)' 
              }}
            >
              <h2 
                className="text-[20px] font-bold mb-6 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
              >
                <CheckCircle className="w-5 h-5" /> Proje Özeti
              </h2>
              <div className="flex flex-col gap-4">
                {/* Script */}
                <div 
                  className="flex items-start gap-4 p-4 rounded-lg border"
                  style={{ 
                    background: 'var(--surface-darker)', 
                    borderColor: 'var(--border)' 
                  }}
                >
                  <div style={{ color: 'var(--primary)', marginTop: 4 }}>
                    <CheckCircle size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-main)' }}>Script Önizleme</p>
                    <p className="text-xs line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                      {script || '"Script henüz girilmedi..."'}
                    </p>
                    <Link href="/wizard/video/script" className="text-xs font-medium mt-2 hover:underline" style={{ color: 'var(--primary)' }}>
                      {"Script'i Düzenle"}
                    </Link>
                  </div>
                </div>

                {/* Visual Style */}
                <div 
                  className="flex items-start gap-4 p-4 rounded-lg border"
                  style={{ 
                    background: 'var(--surface-darker)', 
                    borderColor: 'var(--border)' 
                  }}
                >
                  <div style={{ color: 'var(--primary)', marginTop: 4 }}>
                    <CheckCircle size={20} />
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-main)' }}>Görsel Stil</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{visualStyleName || 'Seçilmedi'}</p>
                    </div>
                    <div 
                      className="w-12 h-12 rounded"
                      style={{ 
                        background: visualStyle 
                          ? `linear-gradient(135deg, var(--primary), var(--secondary))` 
                          : 'var(--surface-hover)' 
                      }}
                    ></div>
                  </div>
                </div>

                {/* AI Voice */}
                <div 
                  className="flex items-start gap-4 p-4 rounded-lg border"
                  style={{ 
                    background: 'var(--surface-darker)', 
                    borderColor: 'var(--border)' 
                  }}
                >
                  <div style={{ color: 'var(--primary)', marginTop: 4 }}>
                    <CheckCircle size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-main)' }}>AI Ses</p>
                    <div className="flex items-center gap-2">
                      <Mic size={16} style={{ color: 'var(--text-muted)' }} />
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{getVoiceText()}</p>
                    </div>
                  </div>
                </div>

                {/* Subtitles */}
                <div 
                  className="flex items-start gap-4 p-4 rounded-lg border"
                  style={{ 
                    background: 'var(--surface-darker)', 
                    borderColor: 'var(--border)' 
                  }}
                >
                  <div style={{ color: 'var(--primary)', marginTop: 4 }}>
                    <CheckCircle size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-main)' }}>Altyazı Stili</p>
                    <div className="flex items-center gap-2">
                      <Subtitles size={16} style={{ color: 'var(--text-muted)' }} />
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{getSubtitleStyleText()}</p>
                    </div>
                  </div>
                </div>

                {/* Music */}
                <div 
                  className="flex items-start gap-4 p-4 rounded-lg border"
                  style={{ 
                    background: 'var(--surface-darker)', 
                    borderColor: 'var(--border)' 
                  }}
                >
                  <div style={{ color: 'var(--primary)', marginTop: 4 }}>
                    <CheckCircle size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-main)' }}>Arka Plan Müziği</p>
                    <div className="flex items-center gap-2">
                      <Music size={16} style={{ color: 'var(--text-muted)' }} />
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {musicTrack || 'Seçilmedi'} (Ses: {musicVolume}%)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Settings & Render */}
            <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
              {/* Video Settings */}
              <div 
                className="rounded-xl border p-6 shadow-sm"
                style={{ 
                  background: 'var(--surface)', 
                  borderColor: 'var(--border)' 
                }}
              >
                <h2 
                  className="text-[20px] font-bold mb-6 flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
                >
                  <Settings className="w-5 h-5" /> Video Ayarları
                </h2>
                <div className="flex flex-col gap-6">
                  {/* Quality */}
                  <div>
                    <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-muted)' }}>Çözünürlük Kalitesi</p>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="cursor-pointer">
                        <input
                          checked={quality === '1080p'}
                          onChange={() => setQuality('1080p')}
                          name="quality"
                          type="radio"
                          className="peer sr-only"
                        />
                        <div 
                          className="rounded-lg border-2 p-4 transition-all peer-checked:border-[var(--primary)] peer-checked:bg-[var(--primary)]/5"
                          style={{ borderColor: 'var(--border)' }}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold" style={{ color: 'var(--text-main)' }}>1080p Full HD</span>
                            {quality === '1080p' && (
                              <CheckCircle size={20} style={{ color: 'var(--primary)' }} />
                            )}
                          </div>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Standart kalite, daha hızlı render.</p>
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
                        <div 
                          className="rounded-lg border-2 p-4 transition-all peer-checked:border-[var(--primary)] peer-checked:bg-[var(--primary)]/5"
                          style={{ borderColor: 'var(--border)' }}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold" style={{ color: 'var(--text-main)' }}>4K Ultra HD</span>
                            {quality === '4k' && (
                              <CheckCircle size={20} style={{ color: 'var(--primary)' }} />
                            )}
                          </div>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>En yüksek kalite, daha yavaş render.</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Aspect Ratio */}
                  <div>
                    <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-muted)' }}>En-Boy Oranı</p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setAspectRatio('9:16')}
                        className="flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-lg border-2 transition-all"
                        style={{
                          borderColor: aspectRatio === '9:16' ? 'var(--primary)' : 'var(--border)',
                          background: aspectRatio === '9:16' ? 'var(--primary)/5' : 'transparent',
                          color: aspectRatio === '9:16' ? 'var(--primary)' : 'var(--text-muted)'
                        }}
                      >
                        <Smartphone size={32} />
                        <span className="text-sm font-semibold">9:16</span>
                        <span className="text-xs">Reels / TikTok</span>
                      </button>
                      <button
                        onClick={() => setAspectRatio('16:9')}
                        className="flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-lg border-2 transition-all"
                        style={{
                          borderColor: aspectRatio === '16:9' ? 'var(--primary)' : 'var(--border)',
                          background: aspectRatio === '16:9' ? 'var(--primary)/5' : 'transparent',
                          color: aspectRatio === '16:9' ? 'var(--primary)' : 'var(--text-muted)'
                        }}
                      >
                        <Monitor size={32} />
                        <span className="text-sm font-semibold">16:9</span>
                        <span className="text-xs">YouTube</span>
                      </button>
                      <button
                        onClick={() => setAspectRatio('1:1')}
                        className="flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-lg border-2 transition-all"
                        style={{
                          borderColor: aspectRatio === '1:1' ? 'var(--primary)' : 'var(--border)',
                          background: aspectRatio === '1:1' ? 'var(--primary)/5' : 'transparent',
                          color: aspectRatio === '1:1' ? 'var(--primary)' : 'var(--text-muted)'
                        }}
                      >
                        <Square size={32} />
                        <span className="text-sm font-semibold">1:1</span>
                        <span className="text-xs">Instagram Feed</span>
                      </button>
                    </div>
                  </div>

                  {/* Duration Estimate */}
                  <div 
                    className="p-4 rounded-lg flex items-center justify-between border"
                    style={{ 
                      background: 'var(--surface-darker)', 
                      borderColor: 'var(--border)' 
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Clock style={{ color: 'var(--text-muted)' }} />
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>Tahmini Süre</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Script uzunluğuna göre</p>
                      </div>
                    </div>
                    <p className="font-bold text-lg" style={{ color: 'var(--text-main)' }}>{estimatedDuration}</p>
                  </div>
                </div>
              </div>

              {/* Render Action Area */}
              <div 
                className="rounded-xl border p-6 shadow-sm flex flex-col gap-6"
                style={{ 
                  background: 'var(--surface)', 
                  borderColor: 'var(--border)' 
                }}
              >
                <label className="flex gap-x-3 items-start cursor-pointer">
                  <input
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded"
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    Şartlar ve Koşulları kabul ediyorum ve bu videonun render edilmesinin hesabımdan kredi tüketiceğini anlıyorum.
                  </p>
                </label>

                {!hasEnoughCredits && (
                  <div 
                    className="p-4 rounded-lg flex items-center gap-3"
                    style={{ background: '#fee2e2', border: '1px solid #fecaca' }}
                  >
                    <span style={{ color: '#dc2626' }}>⚠️</span>
                    <p className="text-sm" style={{ color: '#dc2626' }}>
                      Yetersiz kredi! Video render etmek için en az {videoCost} kredi gerekiyor.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between border-t pt-6" style={{ borderColor: 'var(--border)' }}>
                  <div 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                    style={{ background: 'var(--primary)/10', color: 'var(--primary)' }}
                  >
                    <Coins size={18} />
                    <span className="text-sm font-semibold">Maliyet: {videoCost} Kredi</span>
                  </div>
                  <button
                    onClick={handleStartRender}
                    disabled={!canRender}
                    className="px-8 py-3 rounded-lg font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      background: canRender ? 'var(--primary)' : 'var(--surface-hover)',
                      color: 'white',
                      boxShadow: canRender ? '0 10px 15px -3px var(--primary)/30' : 'none'
                    }}
                  >
                    <Film />
                    Render Başlat
                  </button>
                </div>

                {/* Render Progress */}
                {isRendering && (
                  <div 
                    className="p-5 rounded-lg border"
                    style={{ 
                      background: 'var(--surface-darker)', 
                      borderColor: 'var(--border)' 
                    }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2" style={{ color: 'var(--primary)' }}>
                        <RotateCcw className="animate-spin" size={20} />
                        <span className="font-bold text-sm">Video Render Ediliyor...</span>
                      </div>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Tahmini: ~2 dk</span>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1 rounded-full h-3 overflow-hidden" style={{ background: 'var(--border)' }}>
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-rose-400 transition-all duration-300"
                          style={{ width: `${renderProgress}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-sm min-w-[3ch]" style={{ color: 'var(--text-main)' }}>
                        {Math.round(renderProgress)}%
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleCancelRender}
                        className="text-sm font-medium px-4 py-2 rounded-md transition-colors"
                        style={{ 
                          color: 'var(--text-muted)',
                          border: '1px solid var(--border)'
                        }}
                      >
                        {"Render'ı İptal Et"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Render Complete */}
                {renderProgress >= 100 && (
                  <div 
                    className="p-5 rounded-lg border"
                    style={{ 
                      background: '#dcfce7', 
                      borderColor: '#86efac' 
                    }}
                  >
                    <div className="flex items-center gap-2" style={{ color: '#16a34a' }}>
                      <CheckCircle size={20} />
                      <span className="font-bold text-sm">Video Başarıyla Oluşturuldu!</span>
                    </div>
                    <p className="text-sm mt-2" style={{ color: '#16a34a' }}>
                      Videonuz kütüphanenize eklendi.
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <Link
                  href="/wizard/video/subtitles"
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors"
                  style={{ 
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <ChevronLeft /> Geri
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
