import { render, screen, fireEvent } from "@testing-library/react";
import ReviewPage from "@/app/wizard/video/review/page";

describe("Video Wizard Step 7 - Review", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("renders the page with correct title", () => {
      render(<ReviewPage />);
      expect(screen.getByText("Review and Render")).toBeInTheDocument();
    });

    it("renders the step indicator showing Step 7 of 7", () => {
      render(<ReviewPage />);
      expect(screen.getByText("Step 7 of 7: Review your settings and generate your AI video.")).toBeInTheDocument();
    });

    it("renders project summary section", () => {
      render(<ReviewPage />);
      expect(screen.getByText("Project Summary")).toBeInTheDocument();
    });

    it("renders script preview in summary", () => {
      render(<ReviewPage />);
      expect(screen.getByText("Script Preview")).toBeInTheDocument();
    });

    it("renders visual style in summary", () => {
      render(<ReviewPage />);
      expect(screen.getByText("Visual Style")).toBeInTheDocument();
    });

    it("renders AI voice in summary", () => {
      render(<ReviewPage />);
      expect(screen.getByText("AI Voice")).toBeInTheDocument();
    });

    it("renders subtitles in summary", () => {
      render(<ReviewPage />);
      expect(screen.getByText("Subtitle Style")).toBeInTheDocument();
    });

    it("renders music in summary", () => {
      render(<ReviewPage />);
      expect(screen.getByText("Background Music")).toBeInTheDocument();
    });

    it("renders video settings section", () => {
      render(<ReviewPage />);
      expect(screen.getByText("Video Settings")).toBeInTheDocument();
    });

    it("renders credit calculation section", () => {
      render(<ReviewPage />);
      expect(screen.getByText("Credit Calculation")).toBeInTheDocument();
    });

    it("renders final preview section", () => {
      render(<ReviewPage />);
      expect(screen.getByText("Final Preview")).toBeInTheDocument();
    });

    it("renders start render button", () => {
      render(<ReviewPage />);
      expect(screen.getByText("Start Rendering")).toBeInTheDocument();
    });

    it("renders previous navigation button", () => {
      render(<ReviewPage />);
      expect(screen.getAllByRole("button", { name: /previous/i })[0]).toBeInTheDocument();
    });
  });

  describe("Credit Calculation", () => {
    it("displays credit cost", () => {
      render(<ReviewPage />);
      expect(screen.getAllByText(/5 credits/).length).toBeGreaterThan(0);
    });

    it("displays user credit balance", () => {
      render(<ReviewPage />);
      expect(screen.getAllByText(/15 credits/).length).toBeGreaterThan(0);
    });

    it("shows sufficient credits message", () => {
      render(<ReviewPage />);
      // Should show positive balance message
      expect(screen.getByText("Start Rendering")).toBeEnabled();
    });
  });

  describe("Confirmation Modal", () => {
    it("shows confirmation modal when clicking start render", () => {
      render(<ReviewPage />);
      const renderButton = screen.getByText("Start Rendering");
      fireEvent.click(renderButton);
      expect(screen.getByText(/Start Rendering\?/)).toBeInTheDocument();
    });

    it("closes modal on cancel", () => {
      render(<ReviewPage />);
      const renderButton = screen.getByText("Start Rendering");
      fireEvent.click(renderButton);
      
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      fireEvent.click(cancelButton);
      
      expect(screen.queryByText(/Start Rendering\?/)).not.toBeInTheDocument();
    });
  });

  describe("Render Progress", () => {
    it("shows progress after confirming render", () => {
      render(<ReviewPage />);
      const renderButton = screen.getByText("Start Rendering");
      fireEvent.click(renderButton);
      
      const confirmButton = screen.getByRole("button", { name: /confirm & render/i });
      fireEvent.click(confirmButton);
      
      expect(screen.getByText("Rendering in Progress")).toBeInTheDocument();
    });

    it("shows cancel button during render", () => {
      render(<ReviewPage />);
      const renderButton = screen.getByText("Start Rendering");
      fireEvent.click(renderButton);
      
      const confirmButton = screen.getByRole("button", { name: /confirm & render/i });
      fireEvent.click(confirmButton);
      
      expect(screen.getByRole("button", { name: /cancel render/i })).toBeInTheDocument();
    });

    it("can cancel render", () => {
      render(<ReviewPage />);
      const renderButton = screen.getByText("Start Rendering");
      fireEvent.click(renderButton);
      
      const confirmButton = screen.getByRole("button", { name: /confirm & render/i });
      fireEvent.click(confirmButton);
      
      const cancelButton = screen.getByRole("button", { name: /cancel render/i });
      fireEvent.click(cancelButton);
      
      expect(screen.queryByText("Rendering in Progress")).not.toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("Previous button is clickable", () => {
      render(<ReviewPage />);
      const prevButton = screen.getAllByRole("button", { name: /previous/i })[0];
      fireEvent.click(prevButton);
    });
  });

  describe("Acceptance Criteria", () => {
    it("has summary table with all wizard selections", () => {
      render(<ReviewPage />);
      expect(screen.getByText("Project Summary")).toBeInTheDocument();
      expect(screen.getByText("Script Preview")).toBeInTheDocument();
      expect(screen.getByText("Visual Style")).toBeInTheDocument();
      expect(screen.getByText("AI Voice")).toBeInTheDocument();
    });

    it("has credit cost calculation display", () => {
      render(<ReviewPage />);
      expect(screen.getByText("Credit Calculation")).toBeInTheDocument();
      expect(screen.getAllByText(/5 credits/).length).toBeGreaterThan(0);
    });

    it("has credit balance check with warning", () => {
      render(<ReviewPage />);
      // User has 15 credits, cost is 5, so should be sufficient
      expect(screen.getByText("Start Rendering")).toBeEnabled();
    });

    it("has final preview placeholder", () => {
      render(<ReviewPage />);
      expect(screen.getByText("Final Preview")).toBeInTheDocument();
      expect(screen.getByText("Preview will appear here")).toBeInTheDocument();
    });

    it("has render start button with confirmation modal", () => {
      render(<ReviewPage />);
      const renderButton = screen.getByText("Start Rendering");
      fireEvent.click(renderButton);
      expect(screen.getByText(/Start Rendering\?/)).toBeInTheDocument();
    });

    it("has progress bar after render starts", () => {
      render(<ReviewPage />);
      const renderButton = screen.getByText("Start Rendering");
      fireEvent.click(renderButton);
      
      const confirmButton = screen.getByRole("button", { name: /confirm & render/i });
      fireEvent.click(confirmButton);
      
      expect(screen.getByText("Rendering in Progress")).toBeInTheDocument();
    });

    it("has estimated time remaining", () => {
      render(<ReviewPage />);
      const renderButton = screen.getByText("Start Rendering");
      fireEvent.click(renderButton);
      
      const confirmButton = screen.getByRole("button", { name: /confirm & render/i });
      fireEvent.click(confirmButton);
      
      expect(screen.getByText(/estimated time remaining/i)).toBeInTheDocument();
    });

    it("has cancel render button", () => {
      render(<ReviewPage />);
      const renderButton = screen.getByText("Start Rendering");
      fireEvent.click(renderButton);
      
      const confirmButton = screen.getByRole("button", { name: /confirm & render/i });
      fireEvent.click(confirmButton);
      
      expect(screen.getByRole("button", { name: /cancel render/i })).toBeInTheDocument();
    });

    it("has previous navigation", () => {
      render(<ReviewPage />);
      expect(screen.getAllByRole("button", { name: /previous/i })[0]).toBeInTheDocument();
    });
  });
});
