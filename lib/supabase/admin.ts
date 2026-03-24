import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseServiceRoleKey, supabaseUrl } from "@/lib/supabase/env";

export function createSupabaseAdminClient() {
  if (!supabaseUrl || !(supabaseServiceRoleKey || supabaseAnonKey)) {
    throw new Error("Variables Supabase manquantes.");
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey ?? supabaseAnonKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
