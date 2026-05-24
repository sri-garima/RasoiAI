import { Suspense } from "react";
import { UpdatePasswordClient } from "@/components/auth/UpdatePasswordClient";

export const metadata = {
  title: "Update Password | Rasoi AI",
  description: "Update your Rasoi AI kitchen account password.",
};

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-md px-5 py-16 sm:px-6 text-center animate-pulse" aria-busy="true">
        <div className="h-8 w-40 rounded-lg bg-stone-200/80 mx-auto" />
        <div className="mt-6 h-64 rounded-2xl bg-stone-200/60 mx-auto" />
      </div>
    }>
      <UpdatePasswordClient />
    </Suspense>
  );
}
