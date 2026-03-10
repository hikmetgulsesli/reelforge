"use client";

import { Check, X, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const plans = [
  {
    id: "free",
    name: "Free",
    amount: 0,
    currency: "₺",
    period: "/ay",
    description: "Yeni başlayanlar için ideal",
    features: [
      { text: "3 video/ay", included: true },
      { text: "Temel AI senaryo", included: true },
      { text: "5 görsel stil", included: true },
      { text: "Standart sesler", included: true },
      { text: "Su işareti", included: false },
      { text: "Öncelikli render", included: false },
      { text: "Voice cloning", included: false },
      { text: "API erişimi", included: false },
    ],
    cta: "Ücretsiz Başla",
    popular: false,
  },
  {
    id: "starter",
    name: "Starter",
    amount: 499,
    currency: "₺",
    period: "/ay",
    description: "Düzenli içerik üreticileri için",
    features: [
      { text: "30 video/ay", included: true },
      { text: "Gelişmiş AI senaryo", included: true },
      { text: "10 görsel stil", included: true },
      { text: "Premium sesler", included: true },
      { text: "Su işareti yok", included: true },
      { text: "Öncelikli render", included: false },
      { text: "Voice cloning", included: false },
      { text: "API erişimi", included: false },
    ],
    cta: "Başla",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    amount: 999,
    currency: "₺",
    period: "/ay",
    description: "Profesyonel içerik üreticileri için",
    features: [
      { text: "80 video/ay", included: true },
      { text: "Sınırsız AI senaryo", included: true },
      { text: "Tüm görsel stiller", included: true },
      { text: "Tüm premium sesler", included: true },
      { text: "Su işareti yok", included: true },
      { text: "Öncelikli render", included: true },
      { text: "Voice cloning", included: true },
      { text: "API erişimi", included: false },
    ],
    cta: "Başla",
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    amount: 1999,
    currency: "₺",
    period: "/ay",
    description: "Ekipler ve ajanslar için",
    features: [
      { text: "200 video/ay", included: true },
      { text: "Sınırsız AI senaryo", included: true },
      { text: "Tüm görsel stiller", included: true },
      { text: "Tüm premium sesler", included: true },
      { text: "Su işareti yok", included: true },
      { text: "Öncelikli render", included: true },
      { text: "Voice cloning", included: true },
      { text: "API erişimi", included: true },
    ],
    cta: "İletişime Geç",
    popular: false,
  },
];

const formatPrice = (amount: number, currency: string) => {
  if (amount === 0) return `${currency}0`;
  return `${currency}${amount.toLocaleString("tr-TR")}`;
};

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-primary)] to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white font-[family-name:var(--font-display)]">
                ReelForge
              </span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-[var(--text-muted)] hover:text-white transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                Kayıt Ol
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-display)] mb-4">
            Basit ve Şeffaf Fiyatlandırma
          </h1>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
            İhtiyaçlarınıza uygun planı seçin. İstediğiniz zaman yükseltin veya iptal edin.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span
              className={`text-sm ${
                billingCycle === "monthly" ? "text-white" : "text-[var(--text-muted)]"
              }`}
            >
              Aylık
            </span>
            <button
              onClick={() =>
                setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
              }
              className={`w-14 h-8 rounded-full transition-colors ${
                billingCycle === "yearly"
                  ? "bg-[var(--color-primary)]"
                  : "bg-[var(--color-surface-hover)]"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  billingCycle === "yearly" ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm ${
                billingCycle === "yearly" ? "text-white" : "text-[var(--text-muted)]"
              }`}
            >
              Yıllık <span className="text-green-400">%20 indirim</span>
            </span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-[var(--surface)] rounded-2xl border-2 p-6 ${
                plan.popular
                  ? "border-[var(--color-primary)]"
                  : "border-[var(--border)]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-[var(--color-primary)] text-white text-xs font-medium">
                    En Popüler
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-[var(--text-muted)]">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white font-[family-name:var(--font-display)]">
                    {billingCycle === "yearly"
                      ? formatPrice(Math.round(plan.amount * 0.8), plan.currency)
                      : formatPrice(plan.amount, plan.currency)}
                  </span>
                  <span className="text-[var(--text-muted)]">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        feature.included ? "text-white" : "text-[var(--text-muted)]"
                      }`}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.id === "business" ? "/contact" : "/register"}
                className={`block w-full py-3 rounded-xl text-center font-medium transition-colors ${
                  plan.popular
                    ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                    : "bg-[var(--color-surface-hover)] text-white hover:bg-[var(--color-primary)]/20"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Sık Sorulan Sorular
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: "Kullanmadığım krediler bir sonraki aya aktarılır mı?",
                a: "Hayır, krediler her ay sıfırlanır. Bu yüzden ihtiyacınıza uygun planı seçmenizi öneririz.",
              },
              {
                q: "İstediğim zaman plan değiştirebilir miyim?",
                a: "Evet, istediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz. Değişiklik anında uygulanır.",
              },
              {
                q: "Para iadesi var mı?",
                a: "Satın alma tarihinden itibaren 14 gün içinde %100 para iadesi sunuyoruz.",
              },
              {
                q: "API erişimi nasıl çalışır?",
                a: "Business planında API anahtarı alabilir ve kendi uygulamalarınızda ReelForge özelliklerini kullanabilirsiniz.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6"
              >
                <h4 className="text-white font-medium mb-2">{faq.q}</h4>
                <p className="text-sm text-[var(--text-muted)]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[var(--text-muted)]">
            © 2026 ReelForge. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}