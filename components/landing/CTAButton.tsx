"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";

type CTAButtonProps = {
  variant?: "primary" | "ghost";
  className?: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  trailingIcon?: LucideIcon;
  type?: "button" | "submit";
  onClick?: () => void;
  href?: string;
};

export function CTAButton({
  variant = "primary",
  className,
  children,
  icon: Icon,
  trailingIcon: Trailing,
  type = "button",
  onClick,
  href,
}: CTAButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-green";

  const styles =
    variant === "primary"
      ? "bg-deep-green text-white shadow-[0_12px_40px_-12px_rgba(15,124,102,0.55)] hover:shadow-[0_16px_48px_-12px_rgba(15,124,102,0.65)]"
      : "border border-stone-200/90 bg-white/70 text-stone-800 shadow-sm backdrop-blur-sm hover:border-orange-accent/40 hover:bg-white";

  const content = (
    <>
      {Icon ? <Icon className="size-4 shrink-0" strokeWidth={2} aria-hidden /> : null}
      {children}
      {Trailing ? <Trailing className="size-4 shrink-0" strokeWidth={2} aria-hidden /> : null}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        onClick={onClick}
        className={cn(base, styles, className)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={cn(base, styles, className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {content}
    </motion.button>
  );
}
