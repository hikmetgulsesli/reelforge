import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VoiceWizard } from "@/components/wizard/VoiceWizard";
import { VoiceCard } from "@/components/voice/VoiceCard";
import { VoiceCategoryTabs } from "@/components/voice/VoiceCategoryTabs";
import { VoiceCustomizationPanel } from "@/components/voice/VoiceCustomizationPanel";
import { VoiceCloningUpload } from "@/components/voice/VoiceCloningUpload";
import type { Voice } from "@/types/voice";

// Mock fetch
global.fetch = jest.fn();

const mockVoices: Voice[] = [
  {
    id: "voice-1",
    name: "Ayşe",
    slug: "ayse-tr",
    category: "FEMALE",
    provider: "ELEVENLABS",
    accent: "İstanbul",
    language: "tr",
    previewUrl: "/audio/ayse.mp3",
    avatarUrl: "/avatars/ayse.jpg",
    isActive: true,
    isPremium: false,
    metadata: { pitchRange: { min: -10, max: 10 }, speedRange: { min: 0.5, max: 2.0 } },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "voice-2",
    name: "Mehmet",
    slug: "mehmet-tr",
    category: "MALE",
    provider: "ELEVENLABS",
    accent: "İstanbul",
    language: "tr",
    previewUrl: null,
    avatarUrl: "/avatars/mehmet.jpg",
    isActive: true,
    isPremium: false,
    metadata: { pitchRange: { min: -12, max: 8 }, speedRange: { min: 0.5, max: 2.0 } },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "voice-3",
    name: "Elif",
    slug: "elif-tr",
    category: "FEMALE",
    provider: "ELEVENLABS",
    accent: "İzmir",
    language: "tr",
    previewUrl: "/audio/elif.mp3",
    avatarUrl: "/avatars/elif.jpg",
    isActive: true,
    isPremium: true,
    metadata: { pitchRange: { min: -12, max: 8 }, speedRange: { min: 0.5, max: 2.0 } },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("VoiceCard", () => {
  const mockVoice = mockVoices[0];
  const mockSelect = jest.fn();

  it("renders voice information correctly", () => {
    render(
      <VoiceCard
        voice={mockVoice}
        isSelected={false}
        onSelect={mockSelect}
      />
    );

    expect(screen.getByText("Ayşe")).toBeInTheDocument();
    expect(screen.getByText("Kadın")).toBeInTheDocument();
    expect(screen.getByText("İstanbul")).toBeInTheDocument();
  });

  it("shows selected state when isSelected is true", () => {
    render(
      <VoiceCard
        voice={mockVoice}
        isSelected={true}
        onSelect={mockSelect}
      />
    );

    expect(screen.getByRole("button", { pressed: true })).toBeInTheDocument();
  });

  it("calls onSelect when clicked", () => {
    render(
      <VoiceCard
        voice={mockVoice}
        isSelected={false}
        onSelect={mockSelect}
      />
    );

    fireEvent.click(screen.getByText("Ayşe").closest("div[role='button']")!);
    expect(mockSelect).toHaveBeenCalledWith(mockVoice);
  });

  it("displays premium badge for premium voices", () => {
    const premiumVoice = mockVoices[2];
    render(
      <VoiceCard
        voice={premiumVoice}
        isSelected={false}
        onSelect={mockSelect}
      />
    );

    expect(screen.getByText("Premium")).toBeInTheDocument();
  });
});

describe("VoiceCategoryTabs", () => {
  const mockChange = jest.fn();

  it("renders all category tabs", () => {
    render(
      <VoiceCategoryTabs
        activeCategory="ALL"
        onCategoryChange={mockChange}
      />
    );

    expect(screen.getByText("Tümü")).toBeInTheDocument();
    expect(screen.getByText("Erkek")).toBeInTheDocument();
    expect(screen.getByText("Kadın")).toBeInTheDocument();
    expect(screen.getByText("Nötr")).toBeInTheDocument();
  });

  it("shows counts when provided", () => {
    render(
      <VoiceCategoryTabs
        activeCategory="ALL"
        onCategoryChange={mockChange}
        counts={{ ALL: 20, MALE: 8, FEMALE: 10, NEUTRAL: 2 }}
      />
    );

    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("calls onCategoryChange when tab is clicked", () => {
    render(
      <VoiceCategoryTabs
        activeCategory="ALL"
        onCategoryChange={mockChange}
      />
    );

    fireEvent.click(screen.getByText("Erkek"));
    expect(mockChange).toHaveBeenCalledWith("MALE");
  });
});

describe("VoiceCustomizationPanel", () => {
  const mockSpeedChange = jest.fn();
  const mockPitchChange = jest.fn();
  const mockPitchToggle = jest.fn();

  it("renders speed slider with correct initial value", () => {
    render(
      <VoiceCustomizationPanel
        speed={1.2}
        onSpeedChange={mockSpeedChange}
        pitch={0}
        onPitchChange={mockPitchChange}
        usePitchAdjustment={false}
        onUsePitchAdjustmentChange={mockPitchToggle}
      />
    );

    expect(screen.getByText("1.2x")).toBeInTheDocument();
    expect(screen.getByLabelText("Ses hızı")).toHaveValue("1.2");
  });

  it("calls onSpeedChange when speed slider is changed", () => {
    render(
      <VoiceCustomizationPanel
        speed={1.0}
        onSpeedChange={mockSpeedChange}
        pitch={0}
        onPitchChange={mockPitchChange}
        usePitchAdjustment={false}
        onUsePitchAdjustmentChange={mockPitchToggle}
      />
    );

    const slider = screen.getByLabelText("Ses hızı");
    fireEvent.change(slider, { target: { value: "1.5" } });
    expect(mockSpeedChange).toHaveBeenCalledWith(1.5);
  });

  it("shows pitch slider when pitch adjustment is enabled", () => {
    render(
      <VoiceCustomizationPanel
        speed={1.0}
        onSpeedChange={mockSpeedChange}
        pitch={5}
        onPitchChange={mockPitchChange}
        usePitchAdjustment={true}
        onUsePitchAdjustmentChange={mockPitchToggle}
      />
    );

    expect(screen.getByLabelText("Ses perdesi")).toBeInTheDocument();
    expect(screen.getByText("+5")).toBeInTheDocument();
  });

  it("hides pitch slider when pitch adjustment is disabled", () => {
    render(
      <VoiceCustomizationPanel
        speed={1.0}
        onSpeedChange={mockSpeedChange}
        pitch={0}
        onPitchChange={mockPitchChange}
        usePitchAdjustment={false}
        onUsePitchAdjustmentChange={mockPitchToggle}
      />
    );

    expect(screen.queryByLabelText("Ses perdesi")).not.toBeInTheDocument();
  });
});

describe("VoiceCloningUpload", () => {
  const mockUpload = jest.fn();

  it("shows upgrade prompt for free users", () => {
    render(
      <VoiceCloningUpload
        userPlan="free"
        onUpload={mockUpload}
      />
    );

    expect(screen.getByText("Ses Klonlama")).toBeInTheDocument();
    expect(screen.getByText(/Pro veya Business plana yükseltme/)).toBeInTheDocument();
    expect(screen.getByText("Planları Görüntüle")).toBeInTheDocument();
  });

  it("shows upload area for pro users", () => {
    render(
      <VoiceCloningUpload
        userPlan="pro"
        onUpload={mockUpload}
      />
    );

    expect(screen.getByText(/Ses dosyası yüklemek için/)).toBeInTheDocument();
  });

  it("accepts audio file upload for pro users", async () => {
    render(
      <VoiceCloningUpload
        userPlan="pro"
        onUpload={mockUpload}
      />
    );

    const file = new File(["audio content"], "voice-sample.mp3", { type: "audio/mpeg" });
    const input = screen.getByLabelText("Ses dosyası yükle");

    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(mockUpload).toHaveBeenCalledWith(file);
    });
  });
});

describe("VoiceWizard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockVoices }),
    });
  });

  it("fetches voices on mount", async () => {
    render(
      <VoiceWizard
        userPlan="pro"
        onBack={jest.fn()}
        onNext={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/voices?");
    });
  });

  it("displays fetched voices", async () => {
    render(
      <VoiceWizard
        userPlan="pro"
        onBack={jest.fn()}
        onNext={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Ayşe")).toBeInTheDocument();
      expect(screen.getByText("Mehmet")).toBeInTheDocument();
      expect(screen.getByText("Elif")).toBeInTheDocument();
    });
  });

  it("enables next button only when voice is selected", async () => {
    render(
      <VoiceWizard
        userPlan="pro"
        onBack={jest.fn()}
        onNext={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Ayşe")).toBeInTheDocument();
    });

    const nextButton = screen.getByText(/Sonraki:/);
    expect(nextButton).toBeDisabled();

    fireEvent.click(screen.getByText("Ayşe").closest("div[role='button']")!);

    await waitFor(() => {
      expect(nextButton).not.toBeDisabled();
    });
  });
});
