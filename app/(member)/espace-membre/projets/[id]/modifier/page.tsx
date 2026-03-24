import { notFound } from "next/navigation";
import { updateProjectAction } from "@/actions/projects";
import { SubmissionForm } from "@/components/submission-form";
import { SectionTitle } from "@/components/section-title";
import { requireProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { fallbackProjects } from "@/lib/sample-data";
import type { ProjectWithRelations } from "@/types";

async function getEditableProject(id: string) {
  if (!isSupabaseConfigured()) return fallbackProjects.find((project) => project.id === id) ?? null;
  const profile = await requireProfile();
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("projects")
    .select("*, profiles(display_name, username, avatar_url, bio, id), project_tools(tool_name), project_tags(tag)")
    .eq("id", id)
    .eq("user_id", profile.id)
    .maybeSingle();
  return (data as ProjectWithRelations | null) ?? null;
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await requireProfile();
  const { id } = await params;
  const project = await getEditableProject(id);
  if (!project) notFound();

  return (
    <div className="space-y-8 pb-12">
      <SectionTitle
        eyebrow="Modifier"
        title={`Mettre à jour ${project.title}`}
        description="Toute mise à jour réactive la modération pour éviter que des fiches publiques ne se dégradent avec le temps."
      />
      <SubmissionForm action={updateProjectAction.bind(null, project.id)} project={project} />
    </div>
  );
}
