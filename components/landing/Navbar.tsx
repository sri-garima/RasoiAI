"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChefHat, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { CTAButton } from "@/components/landing/CTAButton";
import { SectionContainer } from "@/components/landing/SectionContainer";
import { cn } from "@/lib/cn";

const navLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#about", label: "About us" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background,backdrop-filter,box-shadow,border-color] duration-300",
        scrolled
          ? "border-stone-200/70 bg-cream/75 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.18)] backdrop-blur-xl"
          : "border-transparent bg-cream/40 backdrop-blur-md",
      )}
    >
      <SectionContainer as="div" className="relative flex h-[72px] items-center gap-4">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 text-deep-green"
          onClick={() => setOpen(false)}
        >
          <span className="flex size-10 items-center justify-center rounded-2xl bg-light-peach shadow-inner ring-1 ring-orange-accent/25 transition group-hover:scale-[1.03]">
            <ChefHat className="size-5 text-orange-accent" strokeWidth={2} aria-hidden />
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight sm:text-[1.35rem]">
            RasoiAI
          </span>
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 lg:flex"
          aria-label="Primary"
        >
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[15px] font-medium text-stone-600 transition hover:text-deep-green"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <Link
            href="/home"
            className="text-[15px] font-medium text-deep-green underline-offset-4 hover:underline"
          >
            My kitchen
          </Link>
          <CTAButton variant="primary" href="/home" trailingIcon={ArrowRight}>
            Start Planning
          </CTAButton>
        </div>

        <button
          type="button"
          className="ml-auto flex size-11 items-center justify-center rounded-2xl border border-stone-200/80 bg-white/80 text-stone-800 shadow-sm backdrop-blur-sm lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
          <span className="sr-only">Toggle menu</span>
        </button>
      </SectionContainer>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-stone-200/70 bg-cream/95 backdrop-blur-xl lg:hidden"
          >
            <SectionContainer as="div" className="flex flex-col gap-1 py-4">
              <Link
                href="/home"
                className="rounded-xl px-3 py-3 text-[15px] font-semibold text-deep-green hover:bg-white/70"
                onClick={() => setOpen(false)}
              >
                My kitchen
              </Link>
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-xl px-3 py-3 text-[15px] font-medium text-stone-700 hover:bg-white/70"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <div className="pt-2">
                <CTAButton
                  variant="primary"
                  className="w-full"
                  href="/home"
                  trailingIcon={ArrowRight}
                  onClick={() => setOpen(false)}
                >
                  Start Planning
                </CTAButton>
              </div>
            </SectionContainer>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
