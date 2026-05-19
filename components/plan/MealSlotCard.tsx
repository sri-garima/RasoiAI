import type { LucideIcon } from "lucide-react";
import { Coffee, Moon, Sun, UtensilsCrossed } from "lucide-react";

import type { MealOption, SlotKey } from "@/lib/plan/types";
import { cn } from "@/lib/cn";

const SLOT_ICONS: Record<SlotKey, LucideIcon> = {
  breakfast: Sun,
  lunch: UtensilsCrossed,
  snack: Coffee,
  dinner: Moon,
};

type MealSlotCardProps = {
  slot: SlotKey;
  label: string;
  meal: MealOption;
  dense?: boolean;
  className?: string;
};

export function MealSlotCard({
  slot,
  label,
  meal,
  dense,
  className,
}: MealSlotCardProps) {
  const Icon = SLOT_ICONS[slot];
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl border border-stone-100 bg-gradient-to-br from-white to-cream/60 shadow-sm ring-1 ring-black/[0.03] transition hover:border-stone-200/90 hover:shadow-md print:break-inside-avoid print:border-stone-300 print:shadow-none",
        dense ? "px-3 py-2.5" : "px-4 py-4 sm:px-5 sm:py-5",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-xl bg-light-peach/90 text-deep-green ring-1 ring-orange-accent/20",
            dense ? "size-9" : "size-11",
          )}
          aria-hidden
        >
          <Icon className={dense ? "size-4" : "size-5"} strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "font-bold uppercase tracking-[0.12em] text-deep-green",
              dense ? "text-[9px]" : "text-[10px] sm:text-xs",
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              "mt-1.5 font-serif font-semibold leading-snug text-stone-900",
              dense ? "text-sm" : "text-lg sm:text-xl",
            )}
          >
            {meal.name}
          </p>
          <p
            className={cn(
              "mt-1.5 leading-relaxed text-stone-600",
              dense ? "text-xs" : "text-sm",
            )}
          >
            {meal.note}
          </p>
        </div>
      </div>
    </article>
  );
}
