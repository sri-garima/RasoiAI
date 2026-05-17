import type { Metadata } from "next";

import { ProfileForm } from "@/components/profile/ProfileForm";

export const metadata: Metadata = {
  title: "Profile — RasoiAI",
  description: "Your household, region, diet, and budget for smarter meal plans.",
};

export default function ProfilePage() {
  return <ProfileForm />;
}
