type AdPlaceholderProps = {
  variant: "medium-rectangle" | "leaderboard";
};

const sizes: Record<AdPlaceholderProps["variant"], string> = {
  "medium-rectangle": "min-h-[250px] w-full max-w-[300px]",
  leaderboard: "min-h-[90px] w-full max-w-[728px]",
};

export function AdPlaceholder({ variant }: AdPlaceholderProps) {
  return (
    <aside
      className={`mx-auto flex flex-col justify-center rounded-xl border border-stone-200/80 bg-gradient-to-b from-stone-50 to-stone-100/80 px-6 py-8 text-center shadow-sm ring-1 ring-black/5 ${sizes[variant]}`}
      aria-label="Advertisement placeholder"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
        Advertisement
      </p>
      <p className="mt-3 text-sm font-medium text-stone-500">Your brand here</p>
      <p className="mt-1 text-xs leading-relaxed text-stone-400">
        {variant === "leaderboard"
          ? "728×90 style placement — swap for your network when ready."
          : "300×250 style placement — reserved for partners."}
      </p>
    </aside>
  );
}
