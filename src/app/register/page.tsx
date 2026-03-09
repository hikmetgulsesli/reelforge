"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!formData.termsAccepted) {
      setError("You must accept the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create account");
        setIsLoading(false);
        return;
      }

      // Auto sign in after registration
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError("Account created but sign in failed. Please try logging in.");
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = (provider: string) => {
    setIsLoading(true);
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] selection:bg-[var(--color-primary)]/30">
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
            Create Account
          </h1>
          <p className="text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)] text-sm text-center">
            Start creating AI-powered videos with a single text prompt.
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

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="fullName"
                className="text-[var(--color-text-main-light)] dark:text-[var(--color-text-main-dark)] text-sm font-medium"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="e.g. John Doe"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] bg-white dark:bg-[var(--color-surface-darker)] text-[var(--color-text-main-light)] dark:text-[var(--color-text-main-dark)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] px-4 py-2.5 text-sm transition-colors placeholder:text-[var(--color-text-muted-light)] dark:placeholder:text-[var(--color-text-muted-dark)]"
              />
            </div>

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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] bg-white dark:bg-[var(--color-surface-darker)] text-[var(--color-text-main-light)] dark:text-[var(--color-text-main-dark)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] px-4 py-2.5 text-sm transition-colors placeholder:text-[var(--color-text-muted-light)] dark:placeholder:text-[var(--color-text-muted-dark)]"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-[var(--color-text-main-light)] dark:text-[var(--color-text-main-dark)] text-sm font-medium"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] bg-white dark:bg-[var(--color-surface-darker)] text-[var(--color-text-main-light)] dark:text-[var(--color-text-main-dark)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] px-4 py-2.5 text-sm transition-colors placeholder:text-[var(--color-text-muted-light)] dark:placeholder:text-[var(--color-text-muted-dark)]"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-[var(--color-text-main-light)] dark:text-[var(--color-text-main-dark)] text-sm font-medium"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] bg-white dark:bg-[var(--color-surface-darker)] text-[var(--color-text-main-light)] dark:text-[var(--color-text-main-dark)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] px-4 py-2.5 text-sm transition-colors placeholder:text-[var(--color-text-muted-light)] dark:placeholder:text-[var(--color-text-muted-dark)]"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 mt-2">
              <div className="flex h-5 items-center">
                <input
                  id="terms"
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  className="h-4 w-4 rounded border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] dark:bg-[var(--color-surface-darker)]"
                />
              </div>
              <label htmlFor="terms" className="text-sm text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)]">
                I agree to the{" "}
                <Link
                  href="#"
                  className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm font-[family-name:var(--font-display)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create Account"}
              {!isLoading && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 flex items-center justify-between">
            <span className="border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] w-1/5 lg:w-1/4"></span>
            <span className="text-xs text-center text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)] uppercase tracking-wider font-medium">
              Or continue with
            </span>
            <span className="border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] w-1/5 lg:w-1/4"></span>
          </div>

          {/* Social Buttons */}
          <div className="flex flex-col gap-3 mt-6">
            <button
              type="button"
              onClick={() => handleOAuthSignIn("google")}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-white dark:bg-[var(--color-surface-darker)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] text-[var(--color-text-main-light)] dark:text-[var(--color-text-main-dark)] font-medium py-2.5 px-4 rounded-lg hover:bg-[var(--color-surface-light)] dark:hover:bg-[var(--color-surface-hover)] transition-colors text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuthSignIn("github")}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[var(--color-slate-900)] dark:bg-[var(--color-surface-darker)] border border-[var(--color-slate-900)] dark:border-[var(--color-border-dark)] text-white font-medium py-2.5 px-4 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors text-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              Sign up with GitHub
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-darker)]/50 py-4 px-8 border-t border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] text-center">
          <p className="text-sm text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)]">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[var(--color-primary)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
