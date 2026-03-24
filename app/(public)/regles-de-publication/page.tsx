import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/section-title";

export default function RulesPage() {
  return (
    <div className="space-y-8 pb-12">
      <SectionTitle
        eyebrow="Règles de publication"
        title="Des règles simples pour garder une vitrine utile"
        description="Le but n’est pas d’empêcher de publier, mais de préserver la qualité perçue du catalogue et la confiance entre membres."
      />
      <Card className="p-8">
        <ul className="space-y-5 text-sm leading-7 text-[#55607A]">
          <li>Le projet doit avoir été réalisé avec l’aide d’un ou plusieurs outils IA, mentionnés explicitement dans la fiche.</li>
          <li>Le porteur doit être membre actif du QG et pouvoir être contacté pour un échange utile.</li>
          <li>La description doit expliquer le cas d’usage, la méthodologie et le public visé avec suffisamment de précision.</li>
          <li>Les promesses floues, les pages vides, les liens cassés ou les fiches manifestement bâclées peuvent être refusés.</li>
          <li>Quand c’est possible, proposer un accès bêta ou une offre préférentielle QG augmente la valeur communautaire de la publication.</li>
        </ul>
      </Card>
    </div>
  );
}
