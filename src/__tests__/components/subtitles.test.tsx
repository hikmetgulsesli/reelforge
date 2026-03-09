/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PositionSelector } from "@/components/subtitle/PositionSelector";
import { ColorPicker } from "@/components/subtitle/ColorPicker";
import { FontSelector } from "@/components/subtitle/FontSelector";
import { ToggleSwitch } from "@/components/subtitle/ToggleSwitch";
import { StylePresetGrid } from "@/components/subtitle/StylePresetGrid";
import { SubtitlePosition, SubtitleStyle, PRESET_TYPES, FONT_FAMILIES } from "@/types/subtitle";

describe("PositionSelector", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders all three position options", () => {
    render(<PositionSelector value="BOTTOM" onChange={mockOnChange} />);

    expect(screen.getByText("Top")).toBeInTheDocument();
    expect(screen.getByText("Middle")).toBeInTheDocument();
    expect(screen.getByText("Bottom")).toBeInTheDocument();
  });

  it("highlights the selected position", () => {
    render(<PositionSelector value="CENTER" onChange={mockOnChange} />);

    const middleButton = screen.getByText("Middle").closest("button");
    expect(middleButton).toHaveClass("bg-white");
  });

  it("calls onChange when a position is clicked", () => {
    render(<PositionSelector value="BOTTOM" onChange={mockOnChange} />);

    fireEvent.click(screen.getByText("Top"));
    expect(mockOnChange).toHaveBeenCalledWith("TOP");

    fireEvent.click(screen.getByText("Middle"));
    expect(mockOnChange).toHaveBeenCalledWith("CENTER");
  });
});

describe("ColorPicker", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders color preset buttons", () => {
    render(<ColorPicker label="Text Color" value="#FFFFFF" onChange={mockOnChange} />);

    expect(screen.getByText("Text Color")).toBeInTheDocument();
    // Check for preset color buttons (they don't have text, so we check for aria-label)
    const colorButtons = screen.getAllByRole("button");
    expect(colorButtons.length).toBeGreaterThan(0);
  });

  it("calls onChange when a color is selected", () => {
    render(<ColorPicker label="Text Color" value="#FFFFFF" onChange={mockOnChange} />);

    const colorButtons = screen.getAllByRole("button");
    fireEvent.click(colorButtons[0]); // Click first color
    expect(mockOnChange).toHaveBeenCalled();
  });

  it("shows custom color input when add button is clicked", () => {
    render(<ColorPicker label="Text Color" value="#FFFFFF" onChange={mockOnChange} />);

    const addButton = screen.getByLabelText("Add custom color");
    fireEvent.click(addButton);

    // Should show a text input for custom color
    const textInput = screen.getByPlaceholderText("#RRGGBB");
    expect(textInput).toBeInTheDocument();
  });
});

describe("FontSelector", () => {
  const mockOnChange = jest.fn();
  const fonts = ["Space Grotesk", "DM Sans", "Inter", "Roboto"];

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders font options", () => {
    render(
      <FontSelector value="Space Grotesk" onChange={mockOnChange} options={fonts} />
    );

    expect(screen.getByText("Font Family")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("calls onChange when font is selected", () => {
    render(
      <FontSelector value="Space Grotesk" onChange={mockOnChange} options={fonts} />
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Roboto" } });

    expect(mockOnChange).toHaveBeenCalledWith("Roboto");
  });
});

describe("ToggleSwitch", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders label and description", () => {
    render(
      <ToggleSwitch
        label="Enable Feature"
        description="This is a test feature"
        checked={false}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText("Enable Feature")).toBeInTheDocument();
    expect(screen.getByText("This is a test feature")).toBeInTheDocument();
  });

  it("calls onChange when toggled", () => {
    render(
      <ToggleSwitch
        label="Enable Feature"
        checked={false}
        onChange={mockOnChange}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledWith(true);
  });
});

describe("StylePresetGrid", () => {
  const mockOnSelect = jest.fn();
  const mockStyles: SubtitleStyle[] = [
    {
      id: "1",
      name: "YouTube Classic",
      slug: "youtube-classic",
      presetType: "youtube-classic",
      fontFamily: "Roboto",
      fontSize: 36,
      fontWeight: "500",
      textColor: "#FFFFFF",
      position: "BOTTOM" as SubtitlePosition,
      animationEnabled: false,
      karaokeStyle: false,
      shadowEnabled: true,
      emojiEnabled: false,
      isPreset: true,
      isCustom: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "TikTok Modern",
      slug: "tiktok-modern",
      presetType: "tiktok-modern",
      fontFamily: "Montserrat",
      fontSize: 42,
      fontWeight: "800",
      textColor: "#FFFFFF",
      position: "CENTER" as SubtitlePosition,
      animationEnabled: true,
      karaokeStyle: false,
      shadowEnabled: true,
      emojiEnabled: false,
      isPreset: true,
      isCustom: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it("renders all style presets", () => {
    render(
      <StylePresetGrid
        styles={mockStyles}
        selectedStyleId=""
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText("YouTube Classic")).toBeInTheDocument();
    expect(screen.getByText("TikTok Modern")).toBeInTheDocument();
  });

  it("calls onSelect when a preset is clicked", () => {
    render(
      <StylePresetGrid
        styles={mockStyles}
        selectedStyleId=""
        onSelect={mockOnSelect}
      />
    );

    fireEvent.click(screen.getByText("YouTube Classic"));
    expect(mockOnSelect).toHaveBeenCalledWith(mockStyles[0]);
  });

  it("highlights the selected style", () => {
    render(
      <StylePresetGrid
        styles={mockStyles}
        selectedStyleId="1"
        onSelect={mockOnSelect}
      />
    );

    const selectedButton = screen.getByText("YouTube Classic").closest("button");
    expect(selectedButton).toHaveClass("border-2");
  });
});

describe("Subtitle Types", () => {
  it("should have correct preset types defined", () => {
    expect(PRESET_TYPES).toContain("youtube-classic");
    expect(PRESET_TYPES).toContain("tiktok-modern");
    expect(PRESET_TYPES).toContain("cinematic");
    expect(PRESET_TYPES).toContain("minimal");
    expect(PRESET_TYPES).toContain("animated");
    expect(PRESET_TYPES).toContain("emoji-rich");
    expect(PRESET_TYPES).toContain("highlight");
    expect(PRESET_TYPES).toContain("kinetic");
    expect(PRESET_TYPES).toContain("neon-glow");
    expect(PRESET_TYPES).toContain("custom");
    expect(PRESET_TYPES).toHaveLength(10);
  });

  it("should have font families defined", () => {
    expect(FONT_FAMILIES).toContain("Space Grotesk");
    expect(FONT_FAMILIES).toContain("DM Sans");
    expect(FONT_FAMILIES).toContain("Inter");
    expect(FONT_FAMILIES.length).toBeGreaterThan(0);
  });
});
