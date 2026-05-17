export type DietPreference =
  | "vegetarian"
  | "eggetarian"
  | "non_vegetarian"
  | "jain";

export type CookingTimeBand =
  | "under_30"
  | "30_to_45"
  | "45_to_60"
  | "60_plus";

export type BudgetPeriod = "weekly" | "monthly";

export type UserProfile = {
  name: string;
  city: string;
  stateOrRegion: string;
  diet: DietPreference | "";
  familyMembers: string;
  hasKids: boolean;
  hasElderly: boolean;
  cookingTime: CookingTimeBand | "";
  budgetPeriod: BudgetPeriod | "";
  budgetAmount: string;
  preferredCuisine: string;
};
