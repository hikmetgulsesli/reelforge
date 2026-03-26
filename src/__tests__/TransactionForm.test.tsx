import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  TransactionForm,
  TransactionFormData,
  TransactionType,
} from "@/components/TransactionForm";

describe("TransactionForm", () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it("renders the form with all fields", () => {
    render(<TransactionForm onSubmit={mockSubmit} />);

    expect(screen.getByTestId("transaction-form")).toBeInTheDocument();
    expect(screen.getByTestId("type-income")).toBeInTheDocument();
    expect(screen.getByTestId("type-expense")).toBeInTheDocument();
    expect(screen.getByTestId("category-select")).toBeInTheDocument();
    expect(screen.getByTestId("amount-input")).toBeInTheDocument();
    expect(screen.getByTestId("date-input")).toBeInTheDocument();
    expect(screen.getByTestId("description-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });

  it("displays Turkish labels", () => {
    render(<TransactionForm onSubmit={mockSubmit} />);

    expect(screen.getByText("Gelir")).toBeInTheDocument();
    expect(screen.getByText("Gider")).toBeInTheDocument();
    expect(screen.getByText("Kaydet")).toBeInTheDocument();
  });

  describe("Type Toggle", () => {
    it("defaults to expense type", () => {
      render(<TransactionForm onSubmit={mockSubmit} />);

      const expenseButton = screen.getByTestId("type-expense");
      expect(expenseButton).toHaveStyle({
        background: "var(--error, #ef4444)",
      });
    });

    it("switches between income and expense types", () => {
      render(<TransactionForm onSubmit={mockSubmit} />);

      const incomeButton = screen.getByTestId("type-income");
      const expenseButton = screen.getByTestId("type-expense");

      // Click income
      fireEvent.click(incomeButton);
      expect(incomeButton).toHaveStyle({
        background: "var(--success, #22c55e)",
      });

      // Click expense
      fireEvent.click(expenseButton);
      expect(expenseButton).toHaveStyle({
        background: "var(--error, #ef4444)",
      });
    });

    it("shows income categories when type is income", () => {
      render(<TransactionForm onSubmit={mockSubmit} />);

      // Switch to income
      fireEvent.click(screen.getByTestId("type-income"));

      const categorySelect = screen.getByTestId("category-select");
      expect(categorySelect).toBeInTheDocument();

      // Check for income categories
      const options = Array.from(categorySelect.querySelectorAll("option"));
      const optionTexts = options.map((opt) => opt.textContent);

      expect(optionTexts).toContain("Maaş");
      expect(optionTexts).toContain("Freelance");
      expect(optionTexts).toContain("Yatırım");
      expect(optionTexts).not.toContain("Kira");
      expect(optionTexts).not.toContain("Market");
    });

    it("shows expense categories when type is expense", () => {
      render(<TransactionForm onSubmit={mockSubmit} />);

      // Default is expense
      const categorySelect = screen.getByTestId("category-select");
      const options = Array.from(categorySelect.querySelectorAll("option"));
      const optionTexts = options.map((opt) => opt.textContent);

      expect(optionTexts).toContain("Kira");
      expect(optionTexts).toContain("Market");
      expect(optionTexts).toContain("Ulaşım");
      expect(optionTexts).not.toContain("Maaş");
      expect(optionTexts).not.toContain("Freelance");
    });

    it("resets category when type changes", () => {
      render(<TransactionForm onSubmit={mockSubmit} />);

      const categorySelect = screen.getByTestId(
        "category-select"
      ) as HTMLSelectElement;

      // Select an expense category
      fireEvent.change(categorySelect, { target: { value: "Kira" } });
      expect(categorySelect.value).toBe("Kira");

      // Switch to income
      fireEvent.click(screen.getByTestId("type-income"));

      // Category should be reset
      expect(categorySelect.value).toBe("");
    });
  });

  describe("Amount Input", () => {
    it("only accepts positive numbers", () => {
      render(<TransactionForm onSubmit={mockSubmit} />);

      const amountInput = screen.getByTestId("amount-input");

      // Valid input
      fireEvent.change(amountInput, { target: { value: "100.50" } });
      expect(amountInput).toHaveValue("100.50");

      // Clear and try invalid input
      fireEvent.change(amountInput, { target: { value: "" } });
      fireEvent.change(amountInput, { target: { value: "-50" } });
      expect(amountInput).toHaveValue("");

      // Letters should not work
      fireEvent.change(amountInput, { target: { value: "abc" } });
      expect(amountInput).toHaveValue("");
    });

    it("accepts decimal numbers", () => {
      render(<TransactionForm onSubmit={mockSubmit} />);

      const amountInput = screen.getByTestId("amount-input");
      fireEvent.change(amountInput, { target: { value: "1234.56" } });

      expect(amountInput).toHaveValue("1234.56");
    });
  });

  describe("Date Picker", () => {
    it("defaults to current date", () => {
      const today = new Date().toISOString().split("T")[0];
      render(<TransactionForm onSubmit={mockSubmit} />);

      const dateInput = screen.getByTestId("date-input");
      expect(dateInput).toHaveValue(today);
    });

    it("allows changing the date", () => {
      render(<TransactionForm onSubmit={mockSubmit} />);

      const dateInput = screen.getByTestId("date-input");
      fireEvent.change(dateInput, { target: { value: "2024-03-15" } });

      expect(dateInput).toHaveValue("2024-03-15");
    });
  });

  describe("Validation", () => {
    it("shows error for empty amount", async () => {
      render(<TransactionForm onSubmit={mockSubmit} />);

      // Fill in category but not amount
      fireEvent.change(screen.getByTestId("category-select"), {
        target: { value: "Kira" },
      });

      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("amount-error")).toBeInTheDocument();
      });

      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it("shows error for empty category", async () => {
      render(<TransactionForm onSubmit={mockSubmit} />);

      // Fill in amount but not category
      fireEvent.change(screen.getByTestId("amount-input"), {
        target: { value: "100" },
      });

      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("category-error")).toBeInTheDocument();
      });

      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it("clears errors when fields are corrected", async () => {
      render(<TransactionForm onSubmit={mockSubmit} />);

      // Submit empty form to trigger errors
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("amount-error")).toBeInTheDocument();
      });

      // Fill in amount
      fireEvent.change(screen.getByTestId("amount-input"), {
        target: { value: "100" },
      });

      // Error should be cleared
      await waitFor(() => {
        expect(screen.queryByTestId("amount-error")).not.toBeInTheDocument();
      });
    });
  });

  describe("Form Submission", () => {
    it("submits valid data via onSubmit callback", async () => {
      render(<TransactionForm onSubmit={mockSubmit} />);

      // Fill in the form
      fireEvent.change(screen.getByTestId("category-select"), {
        target: { value: "Kira" },
      });
      fireEvent.change(screen.getByTestId("amount-input"), {
        target: { value: "1500" },
      });
      fireEvent.change(screen.getByTestId("description-input"), {
        target: { value: "Aylık kira ödemesi" },
      });
      fireEvent.change(screen.getByTestId("date-input"), {
        target: { value: "2024-03-15" },
      });

      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledTimes(1);
      });

      const submittedData: TransactionFormData = mockSubmit.mock.calls[0][0];
      expect(submittedData.type).toBe("expense");
      expect(submittedData.category).toBe("Kira");
      expect(submittedData.amount).toBe(1500);
      expect(submittedData.description).toBe("Aylık kira ödemesi");
      expect(submittedData.date).toBe("2024-03-15");
    });

    it("submits income transaction correctly", async () => {
      render(<TransactionForm onSubmit={mockSubmit} />);

      // Switch to income
      fireEvent.click(screen.getByTestId("type-income"));

      // Fill in the form
      fireEvent.change(screen.getByTestId("category-select"), {
        target: { value: "Maaş" },
      });
      fireEvent.change(screen.getByTestId("amount-input"), {
        target: { value: "5000" },
      });

      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledTimes(1);
      });

      const submittedData: TransactionFormData = mockSubmit.mock.calls[0][0];
      expect(submittedData.type).toBe("income");
      expect(submittedData.category).toBe("Maaş");
      expect(submittedData.amount).toBe(5000);
    });

    it("allows submitting without description", async () => {
      render(<TransactionForm onSubmit={mockSubmit} />);

      // Fill in only required fields
      fireEvent.change(screen.getByTestId("category-select"), {
        target: { value: "Market" },
      });
      fireEvent.change(screen.getByTestId("amount-input"), {
        target: { value: "250" },
      });

      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledTimes(1);
      });

      const submittedData: TransactionFormData = mockSubmit.mock.calls[0][0];
      expect(submittedData.description).toBe("");
    });
  });

  describe("Accessibility", () => {
    it("has proper label associations", () => {
      render(<TransactionForm onSubmit={mockSubmit} />);

      expect(screen.getByLabelText(/Kategori/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Tutar/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Tarih/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Açıklama/i)).toBeInTheDocument();
    });
  });
});
