import { Card } from "@/components/ui/card";

export function ProjectStats({
  items
}: {
  items: { label: string; value: string | number }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="p-5">
          <p className="text-sm text-[#6B7280]">{item.label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#2D355A]">{item.value}</p>
        </Card>
      ))}
    </div>
  );
}
