"use client";

import { motion } from "framer-motion";
import { Carrot, MapPin, UtensilsCrossed, Users } from "lucide-react";

import { SectionContainer } from "@/components/landing/SectionContainer";
import { cn } from "@/lib/cn";

const features = [
  {
    title: "Regional taste",
    description: "North, South, East, West—context that matters.",
    icon: MapPin,
    circle: "bg-emerald-100 text-emerald-700 ring-emerald-200/80",
  },
  {
    title: "Pantry-first",
    description: "Use what you already bought before it wilts.",
    icon: Carrot,
    circle: "bg-orange-100 text-orange-700 ring-orange-200/80",
  },
  {
    title: "Four meals a day",
    description: "Breakfast, lunch, snacks, dinner—one flow.",
    icon: UtensilsCrossed,
    circle: "bg-violet-100 text-violet-700 ring-violet-200/80",
  },
  {
    title: "Household-aware",
    description: "Family size, kids, elders, time, and budget.",
    icon: Users,
    circle: "bg-rose-100 text-rose-700 ring-rose-200/80",
  },
] as const;

export function FeatureStrip() {
  return (
    <SectionContainer id="how-it-works" className="pb-16 sm:pb-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-8 lg:p-10"
      >
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="group rounded-2xl p-1 transition-shadow hover:shadow-[0_16px_40px_-28px_rgba(15,124,102,0.35)]"
            >
              <div className="h-full rounded-2xl px-2 py-3 sm:px-3">
                <div
                  className={cn(
                    "mb-4 flex size-12 items-center justify-center rounded-2xl ring-1 shadow-sm transition group-hover:scale-[1.06]",
                    f.circle,
                  )}
                >
                  <f.icon className="size-6" strokeWidth={2} aria-hidden />
                </div>
                <h3 className="text-base font-semibold text-stone-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {f.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </SectionContainer>
  );
}
