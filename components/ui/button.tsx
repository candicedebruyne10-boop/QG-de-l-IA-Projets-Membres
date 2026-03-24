import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

const baseClassName =
  "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4059B5]/40 disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary: "bg-[#2E43A3] text-white shadow-[0_12px_30px_rgba(46,67,163,0.2)] hover:bg-[#4059B5]",
  secondary: "bg-white text-[#2D355A] ring-1 ring-[#DCE1EA] hover:bg-[#F8FAFC]",
  subtle: "bg-[#EEF2FF] text-[#2E43A3] hover:bg-[#E4EAFF]",
  ghost: "bg-transparent text-[#2D355A] hover:bg-white/70"
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return <button className={cn(baseClassName, variants[variant], className)} {...props} />;
}

type ButtonLinkProps = PropsWithChildren<LinkProps> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  className?: string;
  variant?: keyof typeof variants;
};

export function ButtonLink({ className, variant = "primary", children, ...props }: ButtonLinkProps) {
  return (
    <Link className={cn(baseClassName, variants[variant], className)} {...props}>
      {children}
    </Link>
  );
}
