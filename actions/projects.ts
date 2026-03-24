"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { normalizeProjectFormData } from "@/lib/project-form";
import { requireAdmin, requireProfile, requireUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

async function uploadThumbnailIfAny(file: File | null, userId: string, slug: string) {
  if (!file || file.size === 0) return null;
  const supabase = await createSupabaseServerClient();
  const extension = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${slugify(slug)}-${Date.now()}.${extension}`;
  const { error } = await supabase.storage.from("project-thumbnails").upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type || "image/jpeg"
  });
  if (error) throw error;

  const { data } = supabase.storage.from("project-thumbnails").getPublicUrl(path);
  return data.publicUrl;
}

async function syncProjectRelations(projectId: string, tools: string[], tags: string[]) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("project_tools").delete().eq("project_id", projectId);
  await supabase.from("project_tags").delete().eq("project_id", projectId);

  if (tools.length) {
    await supabase.from("project_tools").insert(tools.map((tool_name) => ({ project_id: projectId, tool_name })));
  }

  if (tags.length) {
    await supabase.from("project_tags").insert(tags.map((tag) => ({ project_id: projectId, tag })));
  }
}

export async function createProjectAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    throw new Error("Configurez Supabase pour publier un projet.");
  }

  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const parsed = normalizeProjectFormData(formData);
  const file = formData.get("thumbnail") as File | null;
  const thumbnailUrl = parsed.thumbnail_url || (await uploadThumbnailIfAny(file, user.id, parsed.slug));

  const { error } = await supabase.from("projects").insert({
    user_id: user.id,
    title: parsed.title,
    slug: parsed.slug,
    short_description: parsed.short_description,
    long_description: parsed.long_description,
    external_url: parsed.external_url,
    category: parsed.category,
    profession: parsed.profession,
    project_status: parsed.project_status,
    stage: parsed.stage,
    pricing_model: parsed.pricing_model,
    price_label: parsed.price_label || null,
    qg_special_offer: parsed.qg_special_offer,
    qg_special_offer_details: parsed.qg_special_offer ? parsed.qg_special_offer_details || null : null,
    beta_available: parsed.beta_available,
    methodology: parsed.methodology,
    problem_solved: parsed.problem_solved,
    target_audience: parsed.target_audience,
    creator_feedback: parsed.creator_feedback || null,
    thumbnail_url: thumbnailUrl,
    moderation_status: "pending"
  });

  if (error) throw new Error(error.message);

  const { data: project } = await supabase.from("projects").select("id").eq("slug", parsed.slug).maybeSingle();
  if (project?.id) {
    await syncProjectRelations(project.id, parsed.tools, parsed.tags);
  }

  await supabase
    .from("profiles")
    .update({
      display_name: parsed.member_name,
      bio: parsed.creator_profile_bio || null
    })
    .eq("id", user.id);

  revalidatePath("/");
  revalidatePath("/catalogue");
  revalidatePath("/espace-membre");
  redirect("/espace-membre?created=1");
}

export async function updateProjectAction(projectId: string, formData: FormData) {
  if (!isSupabaseConfigured()) {
    throw new Error("Configurez Supabase pour modifier un projet.");
  }

  await requireProfile();
  const parsed = normalizeProjectFormData(formData);
  const file = formData.get("thumbnail") as File | null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const thumbnailUrl = parsed.thumbnail_url || (await uploadThumbnailIfAny(file, user.id, parsed.slug));
  const { error } = await supabase
    .from("projects")
    .update({
      title: parsed.title,
      slug: parsed.slug,
      short_description: parsed.short_description,
      long_description: parsed.long_description,
      external_url: parsed.external_url,
      category: parsed.category,
      profession: parsed.profession,
      project_status: parsed.project_status,
      stage: parsed.stage,
      pricing_model: parsed.pricing_model,
      price_label: parsed.price_label || null,
      qg_special_offer: parsed.qg_special_offer,
      qg_special_offer_details: parsed.qg_special_offer ? parsed.qg_special_offer_details || null : null,
      beta_available: parsed.beta_available,
      methodology: parsed.methodology,
      problem_solved: parsed.problem_solved,
      target_audience: parsed.target_audience,
      creator_feedback: parsed.creator_feedback || null,
      thumbnail_url: thumbnailUrl,
      updated_at: new Date().toISOString(),
      moderation_status: "pending"
    })
    .eq("id", projectId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  await syncProjectRelations(projectId, parsed.tools, parsed.tags);
  revalidatePath(`/catalogue/${parsed.slug}`);
  revalidatePath("/catalogue");
  revalidatePath("/espace-membre");
  redirect("/espace-membre?updated=1");
}

export async function moderateProjectAction(projectId: string, nextStatus: "approved" | "rejected") {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("projects")
    .update({
      moderation_status: nextStatus,
      published_at: nextStatus === "approved" ? new Date().toISOString() : null
    })
    .eq("id", projectId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/catalogue");
  revalidatePath("/");
}

export async function toggleFeaturedAction(projectId: string, isFeatured: boolean) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("projects").update({ is_featured: !isFeatured }).eq("id", projectId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
}
