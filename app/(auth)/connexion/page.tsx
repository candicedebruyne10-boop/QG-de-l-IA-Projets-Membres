import { AuthForm } from "@/components/auth-form";
import { SectionTitle } from "@/components/section-title";

export default function LoginPage() {
  return (
    <div className="space-y-8 pb-12">
      <SectionTitle
        eyebrow="Accès"
        title="Connexion et inscription"
        description="Créez votre compte pour publier un projet, suivre vos validations, liker des fiches et demander un accès bêta."
      />
      <AuthForm />
    </div>
  );
}
