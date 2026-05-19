import type { Metadata } from "next";

import { WeeklyPlanClient } from "@/components/plan/WeeklyPlanClient";

export const metadata: Metadata = {
  title: "Weekly plan — RasoiAI",
  description: "Seven-day breakfast through dinner preview from your profile and pantry.",
};

export default function PlanWeeklyPage() {
  return <WeeklyPlanClient />;
}
