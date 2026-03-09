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
  AlertTriangle,
  Trash,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

// Sidebar navigation items
const navItems = [
  { icon: User, label: "Profilim", href: "/settings", active: false },
  { icon: Shield, label: "Güvenlik", href: "/settings/security", active: false },
  { icon: Code, label: "API Erişimi", href: "/settings/api", active: false },
  { icon: Link2, label: "Bağlı Platformlar", href: "/settings/platforms", active: false },
  { icon: CreditCard, label: "Ödeme Yöntemleri", href: "/settings/payment", active: true },
  { icon: Bell, label: "Bildirimler", href: "/settings/notifications", active: false },
];

const plans = [
  {
    id: "free",
    name: "Ücretsiz",
    price: 0,
    period: "",
    videos: 3,
    features: ["3 video", "Temel özellikler", "Watermark"],
  },
  {
    id: "starter",
    name: "Starter",
    price: 19,
    period: "ay",
    videos: 30,
    features: ["30 video", "Tüm stiller", "HD kalite", "Öncelikli destek"],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 49,
    period: "ay",
    videos: 80,
    features: ["80 video", "Tüm stiller", "4K kalite", "Öncelikli destek", "API erişimi"],
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    price: 99,
    period: "ay",
    videos: 200,
    features: ["200 video", "Tüm stiller", "4K kalite", "Özel destek", "Tam API erişimi", "Seri modu"],
    popular: false,
  },
];

export default function SettingsPaymentPage() {
  const [currentPlan] = useState("free");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
              Ödeme Yöntemleri
            </h2>
            <p className="text-[var(--text-muted)] mt-2">
              Planınızı yönetin ve ödeme yöntemlerinizi ekleyin.
            </p>
          </div>

          {/* Current Plan */}
          <div className="flex flex-col gap-4 p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)]" style={{ fontFamily: "var(--font-display)" }}>
                  Mevcut Plan
                </h3>
                <p className="text-[var(--text-muted)] text-sm mt-1">
                  {currentPlan === "free" ? "Ücretsiz planı kullanıyorsunuz" : "Business plan aktif"}
                </p>
              </div>
              <div className="px-4 py-2 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] font-semibold">
                {plans.find(p => p.id === currentPlan)?.name}
              </div>
            </div>
            
            {currentPlan === "free" && (
              <div className="pt-4 border-t border-[var(--border)]">
                <p className="text-sm text-[var(--text-muted)] mb-3">
                  {plans.find(p => p.id === "free")?.videos} / {plans.find(p => p.id === "free")?.videos} video kullanıldı
                </p>
                <div className="w-full h-2 rounded-full bg-[var(--surface-darker)] overflow-hidden">
                  <div 
                    className="h-full bg-[var(--primary)] rounded-full"
                    style={{ width: "100%" }}
                  />
                </div>
                <Button className="mt-4">
                  Planı Yükselt
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Pricing Plans */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-[var(--text-main)]" style={{ fontFamily: "var(--font-display)" }}>
              Planlar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`relative flex flex-col gap-4 p-6 rounded-xl bg-[var(--surface)] border ${
                    plan.popular 
                      ? "border-[var(--primary)] shadow-lg shadow-[var(--primary)]/10" 
                      : "border-[var(--border)]"
                  } ${currentPlan === plan.id ? "ring-2 ring-[var(--primary)]" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--primary)] text-white text-xs font-semibold">
                      Popüler
                    </div>
                  )}
                  {currentPlan === plan.id && (
                    <div className="absolute top-4 right-4">
                      <Check className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-lg font-bold text-[var(--text-main)]">{plan.name}</h4>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-bold text-[var(--primary)]">{plan.price}</span>
                      <span className="text-[var(--text-muted)]">{plan.period}</span>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mt-1">{plan.videos} video</p>
                  </div>

                  <ul className="flex flex-col gap-2 mt-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                        <Check className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant={currentPlan === plan.id ? "outline" : "default"}
                    disabled={currentPlan === plan.id}
                    className="mt-auto"
                  >
                    {currentPlan === plan.id ? "Mevcut Plan" : "Seç"}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex flex-col gap-4 p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <h3 className="text-xl font-bold text-[var(--text-main)]" style={{ fontFamily: "var(--font-display)" }}>
              Ödeme Yöntemi
            </h3>
            <p className="text-[var(--text-muted)] text-sm">
              Henüz kayıtlı bir ödeme yönteminiz yok.
            </p>
            <Button variant="outline">
              Ödeme Yöntemi Ekle
            </Button>
          </div>

          {/* Danger Zone */}
          <div className="flex flex-col gap-4 p-6 rounded-xl bg-red-500/5 border border-red-500/20">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="text-xl font-bold text-red-500" style={{ fontFamily: "var(--font-display)" }}>
                Tehlike Bölgesi
              </h3>
            </div>
            <p className="text-[var(--text-muted)] text-sm">
              Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve tüm verileriniz kalıcı olarak silinir.
            </p>
            {!showDeleteConfirm ? (
              <Button 
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash className="w-4 h-4 mr-2" />
                Hesabımı Sil
              </Button>
            ) : (
              <div className="flex flex-col gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-red-500 font-medium">
                  Bu işlemi onaylamak için &quot;HESABIMI SİL&quot; yazın:
                </p>
                <input 
                  type="text" 
                  placeholder="HESABIMI SİL"
                  className="px-4 py-2 rounded-lg border border-red-500/30 bg-transparent text-[var(--text-main)] focus:border-red-500"
                />
                <div className="flex gap-2">
                  <Button 
                    variant="destructive"
                    size="sm"
                  >
                    Hesabımı Kalıcı Olarak Sil
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    İptal
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
