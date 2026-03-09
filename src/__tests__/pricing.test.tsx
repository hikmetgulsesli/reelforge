import { describe, it, expect } from "@jest/globals";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PricingPage from "../app/pricing/page";

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock fetch for Stripe API
global.fetch = jest.fn();

describe("PricingPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
  });

  it("renders pricing page with title", () => {
    render(<PricingPage />);
    expect(screen.getByText(/Basit ve Şeffaf/)).toBeInTheDocument();
    expect(screen.getByText(/Fiyatlandırma/)).toBeInTheDocument();
  });

  it("renders all 4 pricing plans", () => {
    render(<PricingPage />);
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("Starter")).toBeInTheDocument();
    expect(screen.getByText("Pro")).toBeInTheDocument();
    expect(screen.getByText("Business")).toBeInTheDocument();
  });

  it("displays monthly prices by default", () => {
    render(<PricingPage />);
    expect(screen.getByText(/\$0/)).toBeInTheDocument();
    expect(screen.getByText(/\$19/)).toBeInTheDocument();
    expect(screen.getByText(/\$49/)).toBeInTheDocument();
    expect(screen.getByText(/\$99/)).toBeInTheDocument();
  });

  it("toggles between monthly and yearly billing", () => {
    render(<PricingPage />);
    
    // Initially shows monthly
    expect(screen.getByText(/\$19/)).toBeInTheDocument();
    
    // Click the toggle
    const toggle = screen.getByRole("button", { name: /faturalandırma dönemini değiştir/i });
    fireEvent.click(toggle);
    
    // Should now show yearly prices
    expect(screen.getByText(/\$15/)).toBeInTheDocument();
  });

  it("shows discount badge for yearly billing", () => {
    render(<PricingPage />);
    
    const toggle = screen.getByRole("button", { name: /faturalandırma dönemini değiştir/i });
    fireEvent.click(toggle);
    
    expect(screen.getByText(/%20 İndirim/)).toBeInTheDocument();
  });

  it("renders feature lists", () => {
    render(<PricingPage />);
    
    // Check that features are rendered (use getAllByText for multiple occurrences)
    expect(screen.getByText("5 video/ay")).toBeInTheDocument();
    expect(screen.getAllByText("Öncelikli destek").length).toBeGreaterThan(0);
  });

  it("renders FAQ section", () => {
    render(<PricingPage />);
    
    expect(screen.getByText(/Sıkça Sorulan Sorular/)).toBeInTheDocument();
    expect(screen.getByText(/Ücretsiz deneme süresi var mı?/)).toBeInTheDocument();
  });

  it("expands FAQ items on click", () => {
    render(<PricingPage />);
    
    const faqButton = screen.getByText(/Ücretsiz deneme süresi var mı?/);
    fireEvent.click(faqButton);
    
    expect(screen.getByText(/Evet, Free planımızla/)).toBeInTheDocument();
  });

  it("shows 'En Popüler' badge on Pro plan", () => {
    render(<PricingPage />);
    expect(screen.getByText("En Popüler")).toBeInTheDocument();
  });

  it("calls Stripe API for paid plans", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ url: "https://checkout.stripe.com/test" }),
    });
    
    render(<PricingPage />);
    
    const proButton = screen.getByRole("button", { name: /Pro'ya Yükselt/i });
    fireEvent.click(proButton);
    
    // Wait for the async call
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/stripe/checkout",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.stringContaining("priceId"),
        })
      );
    });
  });

  it("handles Stripe API error gracefully", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"));
    
    // Mock alert
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    
    render(<PricingPage />);
    
    const proButton = screen.getByRole("button", { name: /Pro'ya Yükselt/i });
    fireEvent.click(proButton);
    
    // Wait for the async call
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        expect.stringContaining("hata")
      );
    });
    
    alertMock.mockRestore();
  });

  it("renders contact email in CTA section", () => {
    render(<PricingPage />);
    
    expect(screen.getByText(/Hala sorunuz mu var?/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Bize Ulaşın/ })).toHaveAttribute(
      "href",
      "mailto:destek@reelforge.com"
    );
  });
});