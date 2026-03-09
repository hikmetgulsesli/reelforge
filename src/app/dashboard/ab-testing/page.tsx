"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ABTest {
  id: string;
  name: string;
  description?: string;
  status: "DRAFT" | "RUNNING" | "PAUSED" | "COMPLETED";
  startDate?: string;
  endDate?: string;
  createdAt: string;
  winnerId?: string;
  variants: ABVariant[];
}

interface ABVariant {
  id: string;
  name: string;
  description?: string;
  impressions: number;
  views: number;
  clicks: number;
  ctr: number;
  retention: number;
  isControl: boolean;
}

// Mock data for demo
const mockTests: ABTest[] = [
  {
    id: "1",
    name: "Thumbnail Experiment 1",
    description: "Testing different thumbnail styles",
    status: "RUNNING",
    createdAt: "2024-01-15T10:00:00Z",
    variants: [
      {
        id: "v1",
        name: "Variant A",
        impressions: 5200,
        views: 2100,
        clicks: 218,
        ctr: 4.2,
        retention: 38,
        isControl: true,
      },
      {
        id: "v2",
        name: "Variant B",
        impressions: 5100,
        views: 2050,
        clicks: 240,
        ctr: 4.7,
        retention: 40,
        isControl: false,
      },
      {
        id: "v3",
        name: "Variant C",
        impressions: 5300,
        views: 2200,
        clicks: 265,
        ctr: 5.0,
        retention: 42,
        isControl: false,
      },
    ],
  },
  {
    id: "2",
    name: "Title Optimization",
    description: "Testing title variations",
    status: "RUNNING",
    createdAt: "2024-01-20T10:00:00Z",
    variants: [
      {
        id: "v4",
        name: "A",
        impressions: 3000,
        views: 1200,
        clicks: 114,
        ctr: 3.8,
        retention: 35,
        isControl: true,
      },
      {
        id: "v5",
        name: "B",
        impressions: 3100,
        views: 1250,
        clicks: 124,
        ctr: 4.0,
        retention: 36,
        isControl: false,
      },
    ],
  },
  {
    id: "3",
    name: "Intro Hook Variations",
    description: "Testing different intro hooks",
    status: "COMPLETED",
    startDate: "2023-10-01T10:00:00Z",
    endDate: "2023-10-24T10:00:00Z",
    createdAt: "2023-10-01T10:00:00Z",
    winnerId: "v7",
    variants: [
      {
        id: "v6",
        name: "Original (A)",
        impressions: 14203,
        views: 5681,
        clicks: 682,
        ctr: 4.8,
        retention: 35,
        isControl: true,
      },
      {
        id: "v7",
        name: "Variant B",
        impressions: 14500,
        views: 6090,
        clicks: 885,
        ctr: 6.1,
        retention: 42,
        isControl: false,
      },
    ],
  },
];

function StatusBadge({ status }: { status: ABTest["status"] }) {
  const styles = {
    DRAFT: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
    RUNNING: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    PAUSED: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    COMPLETED: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  };

  const icons = {
    DRAFT: "edit_note",
    RUNNING: "play_circle",
    PAUSED: "pause_circle",
    COMPLETED: "done_all",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium",
        styles[status]
      )}
    >
      {status === "RUNNING" && (
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      )}
      <span className="material-symbols-outlined text-sm">{icons[status]}</span>
      {status === "DRAFT" && "Draft"}
      {status === "RUNNING" && "Running"}
      {status === "PAUSED" && "Paused"}
      {status === "COMPLETED" && "Completed"}
    </span>
  );
}

