/**
 * Domain & API types for FaithCards.
 * Shapes mirror the OpenAPI contract in openapi.yaml.
 */

// ---------------------------------------------------------------- Auth
export interface AuthUser {
  id: string;
  email: string;
  role?: string;
}

export interface AuthSession {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  user: AuthUser;
}

// ------------------------------------------------------------- Lookups
export interface Lookup {
  id: number;
  slug: string;
  name: string;
}

// ----------------------------------------------------------- Scriptures
export interface Scripture {
  id: string;
  reference: string;
  text: string;
  theme: string | null;
  reflection_question: string | null;
  translation: string;
}

// ------------------------------------------------------------- Profile
/**
 * personality_type stored in DB uses the schema enum
 * (contemplative | activist | scholar | encourager | worshipper).
 * The UI presents these as the five "Seeker" personas — see
 * constants/personality.ts for the mapping.
 */
export type PersonalityType =
  | "contemplative"
  | "activist"
  | "scholar"
  | "encourager"
  | "worshipper";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  personality_type: PersonalityType | null;
  gender?: string | null;
  streak_count: number;
  total_cards_viewed: number;
  total_reflections: number;
  created_at: string;
}

// --------------------------------------------------------------- Cards
/** Row returned by the generate_daily_cards RPC. */
export interface CardItem {
  daily_card_id: string;
  card_date: string;
  card_position: number;
  scripture_id: string;
  verse_reference: string;
  verse_text: string;
  theme: string | null;
  reflection_question: string | null;
  category: string | null;
}

/** Normalised card used throughout the UI. */
export interface ScriptureCard {
  scriptureId: string;
  position: number;
  reference: string;
  text: string;
  theme: string | null;
  reflectionQuestion: string | null;
  category: string | null;
}

// -------------------------------------------------------------- Streak
export interface StreakResult {
  streak_count: number;
  last_session_date: string;
  incremented: boolean;
}

// ------------------------------------------------------------ Favorites
export interface Favorite {
  id: string;
  user_id: string;
  scripture_id: string;
  created_at: string;
  scriptures?: Scripture | null;
}

// ----------------------------------------------------------- Reflections
export interface Reflection {
  id: string;
  user_id: string;
  scripture_id: string;
  note: string;
  created_at: string;
  scriptures?: Scripture | null;
}

// --------------------------------------------------------------- Quotes
/** A quote row from the `quotes` table (public read). */
export interface Quote {
  id: string;
  text: string;
  author: string | null;
  source: string | null;
  theme: string | null;
  reflection_question: string | null;
  contributor: string | null;
  /** true = SamuelSU original; false = historical "great men of God". */
  is_original: boolean;
}

/** Row returned by the generate_daily_quote RPC (note: `quote_text`, not `text`). */
export interface DailyQuote {
  quote_id: string;
  quote_text: string;
  author: string | null;
  source: string | null;
  theme: string | null;
  reflection_question: string | null;
  contributor: string | null;
  is_original: boolean;
  category: string | null;
  quote_date: string;
}

// ------------------------------------------------- Notification prefs
export interface NotificationPreferences {
  user_id: string;
  enabled: boolean;
  reminder_time: string; // "07:30"
  timezone: string;
}
