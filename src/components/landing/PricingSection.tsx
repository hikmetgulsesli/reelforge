import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const plans = [
  {
    name: "Başlangıç",
    price: "$0",
    period: "/ay",
    popular: false,
    features: [
      "Ayda 3 video",
      "Standart görsel kalitesi",
      "ReelForge filigranı"
    ],
    cta: "Hemen Başla",
    ctaVariant: "outline" as const
  },
  {
    name: "Üretici",
    price: "$19",
    period: "/ay",
    popular: true,
    features: [
      "Ayda 30 video",
      "Yüksek çözünürlük (1080p)",
      "Filigransız çıktı",
      "Otomatik paylaşım (1 hesap)"
    ],
    cta: "Planı Seç",
    ctaVariant: "default" as const
  },
  {
    name: "Pro",
    price: "$49",
    period: "/ay",
    popular: false,
    features: [
      "Ayda 80 video",
      "Ultra HD çözünürlük (4K)",
      "Özel ses klonlama",
      "Sınırsız hesap paylaşımı"
    ],
    cta: "Planı Seç",
    ctaVariant: "outline" as const
  },
  {
    name: "Kurumsal",
    price: "$99",
    period: "/ay",
    popular: false,
    features: [
      "Ayda 200 video",
      "API erişimi",
      "Özel yapay zeka modelleri",
      "7/24 öncelikli destek"
    ],
    cta: "İletişime Geç",
    ctaVariant: "outline" as const
  }
];

export function PricingSection() {
  return (
    <section className="flex flex-col gap-10 px-4 py-20 mt-10" id="pricing">
      <div className="flex flex-col gap-4 items-center text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium mb-2 border border-[var(--primary)]/20">
          Fiyatlandırma
        </div>
        <h2 className="text-[32px] font-bold leading-tight @[480px]:text-4xl text-[var(--text-main)]">
          Her İhtiyaca Uygun Planlar
        </h2>
        <p className="text-base font-normal leading-normal max-w-[600px] text-[var(--text-muted)]">
          Aylık veya yıllık planlardan size en uygun olanı seçin. İstediğiniz zaman iptal edebilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 max-w-[1000px] mx-auto w-full">
        {plans.map((plan, index) => (
          <div 
            key={index}
            className={`flex flex-col p-6 rounded-xl border bg-[var(--surface)] relative ${
              plan.popular 
                ? "border-2 border-[var(--primary)] shadow-xl shadow-[var(--primary)]/20 md:-translate-y-4" 
                : "border-[var(--border)]"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--primary)] text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                EN POPÜLER
              </div>
            )}
            
            <h3 className={`text-lg font-bold text-[var(--text-main)] mb-2 ${plan.popular ? "mt-2" : ""}`}>
              {plan.name}
            </h3>
            
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-black text-[var(--text-main)]">{plan.price}</span>
              <span className="text-sm text-[var(--text-muted)]">{plan.period}</span>
            </div>

            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <CheckCircle className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button 
              variant={plan.ctaVariant}
              className={`w-full h-10 text-sm font-bold ${
                plan.ctaVariant === "default" 
                  ? "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90" 
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-main)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
