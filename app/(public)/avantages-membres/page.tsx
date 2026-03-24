import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/section-title";

export default function BenefitsPage() {
  return (
    <div className="space-y-8 pb-12">
      <SectionTitle
        eyebrow="Avantages membres"
        title="Une visibilité plus utile qu’un simple annuaire"
        description="La plateforme aide les membres à rendre leurs projets plus lisibles, mieux testés et plus faciles à recommander au bon moment."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {[
          "Une fiche durable qui reste trouvable dans le temps.",
          "Des likes et retours concrets pour identifier l’intérêt réel.",
          "Une vitrine premium plus crédible qu’une simple liste partagée.",
          "La possibilité de proposer une bêta fermée à la communauté.",
          "Une mise en avant éditoriale pour les projets les plus solides.",
          "Un premier socle pour futures collaborations, offres ou partenariats."
        ].map((item) => (
          <Card key={item} className="p-8">
            <p className="text-base leading-8 text-[#55607A]">{item}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
