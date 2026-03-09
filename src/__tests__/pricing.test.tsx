import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import PricingPage from "@/app/pricing/page";

// Mock Next.js Link
jest.mock("next/link", () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = "MockLink";
  return MockLink;
});

// Mock fetch for Stripe
global.fetch = jest.fn();

describe("PricingPage", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it("renders all 4 pricing plans", () => {
    render(<PricingPage />);
    
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("Starter")).toBeInTheDocument();
    expect(screen.getByText("Pro")).toBeInTheDocument();
    expect(screen.getByText("Business")).toBeInTheDocument();
  });

  it("displays correct prices for monthly billing", () => {
    render(<PricingPage />);
    
    expect(screen.getByText("$0")).toBeInTheDocument();
    expect(screen.getByText("$19")).toBeInTheDocument();
    expect(screen.getByText("$49")).toBeInTheDocument();
    expect(screen.getByText("$99")).toBeInTheDocument();
  });

  it("toggles between monthly and yearly billing", () => {
    render(<PricingPage />);
    
    // Initially shows monthly
    expect(screen.getByText("Aylık")).toBeInTheDocument();
    
    // Find and click the toggle
    const toggle = screen.getByLabelText("Faturalandırma dönemini değiştir");
    fireEvent.click(toggle);
    
    // Should show yearly prices
    expect(screen.getByText("$190")).toBeInTheDocument();
    expect(screen.getByText("$490")).toBeInTheDocument();
    expect(screen.getByText("$990")).toBeInTheDocument();
  });

  it("displays yearly savings badge when yearly is selected", () => {
    render(<PricingPage />);
    
    const toggle = screen.getByLabelText("Faturalandırma dönemini değiştir");
    fireEvent.click(toggle);
    
    expect(screen.getByText("%20 tasarruf")).toBeInTheDocument();
  });

  it("renders feature list items", () => {
    render(<PricingPage />);
    
    // Check for some feature texts
    expect(screen.getByText("3 video/ay")).toBeInTheDocument();
    expect(screen.getByText("30 video/ay")).toBeInTheDocument();
    // AI Script Yazıcı appears multiple times (in each plan), use getAllByText
    expect(screen.getAllByText("AI Script Yazıcı").length).toBeGreaterThan(0);
  });

  it("shows Pro plan as highlighted with 'En Popüler' badge", () => {
    render(<PricingPage />);
    
    expect(screen.getByText("En Popüler")).toBeInTheDocument();
  });

  it("renders FAQ section with all questions", () => {
    render(<PricingPage />);
    
    expect(screen.getByText("Sıkça Sorulan Sorular")).toBeInTheDocument();
    expect(
      screen.getByText("Ücretsiz plandan ücretli plana nasıl geçiş yapabilirim?")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Video kredileri bir sonraki aya devreder mi?")
    ).toBeInTheDocument();
  });

  it("expands FAQ items on click", () => {
    render(<PricingPage />);
    
    const firstQuestion = screen.getByText(
      "Ücretsiz plandan ücretli plana nasıl geçiş yapabilirim?"
    );
    
    // Click to expand
    fireEvent.click(firstQuestion);
    expect(
      screen.getByText(/Hesabınıza giriş yaptıktan sonra/)
    ).toBeInTheDocument();
  });

  it("renders header with logo and navigation", () => {
    render(<PricingPage />);
    
    expect(screen.getByText("ReelForge")).toBeInTheDocument();
    expect(screen.getByText("Giriş Yap")).toBeInTheDocument();
    expect(screen.getByText("Kayıt Ol")).toBeInTheDocument();
  });

  it("renders footer with copyright", () => {
    render(<PricingPage />);
    
    expect(screen.getByText(/© 2025 ReelForge/)).toBeInTheDocument();
  });

  it("displays contact section for questions", () => {
    render(<PricingPage />);
    
    expect(screen.getByText("Hala sorunuz mu var?")).toBeInTheDocument();
    // Use getAllByText since there are multiple "İletişime Geç" buttons
    const contactButtons = screen.getAllByText("İletişime Geç");
    expect(contactButtons.length).toBeGreaterThan(0);
  });

  it("has correct register link for Free plan", () => {
    render(<PricingPage />);
    
    const registerLinks = screen.getAllByRole("link");
    const registerLink = registerLinks.find(link => link.getAttribute("href") === "/register");
    expect(registerLink).toBeInTheDocument();
  });

  it("shows plan descriptions", () => {
    render(<PricingPage />);
    
    expect(screen.getByText("Başlamak için ideal")).toBeInTheDocument();
    expect(screen.getByText("Büyüyen içerik üreticileri için")).toBeInTheDocument();
    expect(screen.getByText("Profesyonel içerik üreticileri için")).toBeInTheDocument();
    expect(screen.getByText("Ekipler ve ajanslar için")).toBeInTheDocument();
  });

  it("shows CTA buttons for each plan", () => {
    render(<PricingPage />);
    
    expect(screen.getByText("Ücretsiz Başla")).toBeInTheDocument();
    expect(screen.getByText("Başla")).toBeInTheDocument();
    expect(screen.getByText("Pro'ya Geç")).toBeInTheDocument();
  });
});