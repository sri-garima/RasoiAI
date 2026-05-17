type PhasePlaceholderProps = {
  title: string;
  description?: string;
};

export function PhasePlaceholder({
  title,
  description = "Coming next phase.",
}: PhasePlaceholderProps) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-6 sm:py-20">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-deep-green">
        RasoiAI
      </p>
      <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-stone-600">{description}</p>
    </div>
  );
}
