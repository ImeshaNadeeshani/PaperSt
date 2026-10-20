import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const supabaseConfigured = Boolean(url && key?.startsWith("sb_publishable_"));
export const supabase = supabaseConfigured ? createClient(url, key) : null;

// Read-only connectivity check. Does not create tables or modify user data.
export async function checkSupabaseConnection() {
  if (!supabase) return { connected: false, message: "Supabase settings are missing or invalid." };
  const { error } = await supabase.from("products").select("id", { head: true }).limit(1);
  return error
    ? { connected: false, message: error.message }
    : { connected: true, message: "Products API is reachable. This does not verify all access policies." };
}
