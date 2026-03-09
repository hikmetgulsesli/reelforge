"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, ChevronDown, Zap } from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  videoLimit: number;
  features: { text: string; included: boolean }[];
  highlighted?: boolean;
  ctaText: string;
}

const plans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Başlamak için ideal",
    monthlyPrice: 0,
    yearlyPrice: 0,
    videoLimit: 3,
    features: [
      { text: "3 video/ay", included: true },
      { text: "AI Script Yazıcı", included: true },
      { text: "Temel görsel stiller", included: true },
      { text: "TTS seslendirme", included: true },
      { text: "720p video kalitesi", included: true },
      { text: "Filigran", included: false },
      { text: "Öncelikli render", included: false },
      { text: "Voice cloning", included: false },
      { text: "A/B test motoru", included: false },
      { text: "API erişimi", included: false },
    ],
    ctaText: "Ücretsiz Başla",
  },
  {
    id: "starter",
    name: "Starter",
    description: "Büyüyen içerik üreticileri için",
    monthlyPrice: 19,
    yearlyPrice: 190,
    videoLimit: 30,
    features: [
      { text: "30 video/ay", included: true },
      { text: "AI Script Yazıcı", included: true },
      { text: "10+ görsel stil", included: true },
      { text: "TTS seslendirme", included: true },
      { text: "1080p video kalitesi", included: true },
      { text: "Filigransız", included: true },
      { text: "Öncelikli render", included: false },
      { text: "Voice cloning", included: false },
      { text: "A/B test motoru", included: false },
      { text: "API erişimi", included: false },
    ],
    ctaText: "Başla",
  },
  {
    id: "pro",
    name: "Pro",
    description: "Profesyonel içerik üreticileri için",
    monthlyPrice: 49,
    yearlyPrice: 490,
    videoLimit: 80,
    highlighted: true,
    features: [
      { text: "80 video/ay", included: true },
      { text: "AI Script Yazıcı", included: true },
      { text: "Tüm görsel stiller", included: true },
      { text: "Premium TTS sesler", included: true },
      { text: "4K video kalitesi", included: true },
      { text: "Filigransız", included: true },
      { text: "Öncelikli render", included: true },
      { text: "Voice cloning", included: true },
      { text: "A/B test motoru", included: false },
      { text: "API erişimi", included: false },
    ],
    ctaText: "Pro'ya Geç",
  },
  {
    id: "business",
    name: "Business",
    description: "Ekipler ve ajanslar için",
    monthlyPrice: 99,
    yearlyPrice: 990,
    videoLimit: 200,
    features: [
      { text: "200 video/ay", included: true },
      { text: "AI Script Yazıcı", included: true },
      { text: "Tüm görsel stiller", included: true },
      { text: "Premium TTS sesler", included: true },
      { text: "4K video kalitesi", included: true },
      { text: "Filigransız", included: true },
      { text: "Öncelikli render", included: true },
      { text: "Voice cloning", included: true },
      { text: "A/B test motoru", included: true },
      { text: "API erişimi", included: true },
    ],
    ctaText: "İletişime Geç",
  },
];

