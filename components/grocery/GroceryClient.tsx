"use client";

import { startTransition, useEffect, useState } from "react";
import Link from "next/link";
import { Check, Info, ShoppingCart } from "lucide-react";

import { loadLastDailyPlan, loadLastWeeklyPlan } from "@/lib/plan/storage";
import { loadPantry } from "@/lib/pantry/storage";
import { extractGroceryList, type GroceryItem } from "@/lib/grocery/extract";
import { cn } from "@/lib/cn";

export function GroceryClient() {
  const [hydrated, setHydrated] = useState(false);
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    startTransition(() => {
      const daily = loadLastDailyPlan();
      const weekly = loadLastWeeklyPlan();
      const pantry = loadPantry();
      
      const list = extractGroceryList(daily, weekly, pantry);
      setItems(list);
      
      // Load checked states from local storage
      try {
        const raw = window.localStorage.getItem("rasoiai.grocery.checked.v1");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setCheckedIds(new Set(parsed));
          }
        }
      } catch {
        // ignore
      }

      setHydrated(true);
    });
  }, []);

  function toggleCheck(id: string) {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      window.localStorage.setItem("rasoiai.grocery.checked.v1", JSON.stringify(Array.from(next)));
      return next;
    });
  }

  function clearChecked() {
    setCheckedIds(new Set());
    window.localStorage.removeItem("rasoiai.grocery.checked.v1");
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-10 sm:px-6" aria-busy="true">
        <div className="h-9 w-48 animate-pulse rounded-xl bg-stone-200/80" />
        <div className="mt-6 space-y-4">
          <div className="h-16 animate-pulse rounded-2xl bg-stone-200/60" />
          <div className="h-16 animate-pulse rounded-2xl bg-stone-200/60" />
        </div>
      </div>
    );
  }

  const needToBuy = items.filter((item) => !item.inPantry);
  const alreadyHave = items.filter((item) => item.inPantry);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-10 sm:px-6 sm:py-12">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-deep-green">
            Grocery List
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Smart Shopping
          </h1>
        </header>

        <div className="rounded-[1.25rem] border border-amber-200/80 bg-amber-50/80 px-5 py-8 text-center text-sm text-amber-950">
          <ShoppingCart className="mx-auto mb-4 size-10 text-amber-500/50" />
          <p className="font-semibold text-lg">No plan found</p>
          <p className="mt-2 text-amber-900/90 max-w-md mx-auto">
            Generate a daily or weekly plan first, and we will automatically extract a crude shopping list for you here.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/plan/daily"
              className="inline-block font-semibold text-deep-green underline-offset-2 hover:underline"
            >
              Daily Plan
            </Link>
            <Link
              href="/plan/weekly"
              className="inline-block font-semibold text-deep-green underline-offset-2 hover:underline"
            >
              Weekly Plan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-6 sm:py-12">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-deep-green">
          Grocery List
        </p>
        <h1 className="mt-2 flex items-center justify-between font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          <span>Smart Shopping</span>
          {checkedIds.size > 0 && (
            <button
              onClick={clearChecked}
              className="text-sm font-sans font-medium text-stone-500 hover:text-stone-800 transition"
            >
              Clear checked
            </button>
          )}
        </h1>
        <p className="mt-3 text-stone-600">
          Derived from your latest generated plan and compared against your{" "}
          <Link
            href="/pantry"
            className="font-medium text-deep-green underline-offset-2 hover:underline"
          >
            pantry
          </Link>
          .
        </p>
      </header>

      <div className="space-y-10">
        <section>
          <h2 className="mb-4 text-xl font-semibold text-stone-800 flex items-center gap-2">
            <ShoppingCart className="size-5 text-orange-accent" />
            Need to buy
          </h2>
          {needToBuy.length === 0 ? (
            <p className="text-sm text-stone-500 italic">No missing items! Your pantry looks well-stocked.</p>
          ) : (
            <ul className="space-y-2">
              {needToBuy.map((item) => {
                const isChecked = checkedIds.has(item.id);
                return (
                  <li key={item.id}>
                    <label
                      className={cn(
                        "flex cursor-pointer items-center gap-4 rounded-2xl border bg-white px-4 py-4 shadow-sm transition",
                        isChecked ? "border-stone-200 opacity-60" : "border-stone-200/80 hover:border-orange-accent/50 hover:shadow-md"
                      )}
                    >
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={isChecked}
                        onChange={() => toggleCheck(item.id)}
                      />
                      <div
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-md border",
                          isChecked ? "bg-deep-green border-deep-green text-white" : "border-stone-300 bg-white"
                        )}
                      >
                        {isChecked && <Check className="size-4" />}
                      </div>
                      <span className={cn("font-medium", isChecked ? "text-stone-500 line-through" : "text-stone-800")}>
                        {item.name}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-stone-800 flex items-center gap-2">
            <Check className="size-5 text-deep-green" />
            Already have
          </h2>
          {alreadyHave.length === 0 ? (
            <p className="text-sm text-stone-500 italic">No items found in your pantry.</p>
          ) : (
            <ul className="space-y-2">
              {alreadyHave.map((item) => {
                const isChecked = checkedIds.has(item.id);
                return (
                  <li key={item.id}>
                    <label
                      className={cn(
                        "flex cursor-pointer items-center gap-4 rounded-2xl border bg-cream/40 px-4 py-3 shadow-sm transition",
                        isChecked ? "border-stone-200 opacity-50" : "border-stone-200/50 hover:bg-cream"
                      )}
                    >
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={isChecked}
                        onChange={() => toggleCheck(item.id)}
                      />
                      <div
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-md border",
                          isChecked ? "bg-stone-400 border-stone-400 text-white" : "border-stone-300 bg-white"
                        )}
                      >
                        {isChecked && <Check className="size-3" />}
                      </div>
                      <span className={cn("text-sm", isChecked ? "text-stone-400 line-through" : "text-stone-600")}>
                        {item.name}
                      </span>
                      <span className="ml-auto text-[10px] font-medium uppercase tracking-wider text-deep-green/70 bg-deep-green/10 px-2 py-0.5 rounded-full">
                        In Pantry
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
        
        <div className="flex items-start gap-3 rounded-2xl bg-stone-50 px-4 py-4 text-sm text-stone-600">
          <Info className="mt-0.5 size-5 shrink-0 text-stone-400" />
          <p>
            <strong>Note:</strong> This list uses a basic keyword extractor. It might miss some complex ingredients or list standard cooking terms.
          </p>
        </div>
      </div>
    </div>
  );
}
