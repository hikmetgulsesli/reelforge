"use client";

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DashboardLayout, Sidebar, Header } from "@/components/dashboard/Sidebar";
import { MemoryRouter } from "next/navigation";
import React from "react";

// Mock usePathname
const mockUsePathname = jest.fn();
jest.mock("next/navigation", () => {
  const actual = jest.requireActual("next/navigation");
  return {
    ...actual,
    usePathname: () => mockUsePathname(),
  };
});

// Mock next/link
jest.mock("next/link", () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = "Link";
  return { default: MockLink };
});

describe("Sidebar Navigation", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/dashboard");
  });

  it("renders sidebar with logo", () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={jest.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText("ReelForge")).toBeInTheDocument();
  });

  it("renders all main navigation items", () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={jest.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText("Ana Panel")).toBeInTheDocument();
    expect(screen.getByText("Yeni Video")).toBeInTheDocument();
    expect(screen.getByText("Video Kütüphanesi")).toBeInTheDocument();
    expect(screen.getByText("Seri Yönetimi")).toBeInTheDocument();
    expect(screen.getByText("İçerik Takvimi")).toBeInTheDocument();
    expect(screen.getByText("Analitik")).toBeInTheDocument();
    expect(screen.getByText("A/B Testleri")).toBeInTheDocument();
    expect(screen.getByText("Niş Analizi")).toBeInTheDocument();
  });

  it("renders settings section", () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={jest.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText("Ayarlar")).toBeInTheDocument();
  });

  it("renders upgrade plan card", () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={jest.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText("Pro Plan")).toBeInTheDocument();
    expect(screen.getByText("Planı Yükselt")).toBeInTheDocument();
  });
});

describe("Header", () => {
  it("renders header with title", () => {
    render(<Header onMenuClick={jest.fn()} />);

    expect(screen.getByText("Ana Kontrol Paneli")).toBeInTheDocument();
  });

  it("renders search input", () => {
    render(<Header onMenuClick={jest.fn()} />);

    expect(
      screen.getByPlaceholderText("Proje veya video ara...")
    ).toBeInTheDocument();
  });

  it("renders notification bell", () => {
    render(<Header onMenuClick={jest.fn()} />);

    // The bell icon should be present (we can check for the button that contains it)
    const notificationButton = document.querySelector('button[class*="relative"]');
    expect(notificationButton).toBeInTheDocument();
  });
});

describe("DashboardLayout", () => {
  it("renders with children", () => {
    render(
      <MemoryRouter>
        <DashboardLayout user={{ name: "Test User", email: "test@example.com" }}>
          <div>Test Content</div>
        </DashboardLayout>
      </MemoryRouter>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders mobile bottom bar", () => {
    render(
      <MemoryRouter>
        <DashboardLayout user={{ name: "Test User", email: "test@example.com" }}>
          <div>Test Content</div>
        </DashboardLayout>
      </MemoryRouter>
    );

    expect(screen.getByText("Ana Panel")).toBeInTheDocument();
    expect(screen.getByText("Video Oluştur")).toBeInTheDocument();
    expect(screen.getByText("Kütüphane")).toBeInTheDocument();
    expect(screen.getByText("Ayarlar")).toBeInTheDocument();
  });
});

describe("Navigation Links", () => {
  it("has correct href for dashboard", () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={jest.fn()} />
      </MemoryRouter>
    );

    const dashboardLink = screen.getByRole("link", { name: /ana panel/i });
    expect(dashboardLink).toHaveAttribute("href", "/dashboard");
  });

  it("has correct href for new video", () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={jest.fn()} />
      </MemoryRouter>
    );

    const newVideoLink = screen.getByRole("link", { name: /yeni video/i });
    expect(newVideoLink).toHaveAttribute("href", "/wizard");
  });

  it("has correct href for video library", () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={jest.fn()} />
      </MemoryRouter>
    );

    const libraryLink = screen.getByRole("link", { name: /video kütüphanesi/i });
    expect(libraryLink).toHaveAttribute("href", "/dashboard/videos");
  });

  it("has correct href for analytics", () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={jest.fn()} />
      </MemoryRouter>
    );

    const analyticsLink = screen.getByRole("link", { name: /analitik/i });
    expect(analyticsLink).toHaveAttribute("href", "/dashboard/analytics");
  });

  it("has correct href for settings", () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={jest.fn()} />
      </MemoryRouter>
    );

    const settingsLink = screen.getByRole("link", { name: /ayarlar/i });
    expect(settingsLink).toHaveAttribute("href", "/dashboard/settings");
  });
});

describe("Active State", () => {
  it("highlights active route", () => {
    mockUsePathname.mockReturnValue("/dashboard");

    const { container } = render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={jest.fn()} />
      </MemoryRouter>
    );

    // The active link should have the primary color
    const activeLink = container.querySelector('a[class*="bg-[var(--color-primary)]/20"]');
    expect(activeLink).toBeInTheDocument();
  });
});
