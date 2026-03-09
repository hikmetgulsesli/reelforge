import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[var(--color-background-dark)]">
      {/* Navbar */}
      <nav className="border-b border-[var(--color-border-dark)] bg-[var(--color-surface-dark)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 text-[var(--color-primary)]">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
                </svg>
              </div>
              <span className="text-xl font-bold text-[var(--color-text-main-dark)] font-[family-name:var(--font-display)]">
                ReelForge
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[var(--color-text-muted-dark)]">
                {session.user?.email}
              </span>
              <Link
                href="/api/auth/signout"
                className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
              >
                Sign out
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-main-dark)] font-[family-name:var(--font-display)] mb-6">
          Dashboard
        </h1>
        <p className="text-[var(--color-text-muted-dark)]">
          Welcome back, {session.user?.name || session.user?.email}!
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[var(--color-surface-dark)] rounded-xl p-6 border border-[var(--color-border-dark)]">
            <h3 className="text-lg font-semibold text-[var(--color-text-main-dark)] mb-2">
              Videos Created
            </h3>
            <p className="text-3xl font-bold text-[var(--color-primary)]">0</p>
          </div>
          <div className="bg-[var(--color-surface-dark)] rounded-xl p-6 border border-[var(--color-border-dark)]">
            <h3 className="text-lg font-semibold text-[var(--color-text-main-dark)] mb-2">
              Credits Remaining
            </h3>
            <p className="text-3xl font-bold text-[var(--color-primary)]">3</p>
          </div>
          <div className="bg-[var(--color-surface-dark)] rounded-xl p-6 border border-[var(--color-border-dark)]">
            <h3 className="text-lg font-semibold text-[var(--color-text-main-dark)] mb-2">
              Plan
            </h3>
            <p className="text-3xl font-bold text-[var(--color-primary)]">Free</p>
          </div>
        </div>
      </main>
    </div>
  );
}
