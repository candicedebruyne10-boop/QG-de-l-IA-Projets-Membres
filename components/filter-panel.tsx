import { aiToolOptions, pricingModelOptions, professionOptions, projectStageOptions, projectStatusOptions } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { SearchBar } from "@/components/search-bar";
import type { ProjectFilters } from "@/types";

export function FilterPanel({ filters }: { filters: ProjectFilters }) {
  return (
    <form action="/catalogue" className="rounded-[28px] border border-[#E7EAF0] bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)] md:p-6">
      <div className="grid gap-4 lg:grid-cols-[2fr_repeat(3,1fr)]">
        <SearchBar defaultValue={filters.q} />
        <Select name="status" defaultValue={filters.status || ""}>
          <option value="">Statut du projet</option>
          {projectStatusOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Select name="profession" defaultValue={filters.profession || ""}>
          <option value="">Métier ciblé</option>
          {professionOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Select name="pricing" defaultValue={filters.pricing || ""}>
          <option value="">Modèle économique</option>
          {pricingModelOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[repeat(4,1fr)_auto]">
        <Select name="stage" defaultValue={filters.stage || ""}>
          <option value="">Niveau d’avancement</option>
          {projectStageOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Select name="tool" defaultValue={filters.tool || ""}>
          <option value="">Outil IA utilisé</option>
          {aiToolOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Select name="beta" defaultValue={filters.beta || ""}>
          <option value="">Bêta disponible</option>
          <option value="true">Oui</option>
          <option value="false">Non</option>
        </Select>
        <Select name="qgOffer" defaultValue={filters.qgOffer || ""}>
          <option value="">Tarif QG</option>
          <option value="true">Oui</option>
          <option value="false">Non</option>
        </Select>
        <Button type="submit" className="min-w-[9rem]">
          Filtrer
        </Button>
      </div>
    </form>
  );
}
