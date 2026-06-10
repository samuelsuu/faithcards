/** Tiny className joiner (clsx-lite) for conditional NativeWind classes. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Time-of-day greeting, e.g. "Good Morning". */
export function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return "Good Morning";
  if (h < 18) return "Good Afternoon";
  return "Good Evening";
}

/** First name from a full name, falling back to "Friend". */
export function firstName(fullName?: string | null): string {
  if (!fullName) return "Friend";
  return fullName.trim().split(/\s+/)[0] || "Friend";
}

/** YYYY-MM-DD for the local day. */
export function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/** Human date like "June 10, 2026". */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