const faqs = [
  {
    question: "Ücretsiz plandan ücretli plana nasıl geçiş yapabilirim?",
    answer:
      "Hesabınıza giriş yaptıktan sonra, Ayarlar > Planım bölümünden istediğiniz plana yükseltme yapabilirsiniz. Yükseltme anında aktif edilir ve kalan ay süresi orantılı olarak iade edilir.",
  },
  {
    question: "Video kredileri bir sonraki aya devreder mi?",
    answer:
      "Hayır, kullanılmayan video kredileri bir sonraki aya devretmez. Her ay başında planınıza göre yeni krediler yüklenir.",
  },
  {
    question: "Yıllık planda ne kadar tasarruf edebilirim?",
    answer:
      "Yıllık planlarda aylık fiyata göre yaklaşık %15-20 tasarruf sağlarsınız. Ayrıca yıllık planlarda bazı özelliklere öncelikli erişim hakkı kazanırsınız.",
  },
  {
    question: "Planımı istediğim zaman iptal edebilir miyim?",
    answer:
      "Evet, planınızı istediğiniz zaman iptal edebilirsiniz. İptal sonrası mevcut fatura dönemi sonuna kadar planınız aktif kalır. Ücret iadesi yapılmaz.",
  },
  {
    question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
    answer:
      "Kredi kartı ve banka kartı ile ödeme kabul ediyoruz. Tüm ödemeler Stripe altyapısı ile güvenli şekilde işlenir.",
  },
  {
    question: "Voice cloning nedir ve nasıl çalışır?",
    answer:
      "Voice cloning, kendi sesinizi veya seçtiğiniz bir sesi klonlayarak videolarınızda kullanmanızı sağlar. Sadece 30 saniyelik bir ses kaydı ile ses profiliniz oluşturulur.",
  },
];

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div
      className="border-b"
      style={{ borderColor: "var(--border)" }}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left cursor-pointer"
        aria-expanded={isOpen}
      >
        <span
          className="text-base font-medium"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {question}
        </span>
        <ChevronDown
          className={`h-5 w-5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          style={{ color: "var(--text-muted)" }}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          {answer}
        </p>
      </div>
    </div>
  );
}

interface PricingCardProps {
  plan: PricingPlan;
  isYearly: boolean;
}

function PricingCard({ plan, isYearly }: PricingCardProps) {
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const monthlyEquivalent = isYearly
    ? Math.round(plan.yearlyPrice / 12)
    : plan.monthlyPrice;

  const handleSelectPlan = async () => {
    if (plan.id === "free") {
      window.location.href = "/register";
      return;
    }

    if (plan.id === "business") {
      window.location.href = "mailto:contact@reelforge.com";
      return;
    }

    const priceId = `price_${plan.id}_${isYearly ? "yearly" : "monthly"}`;
    
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
    }
  };

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-200 ${
        plan.highlighted
          ? "scale-105 shadow-xl"
          : "hover:-translate-y-1 hover:shadow-lg"
      }`}
      style={{
        background: plan.highlighted
          ? "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)"
          : "var(--surface)",
        borderColor: plan.highlighted ? "transparent" : "var(--border)",
      }}
    >
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
            style={{
              background: "var(--secondary)",
              color: "var(--color-background-dark)",
            }}
          >
            <Zap className="h-3 w-3" />
            En Popüler
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3
          className="mb-1 text-xl font-bold"
          style={{
            fontFamily: "var(--font-display)",
            color: plan.highlighted ? "white" : "var(--text-main)",
          }}
        >
          {plan.name}
        </h3>
        <p
          className="text-sm"
          style={{
            color: plan.highlighted
              ? "rgba(255,255,255,0.8)"
              : "var(--text-muted)",
          }}
        >
          {plan.description}
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span
            className="text-4xl font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color: plan.highlighted ? "white" : "var(--text-main)",
            }}
          >
            ${price}
          </span>
          {plan.monthlyPrice > 0 && (
            <span
              className="text-sm"
              style={{
                color: plan.highlighted
                  ? "rgba(255,255,255,0.8)"
                  : "var(--text-muted)",
              }}
            >
              /{isYearly ? "yıl" : "ay"}
            </span>
          )}
        </div>
        {isYearly && plan.monthlyPrice > 0 && (
          <p
            className="mt-1 text-xs"
            style={{
              color: plan.highlighted
                ? "rgba(255,255,255,0.7)"
                : "var(--text-muted)",
            }}
          >
            Aylık ${monthlyEquivalent} karşılığı
          </p>
        )}
      </div>

      <ul className="mb-6 flex-1 space-y-3">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            {feature.included ? (
              <Check
                className="h-5 w-5 flex-shrink-0"
                style={{
                  color: plan.highlighted
                    ? "var(--secondary)"
                    : "var(--primary)",
                }}
              />
            ) : (
              <X
                className="h-5 w-5 flex-shrink-0"
                style={{ color: "var(--text-muted)" }}
              />
            )}
            <span
              className="text-sm"
              style={{
                color: feature.included
                  ? plan.highlighted
                    ? "rgba(255,255,255,0.9)"
                    : "var(--text-main)"
                  : "var(--text-muted)",
              }}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSelectPlan}
        className={`w-full rounded-lg py-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
          plan.highlighted
            ? "hover:opacity-90"
            : "hover:-translate-y-0.5 hover:shadow-md"
        }`}
        style={{
          background: plan.highlighted
            ? "white"
            : plan.id === "free"
            ? "var(--surface-hover)"
            : "var(--primary)",
          color: plan.highlighted
            ? "var(--primary)"
            : plan.id === "free"
            ? "var(--text-main)"
            : "white",
        }}
      >
        {plan.ctaText}
      </button>
    </div>
  );
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

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
          <Link href="/">
            <h1
              className="text-2xl font-bold cursor-pointer"
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

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-16 text-center">
          <h2
            className="mb-4 text-4xl font-bold md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Basit ve Şeffaf{" "}
            <span style={{ color: "var(--primary)" }}>Fiyatlandırma</span>
          </h2>
          <p
            className="mx-auto mb-8 max-w-2xl text-lg"
            style={{ color: "var(--text-muted)" }}
          >
            İhtiyacınıza uygun planı seçin. Gizli ücret yok, sürpriz yok.
          </p>

          {/* Billing Toggle */}
          <div className="mb-12 flex items-center justify-center gap-4">
            <span
              className={`text-sm font-medium ${
                !isYearly ? "" : "opacity-60"
              }`}
              style={{ color: !isYearly ? "var(--text-main)" : "var(--text-muted)" }}
            >
              Aylık
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative h-7 w-14 rounded-full transition-colors cursor-pointer"
              style={{
                background: isYearly ? "var(--primary)" : "var(--surface-hover)",
              }}
              aria-label="Faturalandırma dönemini değiştir"
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform duration-200 ${
                  isYearly ? "left-8" : "left-1"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${isYearly ? "" : "opacity-60"}`}
              style={{ color: isYearly ? "var(--text-main)" : "var(--text-muted)" }}
            >
              Yıllık
            </span>
            {isYearly && (
              <span
                className="rounded-full px-2 py-1 text-xs font-medium"
                style={{
                  background: "var(--secondary)",
                  color: "var(--color-background-dark)",
                }}
              >
                %20 tasarruf
              </span>
            )}
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="px-6 pb-16">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} isYearly={isYearly} />
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section
          className="px-6 py-16"
          style={{ background: "var(--surface-darker)" }}
        >
          <div className="mx-auto max-w-3xl">
            <h2
              className="mb-8 text-center text-3xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Sıkça Sorulan Sorular
            </h2>
            <div
              className="rounded-xl border p-4"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFAQ === index}
                  onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-16 text-center">
          <h2
            className="mb-4 text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Hala sorunuz mu var?
          </h2>
          <p
            className="mb-6"
            style={{ color: "var(--text-muted)" }}
          >
            Ekibimiz size yardımcı olmak için burada.
          </p>
          <Link
            href="mailto:contact@reelforge.com"
            className="inline-block rounded-lg px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
            style={{
              background: "var(--primary)",
              color: "white",
            }}
          >
            İletişime Geç
          </Link>
        </section>
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