"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { 
  User, 
  Shield, 
  Code, 
  Link2, 
  CreditCard, 
  Bell, 
  Check,
  Unlink,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

// Sidebar navigation items
const navItems = [
  { icon: User, label: "Profilim", href: "/settings", active: false },
  { icon: Shield, label: "Güvenlik", href: "/settings/security", active: false },
  { icon: Code, label: "API Erişimi", href: "/settings/api", active: false },
  { icon: Link2, label: "Bağlı Platformlar", href: "/settings/platforms", active: true },
  { icon: CreditCard, label: "Ödeme Yöntemleri", href: "/settings/payment", active: false },
  { icon: Bell, label: "Bildirimler", href: "/settings/notifications", active: false },
];

interface Platform {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  username?: string;
}

export default function SettingsPlatformsPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([
    { id: "youtube", name: "YouTube", icon: "youtube", connected: false },
    { id: "tiktok", name: "TikTok", icon: "tiktok", connected: false },
    { id: "instagram", name: "Instagram", icon: "instagram", connected: false },
  ]);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const handleConnect = async (platformId: string) => {
    setIsConnecting(platformId);
    // Simulate OAuth connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    setPlatforms(prev => prev.map(p => 
      p.id === platformId 
        ? { ...p, connected: true, username: "kullanici_adi" }
        : p
    ));
    setIsConnecting(null);
  };

  const handleDisconnect = (platformId: string) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId 
        ? { ...p, connected: false, username: undefined }
        : p
    ));
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-[var(--border)] px-10 py-4 bg-[var(--surface)] sticky top-0 z-10">
        <div className="flex items-center gap-4 text-[var(--primary)]">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
            </svg>
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-tight text-[var(--text-main)]" style={{ fontFamily: "var(--font-display)" }}>
            ReelForge
          </h2>
        </div>
        <div className="flex flex-1 justify-end gap-6 items-center">
          <button className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors" aria-label="Yardım">
            <User className="w-5 h-5" />
          </button>
          <div 
            className="w-10 h-10 rounded-full bg-[var(--primary)]/20 ring-2 ring-[var(--primary)]/30 cursor-pointer"
            aria-label="Kullanıcı profil fotoğrafı"
          />
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 flex flex-col gap-6">
          <div className="flex flex-col px-2">
            <h1 className="text-2xl font-bold leading-normal text-[var(--text-main)] mb-1" style={{ fontFamily: "var(--font-display)" }}>
              Hesap Yönetimi
            </h1>
            <p className="text-[var(--text-muted)] text-sm">Ayarlarınızı yönetin</p>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active 
                    ? "bg-[var(--primary)] text-white font-medium" 
                    : "text-[var(--text-muted)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <section className="flex-1 flex flex-col gap-8">
          <div className="border-b border-[var(--border)] pb-6">
            <h2 className="text-3xl font-bold leading-tight text-[var(--text-main)]" style={{ fontFamily: "var(--font-display)" }}>
              Bağlı Platformlar
            </h2>
            <p className="text-[var(--text-muted)] mt-2">
              Video yayınlamak için sosyal medya hesaplarınızı bağlayın.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {platforms.map((platform) => (
              <div 
                key={platform.id}
                className="flex items-center justify-between p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm"
              >
                <div className="flex items-center gap-4">
                  {/* Platform Icon */}
                  <div className="w-12 h-12 rounded-lg bg-[var(--surface-darker)] flex items-center justify-center">
                    {platform.icon === "youtube" && (
                      <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    )}
                    {platform.icon === "tiktok" && (
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                    )}
                    {platform.icon === "instagram" && (
                      <svg className="w-6 h-6 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-main)]">{platform.name}</h3>
                    {platform.connected ? (
                      <p className="text-sm text-green-500 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        @{platform.username} hesabı bağlı
                      </p>
                    ) : (
                      <p className="text-sm text-[var(--text-muted)]">Hesabınızı bağlayın</p>
                    )}
                  </div>
                </div>

                {platform.connected ? (
                  <Button
                    variant="outline"
                    onClick={() => handleDisconnect(platform.id)}
                    className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                  >
                    <Unlink className="w-4 h-4 mr-2" />
                    Bağlantıyı Kes
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    onClick={() => handleConnect(platform.id)}
                    disabled={isConnecting === platform.id}
                  >
                    {isConnecting === platform.id ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Link2 className="w-4 h-4 mr-2" />
                    )}
                    {isConnecting === platform.id ? "Bağlanıyor..." : "Bağla"}
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="flex flex-col gap-4 p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <h3 className="text-lg font-semibold text-[var(--text-main)]">
              Platform Bağlantısı Hakkında
            </h3>
            <ul className="list-disc list-inside text-[var(--text-muted)] text-sm space-y-2">
              <li>Hesaplarınızı bağlayarak videolarınızı doğrudan yayınlayabilirsiniz</li>
              <li>Bağlantı işlemi OAuth ile güvenli bir şekilde gerçekleştirilir</li>
              <li>İstediğiniz zaman hesapların bağlantısını kesebilirsiniz</li>
              <li>Hesap bilgileriniz sadece video yayınlama için kullanılır</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