function VariantCard({
  variant,
  isWinner = false,
  compact = false,
}: {
  variant: ABVariant;
  isWinner?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg bg-white dark:bg-slate-900 p-3 relative",
        isWinner
          ? "border-2 border-amber-400 dark:border-amber-500 shadow-md shadow-amber-500/10"
          : "border border-slate-200 dark:border-slate-700",
        compact && "opacity-80"
      )}
    >
      {isWinner && (
        <div className="absolute -top-3 -right-3 bg-amber-400 dark:bg-amber-500 text-white p-1 rounded-full shadow-lg">
          <span className="material-symbols-outlined text-sm">workspace_premium</span>
        </div>
      )}
      <h5
        className={cn(
          "text-xs font-bold mb-2 uppercase tracking-wider",
          isWinner
            ? "text-amber-600 dark:text-amber-400"
            : "text-slate-500 dark:text-slate-400"
        )}
      >
        {variant.name}
        {variant.isControl && " (Control)"}
        {isWinner && " (Winner)"}
      </h5>
      {!compact && (
        <>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">CTR</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {variant.ctr.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Retention</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {variant.retention}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Views</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {variant.views.toLocaleString()}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ComparisonChart({ variants }: { variants: ABVariant[] }) {
  const maxCtr = Math.max(...variants.map((v) => v.ctr));
  
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <h5 className="text-slate-700 dark:text-slate-300 text-sm font-medium mb-4">
        CTR Comparison
      </h5>
      <div className="flex items-end justify-around h-32 gap-4">
        {variants.map((variant, index) => {
          const height = (variant.ctr / maxCtr) * 100;
          return (
            <div key={variant.id} className="flex flex-col items-center gap-2 flex-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {variant.ctr.toFixed(1)}%
              </span>
              <div
                className={cn(
                  "w-full rounded-t-lg transition-all",
                  index === 0
                    ? "bg-slate-400 dark:bg-slate-600"
                    : "bg-primary"
                )}
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {variant.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ABTestingPage() {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    // In production, fetch from API
    // For now, use mock data
    setTimeout(() => {
      setTests(mockTests);
      setLoading(false);
    }, 500);
  }, []);

  const activeTests = tests.filter((t) => t.status === "RUNNING" || t.status === "PAUSED");
  const completedTests = tests.filter((t) => t.status === "COMPLETED");

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-w-0">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col gap-1">
          <h2 className="text-slate-900 dark:text-slate-100 tracking-tight text-2xl font-bold leading-tight">
            Video A/B Testing
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">
            Test and optimize your video content to maximize engagement.
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex min-w-[84px]"
        >
          <span className="truncate">Create New Test</span>
        </Button>
      </div>

      {/* Active Tests */}
      <div className="p-4 flex flex-col gap-4">
        <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em]">
          Active Tests
        </h3>
        {activeTests.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No active tests. Create one to get started!
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-4 py-3 text-slate-600 dark:text-slate-300 text-sm font-medium leading-normal">
                    Test Name
                  </th>
                  <th className="px-4 py-3 text-slate-600 dark:text-slate-300 text-sm font-medium leading-normal">
                    Variants
                  </th>
                  <th className="px-4 py-3 text-slate-600 dark:text-slate-300 text-sm font-medium leading-normal">
                    Status
                  </th>
                  <th className="px-4 py-3 text-slate-600 dark:text-slate-300 text-sm font-medium leading-normal">
                    Live CTR
                  </th>
                  <th className="px-4 py-3 text-slate-600 dark:text-slate-300 text-sm font-medium leading-normal">
                    Avg. Watch Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeTests.map((test) => {
                  const bestVariant = test.variants.reduce((best, current) =>
                    current.ctr > best.ctr ? current : best
                  );
                  return (
                    <tr
                      key={test.id}
                      className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-4 py-4 text-slate-900 dark:text-slate-100 text-sm font-medium leading-normal">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary">
                            {test.variants.length > 2 ? "play_circle" : "title"}
                          </span>
                          {test.name}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-normal leading-normal">
                        <div className="flex items-center -space-x-2">
                          {test.variants.slice(0, 3).map((variant) => (
                            <div
                              key={variant.id}
                              className="w-8 h-8 rounded border-2 border-white dark:border-slate-900 bg-primary/20 flex items-center justify-center text-xs font-bold text-primary"
                            >
                              {variant.name.charAt(0)}
                            </div>
                          ))}
                          {test.variants.length > 3 && (
                            <div className="w-8 h-8 rounded border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300">
                              +{test.variants.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-normal leading-normal">
                        <StatusBadge status={test.status} />
                      </td>
                      <td className="px-4 py-4 text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal">
                        {bestVariant.ctr.toFixed(1)}%{" "}
                        <span className="text-green-500 text-xs ml-1">↑ 0.5%</span>
                      </td>
                      <td className="px-4 py-4 text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal">
                        {formatDuration(Math.floor(bestVariant.views / 10))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Completed Tests */}
      <div className="p-4 flex flex-col gap-4">
        <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em]">
          Completed Tests
        </h3>
        {completedTests.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No completed tests yet.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {completedTests.map((test) => {
              const totalViews = test.variants.reduce((sum, v) => sum + v.views, 0);

              return (
                <div
                  key={test.id}
                  className="rounded-xl border border-primary/30 bg-primary/5 dark:bg-primary/5 p-5 flex flex-col gap-5"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">
                        done_all
                      </span>
                      <div>
                        <h4 className="text-slate-900 dark:text-slate-100 text-base font-bold">
                          {test.name}
                        </h4>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">
                          Completed {test.endDate && new Date(test.endDate).toLocaleDateString()} •{" "}
                          {totalViews.toLocaleString()} views
                        </p>
                      </div>
                    </div>
                    <Button size="sm" className="shadow-sm">
                      Apply Winner
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Variant Cards */}
                    <div className="flex gap-4">
                      {test.variants.map((variant) => (
                        <div key={variant.id} className="flex-1 relative">
                          <VariantCard
                            variant={variant}
                            isWinner={variant.id === test.winnerId}
                          />
                        </div>
                      ))}
                    </div>
                    {/* Chart */}
                    <ComparisonChart variants={test.variants} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Test Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Create New A/B Test
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Test Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  placeholder="e.g., Thumbnail Test"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  rows={2}
                  placeholder="What are you testing?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Number of Variants
                </label>
                <select className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  <option>2 Variants (A/B)</option>
                  <option>3 Variants (A/B/C)</option>
                  <option>4 Variants</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Test
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
