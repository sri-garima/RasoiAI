"use client";

import { startTransition, useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { EMPTY_PROFILE } from "@/lib/profile/defaults";
import { loadProfile, saveProfile } from "@/lib/profile/storage";
import type { UserProfile } from "@/lib/profile/types";
import { validateProfile, type ProfileFieldErrors } from "@/lib/profile/validate";
import { cn } from "@/lib/cn";

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

function inputClass(invalid: boolean) {
  return cn(
    "w-full rounded-xl border bg-white/90 px-4 py-3 text-[15px] text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400",
    invalid
      ? "border-red-400 ring-2 ring-red-100"
      : "border-stone-200 focus:border-deep-green focus:ring-2 focus:ring-deep-green/25",
  );
}

export function ProfileForm() {
  const baseId = useId();
  const [hydrated, setHydrated] = useState(false);
  const [values, setValues] = useState<UserProfile>(EMPTY_PROFILE);
  const [errors, setErrors] = useState<ProfileFieldErrors>({});
  const [savedFlash, setSavedFlash] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth?redirect=/profile");
      return;
    }
    if (user) {
      startTransition(() => {
        setValues(loadProfile());
        setHydrated(true);
      });
    }
  }, [user, isLoading, router]);

  function set<K extends keyof UserProfile>(key: K, v: UserProfile[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validateProfile(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const normalized: UserProfile = {
      ...values,
      name: values.name.trim(),
      city: values.city.trim(),
      stateOrRegion: values.stateOrRegion.trim(),
      familyMembers: String(Number.parseInt(values.familyMembers, 10)),
      budgetAmount: values.budgetAmount.trim().replace(/,/g, ""),
      preferredCuisine: values.preferredCuisine.trim(),
    };
    saveProfile(normalized);
    setValues(normalized);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 3200);
  }

  if (!hydrated || isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-10 sm:px-6" aria-busy="true">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-stone-200/80" />
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-stone-200/60" />
      </div>
    );
  }

  const cuisineOptionValues = new Set<string>(
    CUISINE_OPTIONS.map((o) => o.value).filter((v) => v.length > 0),
  );
  const trimmedCuisine = values.preferredCuisine.trim();
  const cuisineExtra =
    trimmedCuisine && !cuisineOptionValues.has(trimmedCuisine)
      ? ([{ value: trimmedCuisine, label: trimmedCuisine }] as const)
      : ([] as const);
  const cuisineSelectOptions = [...CUISINE_OPTIONS, ...cuisineExtra];

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-6 sm:py-12">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-deep-green">
          Your household
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          Profile
        </h1>
        <p className="mt-3 text-stone-600">
          Tell RasoiAI who you cook for and how your kitchen runs. This stays on
          this device until you add sign-in later.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-[1.5rem] border border-stone-200/80 bg-white/90 p-6 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.15)] sm:p-8"
        noValidate
      >
        <div className="space-y-6">
          <Field
            label="Name"
            id={`${baseId}-name`}
            error={errors.name}
            input={
              <input
                id={`${baseId}-name`}
                name="name"
                type="text"
                autoComplete="name"
                className={inputClass(Boolean(errors.name))}
                value={values.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Ananya"
              />
            }
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              label="City"
              id={`${baseId}-city`}
              error={errors.city}
              input={
                <input
                  id={`${baseId}-city`}
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  className={inputClass(Boolean(errors.city))}
                  value={values.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="e.g. Lucknow"
                />
              }
            />
            <Field
              label="State / region"
              id={`${baseId}-state`}
              error={errors.stateOrRegion}
              input={
                <input
                  id={`${baseId}-state`}
                  name="stateOrRegion"
                  type="text"
                  autoComplete="address-level1"
                  className={inputClass(Boolean(errors.stateOrRegion))}
                  value={values.stateOrRegion}
                  onChange={(e) => set("stateOrRegion", e.target.value)}
                  placeholder="e.g. Uttar Pradesh"
                />
              }
            />
          </div>

          <Field
            label="Diet"
            id={`${baseId}-diet`}
            error={errors.diet}
            input={
              <select
                id={`${baseId}-diet`}
                name="diet"
                className={inputClass(Boolean(errors.diet))}
                value={values.diet}
                onChange={(e) =>
                  set("diet", e.target.value as UserProfile["diet"])
                }
              >
                <option value="">Select…</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="eggetarian">Eggetarian</option>
                <option value="non_vegetarian">Non-vegetarian</option>
                <option value="jain">Jain</option>
              </select>
            }
          />

          <Field
            label="Family members"
            id={`${baseId}-family`}
            hint="People you usually cook for at home."
            error={errors.familyMembers}
            input={
              <input
                id={`${baseId}-family`}
                name="familyMembers"
                type="number"
                min={1}
                max={20}
                inputMode="numeric"
                className={inputClass(Boolean(errors.familyMembers))}
                value={values.familyMembers}
                onChange={(e) => set("familyMembers", e.target.value)}
              />
            }
          />

          <fieldset className="rounded-xl border border-stone-100 bg-cream/50 px-4 py-4">
            <legend className="px-1 text-sm font-semibold text-stone-800">
              Household
            </legend>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:gap-8">
              <label className="flex cursor-pointer items-center gap-3 text-[15px] text-stone-700">
                <input
                  type="checkbox"
                  checked={values.hasKids}
                  onChange={(e) => set("hasKids", e.target.checked)}
                  className="size-4 rounded border-stone-300 text-deep-green focus:ring-deep-green/40"
                />
                Kids at home
              </label>
              <label className="flex cursor-pointer items-center gap-3 text-[15px] text-stone-700">
                <input
                  type="checkbox"
                  checked={values.hasElderly}
                  onChange={(e) => set("hasElderly", e.target.checked)}
                  className="size-4 rounded border-stone-300 text-deep-green focus:ring-deep-green/40"
                />
                Elderly members
              </label>
            </div>
          </fieldset>

          <Field
            label="Cooking time available (most days)"
            id={`${baseId}-cook`}
            error={errors.cookingTime}
            input={
              <select
                id={`${baseId}-cook`}
                name="cookingTime"
                className={inputClass(Boolean(errors.cookingTime))}
                value={values.cookingTime}
                onChange={(e) =>
                  set("cookingTime", e.target.value as UserProfile["cookingTime"])
                }
              >
                <option value="">Select…</option>
                <option value="under_30">Under 30 minutes</option>
                <option value="30_to_45">30–45 minutes</option>
                <option value="45_to_60">45–60 minutes</option>
                <option value="60_plus">60+ minutes (weekends / help at home)</option>
              </select>
            }
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              label="Food budget"
              id={`${baseId}-budgetPeriod`}
              error={errors.budgetPeriod}
              input={
                <select
                  id={`${baseId}-budgetPeriod`}
                  name="budgetPeriod"
                  className={inputClass(Boolean(errors.budgetPeriod))}
                  value={values.budgetPeriod}
                  onChange={(e) =>
                    set(
                      "budgetPeriod",
                      e.target.value as UserProfile["budgetPeriod"],
                    )
                  }
                >
                  <option value="">Select period…</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              }
            />
            <Field
              label="Amount (₹)"
              id={`${baseId}-budgetAmount`}
              hint="Rough grocery spend for meals at home."
              error={errors.budgetAmount}
              input={
                <input
                  id={`${baseId}-budgetAmount`}
                  name="budgetAmount"
                  type="text"
                  inputMode="decimal"
                  className={inputClass(Boolean(errors.budgetAmount))}
                  value={values.budgetAmount}
                  onChange={(e) => set("budgetAmount", e.target.value)}
                  placeholder="e.g. 8000"
                />
              }
            />
          </div>

          <Field
            label="Preferred cuisine"
            id={`${baseId}-cuisine`}
            error={errors.preferredCuisine}
            input={
              <select
                id={`${baseId}-cuisine`}
                name="preferredCuisine"
                className={inputClass(Boolean(errors.preferredCuisine))}
                value={values.preferredCuisine}
                onChange={(e) => set("preferredCuisine", e.target.value)}
              >
                {cuisineSelectOptions.map((o) => (
                  <option key={`${o.value}-${o.label}`} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            }
          />
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-2xl bg-deep-green px-8 py-3.5 text-sm font-semibold text-white shadow-[0_12px_36px_-14px_rgba(15,124,102,0.55)] transition hover:shadow-[0_14px_40px_-12px_rgba(15,124,102,0.6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-green"
          >
            Save profile
          </button>
          {savedFlash ? (
            <p
              className="text-sm font-medium text-deep-green"
              role="status"
              aria-live="polite"
            >
              Saved — your details will load again after refresh.
            </p>
          ) : (
            <p className="text-xs text-stone-500">
              Stored locally in your browser (localStorage).
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  id,
  hint,
  error,
  input,
}: {
  label: string;
  id: string;
  hint?: string;
  error?: string;
  input: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-stone-800">
        {label}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-stone-500">
          {hint}
        </p>
      ) : null}
      <div className={hint ? "mt-2" : "mt-1.5"}>{input}</div>
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
