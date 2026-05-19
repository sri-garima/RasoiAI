import type { Metadata } from "next";

import { PantryManager } from "@/components/pantry/PantryManager";

export const metadata: Metadata = {
  title: "Pantry — RasoiAI",
  description: "Vegetables and groceries you already have at home.",
};

export default function PantryPage() {
  return <PantryManager />;
}
