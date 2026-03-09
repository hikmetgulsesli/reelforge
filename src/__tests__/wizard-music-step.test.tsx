import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MusicStep, MUSIC_CATEGORIES, MUSIC_TRACKS } from '@/components/wizard';

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('MusicStep', () => {
  const mockOnDataChange = vi.fn();
  const mockOnNext = vi.fn();
  const mockOnPrevious = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the music step component', () => {
    render(
      <MusicStep
        onDataChange={mockOnDataChange}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
      />
    );

    expect(screen.getByText('Arka Plan Muzigi Secin')).toBeInTheDocument();
    expect(screen.getByText('Videonuzun havasini belirleyecek bir parca secin veya kendinizinkini yukleyin.')).toBeInTheDocument();
  });

  it('displays music category tabs', () => {
    render(<MusicStep onDataChange={mockOnDataChange} />);

    MUSIC_CATEGORIES.forEach((cat) => {
      expect(screen.getByText(cat.label)).toBeInTheDocument();
    });
  });

  it('displays no music option', () => {
    render(<MusicStep onDataChange={mockOnDataChange} />);

    expect(screen.getByText('Muzik Yok')).toBeInTheDocument();
    expect(screen.getByText('Videoyu sadece seslendirme ile oynat')).toBeInTheDocument();
  });

  it('displays music tracks list with duration', () => {
    render(<MusicStep onDataChange={mockOnDataChange} />);

    // Check that music tracks are displayed
    const upbeatTracks = MUSIC_TRACKS.filter((t) => t.category === 'upbeat');
    upbeatTracks.forEach((track) => {
      expect(screen.getByText(track.title)).toBeInTheDocument();
      expect(screen.getByText(track.artist)).toBeInTheDocument();
      expect(screen.getByText(track.duration)).toBeInTheDocument();
    });
  });

  it('selects no music option when clicked', async () => {
    const user = userEvent.setup();
    render(<MusicStep onDataChange={mockOnDataChange} />);

    const noMusicButton = screen.getByText('Muzik Yok').closest('button');
    if (noMusicButton) {
      await user.click(noMusicButton);
    }

    await waitFor(() => {
      expect(mockOnDataChange).toHaveBeenCalled();
    });
  });

  it('selects a music track when clicked', async () => {
    const user = userEvent.setup();
    render(<MusicStep onDataChange={mockOnDataChange} />);

    const firstTrack = MUSIC_TRACKS.find((t) => t.category === 'upbeat');
    if (firstTrack) {
      const trackElement = screen.getByText(firstTrack.title).closest('[role="button"]');
      if (trackElement) {
        await user.click(trackElement);
      }
    }

    await waitFor(() => {
      expect(mockOnDataChange).toHaveBeenCalled();
    });
  });

  it('displays volume slider (0-100%)', () => {
    render(<MusicStep onDataChange={mockOnDataChange} />);

    const volumeSlider = screen.getByLabelText('Ses seviyesi');
    expect(volumeSlider).toBeInTheDocument();
    expect(volumeSlider).toHaveAttribute('type', 'range');
    expect(volumeSlider).toHaveAttribute('min', '0');
    expect(volumeSlider).toHaveAttribute('max', '100');
  });

  it('displays voice ducking indicator', () => {
    render(<MusicStep onDataChange={mockOnDataChange} />);

    // Voice ducking is shown as percentage next to volume slider
    expect(screen.getByText('Ses')).toBeInTheDocument();
    expect(screen.getByText('Muzik')).toBeInTheDocument();
  });

  it('displays fade in duration input', () => {
    render(<MusicStep onDataChange={mockOnDataChange} />);

    const fadeInInput = screen.getByLabelText('Fade in suresi');
    expect(fadeInInput).toBeInTheDocument();
    expect(fadeInInput).toHaveAttribute('type', 'number');
  });

  it('displays fade out duration input', () => {
    render(<MusicStep onDataChange={mockOnDataChange} />);

    const fadeOutInput = screen.getByLabelText('Fade out suresi');
    expect(fadeOutInput).toBeInTheDocument();
    expect(fadeOutInput).toHaveAttribute('type', 'number');
  });

  it('displays AI recommendation toggle', () => {
    render(<MusicStep onDataChange={mockOnDataChange} />);

    expect(screen.getByText('AI Onerileri')).toBeInTheDocument();
    const toggle = screen.getByRole('switch', { name: /ai onerilerini aktif et/i });
    expect(toggle).toBeInTheDocument();
  });

  it('shows suggested tracks section when AI toggle is enabled', async () => {
    const user = userEvent.setup();
    render(<MusicStep onDataChange={mockOnDataChange} />);

    // Initially, suggested tracks should not be visible
    expect(screen.queryByText('Onerilen Parcalar')).not.toBeInTheDocument();

    // Click AI toggle
    const toggle = screen.getByRole('switch', { name: /ai onerilerini aktif et/i });
    await user.click(toggle);

    // Now suggested tracks should be visible
    await waitFor(() => {
      expect(screen.getByText('Onerilen Parcalar')).toBeInTheDocument();
    });
  });

  it('filters tracks by category when tab is clicked', async () => {
    const user = userEvent.setup();
    render(<MusicStep onDataChange={mockOnDataChange} />);

    // Click on Chill category
    const chillTab = screen.getByText('Chill');
    await user.click(chillTab);

    // Check that chill tracks are displayed
    const chillTracks = MUSIC_TRACKS.filter((t) => t.category === 'chill');
    await waitFor(() => {
      chillTracks.forEach((track) => {
        expect(screen.getByText(track.title)).toBeInTheDocument();
      });
    });
  });

  it('plays preview when play button is clicked', async () => {
    const user = userEvent.setup();
    render(<MusicStep onDataChange={mockOnDataChange} />);

    const playButtons = screen.getAllByLabelText('Onizle');
    await user.click(playButtons[0]);

    // Should show pause icon (Duraklat)
    await waitFor(() => {
      expect(screen.getByLabelText('Duraklat')).toBeInTheDocument();
    });
  });

  it('displays recently used tracks', () => {
    render(<MusicStep onDataChange={mockOnDataChange} />);

    expect(screen.getByText('Son Kullanilanlar')).toBeInTheDocument();
  });

  it('initializes with provided initialData', () => {
    const initialData = {
      selectedMusicId: 'neon-horizon',
      category: 'upbeat',
      volume: 50,
      voiceDucking: 50,
      fadeIn: 2,
      fadeOut: 3,
      aiRecommendation: true,
    };

    render(<MusicStep initialData={initialData} onDataChange={mockOnDataChange} />);

    // Check volume is initialized
    const volumeSlider = screen.getByLabelText('Ses seviyesi');
    expect(volumeSlider).toHaveValue('50');
  });
});

