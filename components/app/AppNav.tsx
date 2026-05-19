"use client";

import { ChefHat, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/cn";

const appNav = [
  { href: "/home", label: "Home" },
  { href: "/profile", label: "Profile" },
  { href: "/pantry", label: "Pantry" },
  { href: "/plan/daily", label: "Plan (daily)" },
  { href: "/plan/weekly", label: "Plan (weekly)" },
  { href: "/grocery", label: "Grocery" },
] as const;

export function AppNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-cream/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[60px] max-w-6xl items-center gap-4 px-5 sm:px-6 lg:px-8">
        <Link
          href="/home"
          className="flex shrink-0 items-center gap-2 text-deep-green"
          onClick={() => setOpen(false)}
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-light-peach ring-1 ring-orange-accent/20">
            <ChefHat className="size-4 text-orange-accent" strokeWidth={2} aria-hidden />
          </span>
          <span className="font-serif text-lg font-semibold tracking-tight">RasoiAI</span>
        </Link>

        <nav
          className="hidden flex-1 flex-wrap items-center justify-center gap-1 lg:flex"
          aria-label="App"
        >
          {appNav.map((item) => (
            <AppNavLink
              key={item.href}
              href={item.href}
              label={item.label}
              active={pathname === item.href}
            />
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <Link
            href="/"
            className="hidden text-sm font-medium text-stone-500 underline-offset-4 hover:text-deep-green hover:underline lg:inline"
          >
            Marketing site
          </Link>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl border border-stone-200/80 bg-white/80 text-stone-800 shadow-sm lg:hidden"
            aria-expanded={open}
            aria-controls="app-mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="sr-only">Toggle app menu</span>
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="app-mobile-nav"
          className="border-t border-stone-200/70 bg-cream/95 px-5 py-3 backdrop-blur-xl lg:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {appNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-3 py-3 text-[15px] font-medium",
                  pathname === item.href
                    ? "bg-white text-deep-green shadow-sm ring-1 ring-stone-200/80"
                    : "text-stone-700 hover:bg-white/70",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/"
              className="mt-2 rounded-xl px-3 py-3 text-[15px] font-medium text-stone-500 hover:bg-white/70"
              onClick={() => setOpen(false)}
            >
              Marketing site
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function AppNavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-deep-green text-white shadow-sm"
          : "text-stone-600 hover:bg-white/80 hover:text-stone-900",
      )}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}
