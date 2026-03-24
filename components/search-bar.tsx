import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar({ defaultValue }: { defaultValue?: string }) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#7B8599]" />
      <Input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Rechercher un projet, un cas d’usage, un outil ou un métier"
        className="rounded-full border-white bg-white/90 py-4 pl-11 pr-5 shadow-[0_10px_40px_rgba(15,23,42,0.08)]"
      />
    </div>
  );
}
