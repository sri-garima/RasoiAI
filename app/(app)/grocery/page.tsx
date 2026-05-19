import { GroceryClient } from "@/components/grocery/GroceryClient";

export const metadata = {
  title: "Grocery List | Rasoi AI",
  description: "Smart shopping list derived from your meal plan.",
};

export default function GroceryPage() {
  return <GroceryClient />;
}
