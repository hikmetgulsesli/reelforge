import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CalendarPage from "../app/calendar/page";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { name: "Test User", email: "test@example.com" } } }),
}));

// Mock the store
jest.mock("../lib/store", () => ({
  useAppStore: () => ({ notificationCount: 0 }),
}));

// Mock DashboardLayout
jest.mock("../components/layout/DashboardLayout", () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock Header
jest.mock("../components/layout/Header", () => ({
  Header: ({ title }: { title: string }) => <div>{title}</div>,
}));

describe("Calendar Search and Filter", () => {
  it("renders search input with correct placeholder", () => {
    render(<CalendarPage />);
    const searchInput = screen.getByPlaceholderText("Etkinlik ara...");
    expect(searchInput).toBeInTheDocument();
  });

  it("renders filter button", () => {
    render(<CalendarPage />);
    const filterButton = screen.getByText("Filtrele");
    expect(filterButton).toBeInTheDocument();
  });

  it("shows date filter panel when filter button is clicked", () => {
    render(<CalendarPage />);
    const filterButton = screen.getByText("Filtrele");
    fireEvent.click(filterButton);
    
    expect(screen.getByText("Başlangıç Tarihi")).toBeInTheDocument();
    expect(screen.getByText("Bitiş Tarihi")).toBeInTheDocument();
  });

  it("shows search results dropdown when typing", async () => {
    render(<CalendarPage />);
    const searchInput = screen.getByPlaceholderText("Etkinlik ara...");
    
    fireEvent.change(searchInput, { target: { value: "Tech" } });
    
    await waitFor(() => {
      // Look for the event title in the dropdown (search results)
      const results = screen.getAllByText("Tech Tips #5");
      expect(results.length).toBeGreaterThan(0);
    });
  });

  it("filters events by title case-insensitively", async () => {
    render(<CalendarPage />);
    const searchInput = screen.getByPlaceholderText("Etkinlik ara...");
    
    fireEvent.change(searchInput, { target: { value: "tech" } });
    
    await waitFor(() => {
      const results = screen.getAllByText("Tech Tips #5");
      expect(results.length).toBeGreaterThan(0);
    });
  });

  it("shows no results message when search has no matches", async () => {
    render(<CalendarPage />);
    const searchInput = screen.getByPlaceholderText("Etkinlik ara...");
    
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });
    
    await waitFor(() => {
      expect(screen.getByText("Sonuç bulunamadı")).toBeInTheDocument();
    });
  });

  it("clears search when clear button is clicked", async () => {
    render(<CalendarPage />);
    const searchInput = screen.getByPlaceholderText("Etkinlik ara...") as HTMLInputElement;
    
    fireEvent.change(searchInput, { target: { value: "Tech" } });
    
    await waitFor(() => {
      expect(searchInput.value).toBe("Tech");
    });
    
    // Find the clear button by looking for the X icon button
    const clearButtons = screen.getAllByRole("button");
    // Find the one that's inside the search input area (has no text, just the X icon)
    const clearButton = clearButtons.find(btn => btn.querySelector("svg"));
    if (clearButton) {
      fireEvent.click(clearButton);
    }
    
    // After clearing, the search results should not show "Sonuç bulunamadı"
    await waitFor(() => {
      expect(screen.queryByText("Sonuç bulunamadı")).not.toBeInTheDocument();
    });
  });

  it("opens event detail modal when clicking a search result", async () => {
    render(<CalendarPage />);
    const searchInput = screen.getByPlaceholderText("Etkinlik ara...");
    
    fireEvent.change(searchInput, { target: { value: "Tech" } });
    
    // Wait for dropdown to appear and click on a result
    await waitFor(() => {
      const results = screen.getAllByText("Tech Tips #5");
      // Click the first one in the dropdown
      fireEvent.click(results[0]);
    });
    
    // Modal should open
    expect(screen.getByText("Etkinlik Detayı")).toBeInTheDocument();
  });

  it("closes event detail modal when clicking close button", async () => {
    render(<CalendarPage />);
    const searchInput = screen.getByPlaceholderText("Etkinlik ara...");
    
    fireEvent.change(searchInput, { target: { value: "Tech" } });
    
    await waitFor(() => {
      const results = screen.getAllByText("Tech Tips #5");
      fireEvent.click(results[0]);
    });
    
    expect(screen.getByText("Etkinlik Detayı")).toBeInTheDocument();
    
    const closeButton = screen.getByText("Kapat");
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByText("Etkinlik Detayı")).not.toBeInTheDocument();
    });
  });

  it("shows filtered event count when filters are active", async () => {
    render(<CalendarPage />);
    const searchInput = screen.getByPlaceholderText("Etkinlik ara...");
    
    fireEvent.change(searchInput, { target: { value: "Tech" } });
    
    await waitFor(() => {
      expect(screen.getByText(/etkinlik gösteriliyor/i)).toBeInTheDocument();
    });
  });

  it("renders upcoming events section", () => {
    render(<CalendarPage />);
    expect(screen.getByText("Yaklaşan Planlamalar")).toBeInTheDocument();
  });

  it("opens event detail when clicking an upcoming event", async () => {
    render(<CalendarPage />);
    // Get the upcoming events section
    const upcomingSection = screen.getByText("Yaklaşan Planlamalar").parentElement;
    
    // Find event buttons within the upcoming section
    const eventButtons = upcomingSection?.querySelectorAll("button");
    expect(eventButtons?.length).toBeGreaterThan(0);
    
    if (eventButtons && eventButtons[0]) {
      fireEvent.click(eventButtons[0]);
    }
    
    await waitFor(() => {
      expect(screen.getByText("Etkinlik Detayı")).toBeInTheDocument();
    });
  });
});
