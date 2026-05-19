import type { PantryItem } from "@/lib/pantry/types";
import type { UserProfile } from "@/lib/profile/types";

const DIET_LABEL: Record<string, string> = {
  vegetarian: "Vegetarian",
  eggetarian: "Eggetarian",
  non_vegetarian: "Non-vegetarian",
  jain: "Jain",
};

const COOK_LABEL: Record<string, string> = {
  under_30: "Usually under 30 minutes cooking",
  "30_to_45": "30–45 minutes most days",
  "45_to_60": "45–60 minutes",
  "60_plus": "60+ minutes or weekend-style cooking",
};

export function buildUserPromptContext(
  profile: UserProfile,
  pantry: PantryItem[],
): string {
  const lines: string[] = [
    `Name: ${profile.name.trim() || "(not set)"}`,
    `City: ${profile.city.trim() || "—"}`,
    `State/region: ${profile.stateOrRegion.trim() || "—"}`,
    `Diet: ${profile.diet ? (DIET_LABEL[profile.diet] ?? profile.diet) : "—"}`,
    `Family members: ${profile.familyMembers.trim() || "—"}`,
    `Kids at home: ${profile.hasKids ? "yes" : "no"}`,
    `Elderly at home: ${profile.hasElderly ? "yes" : "no"}`,
    `Cooking time: ${profile.cookingTime ? (COOK_LABEL[profile.cookingTime] ?? profile.cookingTime) : "—"}`,
    `Budget: ${profile.budgetPeriod && profile.budgetAmount ? `${profile.budgetPeriod} ₹${profile.budgetAmount}` : "—"}`,
    `Preferred cuisine: ${profile.preferredCuisine.trim() || "—"}`,
    "",
    "Pantry / ingredients already at home:",
  ];
  if (pantry.length === 0) {
    lines.push("(none listed — still suggest practical Indian household meals.)");
  } else {
    for (const p of pantry) {
      lines.push(`- ${p.name} (${p.category})`);
    }
  }
  return lines.join("\n");
}

export const DAILY_JSON_INSTRUCTION = `Return ONLY valid JSON (no markdown) with this exact shape:
{
  "breakfast": { "name": "string", "note": "string" },
  "lunch": { "name": "string", "note": "string" },
  "snack": { "name": "string", "note": "string" },
  "dinner": { "name": "string", "note": "string" }
}
Each name is a concise Indian meal title; each note is one short practical sentence (timing, pairing, or pantry tip).`;

export const WEEKLY_JSON_INSTRUCTION = `Return ONLY valid JSON (no markdown) with this exact shape:
{
  "days": [
    {
      "day": "Monday",
      "breakfast": { "name": "string", "note": "string" },
      "lunch": { "name": "string", "note": "string" },
      "snack": { "name": "string", "note": "string" },
      "dinner": { "name": "string", "note": "string" }
    }
  ]
}
Provide exactly 7 objects in "days", in order Monday through Sunday. Titles must feel appropriate for an Indian household; notes are one short sentence each.`;
