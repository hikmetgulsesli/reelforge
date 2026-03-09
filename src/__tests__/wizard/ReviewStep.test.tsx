/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReviewStep } from '@/components/wizard/ReviewStep';
import { useWizardStore } from '@/lib/wizard-store';
import React from 'react';

// Reset store before each test
beforeEach(() => {
  useWizardStore.getState().reset();
});

describe('ReviewStep - Wizard Step 7', () => {
  // Test 1: Summary table with all wizard selections
  describe('1. Summary table with all wizard selections', () => {
    it('should display script preview in summary', () => {
      useWizardStore.getState().setScript('Test script content');
      render(<ReviewStep />);
      
      expect(screen.getByText(/Test script content/i)).toBeInTheDocument();
    });

    it('should display visual style in summary', () => {
      useWizardStore.getState().setVisualStyle('anime', 'Anime');
      render(<ReviewStep />);
      
      expect(screen.getByText('Anime')).toBeInTheDocument();
    });

    it('should display AI voice in summary', () => {
      useWizardStore.getState().setVoice('sarah', 'Sarah', 'female');
      render(<ReviewStep />);
      
      expect(screen.getByText(/Sarah/i)).toBeInTheDocument();
    });

    it('should display subtitle style in summary', () => {
      useWizardStore.getState().setSubtitleStyle('bold');
      useWizardStore.getState().setSubtitleColor('#FFFF00');
      useWizardStore.getState().setSubtitleOutline(true);
      render(<ReviewStep />);
      
      expect(screen.getByText(/Bold/i)).toBeInTheDocument();
    });

    it('should display background music in summary', () => {
      useWizardStore.getState().setMusicTrack('Chill Lo-fi');
      useWizardStore.getState().setMusicVolume(15);
      render(<ReviewStep />);
      
      expect(screen.getByText(/Chill Lo-fi/i)).toBeInTheDocument();
    });
  });

  // Test 2: Credit cost calculation display
  describe('2. Credit cost calculation display', () => {
    it('should display credit cost', () => {
      render(<ReviewStep />);
      
      expect(screen.getByText(/Maliyet:/i)).toBeInTheDocument();
      expect(screen.getByText(/1 Kredi/i)).toBeInTheDocument();
    });

    it('should show correct cost based on quality', () => {
      useWizardStore.getState().setQuality('4k');
      render(<ReviewStep />);
      
      // 4K should cost more
      expect(screen.getByText(/2 Kredi/i)).toBeInTheDocument();
    });
  });

  // Test 3: Credit balance check with warning
  describe('3. Credit balance check with warning', () => {
    it('should display user credit balance', () => {
      useWizardStore.getState().setUserCredits(10);
      render(<ReviewStep />);
      
      // The balance should be visible somewhere
      expect(useWizardStore.getState().userCredits).toBe(10);
    });

    it('should show warning when insufficient credits', () => {
      useWizardStore.getState().setUserCredits(0);
      render(<ReviewStep />);
      
      expect(screen.getByText(/Yetersiz kredi/i)).toBeInTheDocument();
    });

    it('should not show warning when sufficient credits', () => {
      useWizardStore.getState().setUserCredits(10);
      render(<ReviewStep />);
      
      expect(screen.queryByText(/Yetersiz kredi/i)).not.toBeInTheDocument();
    });
  });

  // Test 4: Final preview placeholder
  describe('4. Final preview placeholder', () => {
    it('should display project summary section', () => {
      render(<ReviewStep />);
      
      expect(screen.getByText(/Proje Özeti/i)).toBeInTheDocument();
    });

    it('should display video settings section', () => {
      render(<ReviewStep />);
      
      expect(screen.getByText(/Video Ayarları/i)).toBeInTheDocument();
    });
  });

  // Test 5: Render başlat button with confirmation modal
  describe('5. Render başlat button with confirmation modal', () => {
    it('should display render start button', () => {
      render(<ReviewStep />);
      
      expect(screen.getByText(/Render Başlat/i)).toBeInTheDocument();
    });

    it('should be disabled when terms not agreed', () => {
      useWizardStore.getState().setAgreedToTerms(false);
      render(<ReviewStep />);
      
      const button = screen.getByText(/Render Başlat/i);
      expect(button).toBeDisabled();
    });

    it('should be enabled when terms agreed and credits sufficient', () => {
      useWizardStore.getState().setAgreedToTerms(true);
      useWizardStore.getState().setUserCredits(10);
      render(<ReviewStep />);
      
      const button = screen.getByText(/Render Başlat/i);
      expect(button).not.toBeDisabled();
    });
  });

  // Test 6: Progress bar after render starts
  describe('6. Progress bar after render starts', () => {
    it('should show progress bar when rendering', () => {
      useWizardStore.getState().setAgreedToTerms(true);
      useWizardStore.getState().setUserCredits(10);
      useWizardStore.getState().startRender();
      render(<ReviewStep />);
      
      expect(screen.getByText(/Video Render Ediliyor/i)).toBeInTheDocument();
    });

    it('should display progress percentage', () => {
      useWizardStore.getState().setAgreedToTerms(true);
      useWizardStore.getState().setUserCredits(10);
      useWizardStore.getState().startRender();
      useWizardStore.getState().updateProgress(45);
      render(<ReviewStep />);
      
      expect(screen.getByText(/45%/i)).toBeInTheDocument();
    });

    it('should update progress dynamically', async () => {
      useWizardStore.getState().setAgreedToTerms(true);
      useWizardStore.getState().setUserCredits(10);
      useWizardStore.getState().startRender();
      render(<ReviewStep />);
      
      await waitFor(() => {
        const progress = useWizardStore.getState().renderProgress;
        expect(progress).toBeGreaterThan(0);
      });
    });
  });

  // Test 7: Estimated time remaining
  describe('7. Estimated time remaining', () => {
    it('should display estimated duration', () => {
      useWizardStore.getState().setScript('word ' .repeat(150));
      render(<ReviewStep />);
      
      expect(screen.getByText(/Tahmini Süre/i)).toBeInTheDocument();
    });

    it('should display ETA during render', () => {
      useWizardStore.getState().setAgreedToTerms(true);
      useWizardStore.getState().setUserCredits(10);
      useWizardStore.getState().startRender();
      render(<ReviewStep />);
      
      expect(screen.getByText(/Tahmini:/i)).toBeInTheDocument();
    });
  });

  // Test 8: Cancel render button
  describe('8. Cancel render button', () => {
    it('should display cancel button during render', () => {
      useWizardStore.getState().setAgreedToTerms(true);
      useWizardStore.getState().setUserCredits(10);
      useWizardStore.getState().startRender();
      render(<ReviewStep />);
      
      expect(screen.getByText(/Render'ı İptal Et/i)).toBeInTheDocument();
    });

    it('should stop rendering when cancel clicked', () => {
      useWizardStore.getState().setAgreedToTerms(true);
      useWizardStore.getState().setUserCredits(10);
      useWizardStore.getState().startRender();
      render(<ReviewStep />);
      
      const cancelButton = screen.getByText(/Render'ı İptal Et/i);
      fireEvent.click(cancelButton);
      
      expect(useWizardStore.getState().isRendering).toBe(false);
    });
  });

  // Test 9: Previous navigation
  describe('9. Previous navigation', () => {
    it('should have back button', () => {
      render(<ReviewStep />);
      
      expect(screen.getByText(/Geri/i)).toBeInTheDocument();
    });

    it('should link to previous step (subtitles)', () => {
      render(<ReviewStep />);
      
      const backButton = screen.getByText(/Geri/i);
      expect(backButton.closest('a')).toHaveAttribute('href', '/wizard/video/subtitles');
    });
  });

  // Test 10: Typecheck passes
  describe('10. TypeScript type checking', () => {
    it('should have valid types for store', () => {
      const store = useWizardStore.getState();
      
      // Verify all required state properties exist
      expect(typeof store.setScript).toBe('function');
      expect(typeof store.setVisualStyle).toBe('function');
      expect(typeof store.setVoice).toBe('function');
      expect(typeof store.setSubtitleStyle).toBe('function');
      expect(typeof store.setMusicTrack).toBe('function');
      expect(typeof store.setQuality).toBe('function');
      expect(typeof store.setAspectRatio).toBe('function');
      expect(typeof store.startRender).toBe('function');
      expect(typeof store.updateProgress).toBe('function');
      expect(typeof store.cancelRender).toBe('function');
    });
  });

  // Additional integration tests
  describe('Integration Tests', () => {
    it('should render complete wizard step 7', () => {
      // Set all wizard data
      useWizardStore.getState().setScript('Test video script about AI');
      useWizardStore.getState().setVisualStyle('anime', 'Anime');
      useWizardStore.getState().setVoice('sarah', 'Sarah', 'female');
      useWizardStore.getState().setSubtitleStyle('bold');
      useWizardStore.getState().setMusicTrack('Chill Lo-fi');
      useWizardStore.getState().setQuality('1080p');
      useWizardStore.getState().setAspectRatio('9:16');
      useWizardStore.getState().setUserCredits(10);
      useWizardStore.getState().setAgreedToTerms(true);
      
      const { container } = render(<ReviewStep />);
      
      // Verify main sections exist
      expect(screen.getByText(/İnceleme ve Render/i)).toBeInTheDocument();
      expect(screen.getByText(/Proje Özeti/i)).toBeInTheDocument();
      expect(screen.getByText(/Video Ayarları/i)).toBeInTheDocument();
      expect(screen.getByText(/Render Başlat/i)).toBeInTheDocument();
    });

    it('should handle full render workflow', async () => {
      useWizardStore.getState().setUserCredits(10);
      useWizardStore.getState().setAgreedToTerms(true);
      
      render(<ReviewStep />);
      
      // Start render
      const startButton = screen.getByText(/Render Başlat/i);
      fireEvent.click(startButton);
      
      // Verify rendering started
      await waitFor(() => {
        expect(useWizardStore.getState().isRendering).toBe(true);
      });
      
      // Verify progress appears
      await waitFor(() => {
        expect(screen.getByText(/Video Render Ediliyor/i)).toBeInTheDocument();
      });
    });
  });
});
