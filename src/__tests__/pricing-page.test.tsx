import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PricingPage from "@/app/pricing/page";

// Mock Next.js router
jest.mock("next/link", () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = "MockLink";
  return MockLink;
});

// Mock fetch for Stripe
global.fetch = jest.fn();

// Mock window.location
const originalLocation = window.location;
delete (window as unknown as { location?: unknown }).location;
window.location = { href: "" } as Location;

describe("PricingPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = "";
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  it("renders all 4 pricing plans", () => {
    render(<PricingPage />);
    
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("Starter")).toBeInTheDocument();
    expect(screen.getByText("Pro")).toBeInTheDocument();
    expect(screen.getByText("Business")).toBeInTheDocument();
  });

  it("displays correct prices for yearly billing (default)", () => {
    render(<PricingPage />);
    
    // Yearly is default - shows yearly prices
    expect(screen.getByText("$0")).toBeInTheDocument();
    expect(screen.getByText("$190")).toBeInTheDocument();
    expect(screen.getByText("$490")).toBeInTheDocument();
    expect(screen.getByText("$990")).toBeInTheDocument();
  });

  it("shows yearly savings on paid plans", () => {
    render(<PricingPage />);
    
    expect(screen.getByText("38$ tasarruf edin")).toBeInTheDocument(); // Starter
    expect(screen.getByText("98$ tasarruf edin")).toBeInTheDocument(); // Pro
    expect(screen.getByText("198$ tasarruf edin")).toBeInTheDocument(); // Business
  });

  it("shows 'En Popüler' badge on Starter plan", () => {
    render(<PricingPage />);
    
    expect(screen.getByText("En Popüler")).toBeInTheDocument();
  });

  it("toggles billing period when clicked", () => {
    render(<PricingPage />);
    
    // Initially shows yearly
    expect(screen.getByText("$190")).toBeInTheDocument();
    
    // Find and click the toggle button
    const toggleButtons = screen.getAllByRole("button");
    const toggleButton = toggleButtons.find(btn => 
      btn.className.includes("rounded-full") && 
      btn.className.includes("w-12")
    );
    
    fireEvent.click(toggleButton!);
    
    // Should now show monthly prices
    expect(screen.getByText("$19")).toBeInTheDocument();
    expect(screen.getByText("$49")).toBeInTheDocument();
    expect(screen.getByText("$99")).toBeInTheDocument();
  });

  it("renders all FAQ items", () => {
    render(<PricingPage />);
    
    expect(screen.getByText("Ücretsiz planda hangi özellikler var?")).toBeInTheDocument();
    expect(screen.getByText("Yıllık ödemede ne kadar indirim var?")).toBeInTheDocument();
    expect(screen.getByText("Video sayısı sınırını aşarsam ne olur?")).toBeInTheDocument();
    expect(screen.getByText("Voice Cloning nedir?")).toBeInTheDocument();
    expect(screen.getByText("Öncelikli render ne demek?")).toBeInTheDocument();
    expect(screen.getByText("Planımı istediğim zaman değiştirebilir miyim?")).toBeInTheDocument();
    expect(screen.getByText("İade politikası nedir?")).toBeInTheDocument();
    expect(screen.getByText("API erişimi nasıl çalışır?")).toBeInTheDocument();
  });

  it("expands FAQ items on click", async () => {
    render(<PricingPage />);
    
    const faqQuestion = screen.getByText("Ücretsiz planda hangi özellikler var?");
    fireEvent.click(faqQuestion);
    
    // Should show the answer
    await waitFor(() => {
      expect(screen.getByText(/Ücretsiz planda ayda 3 video üretebilir/)).toBeInTheDocument();
    });
  });

  it("shows feature lists for each plan", () => {
    render(<PricingPage />);
    
    // Check for some features
    expect(screen.getAllByText("3 video/ay").length).toBeGreaterThan(0);
    expect(screen.getAllByText("AI Script Yazıcı").length).toBeGreaterThan(0);
  });

  it("shows correct CTA buttons for each plan", () => {
    render(<PricingPage />);
    
    expect(screen.getByText("Ücretsiz Başla")).toBeInTheDocument();
    expect(screen.getByText("Başla")).toBeInTheDocument();
    expect(screen.getByText("Pro'ya Geç")).toBeInTheDocument();
    expect(screen.getByText("İletişime Geç")).toBeInTheDocument();
  });

  it("shows discount badge for yearly billing", () => {
    render(<PricingPage />);
    
    expect(screen.getByText("%17 İndirim")).toBeInTheDocument();
  });

  it("shows navigation links in header", () => {
    render(<PricingPage />);
    
    expect(screen.getByText("Giriş Yap")).toBeInTheDocument();
    expect(screen.getByText("Kayıt Ol")).toBeInTheDocument();
    expect(screen.getByText("ReelForge")).toBeInTheDocument();
  });

  it("shows page title correctly", () => {
    render(<PricingPage />);
    
    // The title is split across text nodes, so use regex
    // Check for the full title phrase to be more specific
    expect(screen.getByRole("heading", { level: 1, name: /Size Uygun.*Planı.*Seçin/ })).toBeInTheDocument();
  });

  it("calls Stripe checkout for paid plans", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ url: "https://checkout.stripe.com/test" }),
    });
    global.fetch = mockFetch;
    
    render(<PricingPage />);
    
    const starterButton = screen.getByText("Başla");
    fireEvent.click(starterButton);
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/stripe/checkout",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
    });
  });
});