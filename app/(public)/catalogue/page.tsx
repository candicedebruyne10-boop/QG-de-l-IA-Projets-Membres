import { EmptyState } from "@/components/empty-state";
import { FilterPanel } from "@/components/filter-panel";
import { ProjectCard } from "@/components/project-card";
import { SectionTitle } from "@/components/section-title";
import { getApprovedProjects } from "@/lib/queries";
import type { ProjectFilters } from "@/types";

export default async function CataloguePage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const resolved = await searchParams;
  const filters: ProjectFilters = {
    q: resolved.q,
    status: resolved.status,
    profession: resolved.profession,
    pricing: resolved.pricing,
    stage: resolved.stage,
    tool: resolved.tool,
    beta: resolved.beta,
    qgOffer: resolved.qgOffer
  };

  const projects = await getApprovedProjects(filters);

  return (
    <div className="space-y-8 pb-12">
      <SectionTitle
        eyebrow="Catalogue"
        title="Explorer les projets IA validés de la communauté"
        description="Filtrez par métier, niveau d’avancement, modèle économique ou outils utilisés pour trouver rapidement les projets les plus pertinents."
      />
      <FilterPanel filters={filters} />
      {projects.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Aucun projet ne correspond à cette recherche"
          description="Essayez d’élargir un filtre, de retirer un outil précis ou de revenir à une recherche plus large."
          ctaLabel="Voir tous les projets"
          ctaHref="/catalogue"
        />
      )}
    </div>
  );
}
