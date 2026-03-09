import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryTabs } from "@/components/music/CategoryTabs";
import { MusicCategory } from "@/types/music";

describe("CategoryTabs", () => {
  const mockCategories: MusicCategory[] = [
    { id: "upbeat", name: "Upbeat", count: 25 },
    { id: "chill", name: "Chill", count: 18 },
    { id: "epic", name: "Epic", count: 12 },
  ];

  const mockOnCategoryChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all categories", () => {
    render(
      <CategoryTabs
        categories={mockCategories}
        activeCategory="all"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    expect(screen.getByText("Upbeat")).toBeInTheDocument();
    expect(screen.getByText("Chill")).toBeInTheDocument();
    expect(screen.getByText("Epic")).toBeInTheDocument();
  });

  it("displays track counts for each category", () => {
    render(
      <CategoryTabs
        categories={mockCategories}
        activeCategory="all"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    expect(screen.getByText("(25)")).toBeInTheDocument();
    expect(screen.getByText("(18)")).toBeInTheDocument();
    expect(screen.getByText("(12)")).toBeInTheDocument();
  });

  it("highlights the active category", () => {
    render(
      <CategoryTabs
        categories={mockCategories}
        activeCategory="upbeat"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const upbeatButton = screen.getByRole("button", { name: /upbeat/i });
    expect(upbeatButton).toHaveClass("border-b-primary");
  });

  it("calls onCategoryChange when clicked", () => {
    render(
      <CategoryTabs
        categories={mockCategories}
        activeCategory="all"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const chillButton = screen.getByRole("button", { name: /chill/i });
    fireEvent.click(chillButton);

    expect(mockOnCategoryChange).toHaveBeenCalledWith("chill");
  });

  it("renders default categories when none provided", () => {
    render(
      <CategoryTabs
        categories={[]}
        activeCategory="all"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    expect(screen.getByText("Tümü")).toBeInTheDocument();
    expect(screen.getByText("Upbeat")).toBeInTheDocument();
    expect(screen.getByText("Chill")).toBeInTheDocument();
    expect(screen.getByText("Epic")).toBeInTheDocument();
    expect(screen.getByText("Lo-fi")).toBeInTheDocument();
  });

  it("is keyboard accessible", () => {
    render(
      <CategoryTabs
        categories={mockCategories}
        activeCategory="all"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const epicButton = screen.getByRole("button", { name: /epic/i });
    fireEvent.click(epicButton);
    expect(mockOnCategoryChange).toHaveBeenCalledWith("epic");
  });
});