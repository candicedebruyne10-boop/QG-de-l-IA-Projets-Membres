"use client";

import { useActionState } from "react";
import { signInAction, signUpAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const initialState = { error: "", success: "" };

export function AuthForm() {
  const [signInState, signInFormAction, signInPending] = useActionState(signInAction as any, initialState);
  const [signUpState, signUpFormAction, signUpPending] = useActionState(signUpAction as any, initialState);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-8">
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6A84B5]">Connexion</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#2D355A]">Retrouver votre espace membre</h2>
          </div>
          <form action={signInFormAction} className="space-y-4">
            <Input type="email" name="email" placeholder="vous@exemple.fr" required />
            <Input type="password" name="password" placeholder="Mot de passe" required />
            {signInState?.error ? <p className="text-sm text-red-600">{signInState.error}</p> : null}
            <Button type="submit" disabled={signInPending} className="w-full">
              {signInPending ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </div>
      </Card>

      <Card className="p-8">
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6A84B5]">Inscription</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#2D355A]">Créer un compte membre</h2>
          </div>
          <form action={signUpFormAction} className="space-y-4">
            <Input type="text" name="display_name" placeholder="Nom affiché" required />
            <Input type="email" name="email" placeholder="vous@exemple.fr" required />
            <Input type="password" name="password" placeholder="Créer un mot de passe" required />
            {signUpState?.error ? <p className="text-sm text-red-600">{signUpState.error}</p> : null}
            {signUpState?.success ? <p className="text-sm text-emerald-700">{signUpState.success}</p> : null}
            <Button type="submit" disabled={signUpPending} className="w-full">
              {signUpPending ? "Création..." : "Créer mon compte"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
