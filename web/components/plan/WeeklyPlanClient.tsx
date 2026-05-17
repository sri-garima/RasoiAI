"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Loader2,
  Printer,
  RefreshCw,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import Link from "next/link";
import { startTransition, useCallback, useEffect, useState } from "react";

import { MealSlotCard } from "@/components/plan/MealSlotCard";
import { canGenerateDailyPlan } from "@/lib/plan/generate-daily";
import { generateWeeklyPlanRules } from "@/lib/plan/generate-weekly";
import type { SlotKey, WeeklyPlanDay } from "@/lib/plan/types";
import { loadPantry } from "@/lib/pantry/storage";
import { loadProfile } from "@/lib/profile/storage";
import type { UserProfile } from "@/lib/profile/types";
import type { PantryItem } from "@/lib/pantry/types";
import { cn } from "@/lib/cn";

const SLOT_LABEL: Record<SlotKey, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  snack: "Snack",
  dinner: "Dinner",
};

const SLOT_ORDER: SlotKey[] = ["breakfast", "lunch", "snack", "dinner"];

type GenMode = "rules" | "ai";

export function WeeklyPlanClient() {
  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [pantry, setPantry] = useState<PantryItem[]>([]);
  const [week, setWeek] = useState<WeeklyPlanDay[] | null>(null);
  const [generatedAt, setGeneratedAt] = useState<number | null>(null);
  const [mode, setMode] = useState<GenMode>("rules");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshInputs = useCallback(() => {
    setProfile(loadProfile());
    setPantry(loadPantry());
  }, []);

  useEffect(() => {
    startTransition(() => {
      refreshInputs();
      setHydrated(true);
    });
  }, [refreshInputs]);

  const ready = profile !== null && canGenerateDailyPlan(profile);

  async function runGenerate() {
    setError(null);
    const p = loadProfile();
    const pa = loadPantry();
    setProfile(p);
    setPantry(pa);
    if (!canGenerateDailyPlan(p)) {
      setWeek(null);
      setGeneratedAt(null);
      return;
    }

    if (mode === "rules") {
      setWeek(generateWeeklyPlanRules(p, pa));
      setGeneratedAt(Date.now());
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/plan/weekly-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: p, pantry: pa }),
      });
      const data = (await res.json()) as {
        days?: WeeklyPlanDay[];
        error?: string;
        message?: string;
      };
      if (!res.ok) {
        throw new Error(data.message || data.error || `Request failed (${res.status})`);
      }
      if (!data.days || data.days.length !== 7) {
        throw new Error("Weekly response incomplete");
      }
      setWeek(data.days);
      setGeneratedAt(Date.now());
    } catch (e) {
      setWeek(null);
      setGeneratedAt(null);
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!hydrated || profile === null) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6" aria-busy="true">
        <div className="h-9 w-56 animate-pulse rounded-xl bg-stone-200/80" />
        <div className="mt-6 h-48 animate-pulse rounded-2xl bg-stone-200/60" />
        <p className="mt-4 text-sm text-stone-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12 print:max-w-none print:px-3">
      <header className="mb-8 print:mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-deep-green">
          Weekly plan
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          Monday → Sunday
        </h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          Seven columns on desktop; scroll horizontally on smaller screens. Uses the
          same{" "}
          <Link href="/profile" className="font-medium text-deep-green underline-offset-2 hover:underline">
            profile
          </Link>{" "}
          and{" "}
          <Link href="/pantry" className="font-medium text-deep-green underline-offset-2 hover:underline">
            pantry
          </Link>{" "}
          as daily.{" "}
          <Link href="/plan/daily" className="font-medium text-deep-green underline-offset-2 hover:underline">
            ← Daily plan
          </Link>
        </p>
      </header>

      {!ready ? (
        <div className="rounded-[1.25rem] border border-amber-200/80 bg-amber-50/80 px-5 py-4 text-sm text-amber-950">
          <p className="font-semibold">Complete profile first</p>
          <p className="mt-2 text-amber-900/90">
            Diet, preferred cuisine, and cooking time are required.
          </p>
          <Link
            href="/profile"
            className="mt-3 inline-block font-semibold text-deep-green underline-offset-2 hover:underline"
          >
            Go to Profile
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div
              className="inline-flex rounded-2xl border border-stone-200/90 bg-white/80 p-1 shadow-sm print:hidden"
              role="tablist"
              aria-label="Generation mode"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === "rules"}
                onClick={() => {
                  setMode("rules");
                  setError(null);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                  mode === "rules"
                    ? "bg-deep-green text-white shadow-sm"
                    : "text-stone-600 hover:bg-cream/80",
                )}
              >
                <RefreshCw className="size-4" aria-hidden />
                Rules
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "ai"}
                onClick={() => {
                  setMode("ai");
                  setError(null);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                  mode === "ai"
                    ? "bg-deep-green text-white shadow-sm"
                    : "text-stone-600 hover:bg-cream/80",
                )}
              >
                <Wand2 className="size-4" aria-hidden />
                AI
              </button>
            </div>
            <div className="flex flex-wrap gap-2 print:hidden">
              <button
                type="button"
                onClick={refreshInputs}
                className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-cream px-4 py-2.5 text-sm font-semibold text-stone-800 transition hover:bg-white"
              >
                <RefreshCw className="size-4" aria-hidden />
                Refresh inputs
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 transition hover:bg-cream/80"
              >
                <Printer className="size-4" aria-hidden />
                Print
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={runGenerate}
                className="inline-flex items-center gap-2 rounded-xl bg-deep-green px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_-12px_rgba(15,124,102,0.55)] transition disabled:opacity-60"
              >
                {mode === "ai" ? (
                  <Sparkles className="size-4" aria-hidden />
                ) : (
                  <RefreshCw className="size-4" aria-hidden />
                )}
                {week ? "Regenerate week" : "Generate week"}
              </button>
            </div>
          </div>

          <div className="relative rounded-[1.5rem] border border-stone-200/80 bg-white/90 p-4 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.15)] sm:p-6 print:border-stone-300 print:shadow-none lg:p-8">
            {loading ? (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-[inherit] bg-white/85 backdrop-blur-sm">
                <Loader2 className="size-9 animate-spin text-deep-green" aria-hidden />
                <p className="text-sm font-medium text-stone-700">
                  Building seven days…
                </p>
              </div>
            ) : null}

            <AnimatePresence>
              {error ? (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 flex gap-3 rounded-xl border border-red-200/90 bg-red-50/90 px-4 py-3 text-sm text-red-900 print:hidden"
                  role="alert"
                >
                  <p className="min-w-0 flex-1">{error}</p>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="shrink-0 rounded-lg p-1 text-red-700 hover:bg-red-100"
                    aria-label="Dismiss"
                  >
                    <X className="size-4" />
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {generatedAt ? (
              <p className="mb-4 text-xs text-stone-500 print:text-stone-700">
                Last generated:{" "}
                <time dateTime={new Date(generatedAt).toISOString()}>
                  {new Date(generatedAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </time>
              </p>
            ) : null}

            {week ? (
              <div className="-mx-1 overflow-x-auto pb-2 print:overflow-visible">
                <div className="flex min-w-[min(100%,1120px)] gap-3 md:grid md:min-w-0 md:grid-cols-7 md:gap-2 lg:gap-3 print:flex print:flex-wrap print:justify-between">
                  {week.map((day) => (
                    <section
                      key={day.key}
                      className="w-[min(88vw,260px)] shrink-0 md:w-auto md:shrink"
                    >
                      <h2 className="sticky top-0 z-[1] mb-3 rounded-xl bg-light-peach/90 px-2 py-2 text-center font-serif text-sm font-semibold text-deep-green ring-1 ring-orange-accent/25 print:static print:bg-transparent print:ring-0">
                        <span className="md:hidden">{day.key}</span>
                        <span className="hidden md:inline">{day.label}</span>
                      </h2>
                      <div className="space-y-2">
                        {SLOT_ORDER.map((slot) => (
                          <MealSlotCard
                            key={slot}
                            slot={slot}
                            label={SLOT_LABEL[slot]}
                            meal={day.plan[slot]}
                            dense
                          />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-stone-200 bg-cream/50 px-5 py-12 text-center text-sm text-stone-600">
                Tap <strong>Generate week</strong> for a seven-day grid (rules = instant
                variety; AI = one model call).
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
