import type { UserProfile } from "@/lib/profile/types";

export type ProfileFieldErrors = Partial<Record<keyof UserProfile, string>>;

const MAX_NAME = 80;
const MAX_CITY = 60;
const MAX_STATE = 60;
const MAX_CUISINE = 80;
const MAX_BUDGET = 500_000;

export function validateProfile(values: UserProfile): ProfileFieldErrors {
  const errors: ProfileFieldErrors = {};

  const name = values.name.trim();
  if (!name) errors.name = "Please enter your name.";
  else if (name.length > MAX_NAME)
    errors.name = `Name must be at most ${MAX_NAME} characters.`;

  const city = values.city.trim();
  if (!city) errors.city = "Please enter your city.";
  else if (city.length > MAX_CITY)
    errors.city = `City must be at most ${MAX_CITY} characters.`;

  const stateOrRegion = values.stateOrRegion.trim();
  if (!stateOrRegion) errors.stateOrRegion = "Please enter your state or region.";
  else if (stateOrRegion.length > MAX_STATE)
    errors.stateOrRegion = `State or region must be at most ${MAX_STATE} characters.`;

  if (!values.diet) errors.diet = "Choose a diet preference.";

  const n = Number.parseInt(values.familyMembers.trim(), 10);
  if (!values.familyMembers.trim())
    errors.familyMembers = "Enter how many people you usually cook for.";
  else if (!Number.isFinite(n) || Number.isNaN(n))
    errors.familyMembers = "Enter a whole number.";
  else if (n < 1) errors.familyMembers = "At least 1 family member.";
  else if (n > 20) errors.familyMembers = "At most 20 for this version.";

  if (!values.cookingTime) errors.cookingTime = "Select how much time you usually have.";

  if (!values.budgetPeriod) errors.budgetPeriod = "Choose weekly or monthly budget.";

  const budgetRaw = values.budgetAmount.trim().replace(/,/g, "");
  const budget = Number.parseFloat(budgetRaw);
  if (!budgetRaw) errors.budgetAmount = "Enter a budget amount in ₹.";
  else if (!Number.isFinite(budget) || budget <= 0)
    errors.budgetAmount = "Enter a positive number.";
  else if (budget > MAX_BUDGET)
    errors.budgetAmount = `Please enter an amount up to ₹${MAX_BUDGET.toLocaleString("en-IN")}.`;

  const cuisine = values.preferredCuisine.trim();
  if (!cuisine) errors.preferredCuisine = "Select or describe your preferred cuisine.";
  else if (cuisine.length > MAX_CUISINE)
    errors.preferredCuisine = `Keep this under ${MAX_CUISINE} characters.`;

  return errors;
}
