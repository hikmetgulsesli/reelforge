/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubtitlesStep, SUBTITLE_PRESETS, FONT_FAMILIES } from '@/components/wizard/SubtitlesStep';

describe('SubtitlesStep Component', () => {
  const mockOnDataChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AC1: 10 subtitle style preset cards', () => {
    it('renders all 10 subtitle preset cards', () => {
      render(<SubtitlesStep onDataChange={mockOnDataChange} />);

      // Check all preset names are rendered
      expect(screen.getByText('Modern Kalin')).toBeInTheDocument();
      expect(screen.getByText('Klasik Sari')).toBeInTheDocument();
      expect(screen.getByText('Neon Parilti')).toBeInTheDocument();
      expect(screen.getByText('Minimal Beyaz')).toBeInTheDocument();
      expect(screen.getByText('Sinematik')).toBeInTheDocument();
      expect(screen.getByText('TikTok Tarzi')).toBeInTheDocument();
      expect(screen.getByText('YouTube CC')).toBeInTheDocument();
      expect(screen.getByText('Retro Altyazi')).toBeInTheDocument();
      expect(screen.getByText('Gradient Pop')).toBeInTheDocument();
      expect(screen.getByText('Sadece Cerceve')).toBeInTheDocument();
    });

    it('has first preset selected by default', () => {
      render(<SubtitlesStep onDataChange={mockOnDataChange} />);

      const modernButton = screen.getByRole('button', { name: /Modern Kalin stili sec/i });
      expect(modernButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('changes selection when clicking a preset card', async () => {
      const user = userEvent.setup();
      render(<SubtitlesStep onDataChange={mockOnDataChange} />);

      const tiktokButton = screen.getByRole('button', { name: /TikTok Tarzi stili sec/i });
      await user.click(tiktokButton);

      expect(tiktokButton).toHaveAttribute('aria-pressed', 'true');
      expect(mockOnDataChange).toHaveBeenCalledWith(
        expect.objectContaining({ selectedPreset: 'tiktok-style' })
      );
    });
  });

  describe('AC2: Live subtitle preview component', () => {
    it('renders live preview section', () => {
      render(<SubtitlesStep onDataChange={mockOnDataChange} />);

      expect(screen.getByText('Canli Onizleme')).toBeInTheDocument();
    });

    it('displays preview text in subtitle area', () => {
      render(<SubtitlesStep onDataChange={mockOnDataChange} />);

      expect(screen.getByText('Bu bir ornek altyazi metnidir.')).toBeInTheDocument();
    });
  });

  describe('AC3: Font family dropdown', () => {
    it('renders font family dropdown button', () => {
      render(<SubtitlesStep onDataChange={mockOnDataChange} />);

      expect(screen.getByText('Inter')).toBeInTheDocument();
    });

    it('opens dropdown with font options when clicked', async () => {
      const user = userEvent.setup();
      render(<SubtitlesStep onDataChange={mockOnDataChange} />);

      const fontButton = screen.getByRole('button', { name: /Inter/i }).closest('button');
      await user.click(fontButton!);

      expect(screen.getByRole('option', { name: /Roboto/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /Montserrat/i })).toBeInTheDocument();
    });

    it('selects font from dropdown', async () => {
      const user = userEvent.setup();
      render(<SubtitlesStep onDataChange={mockOnDataChange} />);

      const fontButton = screen.getByRole('button', { name: /Inter/i }).closest('button');
      await user.click(fontButton!);

      const robotoOption = screen.getByRole('option', { name: /Roboto/i });
      await user.click(robotoOption);

      expect(mockOnDataChange).toHaveBeenCalledWith(
        expect.objectContaining({ fontFamily: 'roboto' })
      );
    });
  });

  describe('AC4: Text color picker', () => {
    it('renders text color picker', () => {
      render(<SubtitlesStep onDataChange={mockOnDataChange} />);

      expect(screen.getByLabelText('Metin rengi secici')).toBeInTheDocument();
    });

    it('has default white color', () => {
      render(<SubtitlesStep onDataChange={mockOnDataChange} />);

      const colorInput = screen.getByLabelText('Metin rengi secici');
      // HTML color inputs return lowercase values
      expect(colorInput).toHaveValue('#ffffff');
    });

    it('updates color when changed', async () => {
      const user = userEvent.setup();
      render(<SubtitlesStep onDataChange={mockOnDataChange} />);

      const textInput = screen.getByPlaceholderText('#FFFFFF');
      await user.clear(textInput);
      await user.type(textInput, '#FF0000');

      expect(mockOnDataChange).toHaveBeenCalledWith(
        expect.objectContaining({ textColor: '#FF0000' })
      );
    });
  });

  describe('AC5: Background color picker', () => {
    it('renders background color picker', () => {
      render(<SubtitlesStep onDataChange={mockOnDataChange} />);

      expect(screen.getByLabelText('Arka plan rengi secici')).toBeInTheDocument();
    });

    it('has default semi-transparent black background', () => {
      render(<SubtitlesStep onDataChange={mockOnDataChange} />);

      const textInput = screen.getByPlaceholderText('rgba(0,0,0,0.6)');
      expect(textInput).toHaveValue('rgba(0,0,0,0.6)');
    });

    it('has transparent and semi-transparent quick buttons', () => {
      render(<SubtitlesStep onDataChange={mockOnDataChange} />);

      expect(screen.getByText('Seffaf')).toBeInTheDocument();
      expect(screen.getByText('Yari Saydam')).toBeInTheDocument();
    });

    it('sets transparent background when clicking transparent button', async () => {
      const user = userEvent.setup();
      render(<SubtitlesStep onDataChange={mockOnDataChange} />);

      const transparentButton = screen.getByText('Seffaf');
      await user.click(transparentButton);

      expect(mockOnDataChange).toHaveBeenCalledWith(
        expect.objectContaining({ backgroundColor: 'transparent' })
      );
    });
  });

  describe('AC6: Outline color picker', () => {
    it('renders outline color picker', () => {
      render(<SubtitlesStep onDataChange={mockOnDataChange} />);

      expect(screen.getByLabelText('Cerceve rengi secici')).toBeInTheDocument();
    });

    it('has default black outline color', () => {
      render(<SubtitlesStep onDataChange={mockOnDataChange} />);

      const colorInput = screen.getByLabelText('Cerceve rengi secici');
      expect(colorInput).toHaveValue('#000000');
    });

    it('updates outline color when changed', async () => {
      const user = userEvent.setup();
      render(<SubtitlesStep onDataChange={mockOnDataChange} />);

      const textInput = screen.getByPlaceholderText('#000000');
      await user.clear(textInput);
      await user.type(textInput, '#333333');

      expect(mockOnDataChange).toHaveBeenCalledWith(
        expect.objectContaining({ outlineColor: '#333333' })
      );
    });
  });

  describe('AC7: Animation toggle switch', () => {
    it('renders animation toggle switch', () => {
      render(<SubtitlesStep onDataChange={mockOnDataChange} />);

      expect(screen.getByRole('switch', { name: /altyazi animasyonunu/i })).toBeInTheDocument();
    });

    it('is enabled by default', () => {
      render(<SubtitlesStep onDataChange={mockOnDataChange} />);

      const toggle = screen.getByRole('switch', { name: /altyazi animasyonunu/i });
      expect(toggle).toHaveAttribute('aria-checked', 'true');
    });

    it('toggles animation when clicked', async () => {
      const user = userEvent.setup();
      render(<SubtitlesStep onDataChange={mockOnDataChange} />);

      const toggle = screen.getByRole('switch', { name: /altyazi animasyonunu/i });
      await user.click(toggle);

      expect(toggle).toHaveAttribute('aria-checked', 'false');
      expect(mockOnDataChange).toHaveBeenCalledWith(
        expect.objectContaining({ animationEnabled: false })
      );
    });
  });

  describe('AC8: Position radio buttons', () => {
    it('renders three position buttons', () => {
      render(<SubtitlesStep onDataChange={mockOnDataChange} />);

      expect(screen.getByText('Ust')).toBeInTheDocument();
      expect(screen.getByText('Orta')).toBeInTheDocument();
      expect(screen.getByText('Alt')).toBeInTheDocument();
    });

    it('has bottom position selected by default', () => {
      render(<SubtitlesStep onDataChange={mockOnDataChange} />);

      // Find position buttons within the Konum section
      const konumLabel = screen.getByText('Konum');
      const positionContainer = konumLabel.closest('div')?.parentElement;
      const buttons = positionContainer?.querySelectorAll('button');
      
      // The "Alt" (bottom) button should have aria-pressed true
      const altButton = Array.from(buttons || []).find(
        btn => btn.textContent?.includes('Alt')
      );
      expect(altButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('changes position when clicking a position button', async () => {
      const user = userEvent.setup();
      render(<SubtitlesStep onDataChange={mockOnDataChange} />);

      const ortaButton = screen.getByRole('button', { name: /Orta/i }).closest('button');
      await user.click(ortaButton!);

      expect(mockOnDataChange).toHaveBeenCalledWith(
        expect.objectContaining({ position: 'center' })
      );
    });
  });

  describe('AC9: Initial data handling', () => {
    it('accepts initial data', () => {
      render(
        <SubtitlesStep
          initialData={{
            selectedPreset: 'tiktok-style',
            fontFamily: 'poppins',
            textColor: '#FF0000',
            backgroundColor: 'transparent',
            outlineColor: '#FFFFFF',
            animationEnabled: false,
            position: 'top',
          }}
          onDataChange={mockOnDataChange}
        />
      );

      expect(screen.getByRole('button', { name: /TikTok Tarzi stili sec/i })).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByRole('switch', { name: /altyazi animasyonunu/i })).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('Data exports', () => {
    it('exports SUBTITLE_PRESETS with 10 presets', () => {
      expect(SUBTITLE_PRESETS).toHaveLength(10);
    });

    it('exports FONT_FAMILIES with 8 fonts', () => {
      expect(FONT_FAMILIES).toHaveLength(8);
    });
  });
});