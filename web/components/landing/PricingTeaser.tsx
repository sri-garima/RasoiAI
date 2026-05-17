"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { CTAButton } from "@/components/landing/CTAButton";
import { SectionContainer } from "@/components/landing/SectionContainer";
import { cn } from "@/lib/cn";

const tiers = [
  {
    name: "Home",
    price: "₹0",
    blurb: "Explore the experience on your own pace.",
    perks: ["Guest-friendly", "Save plans locally", "Core meal slots"],
    highlight: false,
  },
  {
    name: "Family",
    price: "₹499",
    suffix: "/ mo",
    blurb: "For households planning together every week.",
    perks: ["Weekly AI plans", "Pantry-aware lists", "Regional nuance"],
    highlight: true,
  },
  {
    name: "Pro",
    price: "₹899",
    suffix: "/ mo",
    blurb: "Power users juggling work, kids, and elders.",
    perks: ["Priority generation", "Budget guardrails", "Coming: health modes"],
    highlight: false,
  },
] as const;

export function PricingTeaser() {
  return (
    <section id="pricing" className="bg-cream py-16 sm:py-20">
      <SectionContainer>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-deep-green">
            Pricing
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-stone-900 sm:text-4xl">
            Calm pricing for busy kitchens
          </h2>
          <p className="mt-4 text-stone-600">
            Start free, upgrade when RasoiAI becomes part of your weekly rhythm.
            Numbers shown are placeholders—tune them when you launch.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              whileHover={{ y: -4 }}
              className={cn(
                "flex flex-col rounded-[1.5rem] border bg-white/90 p-6 shadow-[0_20px_60px_-44px_rgba(0,0,0,0.25)] backdrop-blur-sm sm:p-7",
                tier.highlight
                  ? "border-deep-green/35 ring-2 ring-deep-green/20"
                  : "border-stone-200/80",
              )}
            >
              {tier.highlight ? (
                <span className="mb-3 w-fit rounded-full bg-light-peach px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-deep-green">
                  Most loved
                </span>
              ) : (
                <span className="mb-3 h-6" aria-hidden />
              )}
              <h3 className="font-serif text-xl font-semibold text-stone-900">
                {tier.name}
              </h3>
              <p className="mt-2 text-sm text-stone-600">{tier.blurb}</p>
              <p className="mt-6 font-serif text-4xl font-semibold text-deep-green">
                {tier.price}
                {"suffix" in tier ? (
                  <span className="text-base font-sans font-medium text-stone-500">
                    {tier.suffix}
                  </span>
                ) : null}
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-stone-700">
                {tier.perks.map((p) => (
                  <li key={p} className="flex gap-2">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-deep-green"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <CTAButton
                  variant={tier.highlight ? "primary" : "ghost"}
                  className="w-full"
                  href="#hero-cta"
                >
                  {tier.highlight ? "Start with Family" : "Learn more"}
                </CTAButton>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
