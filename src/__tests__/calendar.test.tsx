import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CalendarPage from '@/components/calendar/CalendarPage';

// Mock the calendar store
jest.mock('@/lib/calendar-store', () => ({
  useCalendarStore: () => ({
    currentDate: new Date(2026, 9, 1), // October 2026
    view: 'month',
    selectedDate: null,
    videos: [
      {
        id: '1',
        title: 'Test Video 1',
        scheduledAt: new Date(2026, 9, 5, 10, 0),
        status: 'ready',
        platforms: ['youtube'],
      },
      {
        id: '2',
        title: 'Test Video 2',
        scheduledAt: new Date(2026, 9, 9, 11, 30),
        status: 'planned',
        platforms: ['tiktok'],
      },
    ],
    statusFilter: 'all',
    setView: jest.fn(),
    setCurrentDate: jest.fn(),
    setSelectedDate: jest.fn(),
    setStatusFilter: jest.fn(),
    addVideo: jest.fn(),
    updateVideo: jest.fn(),
    removeVideo: jest.fn(),
    moveVideo: jest.fn(),
    goToToday: jest.fn(),
    goToPrevious: jest.fn(),
    goToNext: jest.fn(),
  }),
}));

describe('CalendarPage', () => {
  it('renders calendar page with header', () => {
    render(<CalendarPage />);
    
    // Check header elements
    expect(screen.getByText(/October 2026/)).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('New Schedule')).toBeInTheDocument();
  });

  it('renders view toggle buttons', () => {
    render(<CalendarPage />);
    
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Week')).toBeInTheDocument();
    expect(screen.getByText('List')).toBeInTheDocument();
  });

  it('renders day of week headers', () => {
    render(<CalendarPage />);
    
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
    expect(screen.getByText('Thu')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
  });

  it('renders sidebar with upcoming posts', () => {
    render(<CalendarPage />);
    
    expect(screen.getByText('Upcoming Posts')).toBeInTheDocument();
  });

  it('renders navigation sidebar', () => {
    render(<CalendarPage />);
    
    expect(screen.getByText('ReelForge')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Library')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<CalendarPage />);
    
    expect(screen.getByPlaceholderText('Search schedule...')).toBeInTheDocument();
  });

  it('renders status filter dropdown', () => {
    render(<CalendarPage />);
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('All Status')).toBeInTheDocument();
  });
});

describe('Calendar navigation', () => {
  it('renders calendar grid with days', () => {
    render(<CalendarPage />);
    
    // Should render some day numbers
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('31')).toBeInTheDocument();
  });
});
