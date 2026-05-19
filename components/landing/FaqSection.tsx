const faqItems = [
  {
    q: "Aaj khane mein kya banana hai?",
    a: "RasoiAI builds breakfast-through-dinner ideas from your pantry and preferences—so you spend less time deciding and more time cooking (or resting).",
  },
  {
    q: "Will it respect my region and cuisine?",
    a: "Plans are tailored to your state or region and preferred cuisine, so suggestions feel familiar, not generic.",
  },
  {
    q: "I already have vegetables at home—can it use them?",
    a: "Yes. You tell the app what you have; the planner prioritizes meals that use those ingredients to cut waste.",
  },
  {
    q: "Veg, eggetarian, Jain, or non-veg?",
    a: "Your diet mode steers every suggestion so the whole household sees plans that match what you actually eat.",
  },
  {
    q: "I only have 30–45 minutes to cook. Will it listen?",
    a: "Cooking time and effort are inputs, so busy weekdays do not get the same suggestions as a slow Sunday.",
  },
  {
    q: "Can it help with budget?",
    a: "Budget signals keep suggestions practical—fewer premium-ingredient days when you need the week to stay light.",
  },
] as const;

export function FaqSection() {
  return (
    <section className="rounded-2xl border border-stone-200/80 bg-white/90 p-8 shadow-sm ring-1 ring-black/5 sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800/80">
        Questions
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
        What families ask before they plan
      </h2>
      <p className="mt-3 max-w-2xl text-stone-600">
        Honest answers about how RasoiAI is meant to reduce daily meal stress—
        aligned with how Indian households actually decide what to cook.
      </p>
      <div className="mt-8 divide-y divide-stone-100 border-t border-stone-100">
        {faqItems.map((item) => (
          <details
            key={item.q}
            className="group py-4 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left text-base font-medium text-stone-900 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700/60">
              <span>{item.q}</span>
              <span
                className="mt-0.5 shrink-0 text-stone-400 transition group-open:rotate-180"
                aria-hidden
              >
                <ChevronIcon />
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-[15px]">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

function ChevronIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M5 7.5 10 12.5 15 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
