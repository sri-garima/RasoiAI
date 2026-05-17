import { EMPTY_PROFILE } from "@/lib/profile/defaults";
import type { UserProfile } from "@/lib/profile/types";

const STORAGE_KEY = "rasoiai.profile.v1";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function loadProfile(): UserProfile {
  if (typeof window === "undefined") return EMPTY_PROFILE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROFILE;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return EMPTY_PROFILE;
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      city: typeof parsed.city === "string" ? parsed.city : "",
      stateOrRegion:
        typeof parsed.stateOrRegion === "string" ? parsed.stateOrRegion : "",
      diet:
        parsed.diet === "vegetarian" ||
        parsed.diet === "eggetarian" ||
        parsed.diet === "non_vegetarian" ||
        parsed.diet === "jain"
          ? parsed.diet
          : "",
      familyMembers:
        typeof parsed.familyMembers === "number"
          ? String(parsed.familyMembers)
          : typeof parsed.familyMembers === "string"
            ? parsed.familyMembers
            : String(EMPTY_PROFILE.familyMembers),
      hasKids: Boolean(parsed.hasKids),
      hasElderly: Boolean(parsed.hasElderly),
      cookingTime:
        parsed.cookingTime === "under_30" ||
        parsed.cookingTime === "30_to_45" ||
        parsed.cookingTime === "45_to_60" ||
        parsed.cookingTime === "60_plus"
          ? parsed.cookingTime
          : "",
      budgetPeriod:
        parsed.budgetPeriod === "weekly" || parsed.budgetPeriod === "monthly"
          ? parsed.budgetPeriod
          : "",
      budgetAmount:
        typeof parsed.budgetAmount === "string" ? parsed.budgetAmount : "",
      preferredCuisine:
        typeof parsed.preferredCuisine === "string"
          ? parsed.preferredCuisine
          : "",
    };
  } catch {
    return EMPTY_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
