"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { 
  User, 
  Shield, 
  Code, 
  Link2, 
  CreditCard, 
  Bell, 
  Save, 
  Camera,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

// Sidebar navigation items
const navItems = [
  { icon: User, label: "Profilim", href: "/settings", active: true },
  { icon: Shield, label: "Güvenlik", href: "/settings/security", active: false },
  { icon: Code, label: "API Erişimi", href: "/settings/api", active: false },
  { icon: Link2, label: "Bağlı Platformlar", href: "/settings/platforms", active: false },
  { icon: CreditCard, label: "Ödeme Yöntemleri", href: "/settings/payment", active: false },
  { icon: Bell, label: "Bildirimler", href: "/settings/notifications", active: false },
];

interface ProfileFormData {
  displayName: string;
  email: string;
  bio: string;
  youtubeChannel: string;
  tiktokProfile: string;
}

export default function SettingsProfilePage() {
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: "Alex Yılmaz",
    email: "alex@reelforge.ai",
    bio: "",
    youtubeChannel: "",
    tiktokProfile: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaveSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setSaveSuccess(true);
    
    setTimeout(() => setSaveSuccess(false), 3000);
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
              Profilim
            </h2>
            <p className="text-[var(--text-muted)] mt-2">
              Genel profil bilgilerinizi güncelleyin ve özelleştirin.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            {/* Profile Photo Section */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
              <div 
                className="w-28 h-28 rounded-full bg-[var(--primary)]/20 ring-4 ring-[var(--primary)]/10 flex items-center justify-center"
                aria-label="Kullanıcı profil fotoğrafı"
              >
                <User className="w-12 h-12 text-[var(--primary)]" />
              </div>
              <div className="flex flex-col gap-4 flex-1">
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-main)]" style={{ fontFamily: "var(--font-display)" }}>
                    Profil Fotoğrafı
                  </h3>
                  <p className="text-[var(--text-muted)] text-sm mt-1">
                    PNG veya JPG (Maksimum 5MB boyutunda)
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="default">
                    <Camera className="w-4 h-4 mr-2" />
                    Fotoğrafı Değiştir
                  </Button>
                  <Button type="button" variant="outline">
                    Kaldır
                  </Button>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="flex flex-col gap-6 p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
              <h3 className="text-xl font-bold text-[var(--text-main)]" style={{ fontFamily: "var(--font-display)" }}>
                Kişisel Bilgiler
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[var(--text-main)]">Görünen Ad</span>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange("displayName", e.target.value)}
                    className="rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-main)] focus:border-[var(--primary)] focus:ring-[var(--primary)] h-12 px-4"
                    placeholder="Adınızı girin"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[var(--text-main)]">E-posta Adresi</span>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-main)] focus:border-[var(--primary)] focus:ring-[var(--primary)] h-12 px-4"
                    placeholder="E-posta adresiniz"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[var(--text-main)]">Biyografi</span>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-main)] focus:border-[var(--primary)] focus:ring-[var(--primary)] px-4 py-3 min-h-[120px] resize-y"
                  placeholder="Kendinizden bahsedin..."
                  maxLength={500}
                />
                <p className="text-xs text-[var(--text-muted)] text-right">
                  {formData.bio.length} / 500 karakter
                </p>
              </label>
            </div>

            {/* Social Media Links */}
            <div className="flex flex-col gap-6 p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)]" style={{ fontFamily: "var(--font-display)" }}>
                  Sosyal Medya Bağlantıları
                </h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  Videolarınızı doğrudan bu platformlara aktarmak için hesaplarınızı bağlayın.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[var(--text-main)] flex items-center gap-2">
                    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    YouTube Kanalı
                  </span>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-[var(--text-muted)] text-sm">youtube.com/@</span>
                    <input
                      type="text"
                      value={formData.youtubeChannel}
                      onChange={(e) => handleInputChange("youtubeChannel", e.target.value)}
                      className="rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-main)] focus:border-[var(--primary)] focus:ring-[var(--primary)] h-12 w-full pl-[130px] pr-4"
                      placeholder="kullaniciadi"
                    />
                  </div>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[var(--text-main)] flex items-center gap-2">
                    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                    TikTok Profili
                  </span>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-[var(--text-muted)] text-sm">tiktok.com/@</span>
                    <input
                      type="text"
                      value={formData.tiktokProfile}
                      onChange={(e) => handleInputChange("tiktokProfile", e.target.value)}
                      className="rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-main)] focus:border-[var(--primary)] focus:ring-[var(--primary)] h-12 w-full pl-[120px] pr-4"
                      placeholder="kullaniciadi"
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-4 mb-12">
              <Button 
                type="submit" 
                disabled={isSaving}
                className="px-8 py-3.5 rounded-lg bg-[var(--primary)] text-white text-base font-bold hover:bg-[var(--primary)]/90 shadow-md shadow-[var(--primary)]/20 transition-all flex items-center gap-2"
              >
                {isSaving ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
              </Button>
            </div>

            {saveSuccess && (
              <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
                Değişiklikler başarıyla kaydedildi!
              </div>
            )}
          </form>
        </section>
      </main>
    </div>
  );
}
