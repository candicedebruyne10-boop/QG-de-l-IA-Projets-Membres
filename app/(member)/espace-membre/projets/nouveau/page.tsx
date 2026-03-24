import { createProjectAction } from "@/actions/projects";
import { SubmissionForm } from "@/components/submission-form";
import { SectionTitle } from "@/components/section-title";
import { requireProfile } from "@/lib/auth";

export default async function NewProjectPage() {
  await requireProfile();

  return (
    <div className="space-y-8 pb-12">
      <SectionTitle
        eyebrow="Nouveau projet"
        title="Créer une fiche projet complète"
        description="La soumission est réelle et alimente directement la base Supabase. Après envoi, la fiche passe en statut “en attente”."
      />
      <SubmissionForm action={createProjectAction} />
    </div>
  );
}
