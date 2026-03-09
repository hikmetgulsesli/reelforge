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
  RefreshCw,
  Mail,
} from "lucide-react";
import Link from "next/link";

// Sidebar navigation items
const navItems = [
  { icon: User, label: "Profilim", href: "/settings", active: false },
  { icon: Shield, label: "Güvenlik", href: "/settings/security", active: false },
  { icon: Code, label: "API Erişimi", href: "/settings/api", active: false },
  { icon: Link2, label: "Bağlı Platformlar", href: "/settings/platforms", active: false },
  { icon: CreditCard, label: "Ödeme Yöntemleri", href: "/settings/payment", active: false },
  { icon: Bell, label: "Bildirimler", href: "/settings/notifications", active: true },
];

interface NotificationSettings {
  email: {
    videoCompleted: boolean;
    creditBalance: boolean;
    newFeatures: boolean;
    marketing: boolean;
    security: boolean;
  };
  push: {
    videoCompleted: boolean;
    creditBalance: boolean;
    newComments: boolean;
    mentions: boolean;
  };
}

export default function SettingsBellPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      videoCompleted: true,
      creditBalance: true,
      newFeatures: false,
      marketing: false,
      security: true,
    },
    push: {
      videoCompleted: true,
      creditBalance: true,
      newComments: false,
      mentions: true,
    },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggle = (category: "email" | "push", key: keyof NotificationSettings["email"] | keyof NotificationSettings["push"]) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key],
      },
    }));
    setSaveSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
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
              Bildirimler
            </h2>
            <p className="text-[var(--text-muted)] mt-2">
              Hangi bildirimleri almak istediğinizi seçin.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            {/* Email Bell */}
            <div className="flex flex-col gap-6 p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="text-xl font-bold text-[var(--text-main)]" style={{ fontFamily: "var(--font-display)" }}>
                  E-posta Bildirimleri
                </h3>
              </div>

              <div className="flex flex-col gap-4">
                <ToggleItem
                  title="Video İşlemi Tamamlandı"
                  description="Video oluşturma işlemi bittiğinde e-posta alın"
                  enabled={settings.email.videoCompleted}
                  onChange={() => handleToggle("email", "videoCompleted")}
                />
                <ToggleItem
                  title="Kredi Bakiyesi Uyarısı"
                  description="Kredi bakiyeniz düşük olduğunda bildirim alın"
                  enabled={settings.email.creditBalance}
                  onChange={() => handleToggle("email", "creditBalance")}
                />
                <ToggleItem
                  title="Yeni Özellikler"
                  description="Platformdaki yeni özellikler hakkında bilgi alın"
                  enabled={settings.email.newFeatures}
                  onChange={() => handleToggle("email", "newFeatures")}
                />
                <ToggleItem
                  title="Pazarlama"
                  description="Kampanyalar ve özel teklifler hakkında bilgi alın"
                  enabled={settings.email.marketing}
                  onChange={() => handleToggle("email", "marketing")}
                />
                <ToggleItem
                  title="Güvenlik"
                  description="Hesap güvenliği ile ilgili önemli bildirimler alın"
                  enabled={settings.email.security}
                  onChange={() => handleToggle("email", "security")}
                />
              </div>
            </div>

            {/* Push Bell */}
            <div className="flex flex-col gap-6 p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="text-xl font-bold text-[var(--text-main)]" style={{ fontFamily: "var(--font-display)" }}>
                  Push Bildirimleri
                </h3>
              </div>

              <div className="flex flex-col gap-4">
                <ToggleItem
                  title="Video İşlemi Tamamlandı"
                  description="Video oluşturma işlemi bittiğinde anlık bildirim alın"
                  enabled={settings.push.videoCompleted}
                  onChange={() => handleToggle("push", "videoCompleted")}
                />
                <ToggleItem
                  title="Kredi Bakiyesi Uyarısı"
                  description="Kredi bakiyeniz düşük olduğunda anlık bildirim alın"
                  enabled={settings.push.creditBalance}
                  onChange={() => handleToggle("push", "creditBalance")}
                />
                <ToggleItem
                  title="Yeni Yorumlar"
                  description="Videolarınıza gelen yorumlardan haberdar olun"
                  enabled={settings.push.newComments}
                  onChange={() => handleToggle("push", "newComments")}
                />
                <ToggleItem
                  title="Etiketlemeler"
                  description="Birisi sizi etiketlediğinde bildirim alın"
                  enabled={settings.push.mentions}
                  onChange={() => handleToggle("push", "mentions")}
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
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

// Toggle Component
function ToggleItem({ 
  title, 
  description, 
  enabled, 
  onChange 
}: { 
  title: string; 
  description: string; 
  enabled: boolean; 
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
      <div>
        <h4 className="text-sm font-medium text-[var(--text-main)]">{title}</h4>
        <p className="text-xs text-[var(--text-muted)]">{description}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? "bg-[var(--primary)]" : "bg-[var(--border)]"
        }`}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
