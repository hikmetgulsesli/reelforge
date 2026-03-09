"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, ChevronDown, Zap, Crown, Rocket, Building2 } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    description: "ReelForge'u keşfetmek için mükemmel",
    icon: Zap,
    features: [
      { name: "3 video/ay", included: true },
      { name: "AI Script Yazıcı", included: true },
      { name: "5 görsel stil", included: true },
      { name: "TTS seslendirme", included: true },
      { name: "720p video kalitesi", included: true },
      { name: "Filigranlı videolar", included: false },
      { name: "Özel müzik kütüphanesi", included: false },
      { name: "Öncelikli render", included: false },
      { name: "API erişimi", included: false },
      { name: "Seri modu", included: false },
    ],
    cta: "Ücretsiz Başla",
    popular: false,
    priceId: null,
  },
  {
    name: "Starter",
    price: { monthly: 19, yearly: 190 },
    description: "Düzenli içerik üreticileri için",
    icon: Rocket,
    features: [
      { name: "30 video/ay", included: true },
      { name: "AI Script Yazıcı", included: true },
      { name: "10+ görsel stil", included: true },
      { name: "TTS seslendirme + 3 ses", included: true },
      { name: "1080p video kalitesi", included: true },
      { name: "Filigransız videolar", included: true },
      { name: "Müzik kütüphanesi", included: true },
      { name: "Öncelikli render", included: false },
      { name: "API erişimi", included: false },
      { name: "Seri modu", included: false },
    ],
    cta: "Başla",
    popular: true,
    priceId: { monthly: "price_starter_monthly", yearly: "price_starter_yearly" },
  },
  {
    name: "Pro",
    price: { monthly: 49, yearly: 490 },
    description: "Profesyonel içerik üreticileri için",
    icon: Crown,
    features: [
      { name: "80 video/ay", included: true },
      { name: "AI Script Yazıcı", included: true },
      { name: "Tüm görsel stiller", included: true },
      { name: "TTS + Voice Cloning", included: true },
      { name: "4K video kalitesi", included: true },
      { name: "Filigransız videolar", included: true },
      { name: "Premium müzik kütüphanesi", included: true },
      { name: "Öncelikli render", included: true },
      { name: "API erişimi", included: true },
      { name: "Seri modu", included: false },
    ],
    cta: "Pro'ya Geç",
    popular: false,
    priceId: { monthly: "price_pro_monthly", yearly: "price_pro_yearly" },
  },
  {
    name: "Business",
    price: { monthly: 99, yearly: 990 },
    description: "Ekipler ve ajanslar için",
    icon: Building2,
    features: [
      { name: "200 video/ay", included: true },
      { name: "AI Script Yazıcı", included: true },
      { name: "Tüm görsel stiller", included: true },
      { name: "TTS + Voice Cloning", included: true },
      { name: "4K video kalitesi", included: true },
      { name: "Filigransız videolar", included: true },
      { name: "Premium müzik kütüphanesi", included: true },
      { name: "Öncelikli render", included: true },
      { name: "API erişimi", included: true },
      { name: "Seri modu", included: true },
    ],
    cta: "İletişime Geç",
    popular: false,
    priceId: { monthly: "price_business_monthly", yearly: "price_business_yearly" },
  },
];

const faqs = [
  {
    question: "Ücretsiz planda hangi özellikler var?",
    answer: "Ücretsiz planda ayda 3 video üretebilir, AI Script Yazıcıyı kullanabilir, 5 farklı görsel stil seçebilir ve TTS seslendirme özelliğinden faydalanabilirsiniz. Videolar 720p kalitesinde ve filigranlı olarak üretilir.",
  },
  {
    question: "Yıllık ödemede ne kadar indirim var?",
    answer: "Yıllık ödemede yaklaşık %17 indirim kazanırsınız. Örneğin Pro planı aylık $49 yerine yıllık $490 ile yaklaşık $98 tasarruf edersiniz.",
  },
  {
    question: "Video sayısı sınırını aşarsam ne olur?",
    answer: "Aylık video kotanızı doldurduğunuzda, yeni videolar üretmek için planınızı yükseltebilir veya bir sonraki ayı bekleyebilirsiniz. Taşınan videolar sonraki aya devretmez.",
  },
  {
    question: "Voice Cloning nedir?",
    answer: "Voice Cloning özelliği ile kendi sesinizi klonlayabilir ve videolarınızda kullanabilirsiniz. Sadece 30 saniyelik bir ses kaydı ile AI modeliniz oluşturulur ve tüm videolarınızda kullanılabilir.",
  },
  {
    question: "Öncelikli render ne demek?",
    answer: "Öncelikli render, videolarınızın kuyrukta beklemeden hemen işleme alınması demektir. Yoğun saatlerde bile videolarınız dakikalar içinde hazır olur.",
  },
  {
    question: "Planımı istediğim zaman değiştirebilir miyim?",
    answer: "Evet, planınızı istediğiniz zaman yükseltebilir veya düşürebilirsiniz. Yükseltme anında, düşürme ise mevcut fatura dönemi sonunda geçerli olur.",
  },
  {
    question: "İade politikası nedir?",
    answer: "Satın alma tarihinden itibaren 14 gün içinde, kullanılmamış video kredileri için tam iade sağlıyoruz. Kullanılmış krediler için oransal iade yapılır.",
  },
  {
    question: "API erişimi nasıl çalışır?",
    answer: "Pro ve Business planlarında REST API erişimi sunuyoruz. API ile kendi uygulamalarınızdan video üretebilir, mevcut workflow'unuza entegre edebilirsiniz. Detaylı dokümantasyon için docs.reelforge.com adresini ziyaret edin.",
  },
];