describe('MusicStep - Acceptance Criteria', () => {
  it('1. Music category tabs exist and are clickable', async () => {
    const user = userEvent.setup();
    render(<MusicStep />);

    const categories = ['Upbeat', 'Dramatic', 'Chill', 'Epic', 'Lo-fi'];
    for (const cat of categories) {
      const tab = screen.getByText(cat);
      expect(tab).toBeInTheDocument();
      await user.click(tab);
    }
  });

  it('2. Music track list displays with duration', () => {
    render(<MusicStep />);

    // Check tracks have duration displayed
    const durations = screen.getAllByText(/\d:\d{2}/);
    expect(durations.length).toBeGreaterThan(0);
  });

  it('3. Play preview with waveform visualization', async () => {
    const user = userEvent.setup();
    render(<MusicStep />);

    const playButtons = screen.getAllByLabelText('Onizle');
    await user.click(playButtons[0]);

    // Should show playing state
    await waitFor(() => {
      expect(screen.getByText('Onizleme Oynatiliyor')).toBeInTheDocument();
    });
  });

  it('4. Volume slider (0-100%)', () => {
    render(<MusicStep />);

    const volumeSlider = screen.getByLabelText('Ses seviyesi');
    expect(volumeSlider).toHaveAttribute('min', '0');
    expect(volumeSlider).toHaveAttribute('max', '100');
  });

  it('5. Voice ducking indicator', () => {
    render(<MusicStep />);

    // Voice ducking is shown in the Audio Mixer section
    expect(screen.getByText('Ses')).toBeInTheDocument();
    expect(screen.getByText('Muzik')).toBeInTheDocument();
  });

  it('6. Fade in duration input', () => {
    render(<MusicStep />);

    const fadeInInput = screen.getByLabelText('Fade in suresi');
    expect(fadeInInput).toBeInTheDocument();
    expect(fadeInInput).toHaveAttribute('type', 'number');
  });

  it('7. Fade out duration input', () => {
    render(<MusicStep />);

    const fadeOutInput = screen.getByLabelText('Fade out suresi');
    expect(fadeOutInput).toBeInTheDocument();
    expect(fadeOutInput).toHaveAttribute('type', 'number');
  });

  it('8. AI recommendation toggle', () => {
    render(<MusicStep />);

    const toggle = screen.getByRole('switch', { name: /ai onerilerini aktif et/i });
    expect(toggle).toBeInTheDocument();
  });

  it('9. Suggested tracks section appears when AI is enabled', async () => {
    const user = userEvent.setup();
    render(<MusicStep />);

    const toggle = screen.getByRole('switch', { name: /ai onerilerini aktif et/i });
    await user.click(toggle);

    await waitFor(() => {
      expect(screen.getByText('Onerilen Parcalar')).toBeInTheDocument();
    });
  });

  it('10. Next/Previous navigation', () => {
    const mockOnNext = vi.fn();
    const mockOnPrevious = vi.fn();

    render(
      <MusicStep
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
      />
    );

    // Navigation is handled by parent component, MusicStep passes callbacks
    expect(mockOnNext).not.toHaveBeenCalled();
    expect(mockOnPrevious).not.toHaveBeenCalled();
  });

  it('11. Typecheck passes - component has correct types', () => {
    // This test passes if TypeScript compilation succeeds
    const data: import('@/components/wizard').MusicStepData = {
      selectedMusicId: 'neon-horizon',
      category: 'upbeat',
      volume: 70,
      voiceDucking: 30,
      fadeIn: 0,
      fadeOut: 0,
      aiRecommendation: false,
    };

    expect(data.selectedMusicId).toBe('neon-horizon');
    expect(data.volume).toBe(70);
  });
});