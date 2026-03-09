import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SettingsSecurityPage from "../../app/settings/security/page";

// Mock next/link
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("SettingsSecurityPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the security settings page", () => {
    render(<SettingsSecurityPage />);
    
    expect(screen.getByText("Güvenlik")).toBeInTheDocument();
    expect(screen.getByText("Şifre Değiştir")).toBeInTheDocument();
  });

  it("displays password change form", () => {
    render(<SettingsSecurityPage />);
    
    expect(screen.getByLabelText(/Mevcut Şifre/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Yeni Şifre/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Yeni Şifre \(Tekrar\)/)).toBeInTheDocument();
  });

  it("has password visibility toggles", () => {
    render(<SettingsSecurityPage />);
    
    // Check that toggle buttons exist
    const toggleButtons = screen.getAllByRole("button", { name: /şifreyi/i });
    expect(toggleButtons.length).toBeGreaterThan(0);
  });

  it("displays two-factor authentication section", () => {
    render(<SettingsSecurityPage />);
    
    expect(screen.getByText("İki Faktörlü Kimlik Doğrulama")).toBeInTheDocument();
    expect(screen.getByText("Etkinleştir")).toBeInTheDocument();
  });

  it("shows validation error for short password", async () => {
    render(<SettingsSecurityPage />);
    
    const currentPassword = screen.getByLabelText(/Mevcut Şifre/);
    const newPassword = screen.getByLabelText(/Yeni Şifre/);
    const confirmPassword = screen.getByLabelText(/Yeni Şifre \(Tekrar\)/);
    const submitButton = screen.getByText("Şifremi Güncelle");

    fireEvent.change(currentPassword, { target: { value: "oldpassword123" } });
    fireEvent.change(newPassword, { target: { value: "short" } });
    fireEvent.change(confirmPassword, { target: { value: "short" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Şifre en az 8 karakter olmalıdır")).toBeInTheDocument();
    });
  });

  it("shows validation error for mismatching passwords", async () => {
    render(<SettingsSecurityPage />);
    
    const currentPassword = screen.getByLabelText(/Mevcut Şifre/);
    const newPassword = screen.getByLabelText(/Yeni Şifre/);
    const confirmPassword = screen.getByLabelText(/Yeni Şifre \(Tekrar\)/);
    const submitButton = screen.getByText("Şifremi Güncelle");

    fireEvent.change(currentPassword, { target: { value: "oldpassword123" } });
    fireEvent.change(newPassword, { target: { value: "newpassword123" } });
    fireEvent.change(confirmPassword, { target: { value: "differentpassword123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Yeni şifreler eşleşmiyor")).toBeInTheDocument();
    });
  });

  it("has sidebar navigation", () => {
    render(<SettingsSecurityPage />);
    
    expect(screen.getByText("Profilim")).toBeInTheDocument();
    expect(screen.getByText("Güvenlik")).toBeInTheDocument();
  });
});
