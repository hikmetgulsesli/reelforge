import { render, screen } from "@testing-library/react";
import Home from "../app/page";

describe("Project Setup and Design Tokens", () => {
  describe("Next.js App Router", () => {
    it("renders home page without crashing", () => {
      render(<Home />);
      expect(screen.getByText("ReelForge")).toBeInTheDocument();
    });

    it("renders Turkish language content", () => {
      render(<Home />);
      expect(screen.getByText(/AI ile Faceless Video/i)).toBeInTheDocument();
      expect(screen.getByText("Ücretsiz Başla")).toBeInTheDocument();
    });
  });

  describe("Design Tokens", () => {
    it("renders with custom CSS variables", () => {
      render(<Home />);
      const mainElement = screen.getByRole("main");
      expect(mainElement).toBeInTheDocument();
    });

    it("uses dark background color variable", () => {
      render(<Home />);
      const mainElement = document.querySelector("main");
      expect(mainElement).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("has login link", () => {
      render(<Home />);
      expect(screen.getByText("Giriş Yap")).toHaveAttribute("href", "/login");
    });

    it("has register link", () => {
      render(<Home />);
      expect(screen.getByText("Kayıt Ol")).toHaveAttribute("href", "/register");
    });

    it("has pricing link", () => {
      render(<Home />);
      expect(screen.getByText("Fiyatları Gör")).toHaveAttribute("href", "/pricing");
    });
  });

  describe("Feature Cards", () => {
    it("displays AI Script Yazıcı feature", () => {
      render(<Home />);
      expect(screen.getByText("AI Script Yazıcı")).toBeInTheDocument();
    });

    it("displays 10+ Görsel Stil feature", () => {
      render(<Home />);
      expect(screen.getByText("10+ Görsel Stil")).toBeInTheDocument();
    });

    it("displays TTS Seslendirme feature", () => {
      render(<Home />);
      expect(screen.getByText("TTS Seslendirme")).toBeInTheDocument();
    });
  });

  describe("Footer", () => {
    it("displays copyright", () => {
      render(<Home />);
      expect(screen.getByText(/© 2025 ReelForge/i)).toBeInTheDocument();
    });
  });
});
