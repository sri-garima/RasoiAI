import { Suspense } from "react";
import { AuthClient } from "@/components/auth/AuthClient";

export const metadata = {
  title: "Sign In | Rasoi AI",
  description: "Sign in to sync your Rasoi AI kitchen data.",
};

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-md px-5 py-16 sm:px-6 text-center animate-pulse" aria-busy="true">
        <div className="h-8 w-40 rounded-lg bg-stone-200/80 mx-auto" />
        <div className="mt-6 h-64 rounded-2xl bg-stone-200/60 mx-auto" />
      </div>
    }>
      <AuthClient />
    </Suspense>
  );
}
