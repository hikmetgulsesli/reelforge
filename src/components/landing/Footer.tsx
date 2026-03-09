import Link from "next/link";

const footerLinks = {
  product: [
    { label: "Özellikler", href: "#features" },
    { label: "Fiyatlandırma", href: "#pricing" },
    { label: "SSS", href: "#faq" },
  ],
  company: [
    { label: "Hakkımızda", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "İletişim", href: "/contact" },
  ],
  legal: [
    { label: "Gizlilik Politikası", href: "/privacy" },
    { label: "Kullanım Koşulları", href: "/terms" },
    { label: "Çerez Politikası", href: "/cookies" },
  ]
};

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] px-6 py-12 bg-[var(--surface-darker)]">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="size-6 text-[var(--primary)]">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[var(--text-main)]">ReelForge</h3>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              AI destekli faceless video üretim platformu. YouTube Shorts, TikTok ve Instagram Reels için profesyonel videolar.
            </p>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold text-[var(--text-main)]">Ürün</h4>
            <ul className="flex flex-col gap-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold text-[var(--text-main)]">Şirket</h4>
            <ul className="flex flex-col gap-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold text-[var(--text-main)]">Yasal</h4>
            <ul className="flex flex-col gap-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-8 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            © 2025 ReelForge. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
