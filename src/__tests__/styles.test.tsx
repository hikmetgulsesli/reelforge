import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { StyleCard } from "@/components/style/StyleCard";
import { StyleGrid } from "@/components/style/StyleGrid";
import { StylePreview } from "@/components/style/StylePreview";
import { ColorPaletteSelector } from "@/components/style/ColorPaletteSelector";
import { FontPairSelector } from "@/components/style/FontPairSelector";
import { CustomStyleCreator } from "@/components/style/CustomStyleCreator";
import { StyleWizardStep } from "@/components/style/StyleWizardStep";
import { PREDEFINED_STYLES, FONT_PAIRS, DEFAULT_COLOR_PALETTE } from "@/types/style";

// Mock fetch
global.fetch = jest.fn();

const mockStyle = PREDEFINED_STYLES[0];

describe("StyleCard", () => {
  it("renders style information correctly", () => {
    render(<StyleCard style={mockStyle} isSelected={false} onClick={jest.fn()} />);

    expect(screen.getByText(mockStyle.label)).toBeInTheDocument();
    expect(screen.getByText(mockStyle.description)).toBeInTheDocument();
  });

  it("shows checkmark when selected", () => {
    render(<StyleCard style={mockStyle} isSelected={true} onClick={jest.fn()} />);

    expect(screen.getByText(mockStyle.label)).toBeInTheDocument();
    // Check for selected styling
    const card = screen.getByText(mockStyle.label).closest("div[class*='cursor-pointer']");
    expect(card).toHaveClass("border-[var(--color-primary)]");
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<StyleCard style={mockStyle} isSelected={false} onClick={handleClick} />);

    const card = screen.getByText(mockStyle.label).closest("div[class*='cursor-pointer']");
    fireEvent.click(card!);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe("StyleGrid", () => {
  it("renders all style cards", () => {
    render(
      <StyleGrid
        styles={PREDEFINED_STYLES}
        selectedStyle={null}
        onSelectStyle={jest.fn()}
      />
    );

    PREDEFINED_STYLES.forEach((style) => {
      expect(screen.getByText(style.label)).toBeInTheDocument();
    });
  });

  it("highlights selected style", () => {
    render(
      <StyleGrid
        styles={PREDEFINED_STYLES}
        selectedStyle={mockStyle.value}
        onSelectStyle={jest.fn()}
      />
    );

    const selectedCard = screen.getByText(mockStyle.label).closest("div[class*='cursor-pointer']");
    expect(selectedCard).toHaveClass("border-[var(--color-primary)]");
  });
});

describe("StylePreview", () => {
  it("renders placeholder when no style selected", () => {
    render(<StylePreview style={null} />);

    expect(screen.getByText("Önizleme için bir stil seçin")).toBeInTheDocument();
  });

  it("renders style preview with correct data", () => {
    render(<StylePreview style={mockStyle} sampleText="Test preview" />);

    expect(screen.getByText(mockStyle.label)).toBeInTheDocument();
    expect(screen.getByText("Test preview")).toBeInTheDocument();
    expect(screen.getByText("Vurgu Rengi")).toBeInTheDocument();
  });

  it("displays color palette", () => {
    render(<StylePreview style={mockStyle} />);

    expect(screen.getByText("Font Çifti")).toBeInTheDocument();
  });
});

describe("ColorPaletteSelector", () => {
  it("renders with default palette", () => {
    render(<ColorPaletteSelector />);

    expect(screen.getByText("Hazır Paletler")).toBeInTheDocument();
    expect(screen.getByText("Özel Renkler")).toBeInTheDocument();
  });

  it("switches between tabs", () => {
    render(<ColorPaletteSelector />);

    const customTab = screen.getByText("Özel Renkler");
    fireEvent.click(customTab);

    expect(screen.getByText("Birincil Renk")).toBeInTheDocument();
    expect(screen.getByText("İkincil Renk")).toBeInTheDocument();
  });

  it("calls onChange when palette changes", () => {
    const handleChange = jest.fn();
    render(<ColorPaletteSelector palette={DEFAULT_COLOR_PALETTE} onChange={handleChange} />);

    // Click on a preset palette
    const presetsButton = screen.getByText("Hazır Paletler");
    fireEvent.click(presetsButton);

    const presetButtons = screen.getAllByRole("button");
    if (presetButtons.length > 2) {
      fireEvent.click(presetButtons[2]);
      expect(handleChange).toHaveBeenCalled();
    }
  });
});

describe("FontPairSelector", () => {
  it("renders with default font pair", () => {
    render(<FontPairSelector />);

    expect(screen.getByText(FONT_PAIRS[0].label)).toBeInTheDocument();
  });

  it("opens dropdown when clicked", () => {
    render(<FontPairSelector />);

    const trigger = screen.getByText(FONT_PAIRS[0].label).closest("button");
    fireEvent.click(trigger!);

    // Should show other font pairs
    expect(screen.getByText(FONT_PAIRS[1].label)).toBeInTheDocument();
  });

  it("selects font pair on click", () => {
    const handleChange = jest.fn();
    render(<FontPairSelector value={FONT_PAIRS[0].value} onChange={handleChange} />);

    const trigger = screen.getByText(FONT_PAIRS[0].label).closest("button");
    fireEvent.click(trigger!);

    const secondOption = screen.getByText(FONT_PAIRS[1].label);
    fireEvent.click(secondOption);

    expect(handleChange).toHaveBeenCalledWith(FONT_PAIRS[1].value);
  });
});

describe("CustomStyleCreator", () => {
  it("shows pro feature message for non-pro users", () => {
    render(<CustomStyleCreator isPro={false} />);

    expect(screen.getByText("Pro Özelliği")).toBeInTheDocument();
    expect(screen.getByText(/Özel stiller oluşturmak için Pro plana yükseltin/)).toBeInTheDocument();
  });

  it("shows create button for pro users", () => {
    render(<CustomStyleCreator isPro={true} />);

    expect(screen.getByText("Yeni Özel Stil Oluştur")).toBeInTheDocument();
  });

  it("opens form when create button is clicked", () => {
    render(<CustomStyleCreator isPro={true} />);

    fireEvent.click(screen.getByText("Yeni Özel Stil Oluştur"));

    expect(screen.getByText("Yeni Özel Stil")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Örn: Benim Özel Stilim")).toBeInTheDocument();
  });

  it("calls onSave with correct data", () => {
    const handleSave = jest.fn();
    render(<CustomStyleCreator isPro={true} onSave={handleSave} />);

    fireEvent.click(screen.getByText("Yeni Özel Stil Oluştur"));

    const nameInput = screen.getByPlaceholderText("Örn: Benim Özel Stilim");
    fireEvent.change(nameInput, { target: { value: "My Custom Style" } });

    const saveButton = screen.getByText("Stili Kaydet");
    fireEvent.click(saveButton);

    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "My Custom Style",
        description: "",
        palette: DEFAULT_COLOR_PALETTE,
        fontPair: FONT_PAIRS[0].value,
      })
    );
  });
});

describe("StyleWizardStep", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it("renders header and description", () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: true, data: PREDEFINED_STYLES }),
    });

    render(<StyleWizardStep />);

    expect(screen.getByText("Görsel Stil Seçin")).toBeInTheDocument();
    expect(screen.getByText(/AI videonuz için sanatsal yönü seçin/)).toBeInTheDocument();
  });

  it("fetches styles on mount", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: true, data: PREDEFINED_STYLES }),
    });

    render(<StyleWizardStep />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/styles");
    });
  });

  it("calls onNext when next button is clicked", async () => {
    const handleNext = jest.fn();
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: true, data: PREDEFINED_STYLES }),
    });

    render(<StyleWizardStep onNext={handleNext} />);

    await waitFor(() => {
      expect(screen.getByText("Sonraki Adım")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Sonraki Adım"));
    expect(handleNext).toHaveBeenCalled();
  });

  it("calls onBack when back button is clicked", async () => {
    const handleBack = jest.fn();
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: true, data: PREDEFINED_STYLES }),
    });

    render(<StyleWizardStep onBack={handleBack} />);

    await waitFor(() => {
      expect(screen.getByText("Geri")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Geri"));
    expect(handleBack).toHaveBeenCalled();
  });
});
