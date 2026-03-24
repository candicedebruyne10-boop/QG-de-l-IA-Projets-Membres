export type Role = "member" | "admin";
export type ModerationStatus = "pending" | "approved" | "rejected";

export type Profile = {
  id: string;
  display_name: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: Role;
  created_at: string;
};

export type ProjectRow = {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  short_description: string;
  long_description: string;
  external_url: string;
  category: string;
  profession: string;
  project_status: string;
  stage: string;
  pricing_model: string;
  price_label: string | null;
  qg_special_offer: boolean;
  qg_special_offer_details: string | null;
  beta_available: boolean;
  methodology: string;
  problem_solved: string;
  target_audience: string;
  creator_feedback: string | null;
  thumbnail_url: string | null;
  is_featured: boolean;
  moderation_status: ModerationStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectWithRelations = ProjectRow & {
  profiles: Pick<Profile, "id" | "display_name" | "username" | "avatar_url" | "bio"> | null;
  project_tools: { tool_name: string }[];
  project_tags: { tag: string }[];
  likes_count?: number;
  comments_count?: number;
  has_liked?: boolean;
};

export type ProjectFilters = {
  q?: string;
  status?: string;
  profession?: string;
  pricing?: string;
  stage?: string;
  tool?: string;
  beta?: string;
  qgOffer?: string;
};

export type BetaRequest = {
  id: string;
  project_id: string;
  requester_id: string;
  message: string | null;
  created_at: string;
  profiles?: Pick<Profile, "display_name" | "username"> | null;
};

export type Comment = {
  id: string;
  project_id: string;
  user_id: string;
  body: string;
  created_at: string;
  is_visible: boolean;
  profiles?: Pick<Profile, "display_name" | "username" | "avatar_url"> | null;
};
