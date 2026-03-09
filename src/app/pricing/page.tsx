"use client";

import { useState } from "react";
import Link from "next/link";

interface PricingPlan {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: { text: string; included: boolean }[];
  highlighted?: boolean;
  cta: string;
  priceId?: {
    monthly: string;
    yearly: string;
  };
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Hobby projeler ve deneme için ideal",
    features: [
      { text: "5 video/ay", included: true },
      { text: "720p çözünürlük", included: true },
      { text: "Temel TTS sesler", included: true },
      { text: "3 görsel stil", included: true },
      { text: "Su işareti", included: true },
      { text: "Öncelikli destek", included: false },
      { text: "API erişimi", included: false },
      { text: "Özel ses klonlama", included: false },
    ],
    cta: "Ücretsiz Başla",
  },
  {
    name: "Starter",
    monthlyPrice: 19,
    yearlyPrice: 15,
    description: "Küçük içerik üreticileri için",
    features: [
      { text: "30 video/ay", included: true },
      { text: "1080p çözünürlük", included: true },
      { text: "Tüm TTS sesler", included: true },
      { text: "10 görsel stil", included: true },
      { text: "Su işareti yok", included: true },
      { text: "Email desteği", included: true },
      { text: "API erişimi", included: false },
      { text: "Özel ses klonlama", included: false },
    ],
    cta: "Starter'a Başla",
  },
  {
    name: "Pro",
    monthlyPrice: 49,
    yearlyPrice: 39,
    description: "Profesyonel içerik üreticileri için",
    features: [
      { text: "100 video/ay", included: true },
      { text: "4K çözünürlük", included: true },
      { text: "Tüm TTS + Premium sesler", included: true },
      { text: "Tüm görsel stiller", included: true },
      { text: "Su işareti yok", included: true },
      { text: "Öncelikli destek", included: true },
      { text: "API erişimi", included: true },
      { text: "Özel ses klonlama", included: false },
    ],
    highlighted: true,
    cta: "Pro'ya Yükselt",
    priceId: {
      monthly: "price_pro_monthly",
      yearly: "price_pro_yearly",
    },
  },
  {
    name: "Business",
    monthlyPrice: 99,
    yearlyPrice: 79,
    description: "Ekipler ve ajanslar için",
    features: [
      { text: "Sınırsız video", included: true },
      { text: "4K çözünürlük", included: true },
      { text: "Tüm sesler + klonlama", included: true },
      { text: "Tüm görsel stiller", included: true },
      { text: "Su işareti yok", included: true },
      { text: "7/24 öncelikli destek", included: true },
      { text: "API erişimi", included: true },
      { text: "5 özel ses klonlama", included: true },
    ],
    cta: "Business'a Geç",
    priceId: {
      monthly: "price_business_monthly",
      yearly: "price_business_yearly",
    },
  },
];

