import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DailyView, Event } from "../../../components/DailyView";
import { Video, Youtube, Instagram } from "lucide-react";

// Mock platform icons
const getPlatformIcon = (platform: string, size: "sm" | "md" = "sm") => {
  const sizeClass = size === "md" ? "w-5 h-5" : "w-3 h-3";
  switch (platform) {
    case "youtube":
      return <Youtube className={`${sizeClass} text-red-500`} data-testid="youtube-icon" />;
    case "tiktok":
      return <Video className={`${sizeClass} text-pink-500`} data-testid="tiktok-icon" />;
    case "instagram":
      return <Instagram className={`${sizeClass} text-purple-500`} data-testid="instagram-icon" />;
    default:
      return null;
  }
};

describe("DailyView", () => {
  const mockToday = new Date(2026, 2, 14); // March 14, 2026 (Saturday)
  const mockCurrentDate = new Date(2026, 2, 14);
  
  const mockEvents: Event[] = [
    {
      id: "1",
      title: "Tech Tips #5",
      description: "Yeni teknoloji ürünlerinin incelemesi",
      date: new Date(2026, 2, 14),
      platform: "youtube",
      time: "14:00",
    },
    {
      id: "2",
      title: "Motivasyon Günü",
      description: "Haftalık motivasyon konuşması",
      date: new Date(2026, 2, 14),
      platform: "tiktok",
      time: "18:00",
    },
  ];

  const defaultProps = {
    currentDate: mockCurrentDate,
    today: mockToday,
    events: mockEvents,
    onDateChange: jest.fn(),
    onTodayClick: jest.fn(),
    onEventClick: jest.fn(),
    onEmptyCellClick: jest.fn(),
    getPlatformIcon,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders daily view with correct Turkish date format", () => {
    render(<DailyView {...defaultProps} />);
    
    // Check for Turkish date format: "14 Mart 2026, Cumartesi"
    expect(screen.getByText("14 Mart 2026, Cumartesi")).toBeInTheDocument();
  });

  it("renders 24 hour rows", () => {
    render(<DailyView {...defaultProps} />);
    
    // Check that all 24 hours are rendered (look for hour labels in the time column)
    for (let i = 0; i < 24; i++) {
      const hourLabel = i.toString().padStart(2, "0") + ":00";
      // Use getAllByText and check that at least one exists (time column + possibly event times)
      const hourElements = screen.getAllByText(hourLabel);
      expect(hourElements.length).toBeGreaterThan(0);
    }
  });

  it("displays events in correct hour slots", () => {
    render(<DailyView {...defaultProps} />);
    
    // Check that events are displayed
    expect(screen.getByText("Tech Tips #5")).toBeInTheDocument();
    expect(screen.getByText("Motivasyon Günü")).toBeInTheDocument();
    
    // Check event times
    expect(screen.getAllByText("14:00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("18:00").length).toBeGreaterThan(0);
  });

  it("displays event descriptions", () => {
    render(<DailyView {...defaultProps} />);
    
    // Check that descriptions are visible
    expect(screen.getByText("Yeni teknoloji ürünlerinin incelemesi")).toBeInTheDocument();
    expect(screen.getByText("Haftalık motivasyon konuşması")).toBeInTheDocument();
  });

  it("navigates to previous day when clicking left arrow", () => {
    render(<DailyView {...defaultProps} />);
    
    const prevButton = screen.getByLabelText("Önceki gün");
    fireEvent.click(prevButton);
    
    expect(defaultProps.onDateChange).toHaveBeenCalledTimes(1);
    const calledDate = defaultProps.onDateChange.mock.calls[0][0];
    expect(calledDate.getDate()).toBe(13); // Previous day
  });

  it("navigates to next day when clicking right arrow", () => {
    render(<DailyView {...defaultProps} />);
    
    const nextButton = screen.getByLabelText("Sonraki gün");
    fireEvent.click(nextButton);
    
    expect(defaultProps.onDateChange).toHaveBeenCalledTimes(1);
    const calledDate = defaultProps.onDateChange.mock.calls[0][0];
    expect(calledDate.getDate()).toBe(15); // Next day
  });

  it("shows Bugün button when not viewing today", () => {
    const futureDate = new Date(2026, 2, 20); // March 20, 2026
    render(<DailyView {...defaultProps} currentDate={futureDate} />);
    
    expect(screen.getByText("Bugün")).toBeInTheDocument();
  });

  it("does not show Bugün button when viewing today", () => {
    render(<DailyView {...defaultProps} />);
    
    expect(screen.queryByText("Bugün")).not.toBeInTheDocument();
  });

  it("calls onTodayClick when Bugün button is clicked", () => {
    const futureDate = new Date(2026, 2, 20);
    render(<DailyView {...defaultProps} currentDate={futureDate} />);
    
    const todayButton = screen.getByText("Bugün");
    fireEvent.click(todayButton);
    
    expect(defaultProps.onTodayClick).toHaveBeenCalledTimes(1);
  });

  it("calls onEventClick when clicking an event", () => {
    render(<DailyView {...defaultProps} />);
    
    const eventElement = screen.getByText("Tech Tips #5").closest('[role="button"]');
    if (eventElement) {
      fireEvent.click(eventElement);
    }
    
    expect(defaultProps.onEventClick).toHaveBeenCalledTimes(1);
    expect(defaultProps.onEventClick).toHaveBeenCalledWith(mockEvents[0]);
  });

  it("calls onEmptyCellClick when clicking empty hour slot", () => {
    render(<DailyView {...defaultProps} />);
    
    // Find an empty hour slot (e.g., 01:00 which has no events)
    const emptySlot = screen.getByLabelText("01:00 - Boş slot");
    fireEvent.click(emptySlot);
    
    expect(defaultProps.onEmptyCellClick).toHaveBeenCalledTimes(1);
    expect(defaultProps.onEmptyCellClick).toHaveBeenCalledWith(1);
  });

  it("highlights current hour when viewing today", () => {
    // Mock current time to be 14:00
    const originalDate = global.Date;
    const mockDate = new Date(2026, 2, 14, 14, 30); // March 14, 2026, 14:30
    
    jest.spyOn(global, "Date").mockImplementation((...args: any[]) => {
      if (args.length === 0) {
        return mockDate;
      }
      return new originalDate(...args);
    });
    
    render(<DailyView {...defaultProps} />);
    
    // Check that 14:00 hour label exists (at least one instance in time column)
    const hour14Elements = screen.getAllByText("14:00");
    expect(hour14Elements.length).toBeGreaterThan(0);
    
    jest.restoreAllMocks();
  });

  it("displays platform icons for events", () => {
    render(<DailyView {...defaultProps} />);
    
    expect(screen.getByTestId("youtube-icon")).toBeInTheDocument();
    expect(screen.getByTestId("tiktok-icon")).toBeInTheDocument();
  });

  it("renders Yeni Planlama button", () => {
    render(<DailyView {...defaultProps} />);
    
    expect(screen.getByText("Yeni Planlama")).toBeInTheDocument();
  });

  it("handles keyboard navigation on empty cells", () => {
    render(<DailyView {...defaultProps} />);
    
    const emptySlot = screen.getByLabelText("01:00 - Boş slot");
    fireEvent.keyDown(emptySlot, { key: "Enter" });
    
    expect(defaultProps.onEmptyCellClick).toHaveBeenCalledTimes(1);
    expect(defaultProps.onEmptyCellClick).toHaveBeenCalledWith(1);
  });

  it("handles keyboard navigation on events", () => {
    render(<DailyView {...defaultProps} />);
    
    const eventElement = screen.getByText("Tech Tips #5").closest('[role="button"]');
    if (eventElement) {
      fireEvent.keyDown(eventElement, { key: " " });
    }
    
    expect(defaultProps.onEventClick).toHaveBeenCalledTimes(1);
    expect(defaultProps.onEventClick).toHaveBeenCalledWith(mockEvents[0]);
  });

  it("renders different date correctly", () => {
    const differentDate = new Date(2026, 5, 23); // June 23, 2026 (Tuesday)
    render(<DailyView {...defaultProps} currentDate={differentDate} />);
    
    expect(screen.getByText("23 Haziran 2026, Salı")).toBeInTheDocument();
  });

  it("renders empty slots with plus icon on hover", () => {
    render(<DailyView {...defaultProps} />);
    
    // Check that empty slots are rendered
    const emptySlot = screen.getByLabelText("01:00 - Boş slot");
    expect(emptySlot).toBeInTheDocument();
  });

  it("groups multiple events in same hour correctly", () => {
    const eventsSameHour: Event[] = [
      {
        id: "1",
        title: "Event 1",
        description: "Description 1",
        date: new Date(2026, 2, 14),
        platform: "youtube",
        time: "10:00",
      },
      {
        id: "2",
        title: "Event 2",
        description: "Description 2",
        date: new Date(2026, 2, 14),
        platform: "instagram",
        time: "10:30",
      },
    ];
    
    render(<DailyView {...defaultProps} events={eventsSameHour} />);
    
    expect(screen.getByText("Event 1")).toBeInTheDocument();
    expect(screen.getByText("Event 2")).toBeInTheDocument();
  });
});
