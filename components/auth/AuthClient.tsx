"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";

export function AuthClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        // Optionally alert user to check email if email confirmations are enabled
        alert("Success! If you don't see an error, you are logged in or need to check your email.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
      
      router.push("/home");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl font-semibold text-stone-900">
          {isSignUp ? "Create an account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-stone-600">
          {isSignUp 
            ? "Sign up to sync your pantry and meal plans across devices." 
            : "Sign in to access your kitchen dashboard."}
        </p>
      </div>

      <form onSubmit={handleAuth} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-stone-800 mb-1.5">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-[15px] text-stone-900 shadow-sm outline-none transition focus:border-deep-green focus:ring-2 focus:ring-deep-green/25"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-stone-800 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-[15px] text-stone-900 shadow-sm outline-none transition focus:border-deep-green focus:ring-2 focus:ring-deep-green/25"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={cn(
            "mt-6 w-full inline-flex items-center justify-center rounded-xl bg-deep-green px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-deep-green/90",
            loading && "opacity-70 cursor-not-allowed"
          )}
        >
          {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>

        <div className="mt-6 text-center text-sm">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-stone-500 hover:text-stone-800 underline underline-offset-4"
          >
            {isSignUp 
              ? "Already have an account? Sign in" 
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </form>
      
      <div className="mt-8 rounded-xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-900 text-center">
        <strong>Note:</strong> You must configure <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in your environment for authentication to work.
      </div>
    </div>
  );
}
