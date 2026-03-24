import type { Profile, ProjectWithRelations } from "@/types";

export const fallbackProfiles: Profile[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    display_name: "Claire Martin",
    username: "clairemartin",
    avatar_url: null,
    bio: "Membre du QG, spécialisée dans les outils IA pour les professions réglementées.",
    role: "member",
    created_at: new Date().toISOString()
  },
  {
    id: "00000000-0000-0000-0000-000000000099",
    display_name: "Équipe QG",
    username: "admin-qg",
    avatar_url: null,
    bio: "Administration de la plateforme.",
    role: "admin",
    created_at: new Date().toISOString()
  }
];

function createProject(
  id: string,
  title: string,
  slug: string,
  category: string,
  profession: string,
  shortDescription: string,
  tools: string[],
  tags: string[],
  extras?: Partial<ProjectWithRelations>
): ProjectWithRelations {
  return {
    id,
    user_id: fallbackProfiles[0].id,
    title,
    slug,
    short_description: shortDescription,
    long_description:
      "Cette fiche de démonstration montre le niveau de détail attendu sur la plateforme: contexte, méthodologie, outils IA utilisés, valeur métier et retour d’expérience.",
    external_url: "https://example.com",
    category,
    profession,
    project_status: "lancé",
    stage: "production",
    pricing_model: "abonnement",
    price_label: "À partir de 29 €/mois",
    qg_special_offer: false,
    qg_special_offer_details: null,
    beta_available: false,
    methodology:
      "Prototype sur Lovable, structuration des prompts sur ChatGPT, automatisations via Make, itérations UX avec les retours de la communauté.",
    problem_solved: "Réduction du temps perdu sur les tâches répétitives et amélioration de la clarté de pilotage.",
    target_audience: "Indépendants, petites équipes et experts métier souhaitant industrialiser un premier cas d’usage IA.",
    creator_feedback:
      "Le passage en production a surtout demandé de mieux encadrer les cas limites et de simplifier le parcours d’onboarding.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    is_featured: false,
    moderation_status: "approved",
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profiles: fallbackProfiles[0],
    project_tools: tools.map((tool_name) => ({ tool_name })),
    project_tags: tags.map((tag) => ({ tag })),
    likes_count: Math.floor(Math.random() * 40) + 4,
    comments_count: 0,
    has_liked: false,
    ...extras
  };
}

export const fallbackProjects: ProjectWithRelations[] = [
  createProject("1", "JuriPilot", "juripilot", "applications", "juridique", "Assistant IA pour préqualifier des dossiers et standardiser les réponses clients.", ["ChatGPT", "Make", "Cursor"], ["cabinet", "workflow"], { beta_available: true, qg_special_offer: true, qg_special_offer_details: "2 mois offerts pour les membres QG.", is_featured: true }),
  createProject("2", "EduCapsule", "educapsule", "sites web", "éducation", "Création de capsules pédagogiques prêtes à diffuser avec trames, quiz et synthèses.", ["Claude", "Canva", "Zapier"], ["formation", "microlearning"], { is_featured: true }),
  createProject("3", "Studio Persona", "studio-persona", "outils", "design", "Générateur de personas et d’angles créatifs pour équipes branding et UX.", ["Midjourney", "ChatGPT", "Notion"], ["branding", "UX"]),
  createProject("4", "Ops Radar", "ops-radar", "dashboards", "productivité", "Dashboard IA de suivi d’opérations, alertes et synthèses hebdomadaires.", ["Claude", "n8n", "Cursor"], ["pilotage", "reporting"], { beta_available: true }),
  createProject("5", "Talent Match IA", "talent-match-ia", "marketplaces", "RH", "Plateforme de matching entre profils freelances et besoins opérationnels.", ["ChatGPT", "Bubble", "Make"], ["matching", "freelance"]),
  createProject("6", "Immo Brief", "immo-brief", "agents IA", "immobilier", "Agent conversationnel qui prépare des synthèses de biens et des réponses acquéreurs.", ["Claude", "Replit", "n8n"], ["agent", "commercial"]),
  createProject("7", "CareFlow Notes", "careflow-notes", "automatisations", "santé", "Automatisation de comptes rendus et relances administratives à partir d’entretiens.", ["ChatGPT", "Zapier", "Make"], ["santé", "back-office"], { qg_special_offer: true, qg_special_offer_details: "Pack onboarding offert." }),
  createProject("8", "NoCode Sprint", "nocode-sprint", "produits no-code", "autre", "Kit d’accélération pour transformer une idée métier en MVP no-code testable.", ["Lovable", "Bubble", "ChatGPT"], ["MVP", "no-code"]),
  createProject("9", "Freelance Scope", "freelance-scope", "outils", "marketing", "Outil de cadrage d’offres et de livrables pour freelances IA et consultants.", ["ChatGPT", "Cursor", "Notion"], ["vente", "proposition"]),
  createProject("10", "QG Market Signals", "qg-market-signals", "dashboards", "marketing", "Veille enrichie par IA pour suivre niches, signaux faibles et angles de positionnement.", ["Claude", "Make", "Airtable"], ["veille", "insights"], { is_featured: true }),
  createProject("11", "BackOffice Pulse", "backoffice-pulse", "automatisations", "productivité", "Centre d’opérations interne pour suivre tâches, incidents et arbitrages d’équipe.", ["Cursor", "n8n", "ChatGPT"], ["ops", "équipe"]),
  createProject("12", "Cercle Communauté", "cercle-communaute", "applications", "autre", "Produit communautaire pour centraliser ressources, projets et entraide entre membres.", ["ChatGPT", "Make", "Bubble"], ["communauté", "membres"], { beta_available: true })
];
