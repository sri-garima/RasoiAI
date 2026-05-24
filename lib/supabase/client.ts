import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-key";
  
  if (typeof window !== "undefined" && (url === "https://mock.supabase.co" || key === "mock-key")) {
    console.warn(
      "⚠️ Supabase is using mock credentials. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file, and RESTART your Next.js development server (npm run dev) to apply the changes."
    );
  }

  return createBrowserClient(url, key);
}
