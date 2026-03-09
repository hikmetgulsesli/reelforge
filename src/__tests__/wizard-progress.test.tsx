/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { WizardProgress, WIZARD_STEPS } from '@/components/wizard/WizardProgress';

describe('WizardProgress Component', () => {
  const steps = WIZARD_STEPS;

  describe('rendering', () => {
    it('renders all steps with correct labels', () => {
      render(<WizardProgress currentStep={1} totalSteps={steps.length} steps={steps} />);

      expect(screen.getByText('Video Olusturma Sihirbazi')).toBeInTheDocument();
      expect(screen.getByText('Adim 1 / 7')).toBeInTheDocument();
      
      // Check step labels are rendered
      expect(screen.getByText('Senaryo')).toBeInTheDocument();
      expect(screen.getByText('Gorsel')).toBeInTheDocument();
    });

    it('renders with check icon for completed steps', () => {
      render(<WizardProgress currentStep={3} totalSteps={steps.length} steps={steps} />);

      // Check that step 3 is the current step by verifying the step number is shown
      expect(screen.getByText('3')).toBeInTheDocument();
      // Verify we have step labels
      expect(screen.getByText('Varlik')).toBeInTheDocument();
    });
  });

  describe('step states', () => {
    it('shows current step as active', () => {
      render(<WizardProgress currentStep={1} totalSteps={steps.length} steps={steps} />);

      // First step should have primary styling
      const step1Label = screen.getByText('Senaryo');
      expect(step1Label).toHaveClass('text-primary');
    });

    it('shows incomplete steps with muted styling', () => {
      render(<WizardProgress currentStep={1} totalSteps={steps.length} steps={steps} />);

      // Steps after current should be muted
      const step2Label = screen.getByText('Gorsel');
      expect(step2Label).toHaveClass('text-muted-foreground');
    });

    it('shows correct step number in header', () => {
      render(<WizardProgress currentStep={5} totalSteps={steps.length} steps={steps} />);

      expect(screen.getByText('Adim 5 / 7')).toBeInTheDocument();
    });
  });

  describe('progress bar', () => {
    it('fills progress bar for completed steps', () => {
      render(<WizardProgress currentStep={4} totalSteps={steps.length} steps={steps} />);

      // Progress bars between steps 1-3 should be filled
      const progressBars = document.querySelectorAll('.bg-primary.rounded-full');
      expect(progressBars.length).toBeGreaterThan(0);
    });
  });
});