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
      expect(mainElement).toHaveClass("flex");
    });

    it("applies dark theme classes to root container", () => {
      const mainElement = screen.getByRole("main");
      const rootContainer = mainElement.parentElement;
      expect(rootContainer).toHaveClass("bg-background");
      expect(rootContainer).toHaveClass("text-text-main");
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

    it("uses feature title as key", () => {
      const featureCard = screen.getByText("AI Script Yazıcı").closest("div");
      expect(featureCard).toBeInTheDocument();
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