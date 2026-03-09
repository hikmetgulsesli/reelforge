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
  Save, 
  Lock,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  Eye,
  EyeOff
} from "lucide-react";
import Link from "next/link";

// Sidebar navigation items
const navItems = [
  { icon: User, label: "Profilim", href: "/settings", active: false },
  { icon: Shield, label: "Güvenlik", href: "/settings/security", active: false },
  { icon: Code, label: "API Erişimi", href: "/settings/api", active: true },
  { icon: Link2, label: "Bağlı Platformlar", href: "/settings/platforms", active: false },
  { icon: CreditCard, label: "Ödeme Yöntemleri", href: "/settings/payment", active: false },
  { icon: Bell, label: "Bildirimler", href: "/settings/notifications", active: false },
];

export default function SettingsApiPage() {
  const [showApiLock, setShowApiLock] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Demo API key - in real app this would come from user data
  const apiLock = "rf_sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6";

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRegenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiLock);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              API Erişimi
            </h2>
            <p className="text-[var(--text-muted)] mt-2">
              Uygulamalarınız için API anahtarlarınızı yönetin.
            </p>
          </div>

          {/* Plan Restriction Notice */}
          <div className="flex flex-col gap-4 p-6 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-[var(--text-main)]">
                Business Plan Gereksinimi
              </h3>
            </div>
            <p className="text-[var(--text-muted)] text-sm">
              API erişimi yalnızca Business plan kullanıcıları için mevcuttur. 
              Mevcut planınızı yükseltmek için{" "}
              <Link href="/settings/payment" className="text-[var(--primary)] hover:underline">
                Ödeme Yöntemleri
              </Link>{" "}
              sayfasını ziyaret edebilirsiniz.
            </p>
          </div>

          {/* API Lock Section */}
          <div className="flex flex-col gap-6 p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-[var(--primary)]" />
              <h3 className="text-xl font-bold text-[var(--text-main)]" style={{ fontFamily: "var(--font-display)" }}>
                API Anahtarınız
              </h3>
            </div>
            
            <p className="text-[var(--text-muted)] text-sm">
              Bu anahtarı uygulamalarınızda kimlik doğrulama için kullanabilirsiniz. 
              Anahtarınızı güvende tutun ve asla paylaşmayın.
            </p>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-[var(--text-main)]">API Lock</label>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-lg bg-[var(--surface-darker)] border border-[var(--border)] font-mono text-sm">
                  {showApiLock ? apiLock : "•".repeat(apiLock.length)}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowApiLock(!showApiLock)}
                  aria-label={showApiLock ? "API anahtarını gizle" : "API anahtarını göster"}
                >
                  {showApiLock ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  aria-label="API anahtarını kopyala"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--text-muted)]">
                Son oluşturulma: 15 Ocak 2026
              </p>
              <Button
                variant="outline"
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="text-sm"
              >
                {isRegenerating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {isRegenerating ? "Oluşturuluyor..." : "Anahtarı Yenile"}
              </Button>
            </div>
          </div>

          {/* API Usage */}
          <div className="flex flex-col gap-6 p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
            <h3 className="text-xl font-bold text-[var(--text-main)]" style={{ fontFamily: "var(--font-display)" }}>
              API Kullanım İstatistikleri
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-[var(--surface-darker)]">
                <p className="text-[var(--text-muted)] text-sm">Bu Ay</p>
                <p className="text-2xl font-bold text-[var(--primary)]">0 / 1000</p>
                <p className="text-xs text-[var(--text-muted)]">istek</p>
              </div>
              <div className="p-4 rounded-lg bg-[var(--surface-darker)]">
                <p className="text-[var(--text-muted)] text-sm">Toplam İstek</p>
                <p className="text-2xl font-bold text-[var(--primary)]">0</p>
                <p className="text-xs text-[var(--text-muted)]">tüm zamanlar</p>
              </div>
              <div className="p-4 rounded-lg bg-[var(--surface-darker)]">
                <p className="text-[var(--text-muted)] text-sm">Ortalama Yanıt Süresi</p>
                <p className="text-2xl font-bold text-[var(--primary)]">0ms</p>
                <p className="text-xs text-[var(--text-muted)]">son 24 saat</p>
              </div>
            </div>
          </div>

          {/* Documentation Link */}
          <div className="flex flex-col gap-4 p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
            <h3 className="text-xl font-bold text-[var(--text-main)]" style={{ fontFamily: "var(--font-display)" }}>
              API Dokümantasyonu
            </h3>
            <p className="text-[var(--text-muted)] text-sm">
              API&apos;imizi nasıl kullanacağınızı öğrenmek için dokümantasyonu inceleyin.
            </p>
            <Button variant="outline" className="self-start">
              API Dokümantasyonu
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
