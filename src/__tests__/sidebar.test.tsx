import { render, screen } from "@testing-library/react";
import { Sidebar } from "@/components/dashboard/Sidebar";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Sidebar Navigation", () => {
  const mockUser = {
    name: "Test User",
    email: "test@example.com",
    image: null,
  };

  it("renders logo and brand name", () => {
    render(<Sidebar user={mockUser} />);
    // Multiple elements because both mobile drawer and desktop sidebar have the logo
    expect(screen.getAllByText("ReelForge").length).toBeGreaterThan(0);
  });

  it("renders navigation items", () => {
    render(<Sidebar user={mockUser} />);
    // Use getAllByText since mobile bottom nav also has these labels
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Videolarım").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Video Oluştur").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Seriler").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Takvim").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Analizler").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Niş Analizi").length).toBeGreaterThan(0);
    expect(screen.getAllByText("A/B Testler").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Ayarlar").length).toBeGreaterThan(0);
  });

  it("renders SVG icons for navigation", () => {
    render(<Sidebar user={mockUser} />);
    const svgs = document.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
  });

  it("displays user info", () => {
    render(<Sidebar user={mockUser} />);
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });

  it("displays credits and plan", () => {
    render(<Sidebar user={mockUser} credits={25} plan="Pro" />);
    expect(screen.getByText(/Pro Plan/)).toBeInTheDocument();
    expect(screen.getByText(/25 Kredi/)).toBeInTheDocument();
  });

  it("displays Free plan by default", () => {
    render(<Sidebar user={mockUser} />);
    expect(screen.getByText(/Free Plan/)).toBeInTheDocument();
  });

  it("renders mobile bottom navigation", () => {
    render(<Sidebar user={mockUser} />);
    const mobileNav = document.querySelector('nav[aria-label="Mobil navigasyon"]');
    expect(mobileNav).toBeInTheDocument();
  });

  it("renders mobile hamburger menu button", () => {
    render(<Sidebar user={mockUser} />);
    const menuButton = screen.getByRole("button", { name: /menüyü aç/i });
    expect(menuButton).toBeInTheDocument();
  });

  it("has collapsible settings section", () => {
    render(<Sidebar user={mockUser} />);
    // Settings button should be present
    const settingsButtons = screen.getAllByRole("button", { name: /ayarlar/i });
    expect(settingsButtons.length).toBeGreaterThan(0);
  });

  it("highlights active route on dashboard", () => {
    render(<Sidebar user={mockUser} />);
    const activeLinks = screen.getAllByRole("link", { name: /dashboard/i });
    const activeLink = activeLinks.find(link => link.getAttribute("aria-current") === "page");
    expect(activeLink).toBeDefined();
  });
});