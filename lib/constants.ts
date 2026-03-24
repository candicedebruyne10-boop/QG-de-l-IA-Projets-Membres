export const siteConfig = {
  name: "QG de l’IA – Projets Membres",
  description:
    "Une vitrine privée et soignée pour découvrir, soutenir et tester les projets IA conçus par les membres du QG."
};

export const projectCategories = [
  "applications",
  "sites web",
  "outils",
  "dashboards",
  "automatisations",
  "agents IA",
  "marketplaces",
  "produits no-code"
] as const;

export const professionOptions = [
  "juridique",
  "éducation",
  "design",
  "marketing",
  "RH",
  "productivité",
  "immobilier",
  "santé",
  "autre"
] as const;

export const projectStatusOptions = ["en cours", "terminé", "lancé"] as const;
export const projectStageOptions = ["idée", "MVP", "bêta", "production"] as const;
export const pricingModelOptions = ["gratuit", "payant", "abonnement", "freemium"] as const;

export const aiToolOptions = [
  "ChatGPT",
  "Claude",
  "Midjourney",
  "Lovable",
  "Bolt",
  "Bubble",
  "Wix",
  "Make",
  "Zapier",
  "n8n",
  "Cursor",
  "Replit",
  "autre"
] as const;

export const moderationStatuses = [
  { label: "En attente", value: "pending" },
  { label: "Validé", value: "approved" },
  { label: "Refusé", value: "rejected" }
] as const;

export const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/proposer-un-projet", label: "Proposer un projet" },
  { href: "/a-propos", label: "À propos" },
  { href: "/regles-de-publication", label: "Règles de publication" },
  { href: "/avantages-membres", label: "Avantages membres" }
];

export const footerLinks = [
  { href: "/a-propos", label: "À propos" },
  { href: "/regles-de-publication", label: "Règles de publication" },
  { href: "/avantages-membres", label: "Avantages membres" },
  { href: "/catalogue", label: "Catalogue" }
];
