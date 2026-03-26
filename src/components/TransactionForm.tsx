"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TransactionType = "income" | "expense";

export interface TransactionFormData {
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  date: string;
}

export interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  className?: string;
}

const incomeCategories = [
  "Maaş",
  "Freelance",
  "Yatırım",
  "Hediye",
  "Diğer Gelir",
];

const expenseCategories = [
  "Kira",
  "Market",
  "Ulaşım",
  "Faturalar",
  "Eğlence",
  "Sağlık",
  "Eğitim",
  "Diğer Gider",
];

export function TransactionForm({ onSubmit, className }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = type === "income" ? incomeCategories : expenseCategories;

  // Reset category when type changes
  React.useEffect(() => {
    setCategory("");
  }, [type]);

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = "Lütfen geçerli bir tutar girin";
    }

    if (!category) {
      newErrors.category = "Lütfen bir kategori seçin";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [amount, category]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!validate()) {
        return;
      }

      onSubmit({
        type,
        category,
        amount: parseFloat(amount),
        description,
        date,
      });
    },
    [type, category, amount, description, date, onSubmit, validate]
  );

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // Only allow positive numbers
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setAmount(value);
        if (errors.amount) {
          setErrors((prev) => ({ ...prev, amount: "" }));
        }
      }
    },
    [errors.amount]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "w-full max-w-md space-y-6 rounded-lg border p-6",
        className
      )}
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
      }}
      data-testid="transaction-form"
    >
      {/* Type Toggle */}
      <div className="space-y-2">
        <label
          className="text-sm font-medium"
          style={{ color: "var(--text-main)" }}
        >
          İşlem Tipi
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType("income")}
            className={cn(
              "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              type === "income"
                ? "text-white"
                : "border hover:opacity-80"
            )}
            style={{
              background:
                type === "income" ? "var(--success, #22c55e)" : "transparent",
              borderColor: type === "income" ? undefined : "var(--border)",
              color: type === "income" ? "white" : "var(--text-main)",
            }}
            data-testid="type-income"
          >
            Gelir
          </button>
          <button
            type="button"
            onClick={() => setType("expense")}
            className={cn(
              "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              type === "expense"
                ? "text-white"
                : "border hover:opacity-80"
            )}
            style={{
              background:
                type === "expense" ? "var(--error, #ef4444)" : "transparent",
              borderColor: type === "expense" ? undefined : "var(--border)",
              color: type === "expense" ? "white" : "var(--text-main)",
            }}
            data-testid="type-expense"
          >
            Gider
          </button>
        </div>
      </div>

      {/* Category Dropdown */}
      <div className="space-y-2">
        <label
          htmlFor="category"
          className="text-sm font-medium"
          style={{ color: "var(--text-main)" }}
        >
          Kategori
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            if (errors.category) {
              setErrors((prev) => ({ ...prev, category: "" }));
            }
          }}
          className={cn(
            "w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2",
            errors.category && "border-red-500"
          )}
          style={{
            background: "var(--background)",
            borderColor: errors.category
              ? "#ef4444"
              : "var(--border)",
            color: "var(--text-main)",
          }}
          data-testid="category-select"
        >
          <option value="">Kategori seçin</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-xs text-red-500" data-testid="category-error">
            {errors.category}
          </p>
        )}
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <label
          htmlFor="amount"
          className="text-sm font-medium"
          style={{ color: "var(--text-main)" }}
        >
          Tutar
        </label>
        <div className="relative">
          <input
            id="amount"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
            className={cn(
              "w-full rounded-md border px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2",
              errors.amount && "border-red-500"
            )}
            style={{
              background: "var(--background)",
              borderColor: errors.amount ? "#ef4444" : "var(--border)",
              color: "var(--text-main)",
            }}
            data-testid="amount-input"
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            ₺
          </span>
        </div>
        {errors.amount && (
          <p className="text-xs text-red-500" data-testid="amount-error">
            {errors.amount}
          </p>
        )}
      </div>

      {/* Date Picker */}
      <div className="space-y-2">
        <label
          htmlFor="date"
          className="text-sm font-medium"
          style={{ color: "var(--text-main)" }}
        >
          Tarih
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style={{
            background: "var(--background)",
            borderColor: "var(--border)",
            color: "var(--text-main)",
          }}
          data-testid="date-input"
        />
      </div>

      {/* Description Textarea */}
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-medium"
          style={{ color: "var(--text-main)" }}
        >
          Açıklama{" "}
          <span style={{ color: "var(--text-muted)" }}>(Opsiyonel)</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="İşlem hakkında not..."
          rows={3}
          className="w-full resize-none rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style={{
            background: "var(--background)",
            borderColor: "var(--border)",
            color: "var(--text-main)",
          }}
          data-testid="description-input"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        style={{
          background: "var(--primary)",
          color: "white",
        }}
        data-testid="submit-button"
      >
        Kaydet
      </Button>
    </form>
  );
}
