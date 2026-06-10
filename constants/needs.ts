/**
 * Spiritual-need options shown in the Home need selector. `slug` is sent to the
 * generate_daily_cards RPC and MUST be a slug the backend recognises.
 * Valid backend need slugs: comfort, guidance, strength, forgiveness, healing,
 * provision, patience, courage, wisdom, love, protection, purpose.
 */
export interface NeedOption {
  slug: string;
  label: string;
  icon: string; // Ionicons name
}

export const NEEDS: NeedOption[] = [
  { slug: "comfort", label: "Peace", icon: "leaf-outline" },
  { slug: "wisdom", label: "Wisdom", icon: "bulb-outline" },
  { slug: "strength", label: "Strength", icon: "barbell-outline" },
  { slug: "healing", label: "Healing", icon: "heart-circle-outline" },
  { slug: "guidance", label: "Guidance", icon: "compass-outline" },
  { slug: "courage", label: "Courage", icon: "flame-outline" },
  { slug: "love", label: "Encouragement", icon: "sunny-outline" },
  { slug: "purpose", label: "Purpose", icon: "navigate-outline" },
  { slug: "provision", label: "Provision", icon: "gift-outline" },
  { slug: "patience", label: "Patience", icon: "hourglass-outline" },
  { slug: "forgiveness", label: "Forgiveness", icon: "hand-left-outline" },
  { slug: "protection", label: "Protection", icon: "shield-checkmark-outline" },
];
