import { ArrowRight, Sparkles } from "lucide-react";
import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/project-card";
import { SectionTitle } from "@/components/section-title";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getHomepageProjects, getTopTools } from "@/lib/queries";

export default async function HomePage() {
  const [home, topTools] = await Promise.all([getHomepageProjects(), getTopTools()]);

  return (
    <div className="space-y-14 pb-12 md:space-y-20">
      <Hero />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-8">
          <SectionTitle
            eyebrow="Comment ça marche"
            title="Une vitrine sélective, pensée pour la traction réelle."
            description="Chaque projet passe par une validation simple: qualité de la fiche, usage réel d’outils IA, clarté du positionnement et valeur pour la communauté."
          />
        </Card>
        <Card className="grid gap-4 p-8 sm:grid-cols-3">
          {[
            ["1", "Soumettre", "Une fiche complète avec méthodologie, outils utilisés et angle métier."],
            ["2", "Valider", "L’équipe QG vérifie la lisibilité, la crédibilité et l’intérêt communautaire."],
            ["3", "Faire découvrir", "Le projet devient trouvable, likable et peut recevoir des demandes bêta."]
          ].map(([index, title, description]) => (
            <div key={title} className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF] font-semibold text-[#2E43A3]">{index}</div>
              <h3 className="text-lg font-semibold text-[#2D355A]">{title}</h3>
              <p className="text-sm leading-7 text-[#6B7280]">{description}</p>
            </div>
          ))}
        </Card>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-6">
          <SectionTitle
            eyebrow="Mise en avant"
            title="Projets à suivre de près"
            description="Des projets déjà prometteurs, testables ou particulièrement bien documentés."
          />
          <ButtonLink href="/catalogue" variant="ghost" className="hidden md:inline-flex">
            Tout voir
            <ArrowRight className="ml-2 size-4" />
          </ButtonLink>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {home.featured.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <SectionTitle
            eyebrow="Pépites de la communauté"
            title="Les fiches les plus soutenues en ce moment"
            description="Pour repérer rapidement les projets qui suscitent de l’intérêt et génèrent des retours."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {home.gems.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Card className="p-8">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#EEF8F6] p-3 text-[#2E43A3]">
                <Sparkles className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6A84B5]">À tester cette semaine</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#2D355A]">Projets ouverts aux retours rapides</h3>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {home.beta.map((project) => (
                <div key={project.id} className="rounded-3xl border border-[#EBF0F7] bg-[#FBFCFE] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#2D355A]">{project.title}</p>
                      <p className="mt-1 text-sm text-[#6B7280]">{project.short_description}</p>
                    </div>
                    <ButtonLink href={`/catalogue/${project.slug}`} variant="secondary">
                      Voir
                    </ButtonLink>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6A84B5]">Top outils utilisés par les membres</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {topTools.map((tool) => (
                <Badge key={tool.tool_name} className="bg-[#F3FAF7] text-[#2B6A62] border-[#D7ECE5]">
                  {tool.tool_name} · {tool.count}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <SectionTitle
          eyebrow="Dernières publications"
          title="Les projets récemment ajoutés"
          description="Un aperçu rapide des nouvelles soumissions validées disponibles au catalogue."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {home.latest.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section>
        <Card className="flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center md:p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6A84B5]">Proposer un projet</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#2D355A]">Montrer un projet sérieux, obtenir des retours utiles, gagner en visibilité.</h2>
            <p className="mt-3 text-[#6B7280]">
              La plateforme récompense les fiches claires, les projets déjà testables et les créateurs qui expliquent honnêtement leur méthodologie.
            </p>
          </div>
          <ButtonLink href="/proposer-un-projet">Proposer un projet</ButtonLink>
        </Card>
      </section>
    </div>
  );
}
