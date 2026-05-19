"use client";

import { motion } from "framer-motion";

import { SectionContainer } from "@/components/landing/SectionContainer";

export function AboutTeaser() {
  return (
    <section id="about" className="border-t border-stone-200/60 bg-white/70 py-16 backdrop-blur-sm sm:py-20">
      <SectionContainer>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-deep-green">
            About us
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-stone-900 sm:text-4xl">
            Built for the people who hold the kitchen together
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-stone-600">
            RasoiAI is for working professionals, homemakers, and everyone who
            carries the invisible load of feeding a family well—without endless
            scrolling, guilt over wasted sabzi, or the same three dishes on loop.
            We combine thoughtful AI with Indian food culture so planning feels
            supportive, not robotic.
          </p>
        </motion.div>
      </SectionContainer>
    </section>
  );
}
