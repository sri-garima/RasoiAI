"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock3,
  HeartHandshake,
  Home,
  IndianRupee,
  Leaf,
  Play,
  Sparkles,
  Star,
} from "lucide-react";
import Image from "next/image";

import { CTAButton } from "@/components/landing/CTAButton";
import { FloatingBadge } from "@/components/landing/FloatingBadge";
import { SectionContainer } from "@/components/landing/SectionContainer";

/** Warm overhead Indian meal spread — Unsplash (replace with your brand asset anytime). */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=1200&q=85";

const avatars = [
  { initials: "A", from: "from-rose-200", to: "to-orange-200" },
  { initials: "R", from: "from-amber-200", to: "to-yellow-100" },
  { initials: "M", from: "from-emerald-200", to: "to-teal-100" },
  { initials: "S", from: "from-violet-200", to: "to-purple-100" },
] as const;

export function HeroSection() {
  return (
    <SectionContainer className="pb-16 pt-8 sm:pb-20 sm:pt-10 lg:pb-24 lg:pt-12">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl lg:max-w-none"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-accent/25 bg-light-peach/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-deep-green shadow-sm backdrop-blur-sm sm:text-xs">
            <Sparkles className="size-3.5 text-orange-accent" aria-hidden />
            AI-Powered Kitchen Copilot
          </div>

          <h1 className="mt-6 font-serif text-[2.35rem] font-semibold leading-[1.12] tracking-tight text-stone-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
            Plan Indian meals your family will{" "}
            <span className="relative inline-block">
              <span className="font-serif italic text-deep-green">actually</span>
              <svg
                className="pointer-events-none absolute -bottom-1 left-0 w-full text-orange-accent/90"
                viewBox="0 0 120 10"
                aria-hidden
                preserveAspectRatio="none"
              >
                <path
                  d="M2 7C28 2 52 2 78 4.5C96 6 108 7 118 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            want to eat.
          </h1>

          <p className="mt-6 text-[17px] leading-relaxed text-stone-600 sm:text-lg">
            RasoiAI answers{" "}
            <span className="font-medium text-stone-800">
              &ldquo;Aaj khane mein kya banana hai?&rdquo;
            </span>{" "}
            with calm, personalized plans—rooted in your region, diet, pantry,
            time, and budget—so weeknights feel lighter for everyone who runs
            the kitchen.
          </p>

          <div id="hero-cta" className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <CTAButton variant="primary" trailingIcon={ArrowRight}>
              Start planning now
            </CTAButton>
            <CTAButton variant="ghost" icon={Play} href="#how-it-works">
              See how it works
            </CTAButton>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex -space-x-3">
              {avatars.map((a) => (
                <div
                  key={a.initials}
                  className={`flex size-11 items-center justify-center rounded-full border-2 border-cream bg-gradient-to-br ${a.from} ${a.to} text-sm font-bold text-stone-700 shadow-sm`}
                  aria-hidden
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
              <p className="text-sm font-semibold text-stone-800">
                Loved by 2,500+ Indian families
              </p>
              <div className="flex items-center gap-1.5">
                <div className="flex text-orange-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-orange-accent text-orange-accent"
                      aria-hidden
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-stone-700">4.9/5</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none"
        >
          <Leaf
            className="pointer-events-none absolute -left-2 top-[18%] size-14 rotate-[-35deg] text-deep-green/25 sm:-left-4 sm:size-16"
            aria-hidden
          />
          <Leaf
            className="pointer-events-none absolute -right-1 bottom-[22%] size-12 rotate-[25deg] text-deep-green/20 sm:right-2 sm:size-14"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute -right-4 top-1/4 size-2 rounded-full bg-orange-accent/40 shadow-[0_0_0_6px_rgba(255,159,67,0.12)]"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute bottom-1/3 left-0 size-1.5 rounded-full bg-deep-green/35"
            aria-hidden
          />

          <div className="absolute left-2 top-6 z-20 sm:left-0 sm:top-10 lg:-left-2">
            <FloatingBadge icon={Home} label="Made for Indian kitchens" delay={0.1} />
          </div>
          <div className="absolute right-0 top-[28%] z-20 sm:right-2 lg:-right-2">
            <FloatingBadge
              icon={Clock3}
              label="Saves time & mental load"
              delay={0.2}
            />
          </div>
          <div className="absolute bottom-[18%] left-0 z-20 sm:bottom-[20%] lg:-left-4">
            <FloatingBadge
              icon={HeartHandshake}
              label="Personalized for your family"
              delay={0.28}
            />
          </div>
          <div className="absolute bottom-8 right-2 z-20 sm:bottom-10 sm:right-4 lg:bottom-12">
            <FloatingBadge
              icon={IndianRupee}
              label="Respects your budget"
              delay={0.36}
            />
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-light-peach via-soft-beige to-cream p-3 shadow-[0_28px_80px_-40px_rgba(15,124,102,0.45)] ring-1 ring-stone-200/60 sm:p-4">
            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[1.35rem] bg-stone-100 shadow-inner ring-1 ring-white/70">
              <Image
                src={HERO_IMAGE}
                alt="Overhead view of a traditional Indian thali with rice, curries, and bread"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-900/10 via-transparent to-white/10" />
            </div>
          </div>
        </motion.div>
      </div>
    </SectionContainer>
  );
}
