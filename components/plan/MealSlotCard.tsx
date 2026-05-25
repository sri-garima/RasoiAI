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

function getMealImage(name: string): string {
  const lowerName = name.toLowerCase();

  // 1. South Indian Breakfasts (Dosa, Uttapam)
  if (lowerName.includes("dosa") || lowerName.includes("uttapam")) {
    return "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80";
  }
  // 2. Idli
  if (lowerName.includes("idli")) {
    return "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80";
  }
  // 3. Poha
  if (lowerName.includes("poha")) {
    return "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80";
  }
  // 4. Paratha / Roti / Naan / Phulka / Bhakri / Flatbread / Luchi / Poori
  if (
    lowerName.includes("paratha") || 
    lowerName.includes("roti") || 
    lowerName.includes("naan") || 
    lowerName.includes("phulka") || 
    lowerName.includes("bhakri") || 
    lowerName.includes("luchi") || 
    lowerName.includes("poori") ||
    lowerName.includes("radhaballabhi")
  ) {
    return "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80";
  }
  // 5. Paneer dishes
  if (lowerName.includes("paneer")) {
    return "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?auto=format&fit=crop&w=600&q=80";
  }
  // 6. Chole / Chana / Chickpeas / Bhature
  if (lowerName.includes("chole") || lowerName.includes("chana") || lowerName.includes("bhature") || lowerName.includes("sundal")) {
    return "https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=600&q=80";
  }
  // 7. Rice / Pulao / Biryani / Bhaat / Bath / Pongal
  if (
    lowerName.includes("rice") || 
    lowerName.includes("pulao") || 
    lowerName.includes("biryani") || 
    lowerName.includes("bhaat") || 
    lowerName.includes("bath") || 
    lowerName.includes("pongal")
  ) {
    return "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80";
  }
  // 8. Khichdi
  if (lowerName.includes("khichdi")) {
    return "https://images.unsplash.com/photo-1624462966581-bc6d768cbce5?auto=format&fit=crop&w=600&q=80";
  }
  // 9. Dal / Tadka / Lentils / Sambar / Rasam / Shukto / Posto
  if (lowerName.includes("dal") || lowerName.includes("posto") || lowerName.includes("shukto") || lowerName.includes("rasam") || lowerName.includes("sambar")) {
    return "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80";
  }
  // 10. Kadhi
  if (lowerName.includes("kadhi")) {
    return "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80";
  }
  // 11. Toast / Sandwich / Bread / French Toast
  if (lowerName.includes("toast") || lowerName.includes("sandwich") || lowerName.includes("bread")) {
    return "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80";
  }
  // 12. Dhokla
  if (lowerName.includes("dhokla")) {
    return "https://images.unsplash.com/photo-1628149455678-16f37bc392f4?auto=format&fit=crop&w=600&q=80";
  }
  // 13. Upma
  if (lowerName.includes("upma")) {
    return "https://images.unsplash.com/photo-1608797178974-15b35a61d121?auto=format&fit=crop&w=600&q=80";
  }
  // 14. Fruits / Salad / Sprouts / Bhel / Jhal Muri
  if (lowerName.includes("fruit") || lowerName.includes("chaat")) {
    return "https://images.unsplash.com/photo-1519996521430-02b798c1d881?auto=format&fit=crop&w=600&q=80";
  }
  if (lowerName.includes("salad") || lowerName.includes("sprout") || lowerName.includes("bhel") || lowerName.includes("muri")) {
    return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80";
  }
  // 15. Tea / Chai / Coffee
  if (lowerName.includes("chai") || lowerName.includes("tea") || lowerName.includes("coffee") || lowerName.includes("cha")) {
    return "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80";
  }
  // 16. Egg
  if (lowerName.includes("egg")) {
    return "https://images.unsplash.com/photo-1598214886806-c87b84b7078b?auto=format&fit=crop&w=600&q=80";
  }
  // 17. Chicken / Mutton / Keema / Meat
  if (lowerName.includes("chicken") || lowerName.includes("mutton") || lowerName.includes("keema") || lowerName.includes("meat")) {
    return "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80";
  }
  // 18. Fish
  if (lowerName.includes("fish")) {
    return "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80";
  }
  // 19. Pav Bhaji / Misal Pav
  if (lowerName.includes("pav") || lowerName.includes("bhaji") || lowerName.includes("misal")) {
    return "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80";
  }
  // 20. Curd / Dahi / Raita
  if (lowerName.includes("curd") || lowerName.includes("dahi") || lowerName.includes("raita")) {
    return "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80";
  }
  // 21. General Snacks (makhana, mathri, chips, khakhra, murukku, namkeen, singara, vadi, patra)
  if (
    lowerName.includes("makhana") ||
    lowerName.includes("chips") ||
    lowerName.includes("khakhra") ||
    lowerName.includes("murukku") ||
    lowerName.includes("namkeen") ||
    lowerName.includes("singara") ||
    lowerName.includes("vadi") ||
    lowerName.includes("patra") ||
    lowerName.includes("mathri")
  ) {
    return "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80";
  }
  // 22. General Veg / Sabzi / Curry
  if (
    lowerName.includes("veg") ||
    lowerName.includes("sabzi") ||
    lowerName.includes("kofta") ||
    lowerName.includes("curry") ||
    lowerName.includes("bhindi") ||
    lowerName.includes("vangi") ||
    lowerName.includes("capsicum") ||
    lowerName.includes("lauki") ||
    lowerName.includes("stew") ||
    lowerName.includes("avial")
  ) {
    return "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80";
  }

  // Fallback to the existing deterministic hash-based lookup
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
      <div className={cn("relative w-full overflow-hidden shrink-0", dense ? "h-24" : "h-36 sm:h-44")}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={getMealImage(meal.name)} 
          alt={meal.name} 
          className={cn(
            "object-cover w-full h-full transition-all duration-700",
            dense 
              ? "opacity-90 filter brightness-[0.88] saturate-[0.85] hover:opacity-100 hover:brightness-100 hover:saturate-100 hover:scale-105" 
              : "hover:scale-105"
          )}
          loading="lazy" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        
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
