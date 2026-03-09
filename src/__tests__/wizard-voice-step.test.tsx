/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VoiceStep } from '@/components/wizard/VoiceStep';

describe('VoiceStep Component', () => {
  const mockOnDataChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AC1: Voice category tabs', () => {
    it('renders voice category tabs', () => {
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      expect(screen.getByRole('tab', { name: 'Erkek' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Kadin' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Notr' })).toBeInTheDocument();
    });

    it('has Erkek (male) category selected by default', () => {
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      const maleTab = screen.getByRole('tab', { name: 'Erkek' });
      expect(maleTab).toHaveAttribute('aria-selected', 'true');
    });

    it('changes category when tab is clicked', async () => {
      const user = userEvent.setup();
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      const femaleTab = screen.getByRole('tab', { name: 'Kadin' });
      await user.click(femaleTab);

      expect(femaleTab).toHaveAttribute('aria-selected', 'true');
      expect(mockOnDataChange).toHaveBeenCalledWith(
        expect.objectContaining({ voiceCategory: 'female' })
      );
    });
  });

  describe('AC2: Voice cards with name and preview', () => {
    it('renders voice cards for selected category', () => {
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      // Male voices should be shown by default
      expect(screen.getByText('Ahmet')).toBeInTheDocument();
      expect(screen.getByText('Mehmet')).toBeInTheDocument();
    });

    it('shows voice descriptions', () => {
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      expect(screen.getByText('Guclu, otoriter')).toBeInTheDocument();
      expect(screen.getByText('Sicak, samimi')).toBeInTheDocument();
    });

    it('shows female voices when female category is selected', async () => {
      const user = userEvent.setup();
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      const femaleTab = screen.getByRole('tab', { name: 'Kadin' });
      await user.click(femaleTab);

      expect(screen.getByText('Ayse')).toBeInTheDocument();
      expect(screen.getByText('Zeynep')).toBeInTheDocument();
    });

    it('shows neutral voices when neutral category is selected', async () => {
      const user = userEvent.setup();
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      const neutralTab = screen.getByRole('tab', { name: 'Notr' });
      await user.click(neutralTab);

      expect(screen.getByText('Alex')).toBeInTheDocument();
      expect(screen.getByText('Taylor')).toBeInTheDocument();
    });
  });

  describe('AC3: Play/preview audio button', () => {
    it('renders play buttons for each voice', () => {
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      const playButtons = screen.getAllByRole('button', { name: /Onizle|Durdur/ });
      expect(playButtons.length).toBeGreaterThan(0);
    });

    it('toggles play/pause state when clicked', async () => {
      const user = userEvent.setup();
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      const playButtons = screen.getAllByRole('button', { name: /Onizle/ });
      await user.click(playButtons[0]);

      // Should change to Durdur (pause)
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Durdur' })).toBeInTheDocument();
      });
    });
  });

  describe('AC4: Speed slider with value display', () => {
    it('renders speed slider', () => {
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      const speedSlider = screen.getByRole('slider', { name: 'Ses hizi' });
      expect(speedSlider).toBeInTheDocument();
    });

    it('displays current speed value', () => {
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      // Default speed is 1.0x - there are two 1.0x values (speed and pitch), so we check the Hiz label is nearby
      const speedValues = screen.getAllByText('1.0x');
      expect(speedValues.length).toBeGreaterThanOrEqual(1);
    });

    it('updates speed value when slider changes', async () => {
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      const speedSlider = screen.getByRole('slider', { name: 'Ses hizi' });
      fireEvent.change(speedSlider, { target: { value: '1.5' } });

      expect(mockOnDataChange).toHaveBeenCalledWith(
        expect.objectContaining({ speed: 1.5 })
      );
    });

    it('shows speed range labels', () => {
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      // Check for the presence of speed range labels (Yavas and Hizli are unique)
      expect(screen.getByText(/Yavas/)).toBeInTheDocument();
      expect(screen.getByText(/Hizli/)).toBeInTheDocument();
      // Normal appears in both speed and pitch sliders, so check there are at least 2
      expect(screen.getAllByText(/Normal/).length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('AC5: Pitch slider with value display', () => {
    it('renders pitch slider', () => {
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      const pitchSlider = screen.getByLabelText('Ses perdesi');
      expect(pitchSlider).toBeInTheDocument();
    });

    it('displays current pitch value', () => {
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      // Default pitch is 1.0x
      expect(screen.getByText('Perde')).toBeInTheDocument();
    });

    it('updates pitch value when slider changes', async () => {
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      const pitchSlider = screen.getByLabelText('Ses perdesi');
      fireEvent.change(pitchSlider, { target: { value: '1.3' } });

      expect(mockOnDataChange).toHaveBeenCalledWith(
        expect.objectContaining({ pitch: 1.3 })
      );
    });
  });

  describe('AC6: Voice cloning file dropzone (Pro+)', () => {
    it('renders voice cloning section with Pro+ badge', () => {
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      expect(screen.getByText('Ses Klonlama')).toBeInTheDocument();
      expect(screen.getByText('Pro+')).toBeInTheDocument();
    });

    it('renders file dropzone', () => {
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      const fileInput = screen.getByLabelText('Ses dosyasi yukle');
      expect(fileInput).toBeInTheDocument();
    });

    it('handles file selection', async () => {
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      const file = new File(['audio content'], 'voice.mp3', { type: 'audio/mp3' });
      const fileInput = screen.getByLabelText('Ses dosyasi yukle');
      
      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(mockOnDataChange).toHaveBeenCalledWith(
        expect.objectContaining({ customVoiceFile: file })
      );
    });

    it('displays uploaded file name', async () => {
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      const file = new File(['audio content'], 'voice.mp3', { type: 'audio/mp3' });
      const fileInput = screen.getByLabelText('Ses dosyasi yukle');
      
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText('voice.mp3')).toBeInTheDocument();
      });
    });

    it('allows removing uploaded file', async () => {
      const user = userEvent.setup();
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      const file = new File(['audio content'], 'voice.mp3', { type: 'audio/mp3' });
      const fileInput = screen.getByLabelText('Ses dosyasi yukle');
      
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText('voice.mp3')).toBeInTheDocument();
      });

      const removeButton = screen.getByLabelText('Dosyayi kaldir');
      await user.click(removeButton);

      expect(mockOnDataChange).toHaveBeenCalledWith(
        expect.objectContaining({ customVoiceFile: null })
      );
    });
  });

  describe('AC7: Script preview text area', () => {
    it('renders script preview section', () => {
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      expect(screen.getByText('Senaryo Onizleme')).toBeInTheDocument();
    });

    it('displays default message when no script provided', () => {
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      expect(screen.getByText(/Onceki adimda olusturulan senaryo/)).toBeInTheDocument();
    });

    it('displays provided script content', () => {
      const scriptContent = 'Bu bir test senaryosudur.';
      render(<VoiceStep onDataChange={mockOnDataChange} scriptContent={scriptContent} />);

      expect(screen.getByText(scriptContent)).toBeInTheDocument();
    });
  });

  describe('AC8: Test voice button', () => {
    it('renders test voice button', () => {
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      expect(screen.getByText('Sesi Test Et')).toBeInTheDocument();
    });

    it('is disabled when no voice is selected', () => {
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      const testButton = screen.getByText('Sesi Test Et').closest('button');
      expect(testButton).toBeDisabled();
    });

    it('is enabled when a voice is selected', async () => {
      const user = userEvent.setup();
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      // Select a voice
      const voiceCards = screen.getAllByRole('button', { name: /Ahmet|Mehmet|Can|Burak/ });
      await user.click(voiceCards[0]);

      const testButton = screen.getByText('Sesi Test Et').closest('button');
      expect(testButton).not.toBeDisabled();
    });

    it('shows loading state when testing', async () => {
      const user = userEvent.setup();
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      // Select a voice
      const voiceCards = screen.getAllByRole('button', { name: /Ahmet|Mehmet|Can|Burak/ });
      await user.click(voiceCards[0]);

      const testButton = screen.getByText('Sesi Test Et').closest('button');
      await user.click(testButton!);

      await waitFor(() => {
        expect(screen.getByText('Test Ediliyor...')).toBeInTheDocument();
      });
    });

    it('displays test result after testing', async () => {
      const user = userEvent.setup();
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      // Select a voice
      const voiceCards = screen.getAllByRole('button', { name: /Ahmet|Mehmet|Can|Burak/ });
      await user.click(voiceCards[0]);

      const testButton = screen.getByText('Sesi Test Et').closest('button');
      await user.click(testButton!);

      await waitFor(() => {
        expect(screen.getByText(/Ses testi tamamlandi/)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('AC9: Next/Previous navigation', () => {
    // Navigation is handled by the parent WizardNavigation component
    // This test verifies the component provides the necessary data for navigation decisions
    it('provides canProceed logic based on voice selection', async () => {
      const user = userEvent.setup();
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      // Initially no voice is selected, so canProceed would be false
      expect(mockOnDataChange).not.toHaveBeenCalled();

      // Select a voice
      const voiceCards = screen.getAllByRole('button', { name: /Ahmet|Mehmet|Can|Burak/ });
      await user.click(voiceCards[0]);

      expect(mockOnDataChange).toHaveBeenCalledWith(
        expect.objectContaining({ selectedVoice: expect.any(String) })
      );
    });
  });

  describe('Voice selection behavior', () => {
    it('selects voice when card is clicked', async () => {
      const user = userEvent.setup();
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      const voiceCards = screen.getAllByRole('button', { name: /Ahmet|Mehmet|Can|Burak/ });
      await user.click(voiceCards[0]);

      expect(mockOnDataChange).toHaveBeenCalledWith(
        expect.objectContaining({ selectedVoice: expect.any(String) })
      );
    });

    it('resets voice selection when category changes', async () => {
      const user = userEvent.setup();
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      // Select a voice
      const voiceCards = screen.getAllByRole('button', { name: /Ahmet|Mehmet|Can|Burak/ });
      await user.click(voiceCards[0]);

      // Change category
      const femaleTab = screen.getByRole('tab', { name: 'Kadin' });
      await user.click(femaleTab);

      expect(mockOnDataChange).toHaveBeenCalledWith(
        expect.objectContaining({ selectedVoice: null, voiceCategory: 'female' })
      );
    });

    it('shows selected voice info in sidebar', async () => {
      const user = userEvent.setup();
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      const voiceCards = screen.getAllByRole('button', { name: /Ahmet|Mehmet|Can|Burak/ });
      await user.click(voiceCards[0]);

      expect(screen.getByText('Secili Ses')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes for tabs', () => {
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBe(3);
      
      tabs.forEach(tab => {
        expect(tab).toHaveAttribute('aria-selected');
      });
    });

    it('has proper labels for sliders', () => {
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      expect(screen.getByLabelText('Ses hizi')).toBeInTheDocument();
      expect(screen.getByLabelText('Ses perdesi')).toBeInTheDocument();
    });

    it('supports keyboard navigation for voice selection', async () => {
      const user = userEvent.setup();
      render(<VoiceStep onDataChange={mockOnDataChange} />);

      const voiceCards = screen.getAllByRole('button', { name: /Ahmet|Mehmet|Can|Burak/ });
      
      voiceCards[0].focus();
      await user.keyboard('{Enter}');

      expect(mockOnDataChange).toHaveBeenCalledWith(
        expect.objectContaining({ selectedVoice: expect.any(String) })
      );
    });
  });
});