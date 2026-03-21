import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { EmptyState } from "@/components/ui/EmptyState"
import { Heart } from "lucide-react"

describe("EmptyState", () => {
  it("renders with default inbox icon", () => {
    render(<EmptyState message="No items found" />)
    expect(screen.getByRole("status")).toBeInTheDocument()
    expect(screen.getByText("No items found")).toBeInTheDocument()
  })

  it("renders with music icon", () => {
    render(<EmptyState icon="music" message="Bu playlist boş" />)
    expect(screen.getByRole("status")).toBeInTheDocument()
    expect(screen.getByText("Bu playlist boş")).toBeInTheDocument()
  })

  it("renders with custom Lucide icon", () => {
    render(<EmptyState icon={Heart} message="No favorites" />)
    expect(screen.getByRole("status")).toBeInTheDocument()
  })

  it("renders with title and message", () => {
    render(<EmptyState title="Empty Playlist" message="Bu playlist boş" />)
    expect(screen.getByText("Empty Playlist")).toBeInTheDocument()
    expect(screen.getByText("Bu playlist boş")).toBeInTheDocument()
  })

  it("renders for empty search results", () => {
    render(<EmptyState icon="inbox" message="Sonuç bulunamadı" />)
    expect(screen.getByText("Sonuç bulunamadı")).toBeInTheDocument()
  })

  it("renders action button when actionLabel and onAction provided", () => {
    const handleAction = jest.fn()
    render(
      <EmptyState
        message="No items"
        actionLabel="Add Item"
        onAction={handleAction}
      />
    )
    const button = screen.getByRole("button", { name: "Add Item" })
    expect(button).toBeInTheDocument()
    
    fireEvent.click(button)
    expect(handleAction).toHaveBeenCalledTimes(1)
  })

  it("does not render button when actionLabel missing", () => {
    render(<EmptyState message="No items" onAction={() => {}} />)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("does not render button when onAction missing", () => {
    render(<EmptyState message="No items" actionLabel="Add" />)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("applies custom className", () => {
    render(<EmptyState message="Test" className="custom-class" />)
    expect(screen.getByRole("status")).toHaveClass("custom-class")
  })

  it("has correct accessibility attributes", () => {
    render(<EmptyState message="Empty state" />)
    const container = screen.getByRole("status")
    expect(container).toHaveAttribute("aria-live", "polite")
  })

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<EmptyState ref={ref} message="Test" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("button has functional onClick handler", () => {
    const handleClick = jest.fn()
    render(
      <EmptyState
        message="Test"
        actionLabel="Click Me"
        onAction={handleClick}
      />
    )
    const button = screen.getByRole("button")
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalled()
  })
})
