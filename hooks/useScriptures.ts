import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchScriptures, fetchScripturesPage } from "@/lib/api";
import type { Scripture } from "@/types";

const PAGE_SIZE = 40;

/** Whole days since the Unix epoch — stable for a calendar day, changes daily. */
function dayNumber(): number {
  return Math.floor(Date.now() / 86_400_000);
}

/** Shared query for a pool of scriptures (used by the daily verse of calm). */
export function useScripturesPool() {
  return useQuery({
    queryKey: ["scriptures", "pool"],
    queryFn: () => fetchScriptures(300),
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

/**
 * Infinite, paginated scriptures feed for the Verses tab. Browses the full
 * library (30k+ verses) a page at a time, with server-side search & theme
 * filtering keyed into the query.
 */
export function useScripturesInfinite(opts: {
  search?: string;
  theme?: string | null;
}) {
  return useInfiniteQuery({
    queryKey: ["scriptures", "infinite", opts.search ?? "", opts.theme ?? ""],
    queryFn: ({ pageParam }) =>
      fetchScripturesPage({
        offset: pageParam,
        limit: PAGE_SIZE,
        search: opts.search,
        theme: opts.theme,
      }),
    initialPageParam: 0,
    getNextPageParam: (last) => last.nextOffset,
    staleTime: 1000 * 60 * 5,
  });
}
