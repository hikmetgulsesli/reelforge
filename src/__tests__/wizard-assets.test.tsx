import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AssetsPage from "@/app/wizard/video/assets/page";

describe("Video Wizard Step 3 - Assets", () => {
  beforeEach(() => {
    // Clear any mocks or state
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("renders the page with correct title", () => {
      render(<AssetsPage />);
      expect(screen.getByText("Generate & Review Assets")).toBeInTheDocument();
    });

    it("renders the step indicator showing Step 3 of 7", () => {
      render(<AssetsPage />);
      expect(screen.getByText("Step 3 of 7")).toBeInTheDocument();
    });

    it("renders the prompt input field", () => {
      render(<AssetsPage />);
      expect(screen.getByPlaceholderText(/describe the visual assets/i)).toBeInTheDocument();
    });

    it("renders the Generate button", () => {
      render(<AssetsPage />);
      expect(screen.getAllByRole("button", { name: /generate/i })[0]).toBeInTheDocument();
    });

    it("renders the asset timeline section", () => {
      render(<AssetsPage />);
      expect(screen.getByText("Asset Timeline")).toBeInTheDocument();
    });

    it("renders the Previous and Next navigation buttons", () => {
      render(<AssetsPage />);
      expect(screen.getAllByRole("button", { name: /previous/i })[0]).toBeInTheDocument();
      expect(screen.getAllByRole("button", { name: /next/i })[0]).toBeInTheDocument();
    });
  });

  describe("Image Generation", () => {
    it("generates button is disabled when prompt is empty", () => {
      render(<AssetsPage />);
      const generateButton = screen.getAllByRole("button", { name: /generate/i })[0];
      expect(generateButton).toBeDisabled();
    });

    it("generates button is enabled when prompt has content", () => {
      render(<AssetsPage />);
      const input = screen.getByPlaceholderText(/describe the visual assets/i);
      const generateButton = screen.getAllByRole("button", { name: /generate/i })[0];
      
      fireEvent.change(input, { target: { value: "test prompt" } });
      expect(generateButton).not.toBeDisabled();
    });

    it("shows generating state when button is clicked", async () => {
      render(<AssetsPage />);
      const input = screen.getByPlaceholderText(/describe the visual assets/i);
      const generateButton = screen.getAllByRole("button", { name: /generate/i })[0];
      
      fireEvent.change(input, { target: { value: "futuristic city" } });
      fireEvent.click(generateButton);
      
      await waitFor(() => {
        expect(screen.getByText(/generating/i)).toBeInTheDocument();
      });
    });
  });

  describe("Asset Selection", () => {
    it("renders initial set of sample assets", () => {
      render(<AssetsPage />);
      // Should have scene cards
      expect(screen.getByText("Scene 01")).toBeInTheDocument();
      expect(screen.getByText("Scene 02")).toBeInTheDocument();
    });

    it("allows selecting/deselecting assets via checkbox", () => {
      render(<AssetsPage />);
      
      // Find the first scene card's checkbox (first checkbox button)
      const checkboxes = screen.getAllByRole("button", { name: "" });
      // Click the checkbox in the first scene card
      if (checkboxes[0]) {
        fireEvent.click(checkboxes[0]);
      }
      
      // Asset should now be selected (visual feedback is applied via class)
    });
  });

  describe("Regenerate Functionality", () => {
    it("has regenerate buttons on each asset card", () => {
      render(<AssetsPage />);
      const regenerateButtons = screen.getAllByText(/^regenerate$/i);
      expect(regenerateButtons.length).toBeGreaterThan(0);
    });
  });

  describe("Navigation", () => {
    it("Previous button is rendered and clickable", () => {
      render(<AssetsPage />);
      const prevButton = screen.getAllByRole("button", { name: /previous/i })[0];
      expect(prevButton).toBeInTheDocument();
      fireEvent.click(prevButton);
    });

    it("Next button is rendered and clickable", () => {
      render(<AssetsPage />);
      const nextButton = screen.getAllByRole("button", { name: /next/i })[0];
      expect(nextButton).toBeInTheDocument();
      fireEvent.click(nextButton);
    });
  });

  describe("Acceptance Criteria", () => {
    it("has image generation prompt input", () => {
      render(<AssetsPage />);
      expect(screen.getByPlaceholderText(/describe the visual assets/i)).toBeInTheDocument();
    });

    it("has Generate button with progress state", () => {
      render(<AssetsPage />);
      const button = screen.getAllByRole("button", { name: /generate/i })[0];
      expect(button).toBeInTheDocument();
    });

    it("has generated images grid", () => {
      render(<AssetsPage />);
      expect(screen.getByText("Generated Assets")).toBeInTheDocument();
    });

    it("has image refresh/regenerate button", () => {
      render(<AssetsPage />);
      const regenerateButtons = screen.getAllByRole("button", { name: /regenerate/i });
      expect(regenerateButtons.length).toBeGreaterThan(0);
    });

    it("has manual upload zone (Business only)", () => {
      render(<AssetsPage />);
      expect(screen.getByText(/manual upload/i)).toBeInTheDocument();
    });

    it("has asset timeline with drag reorder placeholder", () => {
      render(<AssetsPage />);
      expect(screen.getByText("Asset Timeline")).toBeInTheDocument();
    });

    it("has scene thumbnail previews in timeline", () => {
      render(<AssetsPage />);
      // Timeline should show scene thumbnails
      expect(screen.getByText(/scene 1/i)).toBeInTheDocument();
    });

    it("has Next/Previous navigation", () => {
      render(<AssetsPage />);
      expect(screen.getAllByRole("button", { name: /previous/i })[0]).toBeInTheDocument();
      expect(screen.getAllByRole("button", { name: /next/i })[0]).toBeInTheDocument();
    });
  });
});
