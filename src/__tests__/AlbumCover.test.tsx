import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { AlbumCover } from "@/components/ui/AlbumCover"

describe("AlbumCover", () => {
  it("renders small size correctly", () => {
    render(<AlbumCover src="/test.jpg" alt="Test Album" size="sm" />)
    const cover = screen.getByTestId("album-cover")
    expect(cover).toBeInTheDocument()
    expect(cover).toHaveClass("w-12", "h-12", "rounded-lg")
  })

  it("renders large size correctly", () => {
    render(<AlbumCover src="/test.jpg" alt="Test Album" size="lg" />)
    const cover = screen.getByTestId("album-cover")
    expect(cover).toBeInTheDocument()
    expect(cover).toHaveClass("w-80", "h-80", "rounded-xl")
  })

  it("shows gradient fallback when src is missing", () => {
    render(<AlbumCover alt="No Cover" />)
    const cover = screen.getByTestId("album-cover")
    expect(cover).toBeInTheDocument()
    expect(cover).toHaveAttribute("role", "img")
    expect(cover).toHaveAttribute("aria-label", "No Cover")
    const gradient = cover.querySelector(".bg-gradient-to-br")
    expect(gradient).toBeInTheDocument()
    expect(gradient).toHaveClass("from-primary", "to-secondary")
  })

  it("shows gradient fallback when src is null", () => {
    render(<AlbumCover src={null} alt="No Cover" />)
    const cover = screen.getByTestId("album-cover")
    const gradient = cover.querySelector(".bg-gradient-to-br")
    expect(gradient).toBeInTheDocument()
  })

  it("applies custom className", () => {
    render(<AlbumCover src="/test.jpg" alt="Test" className="custom-class" />)
    const cover = screen.getByTestId("album-cover")
    expect(cover).toHaveClass("custom-class")
  })

  it("defaults to small size", () => {
    render(<AlbumCover src="/test.jpg" alt="Test" />)
    const cover = screen.getByTestId("album-cover")
    expect(cover).toHaveClass("w-12", "h-12", "rounded-lg")
  })

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<AlbumCover ref={ref} src="/test.jpg" alt="Test" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("renders image with correct alt text", () => {
    render(<AlbumCover src="/test.jpg" alt="Test Album" />)
    const img = screen.getByAltText("Test Album")
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute("src", "/test.jpg")
  })

  it("applies object-cover class to image", () => {
    render(<AlbumCover src="/test.jpg" alt="Test" />)
    const img = screen.getByAltText("Test")
    expect(img).toHaveClass("object-cover")
  })
})
