import { render, screen, fireEvent } from "@testing-library/react";
import { AudioMixer } from "@/components/music/AudioMixer";

describe("AudioMixer", () => {
  const defaultProps = {
    voiceMusicBalance: 70,
    onVoiceMusicBalanceChange: jest.fn(),
    fadeInDuration: 1.5,
    onFadeInDurationChange: jest.fn(),
    fadeOutDuration: 2.0,
    onFadeOutDurationChange: jest.fn(),
    aiRecommended: false,
    onAiRecommendedChange: jest.fn(),
    isPlaying: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all controls", () => {
    render(<AudioMixer {...defaultProps} />);

    expect(screen.getByText("Ses Mikseri")).toBeInTheDocument();
    expect(screen.getByLabelText("Ses ve müzik dengesi")).toBeInTheDocument();
    expect(screen.getByLabelText(/fade in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fade out/i)).toBeInTheDocument();
    expect(screen.getByText("AI Önerisi")).toBeInTheDocument();
  });

  it("displays current balance values", () => {
    render(<AudioMixer {...defaultProps} />);

    expect(screen.getByText("70%")).toBeInTheDocument();
    expect(screen.getByText("30%")).toBeInTheDocument();
  });

  it("calls onVoiceMusicBalanceChange when slider changes", () => {
    render(<AudioMixer {...defaultProps} />);

    const slider = screen.getByLabelText("Ses ve müzik dengesi");
    fireEvent.change(slider, { target: { value: 50 } });

    expect(defaultProps.onVoiceMusicBalanceChange).toHaveBeenCalledWith(50);
  });

  it("calls onFadeInDurationChange when input changes", () => {
    render(<AudioMixer {...defaultProps} />);

    const fadeInInput = screen.getByLabelText(/fade in süresi/i);
    fireEvent.change(fadeInInput, { target: { value: "3" } });

    expect(defaultProps.onFadeInDurationChange).toHaveBeenCalledWith(3);
  });

  it("calls onFadeOutDurationChange when input changes", () => {
    render(<AudioMixer {...defaultProps} />);

    const fadeOutInput = screen.getByLabelText(/fade out süresi/i);
    fireEvent.change(fadeOutInput, { target: { value: "4" } });

    expect(defaultProps.onFadeOutDurationChange).toHaveBeenCalledWith(4);
  });

  it("toggles AI recommendation", () => {
    render(<AudioMixer {...defaultProps} />);

    const toggle = screen.getByRole("switch");
    fireEvent.click(toggle);

    expect(defaultProps.onAiRecommendedChange).toHaveBeenCalledWith(true);
  });

  it("shows correct AI toggle state", () => {
    const { rerender } = render(<AudioMixer {...defaultProps} />);

    let toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "false");

    rerender(<AudioMixer {...defaultProps} aiRecommended={true} />);
    toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("shows playing status when isPlaying is true", () => {
    render(<AudioMixer {...defaultProps} isPlaying={true} />);

    expect(screen.getByText("Önizleme Oynatılıyor")).toBeInTheDocument();
  });

  it("shows waiting status when isPlaying is false", () => {
    render(<AudioMixer {...defaultProps} isPlaying={false} />);

    expect(screen.getByText("Önizleme Bekliyor")).toBeInTheDocument();
  });

  it("displays volume in dB format", () => {
    render(<AudioMixer {...defaultProps} voiceMusicBalance={100} />);

    // 100% voice = 0 dB
    expect(screen.getByText("0 dB")).toBeInTheDocument();
  });

  it("displays -∞ dB for zero volume", () => {
    render(<AudioMixer {...defaultProps} voiceMusicBalance={0} />);

    expect(screen.getByText("-∞ dB")).toBeInTheDocument();
  });
});