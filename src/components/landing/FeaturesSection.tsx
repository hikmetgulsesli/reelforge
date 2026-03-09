import { FileText, Palette, Mic, Subtitles, Music, Share2 } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Yapay Zeka Senaryo",
    description: "Sadece bir konu girin, yapay zekamız saniyeler içinde kancası (hook) güçlü, viral olmaya aday ve ilgi çekici video senaryoları oluştursun."
  },
  {
    icon: Palette,
    title: "10+ Görsel Stil",
    description: "Markanıza veya hikayenize uygun onlarca farklı görsel stil arasından seçim yapın. Anime, gerçekçi, suluboya veya 3D stiller ile videolarınızı özelleştirin."
  },
  {
    icon: Mic,
    title: "TTS Seslendirme",
    description: "Doğal ve profesyonel AI seslendirme ile videolarınıza hayat verin. 20+ farklı ses seçeneği ve ses klonlama özelliği."
  },
  {
    icon: Subtitles,
    title: "Otomatik Altyazı",
    description: "Videolarınıza otomatik olarak stilize edilmiş altyazılar ekleyin. Viral formatlarda, animasyonlu ve dikkat çekici altyazı seçenekleri."
  },
  {
    icon: Music,
    title: "Arka Plan Müziği",
    description: "Telifsiz müzik kütüphanesinden videonuza uygun arka plan müzikleri seçin veya AI ile özel müzik oluşturun."
  },
  {
    icon: Share2,
    title: "Otomatik Paylaşım",
    description: "Hazırlanan videoları indirmeden doğrudan TikTok, Instagram Reels ve YouTube Shorts hesaplarınıza gönderin veya ileri bir tarihe planlayın."
  }
];

export function FeaturesSection() {
  return (
    <section className="flex flex-col gap-10 px-4 py-20 @container mt-10" id="features">
      <div className="flex flex-col gap-4 items-center text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium mb-2 border border-[var(--primary)]/20">
          Özellikler
        </div>
        <h2 className="text-[32px] font-bold leading-tight @[480px]:text-4xl max-w-[720px] text-[var(--text-main)]">
          Video Üretimini Otomatikleştirin
        </h2>
        <p className="text-base font-normal leading-normal max-w-[600px] text-[var(--text-muted)]">
          İçerik üretim sürecinizin her adımını yapay zeka ile hızlandırın ve kolaylaştırın. Fikir aşamasından paylaşıma kadar her şey tek platformda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto w-full">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--primary)]/50 transition-colors shadow-sm"
          >
            <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mb-2">
              <feature.icon className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold leading-tight text-[var(--text-main)]">
                {feature.title}
              </h3>
              <p className="text-[var(--text-muted)] text-sm font-normal leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
