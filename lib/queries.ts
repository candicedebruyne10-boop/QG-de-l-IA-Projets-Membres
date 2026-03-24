import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { fallbackProjects, fallbackProfiles } from "@/lib/sample-data";
import type { BetaRequest, Comment, Profile, ProjectFilters, ProjectWithRelations } from "@/types";

function applyProjectFilters(projects: ProjectWithRelations[], filters: ProjectFilters) {
  return projects.filter((project) => {
    const term = filters.q?.toLowerCase().trim();
    const toolNames = project.project_tools.map((tool) => tool.tool_name.toLowerCase());

    if (
      term &&
      ![
        project.title,
        project.short_description,
        project.long_description,
        project.profession,
        project.category
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    ) {
      return false;
    }

    if (filters.status && project.project_status !== filters.status) return false;
    if (filters.profession && project.profession !== filters.profession) return false;
    if (filters.pricing && project.pricing_model !== filters.pricing) return false;
    if (filters.stage && project.stage !== filters.stage) return false;
    if (filters.tool && !toolNames.includes(filters.tool.toLowerCase())) return false;
    if (filters.beta && String(project.beta_available) !== filters.beta) return false;
    if (filters.qgOffer && String(project.qg_special_offer) !== filters.qgOffer) return false;

    return true;
  });
}

export const getCurrentUser = cache(async () => {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
});

export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  if (!isSupabaseConfigured()) return null;
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return (data as Profile | null) ?? null;
});

export const getHomepageProjects = cache(async () => {
  const projects = await getApprovedProjects({});
  return {
    featured: projects.filter((project) => project.is_featured).slice(0, 3),
    latest: [...projects].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, 6),
    gems: [...projects].sort((a, b) => (b.likes_count ?? 0) - (a.likes_count ?? 0)).slice(0, 4),
    beta: projects.filter((project) => project.beta_available).slice(0, 4)
  };
});

export const getApprovedProjects = cache(async (filters: ProjectFilters): Promise<ProjectWithRelations[]> => {
  if (!isSupabaseConfigured()) {
    return applyProjectFilters(
      fallbackProjects.filter((project) => project.moderation_status === "approved"),
      filters
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      "*, profiles(display_name, username, avatar_url, bio, id), project_tools(tool_name), project_tags(tag)"
    )
    .eq("moderation_status", "approved")
    .order("is_featured", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) throw error;

  const projects = (data ?? []) as ProjectWithRelations[];
  const counts = await getLikesCountMap(projects.map((project) => project.id));
  return applyProjectFilters(
    projects.map((project) => ({ ...project, likes_count: counts[project.id] ?? 0 })),
    filters
  );
});

export const getProjectBySlug = cache(async (slug: string): Promise<ProjectWithRelations | null> => {
  if (!isSupabaseConfigured()) {
    return fallbackProjects.find((project) => project.slug === slug) ?? null;
  }

  const supabase = await createSupabaseServerClient();
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("projects")
    .select(
      "*, profiles(display_name, username, avatar_url, bio, id), project_tools(tool_name), project_tags(tag)"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const project = data as ProjectWithRelations;
  if (project.moderation_status !== "approved" && project.user_id !== user?.id) {
    const profile = await getCurrentProfile();
    if (profile?.role !== "admin") return null;
  }

  const counts = await getLikesCountMap([project.id]);
  let hasLiked = false;

  if (user) {
    const { data: like } = await supabase
      .from("project_likes")
      .select("id")
      .eq("project_id", project.id)
      .eq("user_id", user.id)
      .maybeSingle();
    hasLiked = Boolean(like);
  }

  return { ...project, likes_count: counts[project.id] ?? 0, has_liked: hasLiked };
});

export const getMemberProjects = cache(async () => {
  if (!isSupabaseConfigured()) return fallbackProjects;
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, profiles(display_name, username, avatar_url, bio, id), project_tools(tool_name), project_tags(tag)")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  const projects = (data ?? []) as ProjectWithRelations[];
  const counts = await getLikesCountMap(projects.map((project) => project.id));

  return projects.map((project) => ({ ...project, likes_count: counts[project.id] ?? 0 }));
});

export const getAdminProjects = cache(async (status?: string) => {
  if (!isSupabaseConfigured()) return fallbackProjects;
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("projects")
    .select("*, profiles(display_name, username, avatar_url, bio, id), project_tools(tool_name), project_tags(tag)")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("moderation_status", status);

  const { data, error } = await query;
  if (error) throw error;

  const projects = (data ?? []) as ProjectWithRelations[];
  const counts = await getLikesCountMap(projects.map((project) => project.id));
  return projects.map((project) => ({ ...project, likes_count: counts[project.id] ?? 0 }));
});

export const getProjectComments = cache(async (projectId: string): Promise<Comment[]> => {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("comments")
    .select("*, profiles(display_name, username, avatar_url)")
    .eq("project_id", projectId)
    .eq("is_visible", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Comment[];
});

export const getBetaRequestsForCurrentCreator = cache(async (): Promise<BetaRequest[]> => {
  if (!isSupabaseConfigured()) return [];
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("beta_requests")
    .select("*, profiles!beta_requests_requester_id_fkey(display_name, username), projects!inner(user_id)")
    .eq("projects.user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((item: any) => ({
    id: item.id,
    project_id: item.project_id,
    requester_id: item.requester_id,
    message: item.message,
    created_at: item.created_at,
    profiles: item.profiles
  })) as BetaRequest[];
});

export const getTopTools = cache(async () => {
  if (!isSupabaseConfigured()) {
    return [
      { tool_name: "ChatGPT", count: 10 },
      { tool_name: "Claude", count: 7 },
      { tool_name: "Make", count: 6 },
      { tool_name: "Cursor", count: 5 },
      { tool_name: "n8n", count: 4 }
    ];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("project_tools").select("tool_name");
  if (error) throw error;

  const counts = (data ?? []).reduce<Record<string, number>>((acc, row: { tool_name: string }) => {
    acc[row.tool_name] = (acc[row.tool_name] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([tool_name, count]) => ({ tool_name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
});

async function getLikesCountMap(projectIds: string[]) {
  if (!isSupabaseConfigured() || projectIds.length === 0) {
    return Object.fromEntries(fallbackProjects.map((project) => [project.id, project.likes_count ?? 0]));
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("project_likes").select("project_id").in("project_id", projectIds);
  if (error) throw error;

  return (data ?? []).reduce<Record<string, number>>((acc, row: { project_id: string }) => {
    acc[row.project_id] = (acc[row.project_id] ?? 0) + 1;
    return acc;
  }, {});
}
