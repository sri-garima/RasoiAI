import type { PantryItem } from "@/lib/pantry/types";
import type { UserProfile } from "@/lib/profile/types";

export function parsePlanRequestBody(
  raw: unknown,
): { profile: UserProfile; pantry: PantryItem[] } | null {
  if (typeof raw !== "object" || raw === null) return null;
  const o = raw as Record<string, unknown>;
  if (!o.profile || typeof o.profile !== "object") return null;
  if (!Array.isArray(o.pantry)) return null;
  return {
    profile: o.profile as UserProfile,
    pantry: o.pantry as PantryItem[],
  };
}
