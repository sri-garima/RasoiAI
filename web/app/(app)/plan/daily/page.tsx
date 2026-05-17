import type { Metadata } from "next";

import { DailyPlanClient } from "@/components/plan/DailyPlanClient";

export const metadata: Metadata = {
  title: "Daily plan — RasoiAI",
  description: "Rule-based breakfast, lunch, snack, and dinner preview from your profile.",
};

export default function PlanDailyPage() {
  return <DailyPlanClient />;
}
