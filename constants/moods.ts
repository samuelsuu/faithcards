/**
 * Mood options shown in the Home mood selector. `slug` is sent to the
 * generate_daily_cards RPC and MUST be a slug the backend recognises.
 * Valid backend mood slugs: anxious, sad, fearful, grateful, joyful, lonely,
 * angry, discouraged, hopeful, peaceful, overwhelmed, doubtful.
 */
export interface MoodOption {
  slug: string;
  label: string;
  emoji: string;
}

export const MOODS: MoodOption[] = [
  { slug: "joyful", label: "Happy", emoji: "😊" },
  { slug: "grateful", label: "Grateful", emoji: "🙏" },
  { slug: "hopeful", label: "Hopeful", emoji: "🌅" },
  { slug: "peaceful", label: "Peaceful", emoji: "🕊️" },
  { slug: "anxious", label: "Anxious", emoji: "😟" },
  { slug: "overwhelmed", label: "Stressed", emoji: "😰" },
  { slug: "lonely", label: "Lonely", emoji: "🌧️" },
  { slug: "doubtful", label: "Confused", emoji: "🤔" },
  { slug: "angry", label: "Angry", emoji: "😤" },
  { slug: "discouraged", label: "Tired", emoji: "😴" },
  { slug: "sad", label: "Sad", emoji: "😢" },
  { slug: "fearful", label: "Fearful", emoji: "😨" },
];
