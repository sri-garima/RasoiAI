import type { PantryCategory, PantryItem } from "@/lib/pantry/types";

const STORAGE_KEY = "rasoiai.pantry.v1";

const VALID_CATEGORIES: readonly PantryCategory[] = [
  "vegetable",
  "staple",
  "protein",
  "dairy",
  "grocery",
  "other",
] as const;

function isPantryCategory(v: unknown): v is PantryCategory {
  return typeof v === "string" && VALID_CATEGORIES.includes(v as PantryCategory);
}

export function loadPantry(): PantryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const out: PantryItem[] = [];
    for (const row of parsed) {
      if (typeof row !== "object" || row === null) continue;
      const r = row as Record<string, unknown>;
      const id = typeof r.id === "string" ? r.id : "";
      const name = typeof r.name === "string" ? r.name.trim() : "";
      const category = isPantryCategory(r.category) ? r.category : "other";
      if (!id || !name) continue;
      out.push({ id, name, category });
    }
    return out;
  } catch {
    return [];
  }
}

export function savePantry(items: PantryItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
