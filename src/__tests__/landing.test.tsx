import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { Footer } from '@/components/landing/Footer';

describe('Landing Page', () => {
  describe('Header', () => {
    it('renders ReelForge logo', () => {
      render(<Header />);
      expect(screen.getByText('ReelForge')).toBeInTheDocument();
    });

    it('renders navigation links', () => {
      render(<Header />);
      expect(screen.getByText('Özellikler')).toBeInTheDocument();
      expect(screen.getByText('Nasıl Çalışır')).toBeInTheDocument();
      expect(screen.getByText('Fiyatlandırma')).toBeInTheDocument();
      expect(screen.getByText('SSS')).toBeInTheDocument();
    });

    it('renders CTA buttons', () => {
      render(<Header />);
      expect(screen.getByText('Giriş Yap')).toBeInTheDocument();
      expect(screen.getByText('Ücretsiz Başlayın')).toBeInTheDocument();
    });
  });

  describe('HeroSection', () => {
    it('renders main headline', () => {
      render(<HeroSection />);
      expect(screen.getByText(/Yüzünüzü Göstermeden Viral Videolar Oluşturun/i)).toBeInTheDocument();
    });

    it('renders subheadline', () => {
      render(<HeroSection />);
      expect(screen.getByText(/Yapay zeka destekli senaryo ve görsel oluşturma/i)).toBeInTheDocument();
    });

    it('renders CTA buttons', () => {
      render(<HeroSection />);
      expect(screen.getAllByText('Ücretsiz Başlayın')[0]).toBeInTheDocument();
      expect(screen.getByText('Nasıl Çalışır?')).toBeInTheDocument();
    });

    it('renders social proof', () => {
      render(<HeroSection />);
      expect(screen.getByText(/2,000\+ içerik üreticisi kullanıyor/i)).toBeInTheDocument();
    });

    it('renders video play button', () => {
      render(<HeroSection />);
      expect(screen.getByText('Platformu İzle')).toBeInTheDocument();
      expect(screen.getByLabelText('Platformu İzle')).toBeInTheDocument();
    });
  });

  describe('FeaturesSection', () => {
    it('renders section title', () => {
      render(<FeaturesSection />);
      expect(screen.getByText('Video Üretimini Otomatikleştirin')).toBeInTheDocument();
    });

    it('renders all 6 features', () => {
      render(<FeaturesSection />);
      expect(screen.getByText('Yapay Zeka Senaryo')).toBeInTheDocument();
      expect(screen.getByText('10+ Görsel Stil')).toBeInTheDocument();
      expect(screen.getByText('TTS Seslendirme')).toBeInTheDocument();
      expect(screen.getByText('Otomatik Altyazı')).toBeInTheDocument();
      expect(screen.getByText('Arka Plan Müziği')).toBeInTheDocument();
      expect(screen.getByText('Otomatik Paylaşım')).toBeInTheDocument();
    });

    it('renders feature descriptions', () => {
      render(<FeaturesSection />);
      expect(screen.getByText(/Sadece bir konu girin, yapay zekamız saniyeler içinde/i)).toBeInTheDocument();
      expect(screen.getByText(/Markanıza veya hikayenize uygun onlarca farklı görsel stil/i)).toBeInTheDocument();
    });
  });

  describe('PricingSection', () => {
    it('renders section title', () => {
      render(<PricingSection />);
      expect(screen.getByText('Her İhtiyaca Uygun Planlar')).toBeInTheDocument();
    });

    it('renders all 4 pricing tiers', () => {
      render(<PricingSection />);
      expect(screen.getByText('Başlangıç')).toBeInTheDocument();
      expect(screen.getByText('Üretici')).toBeInTheDocument();
      expect(screen.getByText('Pro')).toBeInTheDocument();
      expect(screen.getByText('Kurumsal')).toBeInTheDocument();
    });

    it('renders pricing amounts', () => {
      render(<PricingSection />);
      expect(screen.getByText('$0')).toBeInTheDocument();
      expect(screen.getByText('$19')).toBeInTheDocument();
      expect(screen.getByText('$49')).toBeInTheDocument();
      expect(screen.getByText('$99')).toBeInTheDocument();
    });

    it('renders popular badge on Üretici plan', () => {
      render(<PricingSection />);
      expect(screen.getByText('EN POPÜLER')).toBeInTheDocument();
    });

    it('renders CTA buttons for all plans', () => {
      render(<PricingSection />);
      expect(screen.getByText('Hemen Başla')).toBeInTheDocument();
      expect(screen.getAllByText('Planı Seç').length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText('İletişime Geç')).toBeInTheDocument();
    });
  });

  describe('Footer', () => {
    it('renders ReelForge logo and description', () => {
      render(<Footer />);
      expect(screen.getAllByText('ReelForge')[0]).toBeInTheDocument();
      expect(screen.getByText(/AI destekli faceless video üretim platformu/i)).toBeInTheDocument();
    });

    it('renders navigation columns', () => {
      render(<Footer />);
      expect(screen.getByText('Ürün')).toBeInTheDocument();
      expect(screen.getByText('Şirket')).toBeInTheDocument();
      expect(screen.getByText('Yasal')).toBeInTheDocument();
    });

    it('renders footer links', () => {
      render(<Footer />);
      expect(screen.getByText('Özellikler')).toBeInTheDocument();
      expect(screen.getByText('Fiyatlandırma')).toBeInTheDocument();
      expect(screen.getByText('Hakkımızda')).toBeInTheDocument();
      expect(screen.getByText('Gizlilik Politikası')).toBeInTheDocument();
    });

    it('renders copyright', () => {
      render(<Footer />);
      expect(screen.getByText(/© 2025 ReelForge. Tüm hakları saklıdır./i)).toBeInTheDocument();
    });
  });

  describe('Home Page Integration', () => {
    it('renders without crashing', () => {
      render(<Home />);
      expect(screen.getAllByText('ReelForge')[0]).toBeInTheDocument();
      expect(screen.getByText(/Yüzünüzü Göstermeden Viral Videolar Oluşturun/i)).toBeInTheDocument();
    });
  });
});
