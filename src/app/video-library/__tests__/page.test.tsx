/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import VideoLibraryPage from '../page';

// Mock Next.js Link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

describe('VideoLibraryPage', () => {
  it('renders the page title', () => {
    render(<VideoLibraryPage />);
    expect(screen.getByText('My Videos')).toBeInTheDocument();
  });

  it('renders the sidebar with navigation links', () => {
    render(<VideoLibraryPage />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('My Videos')).toBeInTheDocument();
    expect(screen.getByText('Credits')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders filter tabs', () => {
    render(<VideoLibraryPage />);
    expect(screen.getByText('All Videos')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Rendering')).toBeInTheDocument();
    expect(screen.getByText('Published')).toBeInTheDocument();
  });

  it('renders video cards with mock data', () => {
    render(<VideoLibraryPage />);
    expect(screen.getByText('Product Showcase Fall 2024')).toBeInTheDocument();
    expect(screen.getByText('Explainer Video - Tech Startup')).toBeInTheDocument();
    expect(screen.getByText('Social Media Ad Campaign')).toBeInTheDocument();
  });

  it('renders status badges', () => {
    render(<VideoLibraryPage />);
    expect(screen.getByText('Ready')).toBeInTheDocument();
    expect(screen.getByText('Published')).toBeInTheDocument();
  });

  it('renders pagination', () => {
    render(<VideoLibraryPage />);
    expect(screen.getByText(/Showing 1 to 12 of 48 results/)).toBeInTheDocument();
  });

  it('renders the Create Video button', () => {
    render(<VideoLibraryPage />);
    expect(screen.getByText('Create Video')).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<VideoLibraryPage />);
    expect(screen.getByPlaceholderText('Search videos...')).toBeInTheDocument();
  });

  it('renders view toggle buttons', () => {
    render(<VideoLibraryPage />);
    // Grid and List view buttons (aria-labels)
    expect(screen.getByLabelText('Grid View')).toBeInTheDocument();
    expect(screen.getByLabelText('List View')).toBeInTheDocument();
  });
});
