/**
 * Centralised, validated environment access.
 * Expo inlines `EXPO_PUBLIC_*` vars at build time.
 */
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  console.warn(
    "[FaithCards] EXPO_PUBLIC_SUPABASE_URL is not set. Copy .env.example to .env.",
  );
}
if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === "your-publishable-anon-key") {
  console.warn(
    "[FaithCards] EXPO_PUBLIC_SUPABASE_ANON_KEY is missing/placeholder. Auth & data calls will fail until set.",
  );
}

export const env = {
  supabaseUrl: SUPABASE_URL ?? "https://kqstctmmbxajikdxonwz.supabase.co",
  supabaseAnonKey: SUPABASE_ANON_KEY ?? "",
};
