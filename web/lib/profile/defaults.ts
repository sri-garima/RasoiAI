import type { UserProfile } from "@/lib/profile/types";

export const EMPTY_PROFILE: UserProfile = {
  name: "",
  city: "",
  stateOrRegion: "",
  diet: "",
  familyMembers: "",
  hasKids: false,
  hasElderly: false,
  cookingTime: "",
  budgetPeriod: "",
  budgetAmount: "",
  preferredCuisine: "",
};
