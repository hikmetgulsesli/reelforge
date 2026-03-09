import { render, screen, fireEvent } from "@testing-library/react";
import SettingsProfilePage from "../../app/settings/page";

// Mock next/link
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("SettingsProfilePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the profile settings page", () => {
    render(<SettingsProfilePage />);
    
    expect(screen.getByText("Profilim")).toBeInTheDocument();
    expect(screen.getByText("Hesap Yönetimi")).toBeInTheDocument();
  });

  it("displays profile photo section", () => {
    render(<SettingsProfilePage />);
    
    expect(screen.getByText("Profil Fotoğrafı")).toBeInTheDocument();
    expect(screen.getByText("Fotoğrafı Değiştir")).toBeInTheDocument();
    expect(screen.getByText("Kaldır")).toBeInTheDocument();
  });

  it("displays personal information form", () => {
    render(<SettingsProfilePage />);
    
    expect(screen.getByText("Kişisel Bilgiler")).toBeInTheDocument();
    expect(screen.getByLabelText(/Görünen Ad/)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-posta Adresi/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Biyografi/)).toBeInTheDocument();
  });

  it("displays social media connections", () => {
    render(<SettingsProfilePage />);
    
    expect(screen.getByText("Sosyal Medya Bağlantıları")).toBeInTheDocument();
    expect(screen.getByText("YouTube Kanalı")).toBeInTheDocument();
    expect(screen.getByText("TikTok Profili")).toBeInTheDocument();
  });

  it("allows typing in form fields", () => {
    render(<SettingsProfilePage />);
    
    const displayNameInput = screen.getByLabelText(/Görünen Ad/);
    fireEvent.change(displayNameInput, { target: { value: "Test User" } });
    
    expect(displayNameInput).toHaveValue("Test User");
  });

  it("shows character count for bio", () => {
    render(<SettingsProfilePage />);
    
    const bioInput = screen.getByLabelText(/Biyografi/);
    fireEvent.change(bioInput, { target: { value: "Test bio content" } });
    
    expect(screen.getByText("15 / 500 karakter")).toBeInTheDocument();
  });

  it("has save button", () => {
    render(<SettingsProfilePage />);
    
    expect(screen.getByText("Değişiklikleri Kaydet")).toBeInTheDocument();
  });

  it("displays sidebar navigation", () => {
    render(<SettingsProfilePage />);
    
    expect(screen.getByText("Profilim")).toBeInTheDocument();
    expect(screen.getByText("Güvenlik")).toBeInTheDocument();
    expect(screen.getByText("API Erişimi")).toBeInTheDocument();
    expect(screen.getByText("Bağlı Platformlar")).toBeInTheDocument();
    expect(screen.getByText("Ödeme Yöntemleri")).toBeInTheDocument();
    expect(screen.getByText("Bildirimler")).toBeInTheDocument();
  });
});
