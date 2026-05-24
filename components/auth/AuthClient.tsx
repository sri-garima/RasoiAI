"use client";

import { useState, useEffect, useId } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/cn";
import { saveProfile } from "@/lib/profile/storage";
import { validateProfile } from "@/lib/profile/validate";
import type { DietPreference, CookingTimeBand, BudgetPeriod, UserProfile } from "@/lib/profile/types";

const CUISINE_OPTIONS = [
  { value: "", label: "Select cuisine…" },
  { value: "North Indian", label: "North Indian" },
  { value: "South Indian", label: "South Indian" },
  { value: "Bengali & Eastern", label: "Bengali & Eastern" },
  { value: "Maharashtrian", label: "Maharashtrian" },
  { value: "Gujarati", label: "Gujarati" },
  { value: "Punjabi", label: "Punjabi" },
  { value: "Hyderabadi / Deccan", label: "Hyderabadi / Deccan" },
  { value: "Coastal / Goan", label: "Coastal / Goan" },
  { value: "Indo-Chinese home style", label: "Indo-Chinese home style" },
  { value: "Pan-Indian (mixed)", label: "Pan-Indian (mixed)" },
  { value: "Other / multicultural", label: "Other / multicultural" },
] as const;

export function AuthClient() {
  const baseId = useId();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const supabase = createClient();

  const redirect = searchParams.get("redirect") || "/profile";

  // Navigation states
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Status messages
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states - Credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Form states - Profile details (used during Sign Up)
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [stateOrRegion, setStateOrRegion] = useState("");
  const [diet, setDiet] = useState<DietPreference | "">("");
  const [familyMembers, setFamilyMembers] = useState("2");
  const [hasKids, setHasKids] = useState(false);
  const [hasElderly, setHasElderly] = useState(false);
  const [cookingTime, setCookingTime] = useState<CookingTimeBand | "">("");
  const [budgetPeriod, setBudgetPeriod] = useState<BudgetPeriod | "">("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [preferredCuisine, setPreferredCuisine] = useState("");

  // Validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && user && !isForgotPassword) {
      router.push(redirect);
    }
  }, [user, authLoading, redirect, router, isForgotPassword]);

  // Clean error states when toggling views
  const resetFormState = () => {
    setError(null);
    setSuccess(null);
    setFieldErrors({});
  };

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    const newFieldErrors: Record<string, string> = {};

    // Validate Credentials
    if (!email) {
      newFieldErrors.email = "Email is required.";
    }
    if (!password) {
      newFieldErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newFieldErrors.password = "Password must be at least 6 characters.";
    }

    const profileData: UserProfile = {
      name: name.trim(),
      city: city.trim(),
      stateOrRegion: stateOrRegion.trim(),
      diet,
      familyMembers,
      hasKids,
      hasElderly,
      cookingTime,
      budgetPeriod,
      budgetAmount,
      preferredCuisine: preferredCuisine.trim(),
    };

    // If signing up, validate the whole profile
    if (isSignUp) {
      const errors = validateProfile(profileData);
      Object.assign(newFieldErrors, errors);
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      setLoading(false);
      
      // Scroll to the first error input
      const firstErrorKey = Object.keys(newFieldErrors)[0];
      const errorElement = document.getElementById(`${baseId}-${firstErrorKey}`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://mock.supabase.co";
    if (!isConfigured) {
      setError("Supabase is not configured. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file, and restart your development server (npm run dev).");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;

        // Save profile locally (will sync once logged in)
        saveProfile(profileData);

        if (data.session) {
          // Immediately logged in
          setSuccess("Account created successfully!");
          router.push(redirect);
          router.refresh();
        } else {
          // Requires email verification
          setSuccess("Sign up successful! Please check your email inbox to confirm your account.");
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        
        router.push(redirect);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    if (!email) {
      setFieldErrors({ email: "Email is required to reset password." });
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
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (resetError) throw resetError;
      setSuccess("A password reset link has been sent to your email address. Please check your inbox.");
    } catch (err: any) {
      setError(err.message || "An error occurred while requesting password reset.");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 sm:px-6 text-center animate-pulse" aria-busy="true">
        <div className="h-8 w-40 rounded-lg bg-stone-200/80 mx-auto" />
        <div className="mt-6 h-64 rounded-2xl bg-stone-200/60" />
      </div>
    );
  }

  return (
    <div className={cn(
      "mx-auto px-5 py-16 sm:px-6 transition-all duration-300",
      isSignUp ? "max-w-2xl" : "max-w-md"
    )}>
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl font-semibold text-stone-900">
          {isForgotPassword 
            ? "Reset password" 
            : isSignUp 
              ? "Create your kitchen account" 
              : "Welcome back"}
        </h1>
        <p className="mt-2 text-stone-600 text-sm sm:text-base">
          {isForgotPassword
            ? "Enter your email address to receive a secure password reset link."
            : isSignUp 
              ? "Sign up to sync your pantry, kitchen profile, and meal plans across devices." 
              : "Sign in to access your kitchen dashboard."}
        </p>
      </div>

      {isForgotPassword ? (
        // --- FORGOT PASSWORD FORM ---
        <form onSubmit={handleForgotPassword} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="space-y-4">
            <div>
              <label htmlFor={`${baseId}-email`} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Email address
              </label>
              <input
                id={`${baseId}-email`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={cn(
                  "w-full rounded-xl border px-4 py-3 text-[15px] text-stone-900 shadow-sm outline-none transition focus:ring-2 focus:ring-deep-green/25",
                  fieldErrors.email 
                    ? "border-red-400 focus:border-red-500" 
                    : "border-stone-200 focus:border-deep-green"
                )}
                placeholder="you@example.com"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </p>
          )}

          {success && (
            <p className="mt-4 text-sm text-deep-green bg-green-50 p-3 rounded-lg border border-green-100">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "mt-6 w-full inline-flex items-center justify-center rounded-xl bg-deep-green px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-deep-green/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-green",
              loading && "opacity-70 cursor-not-allowed"
            )}
          >
            {loading ? "Sending reset link..." : "Send Reset Link"}
          </button>

          <div className="mt-6 text-center text-sm">
            <button
              type="button"
              onClick={() => {
                resetFormState();
                setIsForgotPassword(false);
              }}
              className="text-stone-500 hover:text-stone-800 underline underline-offset-4"
            >
              Back to Sign In
            </button>
          </div>
        </form>
      ) : (
        // --- SIGN IN OR SIGN UP FORM ---
        <form onSubmit={handleAuth} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8" noValidate>
          
          {/* Section: Credentials */}
          <div className="border-b border-stone-100 pb-6 mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-deep-green mb-4">
              1. Account details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`${baseId}-email`} className="block text-sm font-semibold text-stone-800 mb-1.5">
                  Email address
                </label>
                <input
                  id={`${baseId}-email`}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={cn(
                    "w-full rounded-xl border bg-white/90 px-4 py-3 text-[15px] text-stone-900 shadow-sm outline-none transition focus:ring-2 focus:ring-deep-green/25",
                    fieldErrors.email 
                      ? "border-red-400 focus:border-red-500" 
                      : "border-stone-200 focus:border-deep-green"
                  )}
                  placeholder="you@example.com"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor={`${baseId}-password`} className="block text-sm font-semibold text-stone-800">
                    Password
                  </label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => {
                        resetFormState();
                        setIsForgotPassword(true);
                      }}
                      className="text-xs text-deep-green hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  id={`${baseId}-password`}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={cn(
                    "w-full rounded-xl border bg-white/90 px-4 py-3 text-[15px] text-stone-900 shadow-sm outline-none transition focus:ring-2 focus:ring-deep-green/25",
                    fieldErrors.password 
                      ? "border-red-400 focus:border-red-500" 
                      : "border-stone-200 focus:border-deep-green"
                  )}
                  placeholder={isSignUp ? "At least 6 characters" : "••••••••"}
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Profile Details (Only when signing up) */}
          {isSignUp && (
            <div className="space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-deep-green">
                2. Household & Cooking Profile
              </h2>
              
              {/* Name */}
              <div>
                <label htmlFor={`${baseId}-name`} className="block text-sm font-semibold text-stone-800 mb-1.5">
                  Full Name
                </label>
                <input
                  id={`${baseId}-name`}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={cn(
                    "w-full rounded-xl border bg-white/90 px-4 py-3 text-[15px] text-stone-900 shadow-sm outline-none transition focus:ring-2 focus:ring-deep-green/25",
                    fieldErrors.name 
                      ? "border-red-400 focus:border-red-500" 
                      : "border-stone-200 focus:border-deep-green"
                  )}
                  placeholder="e.g. Ananya Sharma"
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-sm text-red-600" id={`${baseId}-name-err`}>{fieldErrors.name}</p>
                )}
              </div>

              {/* City & State */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${baseId}-city`} className="block text-sm font-semibold text-stone-800 mb-1.5">
                    City
                  </label>
                  <input
                    id={`${baseId}-city`}
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className={cn(
                      "w-full rounded-xl border bg-white/90 px-4 py-3 text-[15px] text-stone-900 shadow-sm outline-none transition focus:ring-2 focus:ring-deep-green/25",
                      fieldErrors.city 
                        ? "border-red-400 focus:border-red-500" 
                        : "border-stone-200 focus:border-deep-green"
                    )}
                    placeholder="e.g. Lucknow"
                  />
                  {fieldErrors.city && (
                    <p className="mt-1 text-sm text-red-600" id={`${baseId}-city-err`}>{fieldErrors.city}</p>
                  )}
                </div>
                <div>
                  <label htmlFor={`${baseId}-stateOrRegion`} className="block text-sm font-semibold text-stone-800 mb-1.5">
                    State / Region
                  </label>
                  <input
                    id={`${baseId}-stateOrRegion`}
                    type="text"
                    value={stateOrRegion}
                    onChange={(e) => setStateOrRegion(e.target.value)}
                    required
                    className={cn(
                      "w-full rounded-xl border bg-white/90 px-4 py-3 text-[15px] text-stone-900 shadow-sm outline-none transition focus:ring-2 focus:ring-deep-green/25",
                      fieldErrors.stateOrRegion 
                        ? "border-red-400 focus:border-red-500" 
                        : "border-stone-200 focus:border-deep-green"
                    )}
                    placeholder="e.g. Uttar Pradesh"
                  />
                  {fieldErrors.stateOrRegion && (
                    <p className="mt-1 text-sm text-red-600" id={`${baseId}-stateOrRegion-err`}>{fieldErrors.stateOrRegion}</p>
                  )}
                </div>
              </div>

              {/* Diet & Family Members */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${baseId}-diet`} className="block text-sm font-semibold text-stone-800 mb-1.5">
                    Diet Preference
                  </label>
                  <select
                    id={`${baseId}-diet`}
                    value={diet}
                    onChange={(e) => setDiet(e.target.value as DietPreference)}
                    required
                    className={cn(
                      "w-full rounded-xl border bg-white/90 px-4 py-3 text-[15px] text-stone-900 shadow-sm outline-none transition focus:ring-2 focus:ring-deep-green/25",
                      fieldErrors.diet 
                        ? "border-red-400 focus:border-red-500" 
                        : "border-stone-200 focus:border-deep-green"
                    )}
                  >
                    <option value="">Select diet…</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="eggetarian">Eggetarian</option>
                    <option value="non_vegetarian">Non-vegetarian</option>
                    <option value="jain">Jain</option>
                  </select>
                  {fieldErrors.diet && (
                    <p className="mt-1 text-sm text-red-600" id={`${baseId}-diet-err`}>{fieldErrors.diet}</p>
                  )}
                </div>
                <div>
                  <label htmlFor={`${baseId}-familyMembers`} className="block text-sm font-semibold text-stone-800 mb-1.5">
                    Family Members
                  </label>
                  <input
                    id={`${baseId}-familyMembers`}
                    type="number"
                    min={1}
                    max={20}
                    value={familyMembers}
                    onChange={(e) => setFamilyMembers(e.target.value)}
                    required
                    className={cn(
                      "w-full rounded-xl border bg-white/90 px-4 py-3 text-[15px] text-stone-900 shadow-sm outline-none transition focus:ring-2 focus:ring-deep-green/25",
                      fieldErrors.familyMembers 
                        ? "border-red-400 focus:border-red-500" 
                        : "border-stone-200 focus:border-deep-green"
                    )}
                  />
                  {fieldErrors.familyMembers && (
                    <p className="mt-1 text-sm text-red-600" id={`${baseId}-familyMembers-err`}>{fieldErrors.familyMembers}</p>
                  )}
                </div>
              </div>

              {/* Household Legend */}
              <fieldset className="rounded-xl border border-stone-100 bg-cream/50 px-4 py-4">
                <legend className="px-1 text-sm font-semibold text-stone-800">
                  Household details
                </legend>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:gap-8">
                  <label className="flex cursor-pointer items-center gap-3 text-[15px] text-stone-700">
                    <input
                      type="checkbox"
                      checked={hasKids}
                      onChange={(e) => setHasKids(e.target.checked)}
                      className="size-4 rounded border-stone-300 text-deep-green focus:ring-deep-green/40"
                    />
                    Kids at home
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 text-[15px] text-stone-700">
                    <input
                      type="checkbox"
                      checked={hasElderly}
                      onChange={(e) => setHasElderly(e.target.checked)}
                      className="size-4 rounded border-stone-300 text-deep-green focus:ring-deep-green/40"
                    />
                    Elderly members
                  </label>
                </div>
              </fieldset>

              {/* Cooking Time Available */}
              <div>
                <label htmlFor={`${baseId}-cookingTime`} className="block text-sm font-semibold text-stone-800 mb-1.5">
                  Cooking Time Available (most days)
                </label>
                <select
                  id={`${baseId}-cookingTime`}
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value as CookingTimeBand)}
                  required
                  className={cn(
                    "w-full rounded-xl border bg-white/90 px-4 py-3 text-[15px] text-stone-900 shadow-sm outline-none transition focus:ring-2 focus:ring-deep-green/25",
                    fieldErrors.cookingTime 
                      ? "border-red-400 focus:border-red-500" 
                      : "border-stone-200 focus:border-deep-green"
                  )}
                >
                  <option value="">Select time…</option>
                  <option value="under_30">Under 30 minutes</option>
                  <option value="30_to_45">30–45 minutes</option>
                  <option value="45_to_60">45–60 minutes</option>
                  <option value="60_plus">60+ minutes (weekends / help at home)</option>
                </select>
                {fieldErrors.cookingTime && (
                  <p className="mt-1 text-sm text-red-600" id={`${baseId}-cookingTime-err`}>{fieldErrors.cookingTime}</p>
                )}
              </div>

              {/* Food Budget */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${baseId}-budgetPeriod`} className="block text-sm font-semibold text-stone-800 mb-1.5">
                    Food Budget Period
                  </label>
                  <select
                    id={`${baseId}-budgetPeriod`}
                    value={budgetPeriod}
                    onChange={(e) => setBudgetPeriod(e.target.value as BudgetPeriod)}
                    required
                    className={cn(
                      "w-full rounded-xl border bg-white/90 px-4 py-3 text-[15px] text-stone-900 shadow-sm outline-none transition focus:ring-2 focus:ring-deep-green/25",
                      fieldErrors.budgetPeriod 
                        ? "border-red-400 focus:border-red-500" 
                        : "border-stone-200 focus:border-deep-green"
                    )}
                  >
                    <option value="">Select period…</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  {fieldErrors.budgetPeriod && (
                    <p className="mt-1 text-sm text-red-600" id={`${baseId}-budgetPeriod-err`}>{fieldErrors.budgetPeriod}</p>
                  )}
                </div>
                <div>
                  <label htmlFor={`${baseId}-budgetAmount`} className="block text-sm font-semibold text-stone-800 mb-1.5">
                    Amount (₹)
                  </label>
                  <input
                    id={`${baseId}-budgetAmount`}
                    type="text"
                    inputMode="decimal"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    required
                    className={cn(
                      "w-full rounded-xl border bg-white/90 px-4 py-3 text-[15px] text-stone-900 shadow-sm outline-none transition focus:ring-2 focus:ring-deep-green/25",
                      fieldErrors.budgetAmount 
                        ? "border-red-400 focus:border-red-500" 
                        : "border-stone-200 focus:border-deep-green"
                    )}
                    placeholder="e.g. 8000"
                  />
                  {fieldErrors.budgetAmount && (
                    <p className="mt-1 text-sm text-red-600" id={`${baseId}-budgetAmount-err`}>{fieldErrors.budgetAmount}</p>
                  )}
                </div>
              </div>

              {/* Cuisine */}
              <div>
                <label htmlFor={`${baseId}-preferredCuisine`} className="block text-sm font-semibold text-stone-800 mb-1.5">
                  Preferred Cuisine
                </label>
                <select
                  id={`${baseId}-preferredCuisine`}
                  value={preferredCuisine}
                  onChange={(e) => setPreferredCuisine(e.target.value)}
                  required
                  className={cn(
                    "w-full rounded-xl border bg-white/90 px-4 py-3 text-[15px] text-stone-900 shadow-sm outline-none transition focus:ring-2 focus:ring-deep-green/25",
                    fieldErrors.preferredCuisine 
                      ? "border-red-400 focus:border-red-500" 
                      : "border-stone-200 focus:border-deep-green"
                  )}
                >
                  {CUISINE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                {fieldErrors.preferredCuisine && (
                  <p className="mt-1 text-sm text-red-600" id={`${baseId}-preferredCuisine-err`}>{fieldErrors.preferredCuisine}</p>
                )}
              </div>
            </div>
          )}

          {error && (
            <p className="mt-6 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </p>
          )}

          {success && (
            <p className="mt-6 text-sm text-deep-green bg-green-50 p-3 rounded-lg border border-green-100">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "mt-6 w-full inline-flex items-center justify-center rounded-xl bg-deep-green px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-deep-green/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-green",
              loading && "opacity-70 cursor-not-allowed"
            )}
          >
            {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>

          <div className="mt-6 text-center text-sm">
            <button
              type="button"
              onClick={() => {
                resetFormState();
                setIsSignUp(!isSignUp);
              }}
              className="text-stone-500 hover:text-stone-800 underline underline-offset-4"
            >
              {isSignUp 
                ? "Already have an account? Sign in" 
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      )}
      
      {(!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://mock.supabase.co") ? (
        <div className="mt-8 rounded-xl bg-red-50 border border-red-200 p-4 text-xs sm:text-sm text-red-900 text-center">
          <strong>⚠️ Supabase is not configured:</strong> Environment variables are missing or not loaded. 
          If you recently created or edited your <code>.env.local</code> file, please <strong>restart your development server</strong> (stop the running terminal process and run <code>npm run dev</code> again).
        </div>
      ) : (
        <div className="mt-8 rounded-xl bg-green-50 border border-green-200 p-4 text-xs sm:text-sm text-green-900 text-center">
          <strong>✓ Supabase is connected:</strong> Environment variables are loaded.
        </div>
      )}
    </div>
  );
}
