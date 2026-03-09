/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ScriptStep } from '@/components/wizard/ScriptStep';

// Mock fetch
global.fetch = jest.fn();

describe('ScriptStep Component', () => {
  const mockOnDataChange = jest.fn();
  const mockOnNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
  });

  describe('rendering', () => {
    it('renders the component with all required elements', () => {
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      // Header
      expect(screen.getByText('Senaryo Olusturma')).toBeInTheDocument();
      expect(screen.getByText(/Video fikrinizi tanimlayin/)).toBeInTheDocument();

      // Video Fikri label and textarea
      expect(screen.getByText('Video Fikri')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Ornek: Surdurulebilir bir kahve markasi/)).toBeInTheDocument();

      // Character count
      expect(screen.getByText('0/1000')).toBeInTheDocument();

      // Quick template buttons
      expect(screen.getByText('Trending')).toBeInTheDocument();
      expect(screen.getByText('Egitici')).toBeInTheDocument();
      expect(screen.getByText('Hikaye')).toBeInTheDocument();

      // Generate button
      expect(screen.getByText('Senaryo Olustur')).toBeInTheDocument();

      // Configuration section
      expect(screen.getByText('Yapilandirma')).toBeInTheDocument();
      expect(screen.getByText('Hedef Sure')).toBeInTheDocument();
      expect(screen.getByText('Senaryo Tonu')).toBeInTheDocument();
      expect(screen.getByText('Nis')).toBeInTheDocument();
      expect(screen.getByText('Hedef Platform')).toBeInTheDocument();
    });

    it('renders duration options with 15s selected by default', () => {
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const button15 = screen.getByRole('button', { name: '15s' });
      const button30 = screen.getByRole('button', { name: '30s' });
      const button60 = screen.getByRole('button', { name: '60s' });

      expect(button15).toHaveClass('bg-primary');
      expect(button30).not.toHaveClass('bg-primary');
      expect(button60).not.toHaveClass('bg-primary');
    });

    it('renders niche dropdown with options', () => {
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      // Click to open dropdown
      const nicheButton = screen.getByRole('button', { name: /Nis secin/i });
      fireEvent.click(nicheButton);

      // Check niche options are visible
      expect(screen.getByText('Teknoloji')).toBeInTheDocument();
      expect(screen.getByText('Egitim')).toBeInTheDocument();
      expect(screen.getByText('Saglik')).toBeInTheDocument();
    });
  });

  describe('prompt input', () => {
    it('updates character count when typing', () => {
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Surdurulebilir/);
      fireEvent.change(textarea, { target: { value: 'Test prompt' } });

      // Character count is shown in the format "11/1000"
      const characterCountElement = screen.getByText((content, element) => {
        return element?.textContent?.includes('11') && element?.textContent?.includes('/1000') ?? false;
      });
      expect(characterCountElement).toBeInTheDocument();
    });

    it('shows error styling when over character limit', () => {
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Surdurulebilir/);
      const longText = 'a'.repeat(1001);
      fireEvent.change(textarea, { target: { value: longText } });

      expect(screen.getByText('1001/1000')).toHaveClass('text-destructive');
    });

    it('disables generate button when prompt is empty', () => {
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const generateButton = screen.getByText('Senaryo Olustur').closest('button');
      expect(generateButton).toBeDisabled();
    });

    it('disables generate button when over character limit', () => {
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Surdurulebilir/);
      const longText = 'a'.repeat(1001);
      fireEvent.change(textarea, { target: { value: longText } });

      const generateButton = screen.getByText('Senaryo Olustur').closest('button');
      expect(generateButton).toBeDisabled();
    });
  });

  describe('quick templates', () => {
    it('fills prompt when template button is clicked', () => {
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const trendingButton = screen.getByText('Trending').closest('button');
      fireEvent.click(trendingButton!);

      const textarea = screen.getByPlaceholderText(/Ornek: Surdurulebilir/);
      expect(textarea).toHaveValue('Trending bir konu icin kisa ve etkileyici bir video...');
    });
  });

  describe('configuration', () => {
    it('changes duration when duration button is clicked', () => {
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const button30 = screen.getByRole('button', { name: '30s' });
      fireEvent.click(button30);

      expect(button30).toHaveClass('bg-primary');
      expect(screen.getByRole('button', { name: '15s' })).not.toHaveClass('bg-primary');
    });

    it('changes tone when tone select is changed', () => {
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const toneSelect = screen.getByLabelText(/Senaryo Tonu/i);
      fireEvent.change(toneSelect, { target: { value: 'humorous' } });

      expect(toneSelect).toHaveValue('humorous');
    });

    it('changes platform when platform select is changed', () => {
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const platformSelect = screen.getByLabelText(/Hedef Platform/i);
      fireEvent.change(platformSelect, { target: { value: 'youtube-shorts' } });

      expect(platformSelect).toHaveValue('youtube-shorts');
    });

    it('selects niche from dropdown', () => {
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      // Open dropdown
      const nicheButton = screen.getByRole('button', { name: /Nis secin/i });
      fireEvent.click(nicheButton);

      // Select option
      const teknolojiOption = screen.getByText('Teknoloji');
      fireEvent.click(teknolojiOption);

      // Check selection
      expect(nicheButton).toHaveTextContent('Teknoloji');
    });
  });

  describe('script generation', () => {
    it('shows loading state when generating', async () => {
      (global.fetch as jest.Mock).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({ content: 'Generated script', wordCount: 2 })
        }), 100))
      );

      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Surdurulebilir/);
      fireEvent.change(textarea, { target: { value: 'Test prompt' } });

      const generateButton = screen.getByText('Senaryo Olustur').closest('button');
      fireEvent.click(generateButton!);

      expect(screen.getByText('Olusturuluyor...')).toBeInTheDocument();
    });

    it('displays generated script after successful generation', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ 
          content: 'Generated script content for testing', 
          wordCount: 5 
        })
      });

      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Surdurulebilir/);
      fireEvent.change(textarea, { target: { value: 'Test prompt' } });

      const generateButton = screen.getByText('Senaryo Olustur').closest('button');
      fireEvent.click(generateButton!);

      await waitFor(() => {
        expect(screen.getByText('Olusturulan Senaryo')).toBeInTheDocument();
        expect(screen.getByText('Generated script content for testing')).toBeInTheDocument();
      });
    });

    it('shows error message on failed generation', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'API error' })
      });

      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Surdurulebilir/);
      fireEvent.change(textarea, { target: { value: 'Test prompt' } });

      const generateButton = screen.getByText('Senaryo Olustur').closest('button');
      fireEvent.click(generateButton!);

      await waitFor(() => {
        expect(screen.getByText('API error')).toBeInTheDocument();
      });
    });
  });

  describe('script editing', () => {
    it('shows edit mode when edit button is clicked', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ 
          content: 'Generated script', 
          wordCount: 2 
        })
      });

      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      // Generate script first
      const textarea = screen.getByPlaceholderText(/Ornek: Surdurulebilir/);
      fireEvent.change(textarea, { target: { value: 'Test prompt' } });

      const generateButton = screen.getByText('Senaryo Olustur').closest('button');
      fireEvent.click(generateButton!);

      await waitFor(() => {
        expect(screen.getByText('Duzenle')).toBeInTheDocument();
      });

      // Click edit
      const editButton = screen.getByText('Duzenle').closest('button');
      fireEvent.click(editButton!);

      // Check edit mode
      expect(screen.getByText('Kaydet')).toBeInTheDocument();
      expect(screen.getByText('Iptal')).toBeInTheDocument();
    });
  });

  describe('callbacks', () => {
    it('calls onDataChange with correct data after generation', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ 
          content: 'Generated script', 
          wordCount: 2 
        })
      });

      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Surdurulebilir/);
      fireEvent.change(textarea, { target: { value: 'Test prompt' } });

      const generateButton = screen.getByText('Senaryo Olustur').closest('button');
      fireEvent.click(generateButton!);

      await waitFor(() => {
        expect(mockOnDataChange).toHaveBeenCalledWith(
          expect.objectContaining({
            prompt: 'Test prompt',
            generatedScript: 'Generated script',
            wordCount: 2
          })
        );
      });
    });
  });
});