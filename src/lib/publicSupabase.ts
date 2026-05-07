// Dedicated anonymous Supabase client for public-facing submissions.
// Uses a separate storage key so it never inherits an admin session that
// might be active in this browser tab — guarantees inserts run as `anon`
// and satisfy the "Public can submit applications" RLS policy.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export const publicSupabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    storageKey: "ksitm-public-anon",
  },
});
