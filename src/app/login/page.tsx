"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = (provider: string) => {
    setIsLoading(true);
    signIn(provider, { callbackUrl });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]">
      <div className="w-full max-w-md bg-white dark:bg-[#2a161b] rounded-xl shadow-lg dark:shadow-none border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] p-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 text-[var(--color-primary)]">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-text-main-light)] dark:text-[var(--color-text-main-dark)] tracking-tight font-[family-name:var(--font-display)]">
              ReelForge
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-[var(--color-text-main-light)] dark:text-[var(--color-text-main-dark)] tracking-tight text-center font-[family-name:var(--font-display)]">
            Welcome back
          </h2>
          <p className="text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)] mt-2 text-center text-sm">
            Sign in to your account to continue
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--color-text-main-light)] dark:text-[var(--color-text-main-dark)] mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] bg-white dark:bg-[var(--color-surface-darker)] text-[var(--color-text-main-light)] dark:text-[var(--color-text-main-dark)] px-4 py-2.5 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--color-text-main-light)] dark:text-[var(--color-text-main-dark)]"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] bg-white dark:bg-[var(--color-surface-darker)] text-[var(--color-text-main-light)] dark:text-[var(--color-text-main-dark)] px-4 py-2.5 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium rounded-lg px-4 py-2.5 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] dark:focus:ring-offset-[var(--color-background-dark)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* OAuth */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-[#2a161b] text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)]">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuthSignIn("google")}
              disabled={isLoading}
              className="flex items-center justify-center w-full px-4 py-2 border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-lg bg-white dark:bg-[var(--color-surface-darker)] text-[var(--color-text-main-light)] dark:text-[var(--color-text-main-dark)] hover:bg-[var(--color-surface-light)] dark:hover:bg-[var(--color-surface-hover)] transition-colors font-medium text-sm disabled:opacity-50"
            >
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuthSignIn("github")}
              disabled={isLoading}
              className="flex items-center justify-center w-full px-4 py-2 border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-lg bg-white dark:bg-[var(--color-surface-darker)] text-[var(--color-text-main-light)] dark:text-[var(--color-text-main-dark)] hover:bg-[var(--color-surface-light)] dark:hover:bg-[var(--color-surface-hover)] transition-colors font-medium text-sm disabled:opacity-50"
            >
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  fillRule="evenodd"
                />
              </svg>
              GitHub
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--color-background-dark)]">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
