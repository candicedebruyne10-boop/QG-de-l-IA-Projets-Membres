import { Badge } from "@/components/ui/badge";

export function ToolBadge({ children }: { children: React.ReactNode }) {
  return <Badge className="bg-[#F3FAF7] text-[#2B6A62] border-[#D7ECE5]">{children}</Badge>;
}
