/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { WizardProgress, WIZARD_STEPS } from '@/components/wizard/WizardProgress';

describe('WizardProgress Component', () => {
  const defaultProps = {
    currentStep: 1,
    totalSteps: WIZARD_STEPS.length,
    steps: WIZARD_STEPS,
  };

  it('renders the wizard title', () => {
    render(<WizardProgress {...defaultProps} />);

    expect(screen.getByText('Video Olusturma Sihirbazi')).toBeInTheDocument();
  });

  it('renders step counter', () => {
    render(<WizardProgress {...defaultProps} />);

    expect(screen.getByText(/Adim 1 \/ 7/)).toBeInTheDocument();
  });

  it('renders all step labels', () => {
    render(<WizardProgress {...defaultProps} />);

    expect(screen.getByText('Senaryo')).toBeInTheDocument();
    expect(screen.getByText('Gorsel')).toBeInTheDocument();
    expect(screen.getByText('Varlik')).toBeInTheDocument();
    expect(screen.getByText('Ses')).toBeInTheDocument();
    expect(screen.getByText('Altyazi')).toBeInTheDocument();
    expect(screen.getByText('Muzik')).toBeInTheDocument();
    expect(screen.getByText('Onizleme')).toBeInTheDocument();
  });

  it('highlights current step', () => {
    render(<WizardProgress {...defaultProps} currentStep={2} />);

    // Step 2 should be active
    const step2Button = screen.getByText('2');
    expect(step2Button).toHaveClass('bg-primary');
  });

  it('updates step counter when currentStep changes', () => {
    render(<WizardProgress {...defaultProps} currentStep={5} />);

    expect(screen.getByText(/Adim 5 \/ 7/)).toBeInTheDocument();
  });

  it('WIZARD_STEPS has correct number of steps', () => {
    expect(WIZARD_STEPS).toHaveLength(7);
  });

  it('WIZARD_STEPS contains correct step IDs', () => {
    const stepIds = WIZARD_STEPS.map(s => s.id);
    expect(stepIds).toEqual(['script', 'visuals', 'assets', 'voice', 'subtitles', 'music', 'review']);
  });
});