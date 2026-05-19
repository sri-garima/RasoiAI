import type { LucideIcon } from "lucide-react";
import { Coffee, Moon, Sun, UtensilsCrossed, Play } from "lucide-react";

import type { MealOption, SlotKey } from "@/lib/plan/types";
import { cn } from "@/lib/cn";

const SLOT_ICONS: Record<SlotKey, LucideIcon> = {
  breakfast: Sun,
  lunch: UtensilsCrossed,
  snack: Coffee,
  dinner: Moon,
};

const INDIAN_FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80",
];

function getMealImage(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return INDIAN_FOOD_IMAGES[Math.abs(hash) % INDIAN_FOOD_IMAGES.length];
}

type MealSlotCardProps = {
  slot: SlotKey;
  label: string;
  meal: MealOption;
  dense?: boolean;
  className?: string;
};

export function MealSlotCard({
  slot,
  label,
  meal,
  dense,
  className,
}: MealSlotCardProps) {
  const Icon = SLOT_ICONS[slot];
  
  const searchQuery = encodeURIComponent(`${meal.name} recipe shorts`);
  const ytLink = `https://www.youtube.com/results?search_query=${searchQuery}`;

  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-gradient-to-br from-white to-cream/60 shadow-sm ring-1 ring-black/[0.03] transition hover:border-stone-200/90 hover:shadow-md print:break-inside-avoid print:border-stone-300 print:shadow-none",
        className,
      )}
    >
      <div className={cn("relative w-full overflow-hidden shrink-0", dense ? "h-28" : "h-36 sm:h-44")}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={getMealImage(meal.name)} 
          alt={meal.name} 
          className="object-cover w-full h-full transition-transform hover:scale-105 duration-700" 
          loading="lazy" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        <div className="absolute top-3 right-3">
          <span
            className={cn(
              "flex shrink-0 items-center justify-center rounded-xl bg-white/90 text-deep-green ring-1 ring-black/10 backdrop-blur-sm shadow-sm",
              dense ? "size-8" : "size-10",
            )}
            aria-hidden
          >
            <Icon className={dense ? "size-4" : "size-5"} strokeWidth={2.5} />
          </span>
        </div>

        <div className="absolute bottom-3 left-3 pr-3">
          <p
            className={cn(
              "font-bold uppercase tracking-[0.12em] text-white/80 drop-shadow-md mb-0.5",
              dense ? "text-[9px]" : "text-[10px] sm:text-xs",
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              "font-serif font-semibold leading-tight text-white drop-shadow-md",
              dense ? "text-[15px]" : "text-lg sm:text-xl",
            )}
          >
            {meal.name}
          </p>
        </div>
      </div>

      <div className={cn("flex flex-col flex-1", dense ? "px-3 py-3 gap-2" : "px-4 py-4 sm:px-5 sm:py-4 gap-3")}>
        <p
          className={cn(
            "leading-relaxed text-stone-600 flex-1",
            dense ? "text-[11px]" : "text-sm",
          )}
        >
          {meal.note}
        </p>

        <div className="pt-2 border-t border-stone-200/60 mt-auto">
          <a 
            href={ytLink}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 font-medium transition-colors hover:text-red-600",
              dense ? "text-[11px] text-stone-500" : "text-xs text-stone-600"
            )}
            title={`Search for ${meal.name} recipe shorts on YouTube`}
          >
            <Play className={dense ? "size-3.5 text-red-500" : "size-4 text-red-500"} />
            Watch Recipe Shorts
          </a>
        </div>
      </div>
    </article>
  );
}
