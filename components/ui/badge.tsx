import { cn } from "@/lib/utils";

export function Badge({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[#DFE4EC] bg-white px-3 py-1 text-xs font-medium text-[#4E5A7A]",
        className
      )}
    >
      {children}
    </span>
  );
}
