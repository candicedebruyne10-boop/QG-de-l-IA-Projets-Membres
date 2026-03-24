import { aiToolOptions, pricingModelOptions, professionOptions, projectCategories, projectStageOptions, projectStatusOptions } from "@/lib/constants";
import type { ProjectWithRelations } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function SubmissionForm({
  action,
  project
}: {
  action: (formData: FormData) => unknown;
  project?: ProjectWithRelations | null;
}) {
  return (
    <div className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
      <form action={action as any} className="space-y-6">
        <Card className="grid gap-5 p-6 md:grid-cols-2 md:p-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#2D355A]">Informations principales</h2>
            <p className="mt-2 text-sm leading-7 text-[#6B7280]">
              Renseignez une fiche claire, crédible et exploitable par d’autres membres. L’objectif n’est pas de faire du bruit, mais de donner envie de tester.
            </p>
          </div>
          <div className="md:col-span-2">
            <Input name="title" defaultValue={project?.title} placeholder="Nom du projet" required />
          </div>
          <Input name="slug" defaultValue={project?.slug} placeholder="Slug public" required />
          <Input name="external_url" defaultValue={project?.external_url} placeholder="https://..." required />
          <div className="md:col-span-2">
            <Textarea name="short_description" defaultValue={project?.short_description} placeholder="Description courte" required className="min-h-[110px]" />
          </div>
          <div className="md:col-span-2">
            <Textarea name="long_description" defaultValue={project?.long_description} placeholder="Description détaillée" required />
          </div>
          <Select name="category" defaultValue={project?.category} required>
            <option value="">Catégorie</option>
            {projectCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Select name="profession" defaultValue={project?.profession} required>
            <option value="">Métier ciblé</option>
            {professionOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Select name="project_status" defaultValue={project?.project_status} required>
            <option value="">Statut du projet</option>
            {projectStatusOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Select name="stage" defaultValue={project?.stage} required>
            <option value="">Niveau d’avancement</option>
            {projectStageOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Select name="pricing_model" defaultValue={project?.pricing_model} required>
            <option value="">Modèle économique</option>
            {pricingModelOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Input name="price_label" defaultValue={project?.price_label || ""} placeholder="Prix affiché ou indication tarifaire" />
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-[#2D355A]">Outils IA utilisés</label>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {aiToolOptions.map((tool) => (
                <Checkbox
                  key={tool}
                  name="tools"
                  value={tool}
                  defaultChecked={project?.project_tools.some((item) => item.tool_name === tool)}
                  label={tool}
                />
              ))}
            </div>
          </div>
        </Card>

        <Card className="grid gap-5 p-6 md:grid-cols-2 md:p-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#2D355A]">Comment le projet a été construit</h2>
          </div>
          <div className="md:col-span-2">
            <Textarea name="methodology" defaultValue={project?.methodology} placeholder="Méthodologie utilisée" required />
          </div>
          <div className="md:col-span-2">
            <Textarea name="problem_solved" defaultValue={project?.problem_solved} placeholder="Problème résolu" required />
          </div>
          <div className="md:col-span-2">
            <Textarea name="target_audience" defaultValue={project?.target_audience} placeholder="Public cible" required />
          </div>
          <div className="md:col-span-2">
            <Textarea name="creator_feedback" defaultValue={project?.creator_feedback || ""} placeholder="Retour d’expérience du créateur" />
          </div>
          <Input
            name="tags"
            defaultValue={project?.project_tags.map((item) => item.tag).join(", ") || ""}
            placeholder="Tags séparés par des virgules"
            className="md:col-span-2"
          />
          <Select name="beta_available" defaultValue={project?.beta_available ? "oui" : "non"}>
            <option value="non">Bêta test proposé à la communauté ? Non</option>
            <option value="oui">Bêta test proposé à la communauté ? Oui</option>
          </Select>
          <Select name="qg_special_offer" defaultValue={project?.qg_special_offer ? "oui" : "non"}>
            <option value="non">Tarif préférentiel QG ? Non</option>
            <option value="oui">Tarif préférentiel QG ? Oui</option>
          </Select>
          <div className="md:col-span-2">
            <Textarea
              name="qg_special_offer_details"
              defaultValue={project?.qg_special_offer_details || ""}
              placeholder="Détail de l’offre spéciale QG"
              className="min-h-[110px]"
            />
          </div>
        </Card>

        <Card className="grid gap-5 p-6 md:grid-cols-2 md:p-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#2D355A]">Créateur et contact</h2>
          </div>
          <Input name="member_name" placeholder="Nom du membre" required />
          <Input name="contact_link" placeholder="Email, LinkedIn ou lien de contact" required />
          <div className="md:col-span-2">
            <Textarea name="creator_profile_bio" placeholder="Bio créateur courte" className="min-h-[100px]" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-[#2D355A]">Image / thumbnail</label>
            <Input type="file" name="thumbnail" accept="image/*" />
            <Input name="thumbnail_url" defaultValue={project?.thumbnail_url || ""} placeholder="Ou URL d’image existante" />
          </div>
          <div className="md:col-span-2 space-y-3">
            <Checkbox name="ai_confirmed" defaultChecked label="Je confirme que ce projet a été réalisé avec l’aide d’outils IA." />
            <Checkbox name="qg_member_confirmed" defaultChecked label="Je confirme être membre actif du QG." />
          </div>
        </Card>

        <Button type="submit" className="w-full sm:w-auto">
          {project ? "Mettre à jour le projet" : "Soumettre le projet à validation"}
        </Button>
      </form>

      <div className="space-y-6">
        <Card className="p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6A84B5]">Règles visibles</p>
          <ul className="mt-4 space-y-4 text-sm leading-7 text-[#55607A]">
            <li>Projet réalisé avec un outil IA.</li>
            <li>Membre actif du QG.</li>
            <li>Description des outils utilisés et de la méthodologie obligatoire.</li>
            <li>Bêta test proposé en exclusivité ici si possible.</li>
            <li>Tarif préférentiel communauté si possible.</li>
          </ul>
        </Card>

        <Card className="p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6A84B5]">Ce qui aide à être validé vite</p>
          <ul className="mt-4 space-y-4 text-sm leading-7 text-[#55607A]">
            <li>Une promesse claire en une phrase.</li>
            <li>Un cas d’usage concret, compréhensible sans contexte.</li>
            <li>Des outils IA cités précisément.</li>
            <li>Un lien de test ou de contact fonctionnel.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
