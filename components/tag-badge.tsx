import { Badge } from "@/components/ui/badge";

export function TagBadge({ children }: { children: React.ReactNode }) {
  return <Badge className="bg-[#F5F7FB] text-[#52607C]">{children}</Badge>;
}
