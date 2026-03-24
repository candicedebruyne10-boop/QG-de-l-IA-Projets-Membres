"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const schema = z.object({
  body: z.string().min(8, "Votre retour est trop court.")
});

export async function addCommentAction(projectId: string, slug: string, formData: FormData) {
  if (!isSupabaseConfigured()) return { error: "Supabase n’est pas configuré." };
  const user = await requireUser();
  const parsed = schema.safeParse({ body: String(formData.get("body") ?? "") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("comments").insert({
    project_id: projectId,
    user_id: user.id,
    body: parsed.data.body
  });
  if (error) return { error: error.message };

  revalidatePath(`/catalogue/${slug}`);
  return { success: "Votre commentaire a été publié." };
}
