export function SectionTitle({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl space-y-3">
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#6A84B5]">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#2D355A] md:text-4xl">{title}</h2>
      {description ? <p className="text-base leading-7 text-[#6B7280] md:text-lg">{description}</p> : null}
    </div>
  );
}
