import Link from "next/link";
import { signOutAction } from "@/actions/auth";
import { EmptyState } from "@/components/empty-state";
import { ProjectStats } from "@/components/project-stats";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/section-title";
import { getBetaRequestsForCurrentCreator, getMemberProjects, getCurrentProfile } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { requireProfile } from "@/lib/auth";

export default async function MemberDashboardPage() {
  await requireProfile();
  const [projects, betaRequests, profile] = await Promise.all([
    getMemberProjects(),
    getBetaRequestsForCurrentCreator(),
    getCurrentProfile()
  ]);

  const pendingCount = projects.filter((project) => project.moderation_status === "pending").length;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionTitle
          eyebrow="Espace membre"
          title={`Bonjour ${profile?.display_name ?? "membre"}`}
          description="Suivez vos fiches, leur état de validation, les demandes bêta reçues et les signaux d’intérêt sur vos projets."
        />
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/espace-membre/projets/nouveau">Créer un projet</ButtonLink>
          <form action={signOutAction}>
            <Button type="submit" variant="secondary">
              Se déconnecter
            </Button>
          </form>
        </div>
      </div>

      <ProjectStats
        items={[
          { label: "Projets", value: projects.length },
          { label: "En attente", value: pendingCount },
          { label: "Demandes bêta", value: betaRequests.length },
          { label: "Likes cumulés", value: projects.reduce((sum, project) => sum + (project.likes_count ?? 0), 0) }
        ]}
      />

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <SectionTitle title="Vos projets" description="Chaque modification renvoie le projet en modération pour préserver la qualité globale du catalogue." />
          <ButtonLink href="/espace-membre/projets/nouveau" variant="secondary" className="hidden md:inline-flex">
            Ajouter un projet
          </ButtonLink>
        </div>
        {projects.length ? (
          <div className="grid gap-5">
            {projects.map((project) => (
              <Card key={project.id} className="p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge>{project.category}</Badge>
                      <Badge>{project.profession}</Badge>
                      <Badge>{project.moderation_status}</Badge>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#2D355A]">{project.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[#6B7280]">{project.short_description}</p>
                    </div>
                    <p className="text-sm text-[#6B7280]">Dernière mise à jour le {formatDate(project.updated_at)}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <ButtonLink href={`/catalogue/${project.slug}`} variant="secondary">
                      Voir la fiche
                    </ButtonLink>
                    <ButtonLink href={`/espace-membre/projets/${project.id}/modifier`} variant="subtle">
                      Modifier
                    </ButtonLink>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Vous n’avez pas encore publié de projet"
            description="Commencez par une fiche claire, même pour un MVP ou une bêta privée. La modération se charge ensuite du reste."
            ctaLabel="Créer mon premier projet"
            ctaHref="/espace-membre/projets/nouveau"
          />
        )}
      </section>

      <section className="space-y-5">
        <SectionTitle title="Demandes bêta reçues" description="Les demandes sont stockées en base et vous permettent d’identifier les membres prêts à tester." />
        {betaRequests.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {betaRequests.map((request) => (
              <Card key={request.id} className="p-6">
                <p className="font-semibold text-[#2D355A]">{request.profiles?.display_name ?? "Membre QG"}</p>
                <p className="mt-1 text-sm text-[#7A869F]">{formatDate(request.created_at)}</p>
                <p className="mt-3 text-sm leading-7 text-[#55607A]">{request.message || "Aucun message laissé."}</p>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6">
            <p className="text-sm leading-7 text-[#6B7280]">Aucune demande bêta reçue pour le moment. Les projets avec promesse claire et lien de test actif déclenchent généralement plus vite de l’intérêt.</p>
          </Card>
        )}
      </section>

      <section>
        <Card className="p-6">
          <p className="text-sm leading-7 text-[#6B7280]">
            Si vous voyez un état “en attente”, cela signifie que votre fiche est bien enregistrée mais pas encore rendue publique.
            <Link href="/regles-de-publication" className="ml-1 font-medium text-[#2E43A3]">
              Relire les règles de publication
            </Link>
            .
          </p>
        </Card>
      </section>
    </div>
  );
}
