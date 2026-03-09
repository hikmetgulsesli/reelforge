import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] px-4 sm:px-10 py-3 bg-[var(--surface)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-6 text-[var(--primary)]">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
            </svg>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-[var(--text-main)]">
            ReelForge
          </h2>
        </div>
        <div className="hidden md:flex flex-1 justify-end gap-8">
          <nav className="flex items-center gap-9">
            <Link 
              href="#features" 
              className="text-sm font-medium leading-normal text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
            >
              Özellikler
            </Link>
            <Link 
              href="#how-it-works" 
              className="text-sm font-medium leading-normal text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
            >
              Nasıl Çalışır
            </Link>
            <Link 
              href="#pricing" 
              className="text-sm font-medium leading-normal text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
            >
              Fiyatlandırma
            </Link>
            <Link 
              href="#faq" 
              className="text-sm font-medium leading-normal text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
            >
              SSS
            </Link>
          </nav>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="h-10 px-4 text-sm font-bold tracking-[0.015em] border-[var(--border)] bg-[var(--surface)] text-[var(--text-main)] hover:bg-[var(--surface-hover)]"
              asChild
            >
              <Link href="/login">Giriş Yap</Link>
            </Button>
            <Button 
              className="h-10 px-4 text-sm font-bold tracking-[0.015em] bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
              asChild
            >
              <Link href="/register">Ücretsiz Başlayın</Link>
            </Button>
          </div>
        </div>
        <div className="md:hidden flex items-center">
          <button aria-label="Menu" className="text-[var(--text-main)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
