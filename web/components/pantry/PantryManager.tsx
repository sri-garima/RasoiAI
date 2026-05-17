"use client";

import { startTransition, useEffect, useId, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { PANTRY_CATEGORY_LABELS, QUICK_ADD } from "@/lib/pantry/labels";
import { loadPantry, savePantry } from "@/lib/pantry/storage";
import type { PantryCategory, PantryItem } from "@/lib/pantry/types";
import { cn } from "@/lib/cn";

const MAX_NAME = 60;
const MAX_ITEMS = 120;

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function categoryBadgeClass(c: PantryCategory) {
  const map: Record<PantryCategory, string> = {
    vegetable: "bg-emerald-50 text-emerald-800 ring-emerald-200/80",
    staple: "bg-amber-50 text-amber-900 ring-amber-200/80",
    protein: "bg-rose-50 text-rose-900 ring-rose-200/80",
    dairy: "bg-sky-50 text-sky-900 ring-sky-200/70",
    grocery: "bg-violet-50 text-violet-900 ring-violet-200/70",
    other: "bg-stone-100 text-stone-700 ring-stone-200/80",
  };
  return map[c];
}

export function PantryManager() {
  const baseId = useId();
  const [hydrated, setHydrated] = useState(false);
  const [items, setItems] = useState<PantryItem[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<PantryCategory>("vegetable");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    startTransition(() => {
      setItems(loadPantry());
      setHydrated(true);
    });
  }, []);

  function persist(next: PantryItem[]) {
    setItems(next);
    savePantry(next);
  }

  const normalizedNames = useMemo(
    () => new Set(items.map((i) => i.name.toLowerCase())),
    [items],
  );

  function addItem(
    nextName: string,
    nextCategory: PantryCategory,
    opts?: { silent?: boolean; clearName?: boolean },
  ) {
    const trimmed = nextName.trim();
    if (!trimmed) {
      if (!opts?.silent) setFormError("Enter a name for the item.");
      return;
    }
    if (trimmed.length > MAX_NAME) {
      if (!opts?.silent)
        setFormError(`Keep names under ${MAX_NAME} characters.`);
      return;
    }
    if (normalizedNames.has(trimmed.toLowerCase())) {
      if (!opts?.silent) setFormError("That item is already on your list.");
      return;
    }
    if (items.length >= MAX_ITEMS) {
      if (!opts?.silent)
        setFormError(`You can save up to ${MAX_ITEMS} items for now.`);
      return;
    }
    setFormError(null);
    persist([
      ...items,
      { id: newId(), name: trimmed, category: nextCategory },
    ]);
    if (opts?.clearName !== false) setName("");
  }

  function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    addItem(name, category);
  }

  function remove(id: string) {
    persist(items.filter((i) => i.id !== id));
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-10 sm:px-6" aria-busy="true">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-stone-200/80" />
        <div className="mt-6 h-40 animate-pulse rounded-2xl bg-stone-200/60" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-6 sm:py-12">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-deep-green">
          At home right now
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          Pantry
        </h1>
        <p className="mt-3 text-stone-600">
          Add vegetables and groceries you already have—separate from your
          profile, saved only on this device—so future meal plans can use them
          first.
        </p>
      </header>

      <div className="rounded-[1.5rem] border border-stone-200/80 bg-white/90 p-6 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.15)] sm:p-8">
        <form onSubmit={handleAddSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <label
              htmlFor={`${baseId}-name`}
              className="block text-sm font-semibold text-stone-800"
            >
              Add item
            </label>
            <input
              id={`${baseId}-name`}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFormError(null);
              }}
              placeholder="e.g. Gobhi, moong dal, pav"
              maxLength={MAX_NAME}
              className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white/90 px-4 py-3 text-[15px] text-stone-900 shadow-sm outline-none transition focus:border-deep-green focus:ring-2 focus:ring-deep-green/25"
            />
          </div>
          <div className="sm:w-44">
            <label
              htmlFor={`${baseId}-cat`}
              className="block text-sm font-semibold text-stone-800"
            >
              Category
            </label>
            <select
              id={`${baseId}-cat`}
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as PantryCategory)
              }
              className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white/90 px-4 py-3 text-[15px] text-stone-900 shadow-sm outline-none focus:border-deep-green focus:ring-2 focus:ring-deep-green/25"
            >
              {(Object.keys(PANTRY_CATEGORY_LABELS) as PantryCategory[]).map(
                (c) => (
                  <option key={c} value={c}>
                    {PANTRY_CATEGORY_LABELS[c].short}
                  </option>
                ),
              )}
            </select>
          </div>
          <button
            type="submit"
            className="inline-flex h-[50px] shrink-0 items-center justify-center gap-2 rounded-xl bg-deep-green px-5 text-sm font-semibold text-white shadow-[0_10px_28px_-12px_rgba(15,124,102,0.55)] transition hover:shadow-[0_12px_32px_-10px_rgba(15,124,102,0.58)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-green sm:self-end"
          >
            <Plus className="size-5" strokeWidth={2.5} aria-hidden />
            Add
          </button>
        </form>

        {formError ? (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {formError}
          </p>
        ) : null}

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Quick add
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {QUICK_ADD.map((q) => (
              <button
                key={q.name}
                type="button"
                onClick={() => {
                  setCategory(q.category);
                  addItem(q.name, q.category, { silent: true, clearName: false });
                }}
                className="rounded-full border border-stone-200/90 bg-cream/80 px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:border-deep-green/40 hover:bg-white"
              >
                + {q.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-stone-100 pt-8">
          {items.length === 0 ? (
            <p className="rounded-xl bg-cream/60 px-4 py-6 text-center text-sm leading-relaxed text-stone-600 ring-1 ring-stone-100">
              Nothing here yet. Add a few staples—you will reuse this list when
              daily and weekly plans arrive in a later phase.
            </p>
          ) : (
            <ul className="space-y-2" aria-label="Pantry items">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border border-stone-100 bg-cream/40 px-3 py-2.5 sm:px-4 sm:py-3"
                >
                  <span
                    className={cn(
                      "shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1",
                      categoryBadgeClass(item.category),
                    )}
                  >
                    {PANTRY_CATEGORY_LABELS[item.category].short}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-stone-900">
                    {item.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl text-stone-500 transition hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="size-5" strokeWidth={2} aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-6 text-xs text-stone-500">
            Stored locally as <code className="rounded bg-stone-100 px-1 py-0.5 text-[11px]">rasoiai.pantry.v1</code> — separate from your profile.
          </p>
        </div>
      </div>
    </div>
  );
}
