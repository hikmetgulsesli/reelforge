/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ScriptStep } from '@/components/wizard/ScriptStep';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('ScriptStep Component', () => {
  const mockOnDataChange = jest.fn();
  const mockOnNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  describe('AC1: Multi-line prompt input with placeholder', () => {
    it('renders a textarea with placeholder text', () => {
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Surdurulebilir bir kahve markasi/);
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('allows multi-line input', async () => {
      const user = userEvent.setup();
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Surdurulebilir/);
      const multiLineText = 'Line 1\nLine 2\nLine 3';
      
      await user.type(textarea, multiLineText);
      expect(textarea).toHaveValue(multiLineText);
    });
  });

  describe('AC2: Niche dropdown with search', () => {
    it('renders niche dropdown button', () => {
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const nicheButton = screen.getByRole('button', { name: /Nis secin/i });
      expect(nicheButton).toBeInTheDocument();
    });

    it('opens dropdown with options when clicked', async () => {
      const user = userEvent.setup();
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const nicheButton = screen.getByRole('button', { name: /Nis secin/i });
      await user.click(nicheButton);

      expect(screen.getByText('Teknoloji')).toBeInTheDocument();
      expect(screen.getByText('Egitim')).toBeInTheDocument();
    });

    it('selects niche from dropdown', async () => {
      const user = userEvent.setup();
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const nicheButton = screen.getByRole('button', { name: /Nis secin/i });
      await user.click(nicheButton);

      const teknolojiOption = screen.getByText('Teknoloji');
      await user.click(teknolojiOption);

      expect(nicheButton).toHaveTextContent('Teknoloji');
    });
  });

  describe('AC3: Duration segmented control', () => {
    it('renders three duration options', () => {
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      expect(screen.getByRole('button', { name: '15s' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '30s' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '60s' })).toBeInTheDocument();
    });

    it('has 15s selected by default', () => {
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const button15 = screen.getByRole('button', { name: '15s' });
      expect(button15).toHaveClass('bg-primary');
    });

    it('changes selection when clicked', async () => {
      const user = userEvent.setup();
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const button30 = screen.getByRole('button', { name: '30s' });
      await user.click(button30);

      expect(button30).toHaveClass('bg-primary');
    });
  });

  describe('AC4: Tone selection', () => {
    it('renders tone select dropdown', () => {
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const toneSelect = screen.getByLabelText(/Senaryo Tonu/i);
      expect(toneSelect).toBeInTheDocument();
    });

    it('has professional tone selected by default', () => {
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const toneSelect = screen.getByLabelText(/Senaryo Tonu/i);
      expect(toneSelect).toHaveValue('professional');
    });

    it('changes tone when selection changes', async () => {
      const user = userEvent.setup();
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const toneSelect = screen.getByLabelText(/Senaryo Tonu/i);
      await user.selectOptions(toneSelect, 'humorous');

      expect(toneSelect).toHaveValue('humorous');
    });
  });

  describe('AC5: AI generate button with loading state', () => {
    it('renders generate button', () => {
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      expect(screen.getByText('Senaryo Olustur')).toBeInTheDocument();
    });

    it('is disabled when prompt is empty', () => {
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const generateButton = screen.getByText('Senaryo Olustur').closest('button');
      expect(generateButton).toBeDisabled();
    });

    it('is enabled when prompt has content', async () => {
      const user = userEvent.setup();
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Surdurulebilir/);
      await user.type(textarea, 'Test prompt');

      const generateButton = screen.getByText('Senaryo Olustur').closest('button');
      expect(generateButton).not.toBeDisabled();
    });
  });

  describe('AC6: Generated script editor', () => {
    it('shows script editor after successful generation', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ 
          content: 'Generated script content', 
          wordCount: 3 
        })
      });

      const user = userEvent.setup();
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Surdurulebilir/);
      await user.type(textarea, 'Test prompt');

      const generateButton = screen.getByText('Senaryo Olustur').closest('button');
      await user.click(generateButton!);

      await waitFor(() => {
        expect(screen.getByText('Olusturulan Senaryo')).toBeInTheDocument();
      }, { timeout: 10000 });
    });
  });

  describe('AC7: Character and word count', () => {
    it('shows character count for prompt', () => {
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      expect(screen.getByText('0/1000')).toBeInTheDocument();
    });

    it('updates character count when typing', async () => {
      const user = userEvent.setup();
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Surdurulebilir/);
      await user.type(textarea, 'Test');

      expect(screen.getByText('4/1000')).toBeInTheDocument();
    });
  });

  describe('AC8: Navigation', () => {
    it('calls onDataChange when script is generated', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ 
          content: 'Generated script', 
          wordCount: 2
        })
      });

      const user = userEvent.setup();
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const textarea = screen.getByPlaceholderText(/Ornek: Surdurulebilir/);
      await user.type(textarea, 'Test prompt');

      const generateButton = screen.getByText('Senaryo Olustur').closest('button');
      await user.click(generateButton!);

      await waitFor(() => {
        expect(mockOnDataChange).toHaveBeenCalled();
      }, { timeout: 10000 });
    });
  });

  describe('Quick templates', () => {
    it('renders quick template buttons', () => {
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      expect(screen.getByText('Trending')).toBeInTheDocument();
      expect(screen.getByText('Egitici')).toBeInTheDocument();
      expect(screen.getByText('Hikaye')).toBeInTheDocument();
    });
  });

  describe('Platform selection', () => {
    it('renders platform select dropdown', () => {
      render(<ScriptStep onDataChange={mockOnDataChange} onNext={mockOnNext} />);

      const platformSelect = screen.getByLabelText(/Hedef Platform/i);
      expect(platformSelect).toBeInTheDocument();
    });
  });
});