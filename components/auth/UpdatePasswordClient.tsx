"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/cn";

export function UpdatePasswordClient() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();
  const { user, isLoading } = useAuth();
  const supabase = createClient();

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://mock.supabase.co";
    if (!isConfigured) {
      setError("Supabase is not configured. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file, and restart your development server (npm run dev).");
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });
      if (updateError) throw updateError;

      setSuccess("Your password has been successfully updated!");
      setTimeout(() => {
        router.push("/profile");
      }, 2500);
    } catch (err: any) {
      setError(err.message || "An error occurred while updating your password.");
    } finally {
      setLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 sm:px-6 text-center animate-pulse" aria-busy="true">
        <div className="h-8 w-40 rounded-lg bg-stone-200/80 mx-auto" />
        <div className="mt-6 h-64 rounded-2xl bg-stone-200/60" />
      </div>
    );
  }

  // If user is not authenticated, they don't have a valid recovery session
  if (!user) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 sm:px-6">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 text-center animate-fade-in">
          <h1 className="font-serif text-2xl font-semibold text-stone-900 mb-4">
            Invalid session
          </h1>
          <p className="text-stone-600 mb-6 text-sm">
            Your password reset link is invalid, expired, or you are not authorized. Please request a new link.
          </p>
          <button
            onClick={() => router.push("/auth")}
            className="w-full inline-flex items-center justify-center rounded-xl bg-deep-green px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-deep-green/90"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl font-semibold text-stone-900">
          Update password
        </h1>
        <p className="mt-2 text-stone-600 text-sm">
          Enter a strong, secure new password for your account.
        </p>
      </div>

      <form onSubmit={handleUpdatePassword} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-stone-800 mb-1.5">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="At least 6 characters"
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-[15px] text-stone-900 shadow-sm outline-none transition focus:border-deep-green focus:ring-2 focus:ring-deep-green/25"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-stone-800 mb-1.5">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-[15px] text-stone-900 shadow-sm outline-none transition focus:border-deep-green focus:ring-2 focus:ring-deep-green/25"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 animate-fade-in">
            {error}
          </p>
        )}

        {success && (
          <p className="mt-4 text-sm text-deep-green bg-green-50 p-3 rounded-lg border border-green-100 animate-fade-in">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !!success}
          className={cn(
            "mt-6 w-full inline-flex items-center justify-center rounded-xl bg-deep-green px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-deep-green/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-green",
            (loading || !!success) && "opacity-70 cursor-not-allowed"
          )}
        >
          {loading ? "Updating password..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
