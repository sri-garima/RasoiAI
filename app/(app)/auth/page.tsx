import { AuthClient } from "@/components/auth/AuthClient";

export const metadata = {
  title: "Sign In | Rasoi AI",
  description: "Sign in to sync your Rasoi AI kitchen data.",
};

export default function AuthPage() {
  return <AuthClient />;
}
