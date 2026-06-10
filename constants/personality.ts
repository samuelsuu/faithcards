import type { PersonalityType } from "@/types";

/**
 * The app presents five "personas". Each maps 1:1 to the DB enum
 * (PersonalityType) that the API/profile stores.
 */
export type PersonaKey =
  | "faith_builder"
  | "peace_seeker"
  | "wisdom_seeker"
  | "purpose_seeker"
  | "encouragement_seeker";

export interface Persona {
  key: PersonaKey;
  /** DB enum value persisted to profiles.personality_type */
  dbValue: PersonalityType;
  title: string;
  emoji: string;
  blurb: string;
  /** Need slugs this persona naturally leans toward (used as a default). */
  affinityNeed: string;
}

export const PERSONAS: Record<PersonaKey, Persona> = {
  faith_builder: {
    key: "faith_builder",
    dbValue: "worshipper",
    title: "Faith Builder",
    emoji: "🔥",
    blurb:
      "You grow by trusting God's promises and stepping out in bold faith. Worship fuels your walk.",
    affinityNeed: "faith",
  },
  peace_seeker: {
    key: "peace_seeker",
    dbValue: "contemplative",
    title: "Peace Seeker",
    emoji: "🕊️",
    blurb:
      "You find God in stillness. Rest, prayer and quiet reflection restore your soul.",
    affinityNeed: "peace",
  },
  wisdom_seeker: {
    key: "wisdom_seeker",
    dbValue: "scholar",
    title: "Wisdom Seeker",
    emoji: "📖",
    blurb:
      "You love to understand. Studying Scripture and discerning truth shapes your decisions.",
    affinityNeed: "wisdom",
  },
  purpose_seeker: {
    key: "purpose_seeker",
    dbValue: "activist",
    title: "Purpose Seeker",
    emoji: "🧭",
    blurb:
      "You're driven to live on mission. You meet God in action, service and purpose.",
    affinityNeed: "guidance",
  },
  encouragement_seeker: {
    key: "encouragement_seeker",
    dbValue: "encourager",
    title: "Encouragement Seeker",
    emoji: "🌅",
    blurb:
      "You're lifted by hope and you lift others. Testimonies and encouragement keep you going.",
    affinityNeed: "encouragement",
  },
};

export const PERSONA_LIST = Object.values(PERSONAS);

/** Resolve a persona from the stored DB enum value. */
export function personaFromDbValue(
  value: PersonalityType | null | undefined,
): Persona | null {
  if (!value) return null;
  return PERSONA_LIST.find((p) => p.dbValue === value) ?? null;
}
