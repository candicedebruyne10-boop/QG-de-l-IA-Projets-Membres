import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Globe, MessageSquareQuote, UserRound } from "lucide-react";
import { CommentList } from "@/components/comment-list";
import { EmptyState } from "@/components/empty-state";
import { ProjectInteractions } from "@/components/project-interactions";
import { ProjectMeta } from "@/components/project-meta";
import { ProjectCard } from "@/components/project-card";
import { SectionTitle } from "@/components/section-title";
import { TagBadge } from "@/components/tag-badge";
import { ToolBadge } from "@/components/tool-badge";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getApprovedProjects, getProjectBySlug, getProjectComments } from "@/lib/queries";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [comments, related] = await Promise.all([
    getProjectComments(project.id),
    getApprovedProjects({ profession: project.profession })
  ]);

  const relatedProjects = related.filter((item) => item.id !== project.id).slice(0, 3);

  return (
    <div className="space-y-10 pb-12">
      <section className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden">
          <div className="relative h-72 md:h-[28rem]">
            <Image
              src={project.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        </Card>

        <Card className="p-8">
          <ProjectMeta
            category={project.category}
            profession={project.profession}
            projectStatus={project.project_status}
            stage={project.stage}
          />
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#2D355A]">{project.title}</h1>
          <p className="mt-4 text-base leading-8 text-[#5C6782]">{project.long_description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.beta_available ? <Badge className="bg-[#ECFDF5] text-[#166534] border-[#CFEFDB]">Bêta dispo</Badge> : null}
            {project.qg_special_offer ? (
              <Badge className="bg-[#EEF2FF] text-[#2E43A3] border-[#DCE5FF]">Tarif QG</Badge>
            ) : null}
            <Badge>{project.pricing_model}</Badge>
            {project.price_label ? <Badge>{project.price_label}</Badge> : null}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={project.external_url} target="_blank" rel="noreferrer">
              Tester le projet
            </ButtonLink>
            {project.beta_available ? (
              <a href="#beta" className="inline-flex items-center justify-center rounded-full border border-[#DCE1EA] bg-white px-5 py-3 text-sm font-semibold text-[#2D355A]">
                Demander l’accès bêta
              </a>
            ) : null}
            <ButtonLink href={`mailto:${project.profiles?.username || "contact@qg-ia.fr"}`} variant="secondary">
              Contacter le créateur
            </ButtonLink>
          </div>

          <div className="mt-8 border-t border-[#EEF2F7] pt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6A84B5]">Créateur</p>
            <div className="mt-3 flex items-start gap-4">
              <div className="rounded-full bg-[#EEF2FF] p-3 text-[#2E43A3]">
                <UserRound className="size-5" />
              </div>
              <div>
                <p className="font-semibold text-[#2D355A]">{project.profiles?.display_name ?? "Membre QG"}</p>
                <p className="mt-1 text-sm leading-7 text-[#6B7280]">{project.profiles?.bio || "Créateur membre du QG de l’IA."}</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <Card className="p-8" id="beta">
            <SectionTitle title="Interaction membre" description="Soutenez le projet, demandez un accès bêta ou partagez un retour utile au créateur." />
            <div className="mt-6">
              <ProjectInteractions
                projectId={project.id}
                slug={project.slug}
                hasLiked={project.has_liked}
                likesCount={project.likes_count ?? 0}
                betaAvailable={project.beta_available}
              />
            </div>
          </Card>

          <Card className="p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6A84B5]">Synthèse du projet</p>
            <dl className="mt-5 space-y-5">
              {[
                ["Public cible", project.target_audience],
                ["Problème résolu", project.problem_solved],
                ["Méthodologie", project.methodology],
                ["Retour du créateur", project.creator_feedback || "Retour non renseigné pour le moment."],
                ["Offre spéciale QG", project.qg_special_offer_details || "Aucune offre spéciale pour le moment."]
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-sm font-medium text-[#52607C]">{label}</dt>
                  <dd className="mt-1 text-sm leading-7 text-[#2D355A]">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-8">
            <SectionTitle title="Comment ce projet a été construit" description="Une lecture utile pour comprendre la démarche produit, les outils choisis et le degré de maturité." />
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-[24px] bg-[#F8FAFC] p-5">
                <div className="flex items-center gap-2 text-[#2E43A3]">
                  <Globe className="size-4" />
                  <p className="text-sm font-semibold">Outils IA utilisés</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.project_tools.map((tool) => (
                    <ToolBadge key={tool.tool_name}>{tool.tool_name}</ToolBadge>
                  ))}
                </div>
              </div>
              <div className="rounded-[24px] bg-[#F8FAFC] p-5">
                <div className="flex items-center gap-2 text-[#2E43A3]">
                  <MessageSquareQuote className="size-4" />
                  <p className="text-sm font-semibold">Tags et contexte</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.project_tags.length ? (
                    project.project_tags.map((tag) => <TagBadge key={tag.tag}>{tag.tag}</TagBadge>)
                  ) : (
                    <span className="text-sm text-[#6B7280]">Pas de tags renseignés.</span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <SectionTitle title="Commentaires" description="Les retours publics restent visibles si le projet est approuvé et si le commentaire respecte les règles." />
            <div className="mt-6">
              <CommentList comments={comments} />
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <SectionTitle
          eyebrow="À découvrir aussi"
          title="Projets proches par métier ou usage"
          description="Une sélection simple basée sur le métier ciblé pour poursuivre l’exploration."
        />
        {relatedProjects.length ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {relatedProjects.map((item) => (
              <ProjectCard key={item.id} project={item} />
            ))}
          </div>
        ) : (
          <EmptyState title="Pas encore de projet lié" description="Cette catégorie est encore en train de se remplir. Revenez bientôt ou proposez un projet complémentaire." />
        )}
      </section>
    </div>
  );
}
