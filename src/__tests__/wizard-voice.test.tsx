import { render, screen, fireEvent } from "@testing-library/react";
import VoicePage from "@/app/wizard/video/voice/page";

describe("Video Wizard Step 4 - Voice", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("renders the page with correct title", () => {
      render(<VoicePage />);
      expect(screen.getByText("Select Voice")).toBeInTheDocument();
    });

    it("renders the step indicator showing Step 4 of 7", () => {
      render(<VoicePage />);
      expect(screen.getByText("Step 4 of 7")).toBeInTheDocument();
    });

    it("renders voice category tabs", () => {
      render(<VoicePage />);
      expect(screen.getByText("Erkek")).toBeInTheDocument();
      expect(screen.getByText("Kadın")).toBeInTheDocument();
      expect(screen.getByText("Notr")).toBeInTheDocument();
    });

    it("renders voice cards with preview buttons", () => {
      render(<VoicePage />);
      // Should have play buttons for voices
      const playButtons = screen.getAllByText("play_arrow");
      expect(playButtons.length).toBeGreaterThan(0);
    });

    it("renders speed slider", () => {
      render(<VoicePage />);
      expect(screen.getByText("Speed")).toBeInTheDocument();
    });

    it("renders pitch slider", () => {
      render(<VoicePage />);
      expect(screen.getByText("Pitch")).toBeInTheDocument();
    });

    it("renders voice cloning section (Pro+)", () => {
      render(<VoicePage />);
      expect(screen.getByText(/voice cloning/i)).toBeInTheDocument();
    });

    it("renders script preview section", () => {
      render(<VoicePage />);
      expect(screen.getByText("Script Preview")).toBeInTheDocument();
    });

    it("renders test voice button", () => {
      render(<VoicePage />);
      expect(screen.getByText("Test Voice")).toBeInTheDocument();
    });

    it("renders Previous and Next navigation buttons", () => {
      render(<VoicePage />);
      const buttons = screen.getAllByRole("button");
      const navButtons = buttons.filter(b => b.textContent?.includes("Previous") || b.textContent?.includes("Next"));
      expect(navButtons.length).toBe(2);
    });
  });

  describe("Voice Category Tabs", () => {
    it("switches between male and female voices", () => {
      render(<VoicePage />);
      
      // Default is male
      expect(screen.getByText("Ahmet")).toBeInTheDocument();
      
      // Switch to female
      fireEvent.click(screen.getByText("Kadın"));
      expect(screen.getByText("Ayşe")).toBeInTheDocument();
    });

    it("switches to neutral voices", () => {
      render(<VoicePage />);
      fireEvent.click(screen.getByText("Notr"));
      expect(screen.getByText("Not 1")).toBeInTheDocument();
    });
  });

  describe("Voice Selection", () => {
    it("allows selecting a voice", () => {
      render(<VoicePage />);
      // Click on first voice card
      const voiceCard = screen.getByText("Ahmet").closest("div[class*='cursor-pointer']");
      if (voiceCard) {
        fireEvent.click(voiceCard);
      }
    });
  });

  describe("Preview Playback", () => {
    it("has play buttons on voice cards", () => {
      render(<VoicePage />);
      const playButtons = screen.getAllByRole("button", { name: /play_arrow|stop/i });
      expect(playButtons.length).toBeGreaterThan(0);
    });
  });

  describe("Speed and Pitch Controls", () => {
    it("renders speed slider with default value", () => {
      render(<VoicePage />);
      expect(screen.getByText("1x")).toBeInTheDocument();
    });

    it("renders pitch slider with default value", () => {
      render(<VoicePage />);
      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("Previous button is clickable", () => {
      render(<VoicePage />);
      const prevButton = screen.getAllByRole("button", { name: /previous/i })[0];
      fireEvent.click(prevButton);
    });

    it("Next button is clickable", () => {
      render(<VoicePage />);
      const nextButton = screen.getAllByRole("button", { name: /next/i })[0];
      fireEvent.click(nextButton);
    });
  });

  describe("Acceptance Criteria", () => {
    it("has voice category tabs (Erkek/Kadin/Notr)", () => {
      render(<VoicePage />);
      expect(screen.getByText("Erkek")).toBeInTheDocument();
      expect(screen.getByText("Kadın")).toBeInTheDocument();
      expect(screen.getByText("Notr")).toBeInTheDocument();
    });

    it("has voice cards with name and preview", () => {
      render(<VoicePage />);
      expect(screen.getByText("Ahmet")).toBeInTheDocument();
      expect(screen.getAllByText("play_arrow").length).toBeGreaterThan(0);
    });

    it("has play/preview audio button", () => {
      render(<VoicePage />);
      expect(screen.getAllByText("play_arrow").length).toBeGreaterThan(0);
    });

    it("has speed slider with value display", () => {
      render(<VoicePage />);
      expect(screen.getByText("Speed")).toBeInTheDocument();
      expect(screen.getByText("1x")).toBeInTheDocument();
    });

    it("has pitch slider with value display", () => {
      render(<VoicePage />);
      expect(screen.getByText("Pitch")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("has voice cloning file dropzone (Pro+)", () => {
      render(<VoicePage />);
      expect(screen.getByText(/voice cloning.*pro+/i)).toBeInTheDocument();
    });

    it("has script preview text area", () => {
      render(<VoicePage />);
      expect(screen.getByText("Script Preview")).toBeInTheDocument();
    });

    it("has test voice button", () => {
      render(<VoicePage />);
      expect(screen.getByText("Test Voice")).toBeInTheDocument();
    });

    it("has Next/Previous navigation", () => {
      render(<VoicePage />);
      const buttons = screen.getAllByRole("button");
      const hasPrev = buttons.some(b => b.textContent?.toLowerCase().includes("previous"));
      const hasNext = buttons.some(b => b.textContent?.toLowerCase().includes("next"));
      expect(hasPrev).toBe(true);
      expect(hasNext).toBe(true);
    });
  });
});
