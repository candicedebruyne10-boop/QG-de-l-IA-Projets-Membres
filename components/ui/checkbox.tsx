import { cn } from "@/lib/utils";

export function Checkbox({
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={cn("flex items-start gap-3 text-sm text-[#48536F]", className)}>
      <input
        type="checkbox"
        {...props}
        className="mt-1 size-4 rounded border border-[#CAD3DF] text-[#2E43A3] focus:ring-[#2E43A3]"
      />
      <span>{label}</span>
    </label>
  );
}
