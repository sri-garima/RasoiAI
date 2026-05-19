import type { DietPreference } from "@/lib/profile/types";
import type { CuisineBucket } from "@/lib/plan/cuisine-bucket";
import type { MealOption, SlotKey } from "@/lib/plan/types";

const VEG: Record<CuisineBucket, Record<SlotKey, MealOption[]>> = {
  north: {
    breakfast: [
      { name: "Masala poha", note: "Quick stovetop; lemon + peanuts for crunch." },
      { name: "Aloo paratha + dahi", note: "Roll thin if weekday mornings are tight." },
      { name: "Besan cheela", note: "High protein; pair with green chutney." },
      { name: "Moong dal chilla", note: "Light; good before a busy workday." },
      { name: "Stuffed moong sprout toast", note: "No tawa time—oven or sandwich grill." },
    ],
    lunch: [
      { name: "Rajma chawal + salad", note: "Soak previous night if using dried beans." },
      { name: "Kadhi chawal + papad", note: "Use leftover dahi; mild and comforting." },
      { name: "Chole + jeera rice", note: "Batch chole freezes well for the week." },
      { name: "Palak paneer + tawa roti", note: "Blanch palak bright green; skip cream if light." },
      { name: "Mix veg + dal tadka", note: "Use whatever sabzi is wilting first." },
    ],
    snack: [
      { name: "Masala chai + mathri", note: "Keep mathri air-tight for crunch." },
      { name: "Roasted makhana", note: "Low oil; kids-friendly crunch." },
      { name: "Sprout bhel", note: "Onion–tomato optional; lemon lifts everything." },
      { name: "Fruit chaat", note: "Chaat masala sparingly if kids are sensitive." },
    ],
    dinner: [
      { name: "Dal palak + roti", note: "One-pot friendly; finish with ghee tadka." },
      { name: "Stuffed capsicum + missi roti", note: "Bake capsicum if you want less oil." },
      { name: "Vegetable khichdi + dahi", note: "Comfort dinner; add achaar on the side." },
      { name: "Paneer bhurji + paratha", note: "Fast protein; use crumbled paneer ends." },
      { name: "Lauki kofta + phulka", note: "Weekend-style treat without restaurant oil." },
    ],
  },
  south: {
    breakfast: [
      { name: "Idli + sambar + chutney", note: "Ferment batter if weekend; rava idli if weekday." },
      { name: "Upma + coconut chutney", note: "Toast rava first for nutty depth." },
      { name: "Pongal + gotsu", note: "Pepper-heavy; soothing for monsoon evenings." },
      { name: "Set dosa + vegetable sagu", note: "Soft spongy dosas; kids love them." },
      { name: "Rava idli + tomato chutney", note: "No ferment; under 30 minutes." },
    ],
    lunch: [
      { name: "Sambar rice + poriyal + pickle", note: "One-plate thali rhythm at home." },
      { name: "Curd rice + podi + fryums", note: "Cooling lunch; great with leftover rice." },
      { name: "Lemon rice + beans poriyal", note: "Tangy; packable if anyone needs dabba." },
      { name: "Rasam + potato roast + rice", note: "Light on the stomach post-work." },
      { name: "Vegetable pulao + raita", note: "Pressure cooker friendly one-pot." },
    ],
    snack: [
      { name: "Filter coffee + murukku", note: "Classic 4 pm reset." },
      { name: "Banana chips + chai", note: "Watch salt if elders need low sodium." },
      { name: "Sundal (chana)", note: "Protein snack; tempered mustard seeds." },
    ],
    dinner: [
      { name: "Avial + rice + papad", note: "Coconut-heavy; balance with simple rasam." },
      { name: "Tomato rice + cucumber raita", note: "Quick dinner when lunch was heavy." },
      { name: "Paruppu usili + roti", note: "Beans + dal crumble; fiber rich." },
      { name: "Vegetable stew + appam", note: "Mild coconut stew; skip if kids dislike coconut." },
      { name: "Bisibele bath", note: "One-pot Karnataka classic; finish with ghee." },
    ],
  },
  west: {
    breakfast: [
      { name: "Kanda poha", note: "Maharashtra staple; peanuts for crunch." },
      { name: "Thalipeeth + dahi", note: "Multi-flour; keeps you full till lunch." },
      { name: "Sabudana khichdi", note: "Fasting-day friendly; also a light weekday option." },
      { name: "Dhokla + green chutney", note: "Steam batch; snack later too." },
    ],
    lunch: [
      { name: "Varan bhaat + bhindi fry", note: "Simple dal–rice comfort." },
      { name: "Misal pav (mild)", note: "Use less oil; serve extra pav if teens are hungry." },
      { name: "Undhiyu + roti", note: "Seasonal; cheat with frozen mix if needed." },
      { name: "Dal dhokli", note: "One-pot Gujarati hug-in-a-bowl." },
    ],
    snack: [
      { name: "Chai + khakhra", note: "Dry snack; desk-friendly." },
      { name: "Kothimbir vadi", note: "Crisp outside; soft inside." },
    ],
    dinner: [
      { name: "Bharli vangi + jowar bhakri", note: "Stuffed baby brinjals; pair with salad." },
      { name: "Pav bhaji (extra veg)", note: "Load capsicum + peas; easy crowd pleaser." },
      { name: "Patra + kadhi", note: "Colocasia rolls; weekend prep friendly." },
    ],
  },
  east: {
    breakfast: [
      { name: "Luchi + aloo dum (light)", note: "Weekend treat; smaller luchis if frying feels heavy." },
      { name: "Chire doi (flattened rice + yogurt)", note: "No cook; add jaggery or fruit." },
      { name: "Radhaballabhi + cholar dal", note: "Stuffed poori; plan extra soak time." },
    ],
    lunch: [
      { name: "Shukto + dal + rice", note: "Bitter-melon medley; Bengali thali starter." },
      { name: "Cholar dal + luchi (mini)", note: "Festive vibe; keep portions sensible." },
      {
        name: "Aloo posto + rice",
        note: "Poppy potato; vegetarian Bengali comfort without onion–garlic if needed.",
      },
    ],
    snack: [
      { name: "Jhal muri", note: "Puffed rice street classic at home; control spice." },
      { name: "Singara + cha", note: "Baked singara if avoiding deep fry." },
    ],
    dinner: [
      { name: "Begun bhaja + masoor dal + rice", note: "Crispy brinjal rounds; simple dal." },
      { name: "Panch mishali torkari + roti", note: "Five-veg medley; fridge cleaner." },
    ],
  },
  pan: {
    breakfast: [
      { name: "Vegetable uttapam", note: "South base; north toppings—household compromise." },
      { name: "Stuffed paratha + pickle", note: "Gobi or paneer stuffing from whatever you have." },
      { name: "Chilla + green chutney", note: "North-west protein; pairs with chai." },
    ],
    lunch: [
      { name: "Dal + sabzi + roti + rice", note: "Pan-Indian thali skeleton—swap sabzi daily." },
      { name: "Kadhi + khichdi", note: "Light combo; elders often appreciate this." },
      { name: "Paneer tikka bowl + mint raita", note: "Oven tikka + salad if you want less carb." },
    ],
    snack: [
      { name: "Chai + mixed nuts", note: "Fast; add jaggery piece if energy dips." },
      { name: "Roasted chana + nimbu", note: "Protein snack; school pickup friendly." },
    ],
    dinner: [
      { name: "Vegetable pulao + raita", note: "One pot; use frozen peas freely." },
      { name: "Dal makhani (home style) + naan", note: "Skip cream; cashew paste for richness." },
    ],
  },
  default: {
    breakfast: [
      { name: "Vegetable poha", note: "Universal; peas + carrots from freezer ok." },
      { name: "Paratha + curd", note: "Any stuffing works; keep dough soft." },
      { name: "Oats upma", note: "Fiber-forward; shorten cook time for busy mornings." },
    ],
    lunch: [
      { name: "Dal + sabzi + roti", note: "Rotate dal daily: arhar, moong, masoor." },
      { name: "Rajma or chole + rice", note: "Legume-heavy; soak planning matters." },
      { name: "Kadhi + jeera rice", note: "Uses dahi; good when fridge is full." },
    ],
    snack: [
      { name: "Chai + roasted namkeen", note: "Portion bowls to avoid over-snacking." },
      { name: "Fruit + chaat masala", note: "Seasonal fruit wins every time." },
    ],
    dinner: [
      { name: "Khichdi + dahi + pickle", note: "Reset meal; add ghee for growing kids." },
      { name: "Mixed veg + roti", note: "Clean the crisper drawer." },
      { name: "Paneer curry + rice", note: "Paneer from pantry list boosts protein." },
    ],
  },
};

