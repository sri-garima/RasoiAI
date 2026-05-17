"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";

type FloatingBadgeProps = {
  icon: LucideIcon;
  label: string;
  className?: string;
  delay?: number;
};

export function FloatingBadge({
  icon: Icon,
  label,
  className,
  delay = 0,
}: FloatingBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "pointer-events-none select-none rounded-2xl border border-white/60 bg-white/45 px-3 py-2 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.18)] backdrop-blur-md sm:pointer-events-auto sm:px-3.5 sm:py-2.5",
        className,
      )}
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay * 0.4,
        }}
        className="flex items-center gap-2"
      >
        <span className="flex size-8 items-center justify-center rounded-xl bg-light-peach/90 text-deep-green ring-1 ring-orange-accent/25">
          <Icon className="size-4" strokeWidth={2} aria-hidden />
        </span>
        <span className="max-w-[9.5rem] text-[11px] font-semibold leading-snug text-stone-800 sm:max-w-[11rem] sm:text-xs">
          {label}
        </span>
      </motion.div>
    </motion.div>
  );
}
