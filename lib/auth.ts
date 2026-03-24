import { redirect } from "next/navigation";
import { getCurrentProfile, getCurrentUser } from "@/lib/queries";

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");
  return user;
}

export async function requireProfile() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/connexion");
  return profile;
}

export async function requireAdmin() {
  const profile = await requireProfile();
  if (profile.role !== "admin") redirect("/espace-membre?denied=admin");
  return profile;
}
