import { z } from "zod";
import { slugify } from "@/lib/utils";

const yesNo = z.enum(["oui", "non"]).transform((value) => value === "oui");

export const projectFormSchema = z.object({
  title: z.string().min(3, "Le nom du projet est requis."),
  slug: z.string().min(3, "Le slug est requis."),
  external_url: z.string().url("Merci d’indiquer une URL valide."),
  short_description: z.string().min(20, "Ajoutez une description courte plus précise."),
  long_description: z.string().min(80, "Ajoutez une description détaillée plus complète."),
  category: z.string().min(1, "Choisissez une catégorie."),
  profession: z.string().min(1, "Choisissez un métier ciblé."),
  project_status: z.string().min(1, "Choisissez le statut du projet."),
  stage: z.string().min(1, "Choisissez le niveau d’avancement."),
  pricing_model: z.string().min(1, "Choisissez le modèle économique."),
  price_label: z.string().optional(),
  methodology: z.string().min(20, "Expliquez votre méthodologie."),
  problem_solved: z.string().min(20, "Précisez le problème résolu."),
  target_audience: z.string().min(20, "Précisez le public cible."),
  creator_feedback: z.string().optional(),
  tools: z.array(z.string()).min(1, "Indiquez au moins un outil IA."),
  tags: z.array(z.string()).default([]),
  qg_special_offer: z.boolean(),
  qg_special_offer_details: z.string().optional(),
  beta_available: z.boolean(),
  member_name: z.string().min(2, "Indiquez votre nom."),
  contact_link: z.string().min(3, "Ajoutez un lien ou un email de contact."),
  creator_profile_bio: z.string().optional(),
  ai_confirmed: z.boolean().refine(Boolean, "La confirmation d’usage d’outils IA est obligatoire."),
  qg_member_confirmed: z.boolean().refine(Boolean, "La confirmation de membership QG est obligatoire."),
  thumbnail_url: z.string().optional()
});

export function normalizeProjectFormData(formData: FormData) {
  const tools = formData.getAll("tools").map(String).filter(Boolean);
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const parsed = projectFormSchema.parse({
    title: String(formData.get("title") ?? ""),
    slug: slugify(String(formData.get("slug") ?? "")),
    external_url: String(formData.get("external_url") ?? ""),
    short_description: String(formData.get("short_description") ?? ""),
    long_description: String(formData.get("long_description") ?? ""),
    category: String(formData.get("category") ?? ""),
    profession: String(formData.get("profession") ?? ""),
    project_status: String(formData.get("project_status") ?? ""),
    stage: String(formData.get("stage") ?? ""),
    pricing_model: String(formData.get("pricing_model") ?? ""),
    price_label: String(formData.get("price_label") ?? ""),
    methodology: String(formData.get("methodology") ?? ""),
    problem_solved: String(formData.get("problem_solved") ?? ""),
    target_audience: String(formData.get("target_audience") ?? ""),
    creator_feedback: String(formData.get("creator_feedback") ?? ""),
    tools,
    tags,
    qg_special_offer: yesNo.parse(String(formData.get("qg_special_offer") ?? "non")),
    qg_special_offer_details: String(formData.get("qg_special_offer_details") ?? ""),
    beta_available: yesNo.parse(String(formData.get("beta_available") ?? "non")),
    member_name: String(formData.get("member_name") ?? ""),
    contact_link: String(formData.get("contact_link") ?? ""),
    creator_profile_bio: String(formData.get("creator_profile_bio") ?? ""),
    ai_confirmed: formData.get("ai_confirmed") === "on",
    qg_member_confirmed: formData.get("qg_member_confirmed") === "on",
    thumbnail_url: String(formData.get("thumbnail_url") ?? "")
  });

  return parsed;
}
