import { render, screen } from "@testing-library/react";
import Home from "../app/page";

describe("Project Setup and Design Tokens", () => {
  describe("Next.js App Router", () => {
    beforeEach(() => {
      render(<Home />);
    });

    it("renders home page without crashing", () => {
      expect(screen.getByText("ReelForge")).toBeInTheDocument();
    });

    it("renders Turkish language content", () => {
      expect(screen.getByText(/AI ile Faceless Video/i)).toBeInTheDocument();
      expect(screen.getByText("Ücretsiz Başla")).toBeInTheDocument();
    });
  });

  describe("Design Tokens", () => {
    beforeEach(() => {
      render(<Home />);
    });

    it("renders with custom CSS variables", () => {
      const mainElement = screen.getByRole("main");
      expect(mainElement).toBeInTheDocument();
    });

    it("applies dark theme classes on root container", () => {
      const container = document.querySelector(".flex.min-h-screen");
      expect(container).toHaveClass("bg-background");
      expect(container).toHaveClass("text-text-main");
    });
  });

  describe("Navigation", () => {
    beforeEach(() => {
      render(<Home />);
    });

    it("has login link", () => {
      expect(screen.getByText("Giriş Yap")).toHaveAttribute("href", "/login");
    });

    it("has register link", () => {
      expect(screen.getByText("Kayıt Ol")).toHaveAttribute("href", "/register");
    });

    it("has pricing link", () => {
      expect(screen.getByText("Fiyatları Gör")).toHaveAttribute("href", "/pricing");
    });
  });

  describe("Feature Cards", () => {
    beforeEach(() => {
      render(<Home />);
    });

    it("displays AI Script Yazıcı feature", () => {
      expect(screen.getByText("AI Script Yazıcı")).toBeInTheDocument();
    });

    it("displays 10+ Görsel Stil feature", () => {
      expect(screen.getByText("10+ Görsel Stil")).toBeInTheDocument();
    });

    it("displays TTS Seslendirme feature", () => {
      expect(screen.getByText("TTS Seslendirme")).toBeInTheDocument();
    });

    it("renders all three feature cards", () => {
      const featureCards = document.querySelectorAll(".rounded-lg.border");
      expect(featureCards.length).toBe(3);
    });
  });

  describe("Footer", () => {
    beforeEach(() => {
      render(<Home />);
    });

    it("displays copyright", () => {
      expect(screen.getByText(/© 2025 ReelForge/i)).toBeInTheDocument();
    });
  });
});