const EGG_EXTRA: Record<SlotKey, MealOption[]> = {
  breakfast: [
    { name: "Egg bhurji + toast", note: "Soft scramble style; finish with coriander." },
    { name: "French toast (masala)", note: "Sweet–savory hybrid kids often love." },
  ],
  lunch: [{ name: "Egg curry + rice", note: "Boiled eggs in onion–tomato gravy." }],
  snack: [{ name: "Boiled eggs + salt–pepper", note: "Fast protein between meetings." }],
  dinner: [{ name: "Egg pepper fry + rasam rice", note: "South-style pepper masala." }],
};

const NV_EXTRA: Record<SlotKey, MealOption[]> = {
  breakfast: [{ name: "Keema paratha (chicken)", note: "Use mince; cook filling fully." }],
  lunch: [
    { name: "Chicken curry + roti", note: "Yogurt marinade keeps it tender." },
    { name: "Fish curry + rice", note: "Coastal style; adjust chili for kids." },
  ],
  snack: [{ name: "Chicken roll (homemade)", note: "Whole-wheat roti wrap; baked option." }],
  dinner: [
    { name: "Grilled fish + sautéed veg", note: "Light dinner after a heavy lunch." },
    { name: "Mutton home curry + missi roti", note: "Pressure cooker tenderizes faster." },
  ],
};

