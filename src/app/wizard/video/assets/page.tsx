import { AssetsStep } from "@/components/wizard/AssetsStep";

export default function AssetsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-background)" }}>
      {/* Header */}
      <header
        className="flex items-center justify-between border-b pb-4 mb-6"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-3xl"
            style={{ color: "var(--color-primary)" }}
          >
            movie_filter
          </span>
          <h2 className="text-xl font-bold tracking-tight">ReelForge</h2>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a
            className="text-sm font-medium hover:opacity-80 transition-opacity"
            href="#"
            style={{ color: "var(--color-text-main)" }}
          >
            Dashboard
          </a>
          <a
            className="text-sm font-medium hover:opacity-80 transition-opacity"
            href="#"
            style={{ color: "var(--color-text-main)" }}
          >
            Projects
          </a>
          <a
            className="text-sm font-medium hover:opacity-80 transition-opacity"
            href="#"
            style={{ color: "var(--color-text-main)" }}
          >
            Templates
          </a>
          <a
            className="text-sm font-medium hover:opacity-80 transition-opacity"
            href="#"
            style={{ color: "var(--color-text-main)" }}
          >
            Settings
          </a>
        </nav>
        <div
          className="w-10 h-10 rounded-full border-2"
          style={{
            backgroundColor: "var(--color-primary-light)",
            borderColor: "var(--color-primary)",
          }}
        />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full max-w-[1200px] mx-auto px-6 py-4">
        <AssetsStep
          onNext={() => console.log("Next step")}
          onPrevious={() => console.log("Previous step")}
        />
      </main>
    </div>
  );
}
