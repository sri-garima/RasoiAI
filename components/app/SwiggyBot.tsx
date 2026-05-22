"use client";

import { useState, useEffect } from "react";
import { Bot, X, ExternalLink, MessageSquare, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function SwiggyBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Show a gentle tooltip to grab attention after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowTooltip(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[320px] overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl ring-1 ring-black/5"
          >
            <div className="flex items-center justify-between bg-deep-green px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <Bot className="size-5" />
                <span className="font-semibold">Rasoi Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 transition hover:bg-white/20"
                aria-label="Close chat"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="p-5">
              <div className="flex gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-light-peach text-orange-accent">
                  <Sparkles className="size-4" />
                </div>
                <div className="rounded-2xl rounded-tl-none bg-stone-100 p-3 text-[15px] text-stone-800">
                  <p>
                    I sense that you don't want to cook today... Let's be real, we all have those days! 😅
                  </p>
                  <p className="mt-2 font-medium">Let's Swiggy instead!! 🍔🍕</p>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <a
                  href="https://www.swiggy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FC8019] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#E57317]"
                  onClick={() => setIsOpen(false)}
                >
                  Order on Swiggy
                  <ExternalLink className="size-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute -top-12 right-0 whitespace-nowrap rounded-xl bg-stone-900 px-3 py-2 text-sm font-medium text-white shadow-lg after:absolute after:-bottom-1.5 after:right-5 after:size-3 after:rotate-45 after:bg-stone-900"
            >
              Don't want to cook? 👀
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setShowTooltip(false);
          }}
          className={cn(
            "flex size-14 items-center justify-center rounded-full shadow-lg ring-1 transition-all duration-300 hover:scale-110 active:scale-95",
            isOpen
              ? "bg-stone-100 text-stone-600 ring-stone-200"
              : "bg-deep-green text-white ring-deep-green/20 hover:shadow-[0_8px_30px_rgb(15,124,102,0.3)]"
          )}
          aria-label="Toggle assistant"
        >
          {isOpen ? <X className="size-6" /> : <MessageSquare className="size-6" />}
        </button>
      </div>
    </div>
  );
}
