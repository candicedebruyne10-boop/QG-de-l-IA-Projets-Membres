import Link from "next/link";
import { AdminTable } from "@/components/admin-table";
import { ProjectStats } from "@/components/project-stats";
import { SectionTitle } from "@/components/section-title";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { getAdminProjects } from "@/lib/queries";

export default async function AdminPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const projects = await getAdminProjects(params.status);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionTitle
          eyebrow="Administration"
          title="Modération et pilotage"
          description="Validez, refusez ou mettez en avant les soumissions. Cette page est protégée par rôle admin."
        />
        <ButtonLink href="/catalogue" variant="secondary">
          Voir le catalogue public
        </ButtonLink>
      </div>

      <ProjectStats
        items={[
          { label: "Soumissions", value: projects.length },
          { label: "En attente", value: projects.filter((project) => project.moderation_status === "pending").length },
          { label: "Validés", value: projects.filter((project) => project.moderation_status === "approved").length },
          { label: "Mis en avant", value: projects.filter((project) => project.is_featured).length }
        ]}
      />

      <Card className="p-6">
        <div className="flex flex-wrap gap-3">
          {[
            ["Toutes", "/admin"],
            ["En attente", "/admin?status=pending"],
            ["Validées", "/admin?status=approved"],
            ["Refusées", "/admin?status=rejected"]
          ].map(([label, href]) => (
            <Link key={label} href={href} className="rounded-full border border-[#DCE3EC] px-4 py-2 text-sm font-medium text-[#52607C]">
              {label}
            </Link>
          ))}
        </div>
      </Card>

      {params.status ? (
        <Badge className="bg-[#EEF2FF] text-[#2E43A3] border-[#DCE5FF]">Filtre actif: {params.status}</Badge>
      ) : null}

      <AdminTable projects={projects} />
    </div>
  );
}
