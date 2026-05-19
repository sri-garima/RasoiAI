import type { DailyPlan, WeeklyPlanDay } from "@/lib/plan/types";
import type { PantryItem } from "@/lib/pantry/types";

export type GroceryItem = {
  id: string;
  name: string;
  inPantry: boolean;
  checked: boolean;
};

// Extremely crude MVP stop-word list
const STOP_WORDS = new Set([
  "and", "or", "with", "served", "for", "a", "the", "in", "on", "of", "to",
  "curry", "sabzi", "roti", "rice", "dal", "fry", "masala", "paratha",
  "style", "recipe", "spicy", "sweet", "sour", "dry", "wet", "gravy",
  "breakfast", "lunch", "dinner", "snack", "evening", "leftover", "fresh",
  "hot", "cold", "warm", "quick", "easy", "simple", "tasty", "delicious",
  "mixed", "mix", "plain", "spiced", "roasted", "boiled", "fried",
]);

export function extractGroceryList(
  dailyPlan: DailyPlan | null,
  weeklyPlan: WeeklyPlanDay[] | null,
  pantry: PantryItem[]
): GroceryItem[] {
  const textBlocks: string[] = [];

  if (weeklyPlan) {
    for (const day of weeklyPlan) {
      for (const slot of ["breakfast", "lunch", "snack", "dinner"] as const) {
        const meal = day.plan[slot];
        if (meal?.name) textBlocks.push(meal.name);
        if (meal?.note) textBlocks.push(meal.note);
      }
    }
  } else if (dailyPlan) {
    for (const slot of ["breakfast", "lunch", "snack", "dinner"] as const) {
      const meal = dailyPlan[slot];
      if (meal?.name) textBlocks.push(meal.name);
      if (meal?.note) textBlocks.push(meal.note);
    }
  }

  if (textBlocks.length === 0) return [];

  const bigText = textBlocks.join(" ").toLowerCase();
  const words = bigText.split(/[\s,()&+-]+/).filter((w) => w.length > 2);
  
  const extracted = new Set<string>();
  for (const w of words) {
    if (!STOP_WORDS.has(w) && !Number.isInteger(Number(w))) {
      extracted.add(w);
    }
  }

  // To make it slightly better MVP, if the meal says "paneer butter masala", 
  // 'paneer' and 'butter' are extracted.
  const pantryNames = pantry.map((p) => p.name.toLowerCase().trim());
  const items: GroceryItem[] = [];

  for (const item of Array.from(extracted).sort()) {
    // Check if item is in pantry
    const inPantry = pantryNames.some((pn) => pn.includes(item) || item.includes(pn));
    items.push({
      id: `grocery-${item}`,
      name: item.charAt(0).toUpperCase() + item.slice(1),
      inPantry,
      checked: false,
    });
  }

  return items;
}
