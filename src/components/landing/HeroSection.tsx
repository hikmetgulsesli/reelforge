import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Play } from "lucide-react";

export function HeroSection() {
  return (
    <section className="@container">
      <div className="flex flex-col gap-6 px-4 py-10 @[864px]:flex-row-reverse items-center">
        {/* Video Demo Placeholder */}
        <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl @[480px]:min-w-[400px] @[864px]:w-1/2 relative overflow-hidden shadow-2xl shadow-[var(--primary)]/20 border border-[var(--border)]"
          style={{ 
            backgroundImage: `linear-gradient(135deg, var(--color-surface-dark) 0%, var(--color-surface-hover) 100%)` 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background-dark)]/80 to-transparent flex items-end p-6">
            <div className="flex items-center gap-3">
              <button 
                aria-label="Platformu İzle"
                className="flex shrink-0 items-center justify-center rounded-full size-12 bg-[var(--primary)] text-white hover:scale-105 transition-transform"
              >
                <Play className="w-6 h-6 ml-1" fill="currentColor" />
              </button>
              <div>
                <p className="text-white font-bold text-sm">Platformu İzle</p>
                <p className="text-white/80 text-xs">2 dk video</p>
              </div>
            </div>
          </div>
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 via-transparent to-[var(--secondary)]/10 animate-pulse" />
        </div>

        {/* Hero Content */}
        <div className="flex flex-col gap-6 @[480px]:min-w-[400px] @[864px]:w-1/2 @[864px]:justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] w-fit text-sm font-medium border border-[var(--primary)]/20">
            <Sparkles className="w-4 h-4" />
            Yapay Zeka Destekli Video Üretimi
          </div>
          
          <div className="flex flex-col gap-4 text-left">
            <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[864px]:text-6xl text-[var(--text-main)]">
              Yüzünüzü Göstermeden Viral Videolar Oluşturun
            </h1>
            <h2 className="text-base font-normal leading-relaxed text-[var(--text-muted)] @[480px]:text-lg max-w-[600px]">
              Yapay zeka destekli senaryo ve görsel oluşturma ile saniyeler içinde TikTok, Instagram Reels ve YouTube Shorts için izlenme rekorları kıran videolar üretin.
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Button 
              className="min-w-[140px] h-12 px-6 text-base font-bold tracking-[0.015em] bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 shadow-lg shadow-[var(--primary)]/30"
              asChild
            >
              <Link href="/register">Ücretsiz Başlayın</Link>
            </Button>
            <Button 
              variant="outline"
              className="min-w-[140px] h-12 px-6 text-base font-bold tracking-[0.015em] border-[var(--border)] bg-[var(--surface)] text-[var(--text-main)] hover:bg-[var(--surface-hover)]"
              asChild
            >
              <Link href="#how-it-works">Nasıl Çalışır?</Link>
            </Button>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-[var(--background)] bg-gradient-to-br from-purple-500 to-pink-500" />
              <div className="w-8 h-8 rounded-full border-2 border-[var(--background)] bg-gradient-to-br from-blue-500 to-cyan-500" />
              <div className="w-8 h-8 rounded-full border-2 border-[var(--background)] bg-gradient-to-br from-green-500 to-emerald-500" />
              <div className="w-8 h-8 rounded-full border-2 border-[var(--background)] bg-[var(--surface-darker)] flex items-center justify-center text-[10px] font-bold text-white">
                +2K
              </div>
            </div>
            <p className="text-sm text-[var(--text-muted)]">2,000+ içerik üreticisi kullanıyor</p>
          </div>
        </div>
      </div>
    </section>
  );
}
