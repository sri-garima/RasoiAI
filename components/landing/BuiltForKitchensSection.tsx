"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Clock3, IndianRupee, MapPin, ShoppingBasket, Users } from "lucide-react";

import { SectionContainer } from "@/components/landing/SectionContainer";

const mockProfile = [
  { label: "Family size", value: "4 members", icon: Users },
  { label: "Diet", value: "Vegetarian", icon: ShoppingBasket },
  { label: "Region", value: "North India", icon: MapPin },
] as const;

const mockPantry = [
  { label: "Bought this week", value: "8 items", icon: ShoppingBasket },
  { label: "Cooking time", value: "30–45 mins", icon: Clock3 },
  { label: "Budget", value: "₹1,200 / week", icon: IndianRupee },
] as const;

function MockCard({
  title,
  rows,
}: {
  title: string;
  rows: readonly { label: string; value: string; icon: LucideIcon }[];
}) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      className="rounded-[1.35rem] border border-white/80 bg-white/90 p-5 shadow-[0_18px_50px_-34px_rgba(0,0,0,0.22)] ring-1 ring-stone-200/60 backdrop-blur-md"
    >
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-accent">
        {title}
      </p>
      <ul className="mt-4 space-y-3">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex items-center justify-between gap-3 rounded-xl bg-cream/80 px-3 py-2.5 ring-1 ring-stone-100"
          >
            <span className="flex items-center gap-2 text-[13px] font-medium text-stone-600">
              <row.icon className="size-4 text-deep-green" strokeWidth={2} aria-hidden />
              {row.label}
            </span>
            <span className="text-[13px] font-semibold text-stone-900">{row.value}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function BuiltForKitchensSection() {
  return (
    <section
      id="features"
      className="relative overflow-hidden border-y border-stone-200/50 bg-gradient-to-b from-cream via-[#fffdfb] to-soft-beige/50 py-16 sm:py-20"
    >
      <div
        className="pointer-events-none absolute -left-24 top-1/2 size-72 -translate-y-1/2 rounded-full bg-light-peach/50 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 size-64 rounded-full bg-deep-green/10 blur-3xl"
        aria-hidden
      />

      <SectionContainer className="relative grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-accent">
            Built for real kitchens
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-4xl lg:text-[2.65rem]">
            From what you have to what you will cook
          </h2>
          <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-stone-600">
            Tell RasoiAI who eats at your table, what is in your pantry, and how
            busy the week looks. It returns plans that feel{" "}
            <span className="font-medium text-stone-800">familiar, doable,</span>{" "}
            and kind to your time—whether you are feeding toddlers, elders, or
            just yourself after a long commute.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none"
        >
          <div className="relative z-10 flex flex-col gap-5 pl-0 sm:pl-4 lg:pl-8">
            <MockCard title="Tell us about you" rows={mockProfile} />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 }}
              className="lg:-ml-6"
            >
              <MockCard title="Your pantry & preferences" rows={mockPantry} />
            </motion.div>
          </div>
          <div
            className="pointer-events-none absolute -right-8 bottom-4 hidden h-24 w-24 rounded-full bg-orange-accent/15 ring-1 ring-orange-accent/25 sm:block lg:-right-4"
            aria-hidden
          />
        </motion.div>
      </SectionContainer>
    </section>
  );
}
