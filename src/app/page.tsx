import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-text-main">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-surface px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-primary">
            ReelForge
          </h1>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="rounded px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:opacity-80"
            >
              Giriş Yap
            </Link>
            <Link
              href="/register"
              className="rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Kayıt Ol
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display mb-6 text-5xl font-bold leading-tight md:text-6xl">
            AI ile Faceless Video{" "}
            <span className="text-primary">Üretin</span>
          </h2>
          <p className="mb-8 text-lg text-text-muted md:text-xl">
            Tek bir metin promptu ile profesyonel kalitede YouTube Shorts, TikTok
            ve Instagram Reels videoları oluşturun.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="rounded bg-primary px-8 py-3 text-base font-medium text-white transition-opacity hover:opacity-90"
            >
              Ücretsiz Başla
            </Link>
            <Link
              href="/pricing"
              className="rounded border border-border px-8 py-3 text-base font-medium text-text-main transition-colors hover:opacity-80"
            >
              Fiyatları Gör
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mt-24 grid max-w-6xl gap-6 px-6 md:grid-cols-3">
          {[
            {
              title: "AI Script Yazıcı",
              desc: "Otomatik senaryo oluşturma",
            },
            {
              title: "10+ Görsel Stil",
              desc: "Farklı görsel stiller",
            },
            {
              title: "TTS Seslendirme",
              desc: "AI seslendirme",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-border bg-surface p-6 transition-colors hover:border-opacity-50"
            >
              <h3 className="font-display mb-2 text-lg font-semibold">
                {feature.title}
              </h3>
              <p className="text-text-muted">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface-darker px-6 py-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-text-muted">
            © 2025 ReelForge. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}