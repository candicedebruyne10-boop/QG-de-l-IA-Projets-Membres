import { cn } from "@/lib/utils";

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { placeholder?: string }
) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-2xl border border-[#DCE3EC] bg-white px-4 py-3 text-sm text-[#2D355A] outline-none transition focus:border-[#4059B5] focus:ring-4 focus:ring-[#4059B5]/10",
        props.className
      )}
    />
  );
}
