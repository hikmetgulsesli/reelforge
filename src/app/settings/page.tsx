"use client";
export const dynamic = "force-dynamic";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Header } from "../../components/layout/Header";
import { useAppStore } from "../../lib/store";
import { User, Bell, Shield, CreditCard, Palette, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { plan, credits } = useAppStore();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
  });
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    language: "tr",
  });

  useEffect(() => {
    if (session?.user) {
      setProfile((prev) => ({
        ...prev,
        name: session.user?.name || "",
        email: session.user?.email || "",
      }));
    }
  }, [session]);

  const tabs = [
    { id: "profile", name: "Profil", icon: <User className="w-5 h-5" /> },
    { id: "notifications", name: "Bildirimler", icon: <Bell className="w-5 h-5" /> },
    { id: "security", name: "Güvenlik", icon: <Shield className="w-5 h-5" /> },
    { id: "billing", name: "Faturalama", icon: <CreditCard className="w-5 h-5" /> },
    { id: "appearance", name: "Görünüm", icon: <Palette className="w-5 h-5" /> },
  ];

  const handleSave = () => {
    // Save settings
    console.log("Settings saved:", { profile, notifications });
  };

  if (status === "loading") {
    return (
      <DashboardLayout>
        <Header title="Hesap Ayarları" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[var(--text-muted)]">Yükleniyor...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Header title="Hesap Ayarları" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--surface)] text-[var(--text-muted)] hover:text-white"
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white">Profil Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white mb-1">Ad Soyad</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white mb-1">E-posta</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text-muted)] cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white mb-1">Dil</label>
                    <select
                      value={profile.language}
                      onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    >
                      <option value="tr">Türkçe</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white">Bildirim Ayarları</h3>
                <div className="space-y-4">
                  {[
                    { key: "email", label: "E-posta Bildirimleri", desc: "Render tamamlandığında e-posta al" },
                    { key: "push", label: "Push Bildirimleri", desc: "Tarayıcı bildirimleri al" },
                    { key: "marketing", label: "Pazarlama E-postaları", desc: "Yeni özellikler ve güncellemeler" },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] bg-[var(--background)]"
                    >
                      <div>
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-sm text-[var(--text-muted)]">{item.desc}</p>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications({
                            ...notifications,
                            [item.key]: !notifications[item.key as keyof typeof notifications],
                          })
                        }
                        className={`w-14 h-8 rounded-full transition-colors ${
                          notifications[item.key as keyof typeof notifications]
                            ? "bg-[var(--color-primary)]"
                            : "bg-[var(--color-surface-hover)]"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full bg-white transition-transform ${
                            notifications[item.key as keyof typeof notifications]
                              ? "translate-x-7"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white">Güvenlik Ayarları</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--background)]">
                    <p className="text-white font-medium">Şifre Değiştir</p>
                    <p className="text-sm text-[var(--text-muted)] mb-4">
                      Hesabınızın şifresini güncelleyin
                    </p>
                    <button className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors">
                      Şifre Değiştir
                    </button>
                  </div>
                  <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--background)]">
                    <p className="text-white font-medium">İki Faktörlü Doğrulama</p>
                    <p className="text-sm text-[var(--text-muted)] mb-4">
                      Hesabınıza ekstra güvenlik katmanı ekleyin
                    </p>
                    <button className="px-4 py-2 rounded-lg border border-[var(--border)] text-white hover:bg-[var(--color-surface-hover)] transition-colors">
                      2FA&apos;yı Etkinleştir
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white">Faturalama ve Plan</h3>
                <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--background)]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white font-medium capitalize">{plan} Plan</p>
                      <p className="text-sm text-[var(--text-muted)]">{credits} kredi kaldı</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-sm">
                      Aktif
                    </span>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors">
                    Planı Yükselt
                  </button>
                </div>
                <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--background)]">
                  <p className="text-white font-medium mb-2">Ödeme Yöntemi</p>
                  <p className="text-sm text-[var(--text-muted)]">
                    Kayıtlı ödeme yöntemi bulunmuyor
                  </p>
                  <button className="mt-4 px-4 py-2 rounded-lg border border-[var(--border)] text-white hover:bg-[var(--color-surface-hover)] transition-colors">
                    Kart Ekle
                  </button>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white">Görünüm Ayarları</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["dark", "light", "system"].map((theme) => (
                    <button
                      key={theme}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        theme === "dark"
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                          : "border-[var(--border)] bg-[var(--background)]"
                      }`}
                    >
                      <div
                        className={`w-full h-24 rounded-lg mb-3 ${
                          theme === "dark"
                            ? "bg-gray-900"
                            : theme === "light"
                            ? "bg-gray-100"
                            : "bg-gradient-to-r from-gray-900 to-gray-100"
                        }`}
                      />
                      <p className="text-white font-medium capitalize">
                        {theme === "system" ? "Sistem" : theme === "dark" ? "Karanlık" : "Aydınlık"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                <Save className="w-5 h-5" />
                Kaydet
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}