import { supabase } from "./supabase";
import type {
  CardItem,
  DailyQuote,
  Favorite,
  Lookup,
  NotificationPreferences,
  PersonalityType,
  Profile,
  Quote,
  Reflection,
  Scripture,
  ScriptureCard,
  StreakResult,
} from "@/types";

/**
 * Thin, typed wrappers over the FaithCards backend (see openapi.yaml).
 * We use the supabase-js client so apikey + bearer headers and RLS are handled
 * automatically. Each function throws on error so React Query can surface it.
 */

function unwrap<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(error.message);
  return (data ?? ([] as unknown)) as T;
}

// --------------------------------------------------------------- Engine
export async function generateDailyCards(params: {
  mood?: string | null;
  need?: string | null;
}): Promise<ScriptureCard[]> {
  // The live RPC accepts only p_mood / p_need (both optional slugs). PostgREST
  // matches functions by exact argument names, so we must not send extras.
  const { data, error } = await supabase.rpc("generate_daily_cards", {
    p_mood: params.mood ?? null,
    p_need: params.need ?? null,
  });
  const rows = unwrap<CardItem[]>(data, error);
  return rows
    .slice()
    .sort((a, b) => a.card_position - b.card_position)
    .map(
      (r): ScriptureCard => ({
        scriptureId: r.scripture_id,
        position: r.card_position,
        reference: r.verse_reference,
        text: r.verse_text,
        theme: r.theme,
        reflectionQuestion: r.reflection_question,
        category: r.category,
      }),
    );
}

export async function updateStreak(): Promise<StreakResult | null> {
  const { data, error } = await supabase.rpc("update_user_streak", {});
  const rows = unwrap<StreakResult[]>(data, error);
  return rows[0] ?? null;
}

// --------------------------------------------------------------- Quotes
/** Quote of the day (auth required; idempotent per calendar day). */
export async function generateDailyQuote(): Promise<DailyQuote | null> {
  const { data, error } = await supabase.rpc("generate_daily_quote");
  const rows = unwrap<DailyQuote[]>(data, error);
  return rows[0] ?? null;
}

/** Browse all quotes (public read). Screens filter client-side. */
export async function fetchQuotes(): Promise<Quote[]> {
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .order("id");
  return unwrap<Quote[]>(data, error);
}

export async function fetchQuoteFavorites(): Promise<string[]> {
  const { data, error } = await supabase
    .from("quote_favorites")
    .select("quote_id");
  const rows = unwrap<{ quote_id: string }[]>(data, error);
  return rows.map((r) => r.quote_id);
}

export async function addQuoteFavorite(
  userId: string,
  quoteId: string,
): Promise<void> {
  const { error } = await supabase
    .from("quote_favorites")
    .insert({ user_id: userId, quote_id: quoteId });
  if (error) throw new Error(error.message);
}

export async function removeQuoteFavorite(quoteId: string): Promise<void> {
  const { error } = await supabase
    .from("quote_favorites")
    .delete()
    .eq("quote_id", quoteId);
  if (error) throw new Error(error.message);
}

// -------------------------------------------------------------- Content
export async function fetchMoods(): Promise<Lookup[]> {
  const { data, error } = await supabase
    .from("moods")
    .select("id,slug,name")
    .order("id");
  return unwrap<Lookup[]>(data, error);
}

export async function fetchNeeds(): Promise<Lookup[]> {
  const { data, error } = await supabase
    .from("needs")
    .select("id,slug,name")
    .order("id");
  return unwrap<Lookup[]>(data, error);
}

/** Public read of a pool of scriptures (used for the daily "verse of calm"). */
export async function fetchScriptures(limit = 150): Promise<Scripture[]> {
  const { data, error } = await supabase
    .from("scriptures")
    .select("id,reference,text,theme,reflection_question,translation")
    .order("id")
    .limit(limit);
  return unwrap<Scripture[]>(data, error);
}

export async function fetchScripture(id: string): Promise<Scripture | null> {
  const { data, error } = await supabase
    .from("scriptures")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

// -------------------------------------------------------------- Profile
export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProfile(
  userId: string,
  // Only columns that exist on `profiles` (see openapi.yaml). `gender` is
  // collected during onboarding but kept client-side — the table has no column.
  patch: Partial<
    Pick<Profile, "full_name"> & { personality_type: PersonalityType }
  >,
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", userId);
  if (error) throw new Error(error.message);
}

// ------------------------------------------------------------ Favorites
export async function fetchFavorites(): Promise<Favorite[]> {
  const { data, error } = await supabase
    .from("favorites")
    .select(
      "id,user_id,scripture_id,created_at,scriptures(id,reference,text,theme,reflection_question,translation)",
    )
    .order("created_at", { ascending: false });
  return unwrap<Favorite[]>(data as unknown as Favorite[], error);
}

export async function addFavorite(
  userId: string,
  scriptureId: string,
): Promise<void> {
  const { error } = await supabase
    .from("favorites")
    .insert({ user_id: userId, scripture_id: scriptureId });
  if (error) throw new Error(error.message);
}

export async function removeFavorite(scriptureId: string): Promise<void> {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("scripture_id", scriptureId);
  if (error) throw new Error(error.message);
}

// ----------------------------------------------------------- Reflections
export async function fetchReflections(): Promise<Reflection[]> {
  const { data, error } = await supabase
    .from("reflections")
    .select(
      "id,user_id,scripture_id,note,created_at,scriptures(id,reference,text,theme,reflection_question,translation)",
    )
    .order("created_at", { ascending: false });
  return unwrap<Reflection[]>(data as unknown as Reflection[], error);
}

export async function saveReflection(
  userId: string,
  scriptureId: string,
  note: string,
): Promise<void> {
  const { error } = await supabase
    .from("reflections")
    .insert({ user_id: userId, scripture_id: scriptureId, note });
  if (error) throw new Error(error.message);
}

export async function updateReflection(
  id: string,
  note: string,
): Promise<void> {
  const { error } = await supabase
    .from("reflections")
    .update({ note })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteReflection(id: string): Promise<void> {
  const { error } = await supabase.from("reflections").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// --------------------------------------------------------------- History
export async function recordHistory(
  userId: string,
  scriptureId: string,
): Promise<void> {
  // Best-effort; feeds the recommender. Ignore duplicate/constraint noise.
  const { error } = await supabase
    .from("user_scripture_history")
    .insert({ user_id: userId, scripture_id: scriptureId });
  if (error && !/duplicate|unique/i.test(error.message)) {
    throw new Error(error.message);
  }
}

// ---------------------------------------------------- Notification prefs
export async function fetchNotificationPrefs(): Promise<NotificationPreferences | null> {
  const { data, error } = await supabase
    .from("notification_preferences")
    .select("*")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateNotificationPrefs(
  userId: string,
  patch: Partial<Omit<NotificationPreferences, "user_id">>,
): Promise<void> {
  const { error } = await supabase
    .from("notification_preferences")
    .update(patch)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
}
