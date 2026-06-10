import { useQuery } from "@tanstack/react-query";
import { fetchScriptures } from "@/lib/api";
import type { Scripture } from "@/types";

/** Whole days since the Unix epoch — stable for a calendar day, changes daily. */
function dayNumber(): number {
  return Math.floor(Date.now() / 86_400_000);
}

/** Shared query for the public scriptures pool (reused across screens). */
export function useScripturesPool() {
  return useQuery({
    queryKey: ["scriptures", "pool"],
    queryFn: () => fetchScriptures(150),
    staleTime: Infinity,
  });
}

/**
 * A deterministic "verse of the day": the same verse all day, a new one each
 * day. Pulled from the public scriptures pool (no auth needed).
 */
export function useVerseOfTheDay() {
  const query = useScripturesPool();
  const pool = query.data ?? [];
  const verse: Scripture | null = pool.length
    ? pool[dayNumber() % pool.length]
    : null;

  return { ...query, verse };
}
