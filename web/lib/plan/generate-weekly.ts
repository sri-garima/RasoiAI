import { generateDailyPlan } from "@/lib/plan/generate-daily";
import type { WeeklyPlanDay } from "@/lib/plan/types";
import { WEEKDAY_FULL_LABEL, WEEKDAY_SHORT } from "@/lib/plan/types";
import type { PantryItem } from "@/lib/pantry/types";
import type { UserProfile } from "@/lib/profile/types";

/** Seven distinct rule-based days (seed varies per weekday). */
export function generateWeeklyPlanRules(
  profile: UserProfile,
  pantry: PantryItem[],
): WeeklyPlanDay[] {
  return WEEKDAY_SHORT.map((key, i) => ({
    key,
    label: WEEKDAY_FULL_LABEL[key],
    plan: generateDailyPlan(profile, pantry, { seedExtra: `weekday-${i}-${key}` }),
  }));
}
