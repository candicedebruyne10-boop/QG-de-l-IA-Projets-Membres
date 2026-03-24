"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const authSchema = z.object({
  email: z.email("Adresse email invalide."),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères."),
  display_name: z.string().optional()
});

type AuthActionState = {
  error?: string;
  success?: string;
};

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Configurez Supabase pour activer la connexion." };
  }

  const payload = authSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? "")
  });

  if (!payload.success) {
    return { error: payload.error.issues[0]?.message };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: payload.data.email,
    password: payload.data.password
  });

  if (error) return { error: error.message };

  redirect("/espace-membre");
}

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Configurez Supabase pour activer l’inscription." };
  }

  const payload = authSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    display_name: String(formData.get("display_name") ?? "")
  });

  if (!payload.success) {
    return { error: payload.error.issues[0]?.message };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email: payload.data.email,
    password: payload.data.password,
    options: {
      data: {
        display_name: payload.data.display_name || payload.data.email.split("@")[0]
      }
    }
  });

  if (error) return { error: error.message };

  return { success: "Compte créé. Vous pouvez maintenant vous connecter." };
}

export async function signOutAction() {
  if (!isSupabaseConfigured()) redirect("/");

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();

  redirect("/");
}