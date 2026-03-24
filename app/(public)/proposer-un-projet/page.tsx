import { createProjectAction } from "@/actions/projects";
import { SubmissionForm } from "@/components/submission-form";
import { SectionTitle } from "@/components/section-title";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/queries";

export default async function SubmitPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-10 pb-16">
      <SectionTitle
        eyebrow="Soumission"
        title="Partage ton projet IA avec la communauté"
        description="Présente ton app, ton site ou ton workflow créé avec l’IA."
      />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#1F2A44]">
              Ton projet mérite mieux qu’un lien perdu
            </h2>

            <p className="text-base text-[#52607C]">
              Publie ton projet dans un espace structuré, visible et utile pour la communauté.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 border rounded-xl">
              <p className="font-semibold">👀 Visibilité</p>
              <p className="text-sm text-gray-500">Expose ton projet clairement</p>
            </div>

            <div className="p-4 border rounded-xl">
              <p className="font-semibold">💬 Feedback</p>
              <p className="text-sm text-gray-500">Améliore plus vite</p>
            </div>

            <div className="p-4 border rounded-xl">
              <p className="font-semibold">🚀 Utilisateurs</p>
              <p className="text-sm text-gray-500">Attire des bêta testeurs</p>
            </div>

            <div className="p-4 border rounded-xl">
              <p className="font-semibold">🧠 Méthode</p>
              <p className="text-sm text-gray-500">Montre ton process IA</p>
            </div>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <h3 className="text-xl font-semibold text-[#1F2A44]">
            Conditions de publication
          </h3>

          <ul className="space-y-2 text-sm text-[#52607C]">
            <li>• Projet réalisé avec IA</li>
            <li>• Description claire</li>
            <li>• Lien fonctionnel</li>
            <li>• Valeur réelle</li>
          </ul>

          <div className="bg-[#2E43A3] text-white p-4 rounded-xl">
            <p className="text-sm">
              Le plus dur n’est pas de créer… c’est d’être vu.
            </p>
          </div>
        </Card>
      </div>

      {!user ? (
        <Card className="p-8">
          <p className="text-[#52607C]">
            Connecte-toi pour proposer ton projet.
          </p>

          <div className="mt-4">
            <ButtonLink href="/connexion">Se connecter</ButtonLink>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-[#1F2A44]">
            Déposer un projet
          </h2>

          <p className="text-[#52607C]">
            Remplis les informations ci-dessous pour soumettre ton projet.
          </p>

          <SubmissionForm action={createProjectAction} />
        </div>
      )}
    </div>
  );
}