export type PantryCategory =
  | "vegetable"
  | "staple"
  | "protein"
  | "dairy"
  | "grocery"
  | "other";

export type PantryItem = {
  id: string;
  name: string;
  category: PantryCategory;
};
