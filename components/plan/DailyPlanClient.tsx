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
import {
  canGenerateDailyPlan,
  generateDailyPlan,
} from "@/lib/plan/generate-daily";
import type { DailyPlan, SlotKey } from "@/lib/plan/types";
import { saveLastDailyPlan } from "@/lib/plan/storage";
import { loadPantry } from "@/lib/pantry/storage";
import { loadProfile } from "@/lib/profile/storage";
import type { UserProfile } from "@/lib/profile/types";
import type { PantryItem } from "@/lib/pantry/types";
import { cn } from "@/lib/cn";

const SLOT_LABEL: Record<SlotKey, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  snack: "Evening snack",
  dinner: "Dinner",
};

const SLOT_ORDER: SlotKey[] = ["breakfast", "lunch", "snack", "dinner"];

type GenMode = "rules" | "ai";

export function DailyPlanClient() {
  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [pantry, setPantry] = useState<PantryItem[]>([]);
  const [plan, setPlan] = useState<DailyPlan | null>(null);
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
      setPlan(null);
      setGeneratedAt(null);
      return;
    }

    if (mode === "rules") {
      const newPlan = generateDailyPlan(p, pa);
      setPlan(newPlan);
      saveLastDailyPlan(newPlan);
      setGeneratedAt(Date.now());
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/plan/daily-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: p, pantry: pa }),
      });
      const data = (await res.json()) as {
        plan?: DailyPlan;
        error?: string;
        message?: string;
      };
      if (!res.ok) {
        throw new Error(data.message || data.error || `Request failed (${res.status})`);
      }
      if (!data.plan) throw new Error("No plan in response");
      setPlan(data.plan);
      saveLastDailyPlan(data.plan);
      setGeneratedAt(Date.now());
    } catch (e) {
      setPlan(null);
      saveLastDailyPlan(null);
      setGeneratedAt(null);
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!hydrated || profile === null) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-10 sm:px-6" aria-busy="true">
        <div className="h-9 w-48 animate-pulse rounded-xl bg-stone-200/80" />
        <div className="mt-6 h-40 animate-pulse rounded-2xl bg-stone-200/60" />
        <p className="mt-4 text-sm text-stone-500">Loading your saved profile…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-6 sm:py-12 print:max-w-none print:px-4">
      <header className="mb-8 print:mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-deep-green">
          Daily plan
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          One day at a glance
        </h1>
        <p className="mt-3 text-stone-600">
          Pulls from your{" "}
          <Link
            href="/profile"
            className="font-medium text-deep-green underline-offset-2 hover:underline"
          >
            profile
          </Link>{" "}
          and{" "}
          <Link
            href="/pantry"
            className="font-medium text-deep-green underline-offset-2 hover:underline"
          >
            pantry
          </Link>
          . Switch between instant rules or OpenAI (server key).{" "}
          <Link
            href="/plan/weekly"
            className="font-medium text-deep-green underline-offset-2 hover:underline"
          >
            Weekly plan →
          </Link>
        </p>
      </header>

      {!ready ? (
        <div className="rounded-[1.25rem] border border-amber-200/80 bg-amber-50/80 px-5 py-4 text-sm text-amber-950">
          <p className="font-semibold">Complete a few profile fields first</p>
          <p className="mt-2 text-amber-900/90">
            We need your <strong>diet</strong>, <strong>preferred cuisine</strong>, and{" "}
            <strong>cooking time</strong> before generating.
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
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div
              className="inline-flex rounded-2xl border border-stone-200/90 bg-white/80 p-1 shadow-sm"
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
            <p className="text-xs text-stone-500 sm:max-w-xs sm:text-right">
              {mode === "rules"
                ? "Deterministic: same profile + pantry → same four meals."
                : "Uses OPENAI_API_KEY on the server (.env.local). No key → friendly error."}
            </p>
          </div>

          <div
            id="daily-plan-sheet"
            className="relative rounded-[1.5rem] border border-stone-200/80 bg-white/90 p-6 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.15)] sm:p-8 print:border-stone-300 print:shadow-none"
          >
            {loading ? (
              <div
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-[inherit] bg-white/85 backdrop-blur-sm"
                aria-live="polite"
                aria-busy="true"
              >
                <Loader2 className="size-9 animate-spin text-deep-green" aria-hidden />
                <p className="text-sm font-medium text-stone-700">
                  {mode === "ai" ? "Asking the model for your day…" : "Working…"}
                </p>
              </div>
            ) : null}

            <AnimatePresence>
              {error ? (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 flex gap-3 rounded-xl border border-red-200/90 bg-red-50/90 px-4 py-3 text-sm text-red-900"
                  role="alert"
                >
                  <p className="min-w-0 flex-1">{error}</p>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="shrink-0 rounded-lg p-1 text-red-700 hover:bg-red-100"
                    aria-label="Dismiss error"
                  >
                    <X className="size-4" />
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-medium text-stone-700">
                  Pantry:{" "}
                  <span className="text-stone-900">
                    {pantry.length > 0 ? `${pantry.length} items` : "none (optional)"}
                  </span>
                </p>
                {generatedAt ? (
                  <p className="mt-1 text-xs text-stone-500">
                    Last generated:{" "}
                    <time dateTime={new Date(generatedAt).toISOString()}>
                      {new Date(generatedAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </time>
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-stone-500">Not generated yet.</p>
                )}
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
                  className="inline-flex items-center gap-2 rounded-xl bg-deep-green px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_-12px_rgba(15,124,102,0.55)] transition hover:shadow-[0_12px_32px_-10px_rgba(15,124,102,0.58)] disabled:opacity-60"
                >
                  {mode === "ai" ? (
                    <Sparkles className="size-4" aria-hidden />
                  ) : (
                    <RefreshCw className="size-4" aria-hidden />
                  )}
                  {plan ? "Regenerate" : "Generate"} day plan
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {plan ? (
                <motion.ul
                  key="plan"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-8 space-y-4"
                >
                  {SLOT_ORDER.map((slot) => (
                    <li key={slot}>
                      <MealSlotCard
                        slot={slot}
                        label={SLOT_LABEL[slot]}
                        meal={plan[slot]}
                      />
                    </li>
                  ))}
                </motion.ul>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 rounded-2xl border border-dashed border-stone-200 bg-cream/50 px-5 py-10 text-center"
                >
                  <p className="font-medium text-stone-800">No plan on screen yet</p>
                  <p className="mt-2 text-sm text-stone-600">
                    Choose <strong>Rules</strong> or <strong>AI</strong>, then tap{" "}
                    <strong>Generate day plan</strong>. Rules work offline; AI needs a
                    configured server key.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="mt-6 text-center text-xs text-stone-500 print:hidden">
            Tip: use <strong>Print</strong> for a clean sheet or screenshot for family
            WhatsApp.
          </p>
        </>
      )}
    </div>
  );
}
