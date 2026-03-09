import { render, screen, fireEvent } from "@testing-library/react";
import { MusicTrackCard } from "@/components/music/MusicTrackCard";
import { MusicTrack } from "@/types/music";

describe("MusicTrackCard", () => {
  const mockTrack: MusicTrack = {
    id: "track-1",
    title: "Neon Horizon",
    artist: "Synthwave Collective",
    category: "Upbeat",
    duration: 165, // 2:45
    url: "https://example.com/track1.mp3",
    coverArt: "https://example.com/cover1.jpg",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOnSelect = jest.fn();
  const mockOnPlayToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders track information", () => {
    render(
      <MusicTrackCard
        track={mockTrack}
        isSelected={false}
        isPlaying={false}
        onSelect={mockOnSelect}
        onPlayToggle={mockOnPlayToggle}
      />
    );

    expect(screen.getByText("Neon Horizon")).toBeInTheDocument();
    expect(screen.getByText("Synthwave Collective")).toBeInTheDocument();
    expect(screen.getByText("2:45")).toBeInTheDocument();
  });

  it("shows selected state when selected", () => {
    render(
      <MusicTrackCard
        track={mockTrack}
        isSelected={true}
        isPlaying={false}
        onSelect={mockOnSelect}
        onPlayToggle={mockOnPlayToggle}
      />
    );

    const card = screen.getByRole("button", { name: /neon horizon.*selected/i });
    expect(card).toHaveClass("border-primary");
  });

  it("shows play button when not playing", () => {
    render(
      <MusicTrackCard
        track={mockTrack}
        isSelected={true}
        isPlaying={false}
        onSelect={mockOnSelect}
        onPlayToggle={mockOnPlayToggle}
      />
    );

    const playButton = screen.getByRole("button", { name: /oynat/i });
    expect(playButton).toBeInTheDocument();
  });

  it("shows pause button when playing", () => {
    render(
      <MusicTrackCard
        track={mockTrack}
        isSelected={true}
        isPlaying={true}
        onSelect={mockOnSelect}
        onPlayToggle={mockOnPlayToggle}
      />
    );

    const pauseButton = screen.getByRole("button", { name: /durdur/i });
    expect(pauseButton).toBeInTheDocument();
  });

  it("calls onSelect when card is clicked", () => {
    render(
      <MusicTrackCard
        track={mockTrack}
        isSelected={false}
        isPlaying={false}
        onSelect={mockOnSelect}
        onPlayToggle={mockOnPlayToggle}
      />
    );

    const card = screen.getByRole("button", { name: /neon horizon/i });
    fireEvent.click(card);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it("calls onPlayToggle when play button is clicked", () => {
    render(
      <MusicTrackCard
        track={mockTrack}
        isSelected={false}
        isPlaying={false}
        onSelect={mockOnSelect}
        onPlayToggle={mockOnPlayToggle}
      />
    );

    const playButton = screen.getByRole("button", { name: /oynat/i });
    fireEvent.click(playButton);

    expect(mockOnPlayToggle).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it("is keyboard accessible", () => {
    render(
      <MusicTrackCard
        track={mockTrack}
        isSelected={false}
        isPlaying={false}
        onSelect={mockOnSelect}
        onPlayToggle={mockOnPlayToggle}
      />
    );

    const card = screen.getByRole("button", { name: /neon horizon/i });
    fireEvent.click(card);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it("formats duration correctly", () => {
    const shortTrack = { ...mockTrack, duration: 45 }; // 0:45
    render(
      <MusicTrackCard
        track={shortTrack}
        isSelected={false}
        isPlaying={false}
        onSelect={mockOnSelect}
        onPlayToggle={mockOnPlayToggle}
      />
    );

    expect(screen.getByText("0:45")).toBeInTheDocument();
  });

  it("handles tracks without cover art", () => {
    const trackNoCover = { ...mockTrack, coverArt: null };
    render(
      <MusicTrackCard
        track={trackNoCover}
        isSelected={false}
        isPlaying={false}
        onSelect={mockOnSelect}
        onPlayToggle={mockOnPlayToggle}
      />
    );

    const albumArt = screen.getByRole("img");
    expect(albumArt).toBeInTheDocument();
  });
});