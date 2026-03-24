import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/section-title";

export default function AboutPage() {
  return (
    <div className="space-y-8 pb-12">
      <SectionTitle
        eyebrow="À propos"
        title="Pourquoi cette plateforme existe"
        description="Le QG de l’IA avait besoin d’un espace propre, lisible et durable pour rendre les projets des membres trouvables, comparables et crédibles."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "Montrer le niveau réel",
            body: "Au-delà des posts, la plateforme documente le projet, son état d’avancement, les outils utilisés et le problème métier traité."
          },
          {
            title: "Accélérer les retours",
            body: "Les membres peuvent découvrir, liker, commenter et demander un accès bêta sans dépendre d’une discussion dispersée."
          },
          {
            title: "Créer une base durable",
            body: "Le catalogue devient une mémoire utile de la communauté et un premier socle pour une logique de marketplace ou de partenaires."
          }
        ].map((item) => (
          <Card key={item.title} className="p-8">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#2D355A]">{item.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[#6B7280]">{item.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