const JAIN: Record<SlotKey, MealOption[]> = {
  breakfast: [
    { name: "Jain poha (no onion–garlic)", note: "Use fennel and curry leaves for aroma." },
    { name: "Plain paratha + dahi", note: "Ajwain in dough aids digestion." },
    { name: "Fruit + nuts bowl", note: "Zero cook; add chia if you like." },
  ],
  lunch: [
    { name: "Jain dal + jeera rice", note: "Tomato optional; hing tadka for depth." },
    { name: "Paneer tikka masala (no root)", note: "Cashew–tomato base; skip honey if strict." },
    { name: "Undhiyu (jain style)", note: "Skip root tubers per household rules." },
  ],
  snack: [
    { name: "Roasted makhana", note: "Plain or pepper; no garlic powder." },
    { name: "Jain bhel (puffed rice)", note: "Raw mango + coriander only." },
  ],
  dinner: [
    { name: "Jain kadhi + khichdi", note: "Gujarati sweet–sour balance without onion." },
    { name: "Paneer pulao + raita", note: "One-pot; use homemade paneer if time allows." },
  ],
};

function mergeUnique(primary: MealOption[], secondary: MealOption[]): MealOption[] {
  const seen = new Set<string>();
  const out: MealOption[] = [];
  for (const m of [...primary, ...secondary]) {
    const k = m.name.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(m);
  }
  return out;
}

function slotPoolForBucket(bucket: CuisineBucket, slot: SlotKey): MealOption[] {
  const regional = VEG[bucket]?.[slot] ?? [];
  const fallback = VEG.default[slot] ?? [];
  return regional.length > 0 ? mergeUnique(regional, fallback) : [...fallback];
}

export function getMealCandidates(
  slot: SlotKey,
  diet: DietPreference,
  bucket: CuisineBucket,
): MealOption[] {
  const base = slotPoolForBucket(bucket, slot);

  if (diet === "jain") {
    return JAIN[slot].length > 0 ? [...JAIN[slot]] : base;
  }

  if (diet === "eggetarian") {
    return mergeUnique(base, EGG_EXTRA[slot] ?? []);
  }

  if (diet === "non_vegetarian") {
    return mergeUnique(mergeUnique(base, EGG_EXTRA[slot] ?? []), NV_EXTRA[slot] ?? []);
  }

  return base.length > 0 ? [...base] : [...(VEG.default[slot] ?? [])];
}
