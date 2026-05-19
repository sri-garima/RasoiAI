import type { DailyPlan, MealOption, SlotKey, WeeklyPlanDay } from "@/lib/plan/types";
import { WEEKDAY_FULL_LABEL, WEEKDAY_SHORT } from "@/lib/plan/types";

const SLOTS: SlotKey[] = ["breakfast", "lunch", "snack", "dinner"];

function stripJsonFence(s: string): string {
  let t = s.trim();
  if (t.startsWith("```")) {
    t = t
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/m, "")
      .trim();
  }
  return t;
}

function isMealOption(v: unknown): v is MealOption {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.name === "string" &&
    o.name.trim().length > 0 &&
    typeof o.note === "string"
  );
}

function pickMeal(v: unknown): MealOption | null {
  if (!isMealOption(v)) return null;
  return { name: v.name.trim(), note: v.note.trim() };
}

export function parseDailyPlanJson(raw: unknown): DailyPlan | null {
  if (typeof raw !== "object" || raw === null) return null;
  const o = raw as Record<string, unknown>;
  const plan = {} as DailyPlan;
  for (const slot of SLOTS) {
    const m = pickMeal(o[slot]);
    if (!m) return null;
    plan[slot] = m;
  }
  return plan;
}

export function parseOpenAiDailyContent(content: string): DailyPlan | null {
  try {
    const parsed: unknown = JSON.parse(stripJsonFence(content));
    return parseDailyPlanJson(parsed);
  } catch {
    return null;
  }
}

const DAY_ALIASES: Record<string, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
  mon: 0,
  tue: 1,
  wed: 2,
  thu: 3,
  fri: 4,
  sat: 5,
  sun: 6,
};

function dayIndexFromLabel(label: string): number {
  const k = label.trim().toLowerCase();
  if (k in DAY_ALIASES) return DAY_ALIASES[k]!;
  const m = /^day\s*(\d+)/i.exec(label);
  if (m) {
    const n = Number.parseInt(m[1], 10);
    if (n >= 1 && n <= 7) return n - 1;
  }
  return -1;
}

export function parseWeeklyPlanJson(raw: unknown): WeeklyPlanDay[] | null {
  if (typeof raw !== "object" || raw === null) return null;
  const root = raw as Record<string, unknown>;
  const days = root.days;
  if (!Array.isArray(days) || days.length === 0) return null;

  if (days.length >= 7) {
    const slice = days.slice(0, 7);
    const sequential: DailyPlan[] = [];
    for (const row of slice) {
      if (typeof row !== "object" || row === null) return null;
      const d = row as Record<string, unknown>;
      const plan = {} as DailyPlan;
      for (const slot of SLOTS) {
        const m = pickMeal(d[slot]);
        if (!m) return null;
        plan[slot] = m;
      }
      sequential.push(plan);
    }
    return WEEKDAY_SHORT.map((key, i) => ({
      key,
      label: WEEKDAY_FULL_LABEL[key],
      plan: sequential[i],
    }));
  }

  const byIndex: (DailyPlan | null)[] = Array(7).fill(null);

  for (const row of days) {
    if (typeof row !== "object" || row === null) continue;
    const d = row as Record<string, unknown>;
    const dayLabel = typeof d.day === "string" ? d.day : "";
    let idx = dayIndexFromLabel(dayLabel);
    if (idx < 0) {
      const firstEmpty = byIndex.findIndex((x) => x === null);
      if (firstEmpty >= 0) idx = firstEmpty;
      else continue;
    }
    if (idx > 6) continue;
    const plan = {} as DailyPlan;
    let ok = true;
    for (const slot of SLOTS) {
      const m = pickMeal(d[slot]);
      if (!m) {
        ok = false;
        break;
      }
      plan[slot] = m;
    }
    if (ok) byIndex[idx] = plan;
  }

  if (byIndex.some((x) => x === null)) return null;

  return WEEKDAY_SHORT.map((key, i) => ({
    key,
    label: WEEKDAY_FULL_LABEL[key],
    plan: byIndex[i] as DailyPlan,
  }));
}

export function parseOpenAiWeeklyContent(content: string): WeeklyPlanDay[] | null {
  try {
    const parsed: unknown = JSON.parse(stripJsonFence(content));
    return parseWeeklyPlanJson(parsed);
  } catch {
    return null;
  }
}