function PricingCard({
  plan,
  isYearly,
  onSelectPlan,
}: {
  plan: (typeof plans)[0];
  isYearly: boolean;
  onSelectPlan: (planName: string, priceId: string | null) => void;
}) {
  const Icon = plan.icon;
  const price = isYearly ? plan.price.yearly : plan.price.monthly;

  return (
    <div
      className={`relative flex flex-col rounded-xl border p-6 transition-all duration-200 hover:-translate-y-1 ${
        plan.popular ? "border-primary ring-2 ring-primary/20" : ""
      }`}
      style={{
        background: "var(--surface)",
        borderColor: plan.popular ? "var(--primary)" : "var(--border)",
      }}
    >
      {plan.popular && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: "var(--primary)", color: "white" }}
        >
          En Popüler
        </div>
      )}

      <div className="mb-4 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ background: "var(--surface-hover)" }}
        >
          <Icon className="h-5 w-5" style={{ color: "var(--primary)" }} />
        </div>
        <div>
          <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            {plan.name}
          </h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {plan.description}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            ${price}
          </span>
          <span style={{ color: "var(--text-muted)" }}>
            /{isYearly ? "yıl" : "ay"}
          </span>
        </div>
        {isYearly && plan.price.monthly > 0 && (
          <p className="mt-1 text-sm" style={{ color: "var(--primary)" }}>
            {plan.price.monthly * 12 - plan.price.yearly}$ tasarruf edin
          </p>
        )}
      </div>

      <ul className="mb-6 flex-1 space-y-3">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {feature.included ? (
              <Check className="h-4 w-4 flex-shrink-0" style={{ color: "var(--secondary)" }} />
            ) : (
              <X className="h-4 w-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
            )}
            <span
              className="text-sm"
              style={{ color: feature.included ? "var(--text-main)" : "var(--text-muted)" }}
            >
              {feature.name}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelectPlan(plan.name, plan.priceId ? (isYearly ? plan.priceId.yearly : plan.priceId.monthly) : null)}
        className={`w-full rounded-lg py-3 text-sm font-medium transition-opacity hover:opacity-90 ${
          plan.popular ? "" : "border"
        }`}
        style={{
          background: plan.popular ? "var(--primary)" : "transparent",
          color: plan.popular ? "white" : "var(--text-main)",
          borderColor: plan.popular ? "transparent" : "var(--border)",
        }}
      >
        {plan.cta}
      </button>
    </div>
  );
}

function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="border-b"
      style={{ borderColor: "var(--border)" }}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="font-medium" style={{ fontFamily: "var(--font-display)" }}>
          {faq.question}
        </span>
        <ChevronDown
          className={`h-5 w-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          style={{ color: "var(--text-muted)" }}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-96 pb-4" : "max-h-0"
        }`}
      >
        <p style={{ color: "var(--text-muted)" }}>{faq.answer}</p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [, setLoading] = useState<string | null>(null);

  const handleSelectPlan = async (planName: string, priceId: string | null) => {
    if (planName === "Free") {
      window.location.href = "/register";
      return;
    }

    if (planName === "Business") {
      window.location.href = "mailto:business@reelforge.com?subject=Business Plan Inquiry";
      return;
    }

    if (!priceId) return;

    setLoading(planName);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
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
          <Link href="/" className="flex items-center gap-2">
            <h1
              className="text-2xl font-bold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--primary)",
              }}
            >
              ReelForge
            </h1>
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

      {/* Main Content */}
      <main className="flex-1 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          {/* Hero */}
          <div className="mb-12 text-center">
            <h1
              className="mb-4 text-4xl font-bold md:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Size Uygun{" "}
              <span style={{ color: "var(--primary)" }}>Planı</span> Seçin
            </h1>
            <p className="mx-auto max-w-2xl text-lg" style={{ color: "var(--text-muted)" }}>
              Her bütçeye uygun esnek fiyatlandırma seçenekleri. İstediğiniz zaman yükseltin veya iptal edin.
            </p>

            {/* Billing Toggle */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <span
                className={`text-sm font-medium ${!isYearly ? "" : "opacity-50"}`}
                style={{ color: !isYearly ? "var(--text-main)" : "var(--text-muted)" }}
              >
                Aylık
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className="relative h-6 w-12 rounded-full transition-colors"
                style={{ background: isYearly ? "var(--primary)" : "var(--surface-hover)" }}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                    isYearly ? "left-7" : "left-1"
                  }`}
                />
              </button>
              <span
                className={`text-sm font-medium ${isYearly ? "" : "opacity-50"}`}
                style={{ color: isYearly ? "var(--text-main)" : "var(--text-muted)" }}
              >
                Yıllık
              </span>
              <span
                className="rounded-full px-2 py-1 text-xs font-medium"
                style={{ background: "var(--secondary)", color: "var(--background)" }}
              >
                %17 İndirim
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="mb-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <PricingCard
                key={plan.name}
                plan={plan}
                isYearly={isYearly}
                onSelectPlan={handleSelectPlan}
              />
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mx-auto max-w-3xl">
            <h2
              className="mb-8 text-center text-2xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Sıkça Sorulan Sorular
            </h2>
            <div
              className="rounded-xl border p-6"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              {faqs.map((faq, idx) => (
                <FAQItem
                  key={idx}
                  faq={faq}
                  isOpen={openFaqIndex === idx}
                  onToggle={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                />
              ))}
            </div>
          </div>
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