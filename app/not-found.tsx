import { EmptyState } from "@/components/empty-state";

export default function NotFound() {
  return (
    <div className="py-16">
      <EmptyState
        title="Cette page n’est pas disponible"
        description="La ressource demandée n’est plus accessible ou n’a pas encore été publiée sur la plateforme."
        ctaLabel="Retour au catalogue"
        ctaHref="/catalogue"
      />
    </div>
  );
}
