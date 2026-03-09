import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MusicWizard } from "@/components/music/MusicWizard";

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

// Mock Audio
class MockAudio {
  src: string;
  volume: number = 1;
  onended: (() => void) | null = null;
  
  constructor(src: string) {
    this.src = src;
  }
  
  play() {
    return Promise.resolve();
  }
  
  pause() {}
}

// @ts-expect-error - Mocking global Audio
global.Audio = MockAudio;

describe("MusicWizard", () => {
  const mockTracks = [
    {
      id: "track-1",
      title: "Test Track 1",
      artist: "Artist 1",
      category: "upbeat",
      duration: 180,
      audioUrl: "/audio/test1.mp3",
      thumbnailUrl: null,
      isAiRecommended: true,
      playCount: 100,
    },
    {
      id: "track-2",
      title: "Test Track 2",
      artist: "Artist 2",
      category: "chill",
      duration: 200,
      audioUrl: "/audio/test2.mp3",
      thumbnailUrl: null,
      isAiRecommended: false,
      playCount: 50,
    },
  ];

  const mockCategories = [
    { id: "upbeat", name: "Upbeat", icon: "music_note", description: "Energetic tracks", trackCount: 1 },
    { id: "chill", name: "Chill", icon: "waves", description: "Relaxed vibes", trackCount: 1 },
  ];

  beforeEach(() => {
    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ data: mockCategories }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ data: mockTracks, meta: { total: 2 } }),
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the music wizard component", async () => {
    render(<MusicWizard />);
    
    await waitFor(() => {
      expect(screen.getByText("Select Background Music")).toBeInTheDocument();
    });
  });

  it("displays No Music option", async () => {
    render(<MusicWizard />);
    
    await waitFor(() => {
      expect(screen.getByText("No Music")).toBeInTheDocument();
    });
  });

  it("displays category tabs", async () => {
    render(<MusicWizard />);
    
    await waitFor(() => {
      expect(screen.getByText("Upbeat")).toBeInTheDocument();
    });
  });

  it("displays music tracks", async () => {
    render(<MusicWizard />);
    
    await waitFor(() => {
      expect(screen.getByText("Test Track 1")).toBeInTheDocument();
      expect(screen.getByText("Test Track 2")).toBeInTheDocument();
    });
  });

  it("displays Audio Mixer panel", async () => {
    render(<MusicWizard />);
    
    await waitFor(() => {
      expect(screen.getByText("Audio Mixer")).toBeInTheDocument();
    });
  });

  it("displays volume control with dB display", async () => {
    render(<MusicWizard />);
    
    await waitFor(() => {
      expect(screen.getByText(/dB/)).toBeInTheDocument();
    });
  });

  it("displays fade in/out inputs", async () => {
    render(<MusicWizard />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Fade In/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Fade Out/i)).toBeInTheDocument();
    });
  });

  it("displays AI recommendation toggle", async () => {
    render(<MusicWizard />);
    
    await waitFor(() => {
      expect(screen.getByText("AI Recommendations")).toBeInTheDocument();
    });
  });

  it("selects a track when clicked", async () => {
    render(<MusicWizard />);
    
    await waitFor(() => {
      expect(screen.getByText("Test Track 1")).toBeInTheDocument();
    });

    const trackCard = screen.getByText("Test Track 1").closest("div");
    fireEvent.click(trackCard!);

    await waitFor(() => {
      // Check mark should appear on selected track
      expect(screen.getByText("check")).toBeInTheDocument();
    });
  });

  it("selects No Music option when clicked", async () => {
    render(<MusicWizard />);
    
    await waitFor(() => {
      expect(screen.getByText("No Music")).toBeInTheDocument();
    });

    const noMusicCard = screen.getByText("No Music").closest("div");
    fireEvent.click(noMusicCard!);

    // Should show check mark in the radio-style indicator
    await waitFor(() => {
      const checkIcon = screen.getAllByText("check");
      expect(checkIcon.length).toBeGreaterThan(0);
    });
  });

  it("filters tracks by category when category tab is clicked", async () => {
    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ data: mockCategories }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ data: mockTracks, meta: { total: 2 } }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ data: [mockTracks[0]], meta: { total: 1 } }),
      });

    render(<MusicWizard />);
    
    await waitFor(() => {
      expect(screen.getByText("Upbeat")).toBeInTheDocument();
    });

    const upbeatTab = screen.getByText("Upbeat").closest("button");
    fireEvent.click(upbeatTab!);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("category=upbeat")
      );
    });
  });
});

describe("Music API Routes", () => {
  describe("GET /api/music", () => {
    it("should return music tracks", async () => {
      const response = await fetch("/api/music");
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
    });

    it("should support category filtering", async () => {
      const response = await fetch("/api/music?category=upbeat");
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.data).toBeDefined();
    });

    it("should support pagination", async () => {
      const response = await fetch("/api/music?limit=5&offset=0");
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.meta).toBeDefined();
      expect(data.meta.limit).toBe(5);
      expect(data.meta.offset).toBe(0);
    });
  });

  describe("GET /api/music/categories", () => {
    it("should return music categories", async () => {
      const response = await fetch("/api/music/categories");
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
    });

    it("should include required category fields", async () => {
      const response = await fetch("/api/music/categories");
      const data = await response.json();
      
      expect(response.status).toBe(200);
      const category = data.data[0];
      expect(category).toHaveProperty("id");
      expect(category).toHaveProperty("name");
      expect(category).toHaveProperty("icon");
      expect(category).toHaveProperty("description");
      expect(category).toHaveProperty("trackCount");
    });
  });
});