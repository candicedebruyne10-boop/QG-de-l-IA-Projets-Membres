import Image from "next/image";
import { Heart } from "lucide-react";
import type { ProjectWithRelations } from "@/types";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectMeta } from "@/components/project-meta";
import { ToolBadge } from "@/components/tool-badge";

export function ProjectCard({ project }: { project: ProjectWithRelations }) {
  return (
    <Card className="group overflow-hidden">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={project.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"}
          alt={project.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="space-y-5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-3">
            <ProjectMeta
              category={project.category}
              profession={project.profession}
              projectStatus={project.project_status}
              stage={project.stage}
            />
            <div>
              <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#2D355A]">{project.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-7 text-[#667085]">{project.short_description}</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F6F8FC] px-3 py-2 text-sm text-[#52607C]">
            <Heart className="size-4 text-[#2E43A3]" />
            {project.likes_count ?? 0}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.beta_available ? <Badge className="bg-[#ECFDF5] text-[#166534] border-[#CFEFDB]">Bêta dispo</Badge> : null}
          {project.qg_special_offer ? (
            <Badge className="bg-[#EEF2FF] text-[#2E43A3] border-[#DCE5FF]">Tarif QG</Badge>
          ) : null}
          <Badge>{project.pricing_model}</Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.project_tools.slice(0, 4).map((tool) => (
            <ToolBadge key={tool.tool_name}>{tool.tool_name}</ToolBadge>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 pt-1">
          <p className="text-sm text-[#6B7280]">
            Par {project.profiles?.display_name ?? "Membre QG"}
          </p>
          <ButtonLink href={`/catalogue/${project.slug}`} variant="secondary">
            Voir le projet
          </ButtonLink>
        </div>
      </div>
    </Card>
  );
}
