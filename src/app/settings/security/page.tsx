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
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";

// Sidebar navigation items
const navItems = [
  { icon: User, label: "Profilim", href: "/settings", active: false },
  { icon: Shield, label: "Güvenlik", href: "/settings/security", active: true },
  { icon: Code, label: "API Erişimi", href: "/settings/api", active: false },
  { icon: Link2, label: "Bağlı Platformlar", href: "/settings/platforms", active: false },
  { icon: CreditCard, label: "Ödeme Yöntemleri", href: "/settings/payment", active: false },
  { icon: Bell, label: "Bildirimler", href: "/settings/notifications", active: false },
];

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SettingsShieldPage() {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: keyof PasswordFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaveSuccess(false);
    setError("");
  };

  const togglePassword = (field: "current" | "new" | "confirm") => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.newPassword.length < 8) {
      setError("Şifre en az 8 karakter olmalıdır");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Yeni şifreler eşleşmiyor");
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setSaveSuccess(true);
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    
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
              Güvenlik
            </h2>
            <p className="text-[var(--text-muted)] mt-2">
              Hesap güvenliğinizi sağlamak için şifrenizi güncelleyin.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            {/* Password Change */}
            <div className="flex flex-col gap-6 p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="text-xl font-bold text-[var(--text-main)]" style={{ fontFamily: "var(--font-display)" }}>
                  Şifre Değiştir
                </h3>
              </div>
              
              <div className="flex flex-col gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[var(--text-main)]">Mevcut Şifre</span>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                      className="rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-main)] focus:border-[var(--primary)] focus:ring-[var(--primary)] h-12 w-full px-4 pr-12"
                      placeholder="Mevcut şifrenizi girin"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePassword("current")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--primary)]"
                      aria-label={showPasswords.current ? "Şifreyi gizle" : "Şifreyi göster"}
                    >
                      {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[var(--text-main)]">Yeni Şifre</span>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange("newPassword", e.target.value)}
                      className="rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-main)] focus:border-[var(--primary)] focus:ring-[var(--primary)] h-12 w-full px-4 pr-12"
                      placeholder="Yeni şifrenizi girin"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePassword("new")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--primary)]"
                      aria-label={showPasswords.new ? "Şifreyi gizle" : "Şifreyi göster"}
                    >
                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">En az 8 karakter, büyük harf, küçük harf ve rakam kullanın</p>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[var(--text-main)]">Yeni Şifre (Tekrar)</span>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-main)] focus:border-[var(--primary)] focus:ring-[var(--primary)] h-12 w-full px-4 pr-12"
                      placeholder="Yeni şifrenizi tekrar girin"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePassword("confirm")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--primary)]"
                      aria-label={showPasswords.confirm ? "Şifreyi gizle" : "Şifreyi göster"}
                    >
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </label>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary)]/90 transition-all flex items-center gap-2"
                >
                  {isSaving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaving ? "Güncelleniyor..." : "Şifremi Güncelle"}
                </Button>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="flex flex-col gap-6 p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-main)]" style={{ fontFamily: "var(--font-display)" }}>
                    İki Faktörlü Kimlik Doğrulama
                  </h3>
                  <p className="text-[var(--text-muted)] text-sm mt-1">
                    Hesabınızı ek güvenlik katmanıyla koruyun
                  </p>
                </div>
                <Button variant="outline" className="text-sm">
                  Etkinleştir
                </Button>
              </div>
            </div>

            {saveSuccess && (
              <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
                Şifreniz başarıyla güncellendi!
              </div>
            )}
          </form>
        </section>
      </main>
    </div>
  );
}
