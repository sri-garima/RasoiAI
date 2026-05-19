"use client";

import { startTransition, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, ChevronRight, Circle, ClipboardList, UtensilsCrossed } from "lucide-react";

import { loadProfile } from "@/lib/profile/storage";
import { loadPantry } from "@/lib/pantry/storage";
import { loadLastDailyPlan, loadLastWeeklyPlan } from "@/lib/plan/storage";
import { canGenerateDailyPlan } from "@/lib/plan/generate-daily";
import { cn } from "@/lib/cn";

export function HomeClient() {
  const [hydrated, setHydrated] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [hasPantry, setHasPantry] = useState(false);
  const [hasPlan, setHasPlan] = useState(false);

  useEffect(() => {
    startTransition(() => {
      const p = loadProfile();
      setHasProfile(canGenerateDailyPlan(p));
      
      const pa = loadPantry();
      setHasPantry(pa.length > 0);
      
      const daily = loadLastDailyPlan();
      const weekly = loadLastWeeklyPlan();
      setHasPlan(daily !== null || weekly !== null);
      
      setHydrated(true);
    });
  }, []);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-16" aria-busy="true">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-stone-200/80 mb-10" />
        <div className="space-y-4">
          <div className="h-24 animate-pulse rounded-2xl bg-stone-200/60" />
          <div className="h-24 animate-pulse rounded-2xl bg-stone-200/60" />
          <div className="h-24 animate-pulse rounded-2xl bg-stone-200/60" />
        </div>
      </div>
    );
  }

  const steps = [
    {
      id: "profile",
      title: "Set up your profile",
      description: "Tell us about your diet, family size, and cuisine preferences.",
      href: "/profile",
      icon: BookOpen,
      completed: hasProfile,
      cta: hasProfile ? "Edit profile" : "Start here",
    },
    {
      id: "pantry",
      title: "Add your pantry items",
      description: "List what's in your fridge so we can suggest meals using them.",
      href: "/pantry",
      icon: ClipboardList,
      completed: hasPantry,
      cta: hasPantry ? "Update pantry" : "Add ingredients",
    },
    {
      id: "plan",
      title: "Generate a meal plan",
      description: "Create a daily or weekly AI-powered meal plan.",
      href: "/plan/daily",
      icon: UtensilsCrossed,
      completed: hasPlan,
      cta: hasPlan ? "View plans" : "Generate now",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-16">
      <header className="mb-10 text-center sm:text-left">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-deep-green">
          Welcome to Rasoi AI
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
          {hasPlan ? "Your Kitchen Dashboard" : "Let's get cooking"}
        </h1>
        <p className="mt-4 text-stone-600 max-w-xl mx-auto sm:mx-0">
          {hasPlan 
            ? "You're all set! Check your grocery list or adjust your upcoming meals." 
            : "Follow these three steps to get your first personalized Indian meal plan."}
        </p>
      </header>

      <div className="space-y-4">
        {steps.map((step, idx) => {
          const isNextAction = !step.completed && (idx === 0 || steps[idx - 1].completed);
          
          return (
            <Link
              key={step.id}
              href={step.href}
              className={cn(
                "group block relative overflow-hidden rounded-2xl border p-5 sm:p-6 transition-all duration-300",
                step.completed 
                  ? "border-stone-200 bg-white shadow-sm hover:border-deep-green/30" 
                  : isNextAction 
                    ? "border-orange-accent/50 bg-light-peach/30 shadow-md ring-1 ring-orange-accent/20 hover:bg-light-peach/50" 
                    : "border-stone-200/50 bg-stone-50/50 opacity-80 hover:opacity-100"
              )}
            >
              <div className="flex items-center gap-4 sm:gap-6">
                <div className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-xl",
                  step.completed ? "bg-deep-green/10 text-deep-green" : isNextAction ? "bg-orange-accent/10 text-orange-accent" : "bg-stone-200/50 text-stone-400"
                )}>
                  <step.icon className="size-6" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className={cn("font-semibold text-lg truncate", step.completed ? "text-stone-900" : "text-stone-800")}>
                    {step.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-stone-500 truncate">
                    {step.description}
                  </p>
                </div>
                
                <div className="hidden sm:flex items-center gap-3 shrink-0">
                  <span className={cn(
                    "text-sm font-medium",
                    step.completed ? "text-deep-green" : isNextAction ? "text-orange-accent" : "text-stone-400"
                  )}>
                    {step.cta}
                  </span>
                  {step.completed ? (
                    <CheckCircle2 className="size-6 text-deep-green" />
                  ) : (
                    <Circle className={cn("size-6", isNextAction ? "text-orange-accent" : "text-stone-300")} />
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {hasPlan && (
        <div className="mt-10">
          <Link
            href="/grocery"
            className="group flex items-center justify-between rounded-2xl bg-deep-green px-6 py-5 text-white shadow-lg shadow-deep-green/20 transition hover:bg-deep-green/90"
          >
            <div>
              <h3 className="font-semibold text-lg">Go shopping</h3>
              <p className="mt-1 text-white/80 text-sm">View your smart grocery list based on your plan.</p>
            </div>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/20 transition group-hover:bg-white/30">
              <ArrowRight className="size-5" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
