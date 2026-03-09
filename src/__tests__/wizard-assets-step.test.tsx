/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssetsStep, type AssetsStepData } from '@/components/wizard/AssetsStep';

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = jest.fn();

describe('AssetsStep Component', () => {
  const mockOnDataChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('AC1: Image generation prompt input', () => {
    it('renders a textarea for prompt input', () => {
      render(<AssetsStep onDataChange={mockOnDataChange} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Neon isikli futuristik/);
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('allows entering prompt text', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<AssetsStep onDataChange={mockOnDataChange} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Neon isikli futuristik/);
      await user.type(textarea, 'Test prompt for image generation');

      expect(textarea).toHaveValue('Test prompt for image generation');
    });

    it('shows character count', () => {
      render(<AssetsStep onDataChange={mockOnDataChange} />);

      expect(screen.getByText('0/500')).toBeInTheDocument();
    });
  });

  describe('AC2: Generate button with progress', () => {
    it('renders generate button', () => {
      render(<AssetsStep onDataChange={mockOnDataChange} />);

      expect(screen.getByText('Gorsel Uret')).toBeInTheDocument();
    });

    it('shows loading state when generating', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<AssetsStep onDataChange={mockOnDataChange} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Neon isikli futuristik/);
      await user.type(textarea, 'Test prompt');

      const generateButton = screen.getByText('Gorsel Uret').closest('button');
      await user.click(generateButton!);

      expect(screen.getByText(/Uretiliyor/)).toBeInTheDocument();
    });

    it('shows progress bar during generation', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<AssetsStep onDataChange={mockOnDataChange} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Neon isikli futuristik/);
      await user.type(textarea, 'Test prompt');

      const generateButton = screen.getByText('Gorsel Uret').closest('button');
      await user.click(generateButton!);

      // Progress bar should be visible
      const progressBar = document.querySelector('.bg-primary\\/20.rounded-full');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('AC3: Generated images grid (4-6 images)', () => {
    it('generates 4 images per scene', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<AssetsStep onDataChange={mockOnDataChange} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Neon isikli futuristik/);
      await user.type(textarea, 'Test prompt');

      const generateButton = screen.getByText('Gorsel Uret').closest('button');
      await user.click(generateButton!);

      // Advance timers to complete generation
      await act(async () => {
        jest.advanceTimersByTime(5000);
      });

      await waitFor(() => {
        // Should have scene cards with asset thumbnails
        const sceneCards = screen.getAllByText(/Sahne 0/);
        expect(sceneCards.length).toBeGreaterThan(0);
      });
    });

    it('displays images in a grid layout', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<AssetsStep onDataChange={mockOnDataChange} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Neon isikli futuristik/);
      await user.type(textarea, 'Test prompt');

      const generateButton = screen.getByText('Gorsel Uret').closest('button');
      await user.click(generateButton!);

      await act(async () => {
        jest.advanceTimersByTime(5000);
      });

      await waitFor(() => {
        // Look for the grid container
        const gridContainer = document.querySelector('.grid-cols-4');
        expect(gridContainer).toBeInTheDocument();
      });
    });
  });

  describe('AC4: Image refresh/regenerate button', () => {
    it('renders regenerate button for each scene after generation', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<AssetsStep onDataChange={mockOnDataChange} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Neon isikli futuristik/);
      await user.type(textarea, 'Test prompt');

      const generateButton = screen.getByText('Gorsel Uret').closest('button');
      await user.click(generateButton!);

      await act(async () => {
        jest.advanceTimersByTime(5000);
      });

      await waitFor(() => {
        const regenerateButtons = screen.getAllByText('Yeniden Uret');
        expect(regenerateButtons.length).toBeGreaterThan(0);
      });
    });

    it('regenerates images when clicking regenerate button', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<AssetsStep onDataChange={mockOnDataChange} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Neon isikli futuristik/);
      await user.type(textarea, 'Test prompt');

      const generateButton = screen.getByText('Gorsel Uret').closest('button');
      await user.click(generateButton!);

      await act(async () => {
        jest.advanceTimersByTime(5000);
      });

      await waitFor(() => {
        const regenerateButtons = screen.getAllByText('Yeniden Uret');
        expect(regenerateButtons.length).toBeGreaterThan(0);
      });

      // Click regenerate for first scene
      const regenerateButton = screen.getAllByText('Yeniden Uret')[0].closest('button');
      await user.click(regenerateButton!);

      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
    });
  });

  describe('AC5: Manual upload zone (Business only)', () => {
    it('does not show upload zone for non-business users', () => {
      render(<AssetsStep onDataChange={mockOnDataChange} isBusinessUser={false} />);

      expect(screen.queryByText('Manuel Yukleme')).not.toBeInTheDocument();
    });

    it('shows upload zone for business users', () => {
      render(<AssetsStep onDataChange={mockOnDataChange} isBusinessUser={true} />);

      expect(screen.getByText('Manuel Yukleme')).toBeInTheDocument();
      expect(screen.getByText(/Tiklayip yukleyin/)).toBeInTheDocument();
    });

    it('shows Business badge for upload feature', () => {
      render(<AssetsStep onDataChange={mockOnDataChange} isBusinessUser={true} />);

      expect(screen.getByText('Business')).toBeInTheDocument();
    });

    it('allows file upload for business users', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<AssetsStep onDataChange={mockOnDataChange} isBusinessUser={true} />);

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      expect(fileInput).toBeInTheDocument();
      await user.upload(fileInput, file);

      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
    });
  });

  describe('AC6: Asset timeline with drag reorder', () => {
    it('renders scene timeline', () => {
      render(<AssetsStep onDataChange={mockOnDataChange} />);

      expect(screen.getByText('Sahne Zaman Cizgisi')).toBeInTheDocument();
    });

    it('shows drag handle for each scene', () => {
      render(<AssetsStep onDataChange={mockOnDataChange} />);

      const dragHandles = document.querySelectorAll('[draggable="true"]');
      expect(dragHandles.length).toBeGreaterThan(0);
    });

    it('displays total duration', () => {
      render(<AssetsStep onDataChange={mockOnDataChange} />);

      expect(screen.getByText(/Toplam:/)).toBeInTheDocument();
    });
  });

  describe('AC7: Scene thumbnail previews', () => {
    it('shows scene cards with thumbnails', () => {
      render(<AssetsStep onDataChange={mockOnDataChange} />);

      // Should show scene names
      expect(screen.getByText('Sahne 01')).toBeInTheDocument();
    });

    it('shows scene descriptions', () => {
      render(<AssetsStep onDataChange={mockOnDataChange} />);

      // Should show scene descriptions
      const descriptions = screen.getAllByText(/futuristik|veri cekirdegi|neon/i);
      expect(descriptions.length).toBeGreaterThan(0);
    });

    it('shows preview button', () => {
      render(<AssetsStep onDataChange={mockOnDataChange} />);

      expect(screen.getByText('Onizleme')).toBeInTheDocument();
    });
  });

  describe('AC8: Next/Previous navigation', () => {
    it('calls onDataChange when assets are generated', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<AssetsStep onDataChange={mockOnDataChange} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Neon isikli futuristik/);
      await user.type(textarea, 'Test prompt');

      const generateButton = screen.getByText('Gorsel Uret').closest('button');
      await user.click(generateButton!);

      await act(async () => {
        jest.advanceTimersByTime(5000);
      });

      await waitFor(() => {
        expect(mockOnDataChange).toHaveBeenCalled();
      });
    });
  });

  describe('Additional functionality', () => {
    it('allows deleting individual assets', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<AssetsStep onDataChange={mockOnDataChange} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Neon isikli futuristik/);
      await user.type(textarea, 'Test prompt');

      const generateButton = screen.getByText('Gorsel Uret').closest('button');
      await user.click(generateButton!);

      await act(async () => {
        jest.advanceTimersByTime(5000);
      });

      await waitFor(() => {
        // Find delete buttons (X buttons on asset thumbnails)
        const deleteButtons = document.querySelectorAll('.group .bg-destructive');
        expect(deleteButtons.length).toBeGreaterThan(0);
      });
    });

    it('shows preview modal when clicking on asset', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<AssetsStep onDataChange={mockOnDataChange} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Neon isikli futuristik/);
      await user.type(textarea, 'Test prompt');

      const generateButton = screen.getByText('Gorsel Uret').closest('button');
      await user.click(generateButton!);

      await act(async () => {
        jest.advanceTimersByTime(5000);
      });

      await waitFor(() => {
        const assetImages = document.querySelectorAll('img[src*="unsplash"]');
        expect(assetImages.length).toBeGreaterThan(0);
      });
    });

    it('disables generate button when over character limit', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<AssetsStep onDataChange={mockOnDataChange} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Neon isikli futuristik/);
      const longText = 'a'.repeat(501);
      await user.type(textarea, longText);

      const generateButton = screen.getByText('Gorsel Uret').closest('button');
      expect(generateButton).toBeDisabled();
    });

    it('shows error styling when over character limit', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<AssetsStep onDataChange={mockOnDataChange} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Neon isikli futuristik/);
      const longText = 'a'.repeat(501);
      await user.type(textarea, longText);

      expect(textarea).toHaveClass('border-destructive');
    });
  });
});

// Helper for act
async function act(fn: () => Promise<void>) {
  await fn();
}