/** Gradient banner used at the top of inner marketing pages. */
export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      <div className="absolute inset-0 bg-hero-grid opacity-90" aria-hidden />
      <div className="container relative py-16 md:py-20">
        {eyebrow && (
          <span className="mb-3 inline-block rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-cyan">
            {eyebrow}
          </span>
        )}
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
