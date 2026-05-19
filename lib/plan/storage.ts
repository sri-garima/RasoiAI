import type { DailyPlan, WeeklyPlanDay } from "@/lib/plan/types";
import { pushDailyPlanToCloud, pushWeeklyPlanToCloud } from "@/lib/supabase/sync";

const DAILY_STORAGE_KEY = "rasoiai.plan.daily.v1";
const WEEKLY_STORAGE_KEY = "rasoiai.plan.weekly.v1";

export function loadLastDailyPlan(): DailyPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DAILY_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DailyPlan;
  } catch {
    return null;
  }
}

export function saveLastDailyPlan(plan: DailyPlan | null): void {
  if (typeof window === "undefined") return;
  if (!plan) {
    window.localStorage.removeItem(DAILY_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(plan));
  pushDailyPlanToCloud(plan).catch(console.error);
}

export function loadLastWeeklyPlan(): WeeklyPlanDay[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(WEEKLY_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WeeklyPlanDay[];
  } catch {
    return null;
  }
}

export function saveLastWeeklyPlan(plan: WeeklyPlanDay[] | null): void {
  if (typeof window === "undefined") return;
  if (!plan) {
    window.localStorage.removeItem(WEEKLY_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(WEEKLY_STORAGE_KEY, JSON.stringify(plan));
  pushWeeklyPlanToCloud(plan).catch(console.error);
}
