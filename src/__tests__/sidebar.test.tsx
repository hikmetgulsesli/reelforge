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
    expect(screen.getByText("ReelForge")).toBeInTheDocument();
  });

  it("renders navigation items", () => {
    render(<Sidebar user={mockUser} />);
    // Desktop sidebar navigation
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

  it("renders mobile navigation", () => {
    render(<Sidebar user={mockUser} />);
    const mobileNav = document.querySelector("nav.lg\\:hidden");
    expect(mobileNav).toBeInTheDocument();
  });
});