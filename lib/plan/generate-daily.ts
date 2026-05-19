import { inferCuisineBucket } from "@/lib/plan/cuisine-bucket";
import { hashString, pickIndex } from "@/lib/plan/hash";
import { getMealCandidates } from "@/lib/plan/meal-pools";
import type { DailyPlan, MealOption, SlotKey } from "@/lib/plan/types";
import type { PantryItem } from "@/lib/pantry/types";
import type { DietPreference, UserProfile } from "@/lib/profile/types";

const SLOTS: SlotKey[] = ["breakfast", "lunch", "snack", "dinner"];

export function canGenerateDailyPlan(profile: UserProfile): boolean {
  return (
    profile.diet !== "" &&
    profile.preferredCuisine.trim() !== "" &&
    profile.cookingTime !== ""
  );
}

function pantryTokens(items: PantryItem[]): string[] {
  return items
    .map((i) => i.name.trim().toLowerCase())
    .filter(Boolean)
    .sort();
}

function buildSeedString(profile: UserProfile, pantry: PantryItem[]): string {
  const pantryJoined = pantryTokens(pantry).join("|");
  return JSON.stringify({
    diet: profile.diet,
    cuisine: profile.preferredCuisine.trim(),
    state: profile.stateOrRegion.trim(),
    city: profile.city.trim(),
    members: profile.familyMembers.trim(),
    kids: profile.hasKids,
    elderly: profile.hasElderly,
    cook: profile.cookingTime,
    budgetP: profile.budgetPeriod,
    budgetA: profile.budgetAmount.trim(),
    pantry: pantryJoined,
  });
}

function mealText(m: MealOption): string {
  return `${m.name} ${m.note}`.toLowerCase();
}

/** Prefer meals that mention pantry ingredients in name or note (deterministic order). */
function prioritizeByPantry(
  candidates: MealOption[],
  pantry: PantryItem[],
): MealOption[] {
  if (candidates.length === 0 || pantry.length === 0) return candidates;
  const tokens = pantryTokens(pantry).filter((t) => t.length >= 2);
  if (tokens.length === 0) return candidates;

  const matched: MealOption[] = [];
  const rest: MealOption[] = [];
  for (const m of candidates) {
    const text = mealText(m);
    const hit = tokens.some((t) => text.includes(t));
    if (hit) matched.push(m);
    else rest.push(m);
  }
  if (matched.length === 0) return candidates;
  return [...matched, ...rest];
}

function resolveDiet(profile: UserProfile): DietPreference {
  if (
    profile.diet === "vegetarian" ||
    profile.diet === "eggetarian" ||
    profile.diet === "non_vegetarian" ||
    profile.diet === "jain"
  ) {
    return profile.diet;
  }
  return "vegetarian";
}

export function generateDailyPlan(
  profile: UserProfile,
  pantry: PantryItem[],
  options?: { seedExtra?: string },
): DailyPlan {
  const diet = resolveDiet(profile);
  const bucket = inferCuisineBucket(
    profile.preferredCuisine,
    profile.stateOrRegion,
  );
  const seed = hashString(
    buildSeedString(profile, pantry) + (options?.seedExtra ?? ""),
  );

  const plan = {} as DailyPlan;
  for (let i = 0; i < SLOTS.length; i += 1) {
    const slot = SLOTS[i];
    let candidates = getMealCandidates(slot, diet, bucket);
    candidates = prioritizeByPantry(candidates, pantry);
    const idx = pickIndex(candidates.length, seed, i * 7919 + slot.length);
    const chosen = candidates[idx] ?? candidates[0] ?? fallbackMeal(slot);
    plan[slot] = chosen;
  }
  return plan;
}

function fallbackMeal(slot: SlotKey): MealOption {
  return {
    name: "Simple home thali",
    note: `Fill ${slot} with dal, one sabzi, and roti or rice—templates expand in later phases.`,
  };
}
