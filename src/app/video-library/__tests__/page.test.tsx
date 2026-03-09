/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react';
import VideoLibraryPage from '../page';

// Mock Next.js Link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

describe('VideoLibraryPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<VideoLibraryPage />);
    expect(container).toBeInTheDocument();
  });
});
