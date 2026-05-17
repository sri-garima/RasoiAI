export type SlotKey = "breakfast" | "lunch" | "snack" | "dinner";

export type MealOption = {
  name: string;
  note: string;
};

export type DailyPlan = Record<SlotKey, MealOption>;

export const WEEKDAY_SHORT = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;

export type WeekdayShort = (typeof WEEKDAY_SHORT)[number];

export const WEEKDAY_FULL_LABEL: Record<WeekdayShort, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

export type WeeklyPlanDay = {
  key: WeekdayShort;
  label: string;
  plan: DailyPlan;
};