const faqItems = [
  {
    question: "Ücretsiz deneme süresi var mı?",
    answer:
      "Evet, Free planımızla aylık 5 video ücretsiz oluşturabilirsiniz. Kredi kartı gerekmez.",
  },
  {
    question: "Planımı nasıl yükseltebilirim?",
    answer:
      "Hesap ayarlarından planınızı istediğiniz zaman yükseltebilirsiniz. Yükseltme anında uygulanır ve kalan süre için prorata iade yapılır.",
  },
  {
    question: "Yıllık planda indirim var mı?",
    answer:
      "Evet, yıllık planlarda %20 indirim uygulanır. Aylık ödemeye göre önemli tasarruf sağlarsınız.",
  },
  {
    question: "İade politikanız nedir?",
    answer:
      "İlk 14 gün içinde koşulsuz iade garantisi sunuyoruz. Memnun kalmazsanız tam iade alırsınız.",
  },
  {
    question: "API erişimi nasıl çalışır?",
    answer:
      "Pro ve Business planlarında REST API erişimi sunuyoruz. API dokümantasyonuna dashboard üzerinden erişebilirsiniz.",
  },
  {
    question: "Özel ses klonlama nedir?",
    answer:
      "Business planında kendi sesinizi veya seçtiğiniz bir sesi klonlayabilirsiniz. Bu sayede videolarınızda benzersiz bir ses tonu kullanabilirsiniz.",
  },
];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      width={16}
      height={16}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      width={16}
      height={16}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      width={20}
      height={20}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectPlan = async (plan: PricingPlan) => {
    if (plan.monthlyPrice === 0) {
      // Free plan - redirect to register
      window.location.href = "/register";
      return;
    }

    if (!plan.priceId) {
      alert("Bu plan şu anda satın alınamıyor. Lütfen destek ekibiyle iletişime geçin.");
      return;
    }

    setLoading(plan.name);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: isYearly ? plan.priceId.yearly : plan.priceId.monthly,
          planName: plan.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Checkout session oluşturulamadı");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Ödeme sayfası açılırken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        background: "var(--background)",
        color: "var(--text-main)",
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b px-6 py-4"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--primary)",
            }}
          >
            ReelForge
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="rounded px-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--text-muted)" }}
            >
              Giriş Yap
            </Link>
            <Link
              href="/register"
              className="rounded px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
              style={{
                background: "var(--primary)",
                color: "white",
              }}
            >
              Kayıt Ol
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-6 py-16">
        {/* Title Section */}
        <div className="mx-auto max-w-4xl text-center">
          <h1
            className="mb-4 text-4xl font-bold md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Basit ve Şeffaf{" "}
            <span style={{ color: "var(--primary)" }}>Fiyatlandırma</span>
          </h1>
          <p
            className="mb-8 text-lg"
            style={{ color: "var(--text-muted)" }}
          >
            İhtiyacınıza uygun planı seçin. Gizli ücret yok.
          </p>

          {/* Billing Toggle */}
          <div className="mb-12 flex items-center justify-center gap-4">
            <span
              className={`text-sm font-medium ${!isYearly ? "" : "opacity-50"}`}
              style={{ color: !isYearly ? "var(--primary)" : "var(--text-muted)" }}
            >
              Aylık
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative h-6 w-11 rounded-full transition-colors"
              style={{
                background: isYearly ? "var(--primary)" : "var(--surface-hover)",
              }}
              aria-label="Faturalandırma dönemini değiştir"
            >
              <span
                className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform"
                style={{
                  transform: isYearly ? "translateX(20px)" : "translateX(0)",
                }}
              />
            </button>
            <span
              className={`text-sm font-medium ${isYearly ? "" : "opacity-50"}`}
              style={{ color: isYearly ? "var(--primary)" : "var(--text-muted)" }}
            >
              Yıllık
            </span>
            {isYearly && (
              <span
                className="rounded-full px-2 py-0.5 text-xs font-medium"
                style={{
                  background: "var(--primary)",
                  color: "white",
                }}
              >
                %20 İndirim
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className="relative rounded-xl border p-6 transition-all"
              style={{
                background: plan.highlighted
                  ? "var(--surface-darker)"
                  : "var(--surface)",
                borderColor: plan.highlighted
                  ? "var(--primary)"
                  : "var(--border)",
                transform: plan.highlighted ? "scale(1.02)" : "scale(1)",
              }}
            >
              {plan.highlighted && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    background: "var(--primary)",
                    color: "white",
                  }}
                >
                  En Popüler
                </div>
              )}

              <h3
                className="mb-2 text-xl font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {plan.name}
              </h3>
              <p
                className="mb-4 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                {plan.description}
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold">
                  ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                <span style={{ color: "var(--text-muted)" }}>
                  /{isYearly ? "ay (yıllık)" : "ay"}
                </span>
              </div>

              <ul className="mb-6 space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    {feature.included ? (
                      <CheckIcon
                        className="flex-shrink-0"
                        style={{ color: "var(--primary)" }}
                      />
                    ) : (
                      <XIcon
                        className="flex-shrink-0 opacity-40"
                        style={{ color: "var(--text-muted)" }}
                      />
                    )}
                    <span
                      style={{
                        color: feature.included
                          ? "var(--text-main)"
                          : "var(--text-muted)",
                      }}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={loading !== null}
                className="w-full rounded-lg px-4 py-3 text-sm font-medium transition-opacity disabled:opacity-50"
                style={{
                  background: plan.highlighted
                    ? "var(--primary)"
                    : "transparent",
                  color: plan.highlighted ? "white" : "var(--text-main)",
                  border: plan.highlighted ? "none" : "1px solid var(--border)",
                }}
              >
                {loading === plan.name ? "Yükleniyor..." : plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mx-auto mt-20 max-w-3xl">
          <h2
            className="mb-8 text-center text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Sıkça Sorulan Sorular
          </h2>

          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div
                key={index}
                className="rounded-lg border"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                  aria-expanded={expandedFaq === index}
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronDownIcon
                    className="transition-transform"
                    style={{
                      transform:
                        expandedFaq === index ? "rotate(180deg)" : "rotate(0)",
                    }}
                  />
                </button>
                {expandedFaq === index && (
                  <div
                    className="px-5 pb-4"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mx-auto mt-20 max-w-2xl text-center">
          <h3
            className="mb-4 text-xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Hala sorunuz mu var?
          </h3>
          <p className="mb-6" style={{ color: "var(--text-muted)" }}>
            Destek ekibimiz size yardımcı olmak için hazır.
          </p>
          <a
            href="mailto:destek@reelforge.com"
            className="inline-block rounded-lg border px-6 py-3 font-medium transition-opacity hover:opacity-80"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-main)",
            }}
          >
            Bize Ulaşın
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="border-t px-6 py-8"
        style={{
          background: "var(--surface-darker)",
          borderColor: "var(--border)",
        }}
      >
        <div className="mx-auto max-w-7xl text-center">
          <p style={{ color: "var(--text-muted)" }}>
            © 2025 ReelForge. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}