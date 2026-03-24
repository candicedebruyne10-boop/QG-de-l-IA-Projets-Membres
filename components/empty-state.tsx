import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref
}: {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <Card className="p-8 md:p-10">
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF3FF] text-[#2E43A3]">
          QG
        </div>
        <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#2D355A]">{title}</h3>
        <p className="text-[#6B7280]">{description}</p>
        {ctaLabel && ctaHref ? <ButtonLink href={ctaHref}>{ctaLabel}</ButtonLink> : null}
      </div>
    </Card>
  );
}
