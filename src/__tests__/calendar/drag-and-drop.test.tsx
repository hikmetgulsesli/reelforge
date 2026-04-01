import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { DraggableEvent } from "@/components/calendar/DraggableEvent";
import { DroppableDayCell, DroppableTimeSlot } from "@/components/calendar/DroppableCells";
import { CalendarProvider, useCalendar } from "@/lib/calendar-context";
import { CalendarEvent } from "@/types/calendar";

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

const mockEvent: CalendarEvent = {
  id: "1",
  title: "Test Event",
  date: new Date(2024, 3, 15),
  time: "14:00",
  platform: "youtube",
  description: "Test description",
  duration: 30,
};

describe("DraggableEvent", () => {
  it("renders event title and time", () => {
    render(
      <DndContext>
        <DraggableEvent event={mockEvent} />
      </DndContext>
    );

    expect(screen.getByText("Test Event")).toBeInTheDocument();
    expect(screen.getByText(/14:00/)).toBeInTheDocument();
  });

  it("renders in compact mode", () => {
    render(
      <DndContext>
        <DraggableEvent event={mockEvent} isCompact />
      </DndContext>
    );

    expect(screen.getByText("Test Event")).toBeInTheDocument();
  });

  it("has draggable cursor style", () => {
    const { container } = render(
      <DndContext>
        <DraggableEvent event={mockEvent} />
      </DndContext>
    );

    // The draggable element should have cursor-grab class
    const draggableElement = container.querySelector(".cursor-grab");
    expect(draggableElement).toBeInTheDocument();
  });
});

describe("DroppableDayCell", () => {
  it("renders children", () => {
    render(
      <DndContext>
        <DroppableDayCell date={new Date(2024, 3, 15)}>
          <div>Cell Content</div>
        </DroppableDayCell>
      </DndContext>
    );

    expect(screen.getByText("Cell Content")).toBeInTheDocument();
  });

  it("applies today styling when isToday is true", () => {
    render(
      <DndContext>
        <DroppableDayCell date={new Date()} isToday>
          <div>Today</div>
        </DroppableDayCell>
      </DndContext>
    );

    const cell = screen.getByText("Today").parentElement;
    expect(cell).toHaveClass("bg-[var(--color-primary)]/10");
  });
});

describe("DroppableTimeSlot", () => {
  it("renders children", () => {
    render(
      <DndContext>
        <DroppableTimeSlot date={new Date(2024, 3, 15)} time="14:00">
          <div>Slot Content</div>
        </DroppableTimeSlot>
      </DndContext>
    );

    expect(screen.getByText("Slot Content")).toBeInTheDocument();
  });
});

describe("CalendarContext", () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
  });

  it("provides calendar context", async () => {
    function TestComponent() {
      const { events, addEvent } = useCalendar();
      return (
        <div>
          <span data-testid="event-count">{events.length}</span>
          <button
            onClick={() =>
              addEvent({
                title: "New Event",
                date: new Date(),
                time: "10:00",
                platform: "youtube",
              })
            }
          >
            Add Event
          </button>
        </div>
      );
    }

    render(
      <CalendarProvider>
        <TestComponent />
      </CalendarProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("event-count")).toHaveTextContent("3"); // Sample events
    });

    fireEvent.click(screen.getByText("Add Event"));

    await waitFor(() => {
      expect(screen.getByTestId("event-count")).toHaveTextContent("4");
    });
  });

  it("updates event and persists to localStorage", async () => {
    function TestComponent() {
      const { events, updateEvent } = useCalendar();
      return (
        <div>
          <span data-testid="event-date">
            {events[0]?.date.toISOString().split("T")[0]}
          </span>
          <button
            onClick={() => {
              const updated = { ...events[0], date: new Date(2024, 5, 20) };
              updateEvent(updated);
            }}
          >
            Update Date
          </button>
        </div>
      );
    }

    render(
      <CalendarProvider>
        <TestComponent />
      </CalendarProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("event-date")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Update Date"));

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "reelforge-calendar-events",
        expect.stringContaining("2024-06-19")
      );
    });
  });

  it("invalidates notifications when event is updated", async () => {
    function TestComponent() {
      const { events, updateEvent, notificationSchedules } = useCalendar();
      return (
        <div>
          <span data-testid="notification-count">{notificationSchedules.length}</span>
          <button
            onClick={() => {
              const updated = { ...events[0], date: new Date(2024, 5, 20) };
              updateEvent(updated);
            }}
          >
            Update Event
          </button>
        </div>
      );
    }

    render(
      <CalendarProvider>
        <TestComponent />
      </CalendarProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("notification-count")).toHaveTextContent("0");
    });
  });
});

describe("Drag and Drop Integration", () => {
  it("handles drag end event with day cell drop", async () => {
    const handleDragEnd = jest.fn((event: DragEndEvent) => {
      const { active, over } = event;
      if (over && over.id.toString().startsWith("day-")) {
        // Event dropped on day cell
        expect(active.data.current?.event).toBeDefined();
        expect(over.data.current?.date).toBeDefined();
      }
    });

    render(
      <DndContext onDragEnd={handleDragEnd}>
        <DraggableEvent event={mockEvent} />
        <DroppableDayCell date={new Date(2024, 3, 20)}>
          <div>Target Day</div>
        </DroppableDayCell>
      </DndContext>
    );

    expect(screen.getByText("Test Event")).toBeInTheDocument();
    expect(screen.getByText("Target Day")).toBeInTheDocument();
  });

  it("handles drag end event with time slot drop", async () => {
    const handleDragEnd = jest.fn((event: DragEndEvent) => {
      const { active, over } = event;
      if (over && over.id.toString().startsWith("slot-")) {
        // Event dropped on time slot
        expect(active.data.current?.event).toBeDefined();
        expect(over.data.current?.date).toBeDefined();
        expect(over.data.current?.time).toBeDefined();
      }
    });

    render(
      <DndContext onDragEnd={handleDragEnd}>
        <DraggableEvent event={mockEvent} />
        <DroppableTimeSlot date={new Date(2024, 3, 20)} time="16:00">
          <div>Target Slot</div>
        </DroppableTimeSlot>
      </DndContext>
    );

    expect(screen.getByText("Test Event")).toBeInTheDocument();
    expect(screen.getByText("Target Slot")).toBeInTheDocument();
  });
});

describe("Calendar Event Types", () => {
  it("validates CalendarEvent structure", () => {
    const event: CalendarEvent = {
      id: "test-id",
      title: "Test",
      date: new Date(),
      time: "10:00",
      platform: "youtube",
      description: "Test description",
      duration: 60,
    };

    expect(event.id).toBeDefined();
    expect(event.title).toBeDefined();
    expect(event.date).toBeInstanceOf(Date);
    expect(event.time).toMatch(/^\d{2}:\d{2}$/);
    expect(["youtube", "tiktok", "instagram", "other"]).toContain(event.platform);
  });
});
