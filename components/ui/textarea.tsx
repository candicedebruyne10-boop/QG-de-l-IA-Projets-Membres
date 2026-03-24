import { cn } from "@/lib/utils";

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-[140px] w-full rounded-[22px] border border-[#DCE3EC] bg-white px-4 py-3 text-sm text-[#2D355A] outline-none transition placeholder:text-[#8A93A7] focus:border-[#4059B5] focus:ring-4 focus:ring-[#4059B5]/10",
        props.className
      )}
    />
  );
}
