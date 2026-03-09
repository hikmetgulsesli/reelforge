"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send reset email");
        setIsLoading(false);
        return;
      }

      setIsSubmitted(true);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]">
      <div className="w-full max-w-md bg-white dark:bg-[var(--color-surface-dark)] rounded-xl shadow-xl overflow-hidden border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
        {/* Header */}
        <div className="p-8 pb-6 flex flex-col items-center border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
          <div className="flex items-center gap-3 text-[var(--color-primary)] mb-4">
            <div className="size-8 rounded bg-[var(--color-primary)]/10 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
              </svg>
            </div>
            <h2 className="text-[var(--color-text-main-light)] dark:text-[var(--color-text-main-dark)] text-2xl font-bold font-[family-name:var(--font-display)] tracking-tight">
              ReelForge
            </h2>
          </div>
          <h1 className="text-[var(--color-text-main-light)] dark:text-[var(--color-text-main-dark)] text-2xl font-bold font-[family-name:var(--font-display)] tracking-tight mb-2">
            Reset Password
          </h1>
          <p className="text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)] text-sm text-center">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {/* Form Content */}
        <div className="p-8 pt-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              {error}
            </div>
          )}

          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[var(--color-text-main-light)] dark:text-[var(--color-text-main-dark)] mb-2">
                Check your email
              </h3>
              <p className="text-sm text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)] mb-6">
                We&apos;ve sent a password reset link to {email}
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium rounded-lg transition-colors"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-[var(--color-text-main-light)] dark:text-[var(--color-text-main-dark)] text-sm font-medium"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] bg-white dark:bg-[var(--color-surface-darker)] text-[var(--color-text-main-light)] dark:text-[var(--color-text-main-dark)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] px-4 py-2.5 text-sm transition-colors placeholder:text-[var(--color-text-muted-light)] dark:placeholder:text-[var(--color-text-muted-dark)]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm font-[family-name:var(--font-display)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-darker)]/50 py-4 px-8 border-t border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] text-center">
          <p className="text-sm text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)]">
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-[var(--color-primary)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
