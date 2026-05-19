import type { PantryCategory } from "@/lib/pantry/types";

export const PANTRY_CATEGORY_LABELS: Record<
  PantryCategory,
  { short: string; hint: string }
> = {
  vegetable: { short: "Vegetables", hint: "Sabzi, greens, tomatoes…" },
  staple: { short: "Staples", hint: "Rice, atta, dal, oil…" },
  protein: { short: "Protein", hint: "Paneer, eggs, fish, meat…" },
  dairy: { short: "Dairy", hint: "Milk, dahi, butter…" },
  grocery: { short: "Grocery", hint: "Packaged, spices, misc…" },
  other: { short: "Other", hint: "Anything else on hand" },
};

export const QUICK_ADD: readonly { name: string; category: PantryCategory }[] =
  [
    { name: "Potato", category: "vegetable" },
    { name: "Onion", category: "vegetable" },
    { name: "Tomato", category: "vegetable" },
    { name: "Paneer", category: "protein" },
    { name: "Spinach / palak", category: "vegetable" },
    { name: "Rice", category: "staple" },
    { name: "Atta", category: "staple" },
    { name: "Dahi", category: "dairy" },
  ] as const;
