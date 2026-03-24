import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-[28px] border border-[#E7EAF0] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]",
        className
      )}
    >
      {children}
    </div>
  );
}
