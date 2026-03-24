"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function toggleProjectLikeAction(projectId: string, slug: string) {
  if (!isSupabaseConfigured()) return { error: "Supabase n’est pas configuré." };
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const { data: existing } = await supabase
    .from("project_likes")
    .select("id")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing?.id) {
    await supabase.from("project_likes").delete().eq("id", existing.id);
  } else {
    await supabase.from("project_likes").insert({ project_id: projectId, user_id: user.id });
  }

  revalidatePath(`/catalogue/${slug}`);
  revalidatePath("/catalogue");
  revalidatePath("/");
}

export async function createBetaRequestAction(projectId: string, slug: string, formData: FormData) {
  if (!isSupabaseConfigured()) return { error: "Supabase n’est pas configuré." };
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const message = String(formData.get("message") ?? "");

  const { error } = await supabase
    .from("beta_requests")
    .insert({ project_id: projectId, requester_id: user.id, message: message || null });

  if (error) return { error: error.message };
  revalidatePath(`/catalogue/${slug}`);
  revalidatePath("/espace-membre");
  return { success: "Votre demande bêta a bien été envoyée." };
}
