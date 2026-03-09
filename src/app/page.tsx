import Link from "next/link";

export default function Home() {
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
          <h1
            className="text-2xl font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--primary)",
            }}
          >
            ReelForge
          </h1>
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

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2
            className="mb-6 text-5xl font-bold leading-tight md:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            AI ile Faceless Video{" "}
            <span style={{ color: "var(--primary)" }}>Üretin</span>
          </h2>
          <p
            className="mb-8 text-lg md:text-xl"
            style={{ color: "var(--text-muted)" }}
          >
            Tek bir metin promptu ile profesyonel kalitede YouTube Shorts, TikTok
            ve Instagram Reels videoları oluşturun.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="rounded px-8 py-3 text-base font-medium transition-opacity hover:opacity-90"
              style={{
                background: "var(--primary)",
                color: "white",
              }}
            >
              Ücretsiz Başla
            </Link>
            <Link
              href="/pricing"
              className="rounded border px-8 py-3 text-base font-medium transition-colors hover:opacity-80"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-main)",
              }}
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
          ].map((feature, i) => (
            <div
              key={i}
              className="rounded-lg border p-6 transition-colors hover:border-opacity-50"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <h3
                className="mb-2 text-lg font-semibold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {feature.title}
              </h3>
              <p style={{ color: "var(--text-muted)" }}>{feature.desc}</p>
            </div>
          ))}
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
