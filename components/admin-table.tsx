import Link from "next/link";
import { moderateProjectAction, toggleFeaturedAction } from "@/actions/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { ProjectWithRelations } from "@/types";

export function AdminTable({ projects }: { projects: ProjectWithRelations[] }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-[#F8FAFC] text-sm text-[#6B7280]">
            <tr>
              <th className="px-6 py-4 font-medium">Projet</th>
              <th className="px-6 py-4 font-medium">Créateur</th>
              <th className="px-6 py-4 font-medium">Statut</th>
              <th className="px-6 py-4 font-medium">Créé le</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t border-[#EEF2F7] align-top">
                <td className="px-6 py-5">
                  <div className="space-y-2">
                    <p className="font-semibold text-[#2D355A]">{project.title}</p>
                    <p className="max-w-md text-sm text-[#6B7280]">{project.short_description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge>{project.category}</Badge>
                      <Badge>{project.profession}</Badge>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-[#52607C]">{project.profiles?.display_name ?? "Membre QG"}</td>
                <td className="px-6 py-5">
                  <div className="space-y-2">
                    <Badge>{project.moderation_status}</Badge>
                    {project.is_featured ? <Badge className="bg-[#EEF2FF] text-[#2E43A3]">Mis en avant</Badge> : null}
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-[#52607C]">{formatDate(project.created_at)}</td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-2">
                    <form action={moderateProjectAction.bind(null, project.id, "approved")}>
                      <Button type="submit" variant="subtle" className="w-full justify-center">
                        Valider
                      </Button>
                    </form>
                    <form action={moderateProjectAction.bind(null, project.id, "rejected")}>
                      <Button type="submit" variant="secondary" className="w-full justify-center">
                        Refuser
                      </Button>
                    </form>
                    <form action={toggleFeaturedAction.bind(null, project.id, project.is_featured)}>
                      <Button type="submit" variant="ghost" className="w-full justify-center">
                        {project.is_featured ? "Retirer la mise en avant" : "Mettre en avant"}
                      </Button>
                    </form>
                    <Link href={`/catalogue/${project.slug}`} className="text-sm font-medium text-[#2E43A3]">
                      Voir la fiche
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
