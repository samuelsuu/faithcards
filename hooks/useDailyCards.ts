import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { generateDailyCards, updateStreak } from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";
import { useAuthStore } from "@/stores/authStore";
import { usePreferencesStore } from "@/stores/preferencesStore";
import type { ScriptureCard } from "@/types";

/**
 * Read today's cards. Reuses anything the Home "generate" mutation already
 * wrote to the cache; otherwise fetches (the RPC is idempotent per day).
 */
export function useDailyCardsQuery() {
  const userId = useAuthStore((s) => s.user?.id);
  const lastMood = usePreferencesStore((s) => s.lastMood);
  const lastNeeds = usePreferencesStore((s) => s.lastNeeds);
  return useQuery({
    queryKey: queryKeys.dailyCards(userId),
    // The RPC takes a single need; send the primary (first-selected) one.
    queryFn: () =>
      generateDailyCards({ mood: lastMood, need: lastNeeds[0] ?? null }),
    enabled: !!userId,
  });
}

/**
 * Generate (or fetch) today's cards. Idempotent server-side per calendar day,
 * so this doubles as "load today's set". We hold the result in the query cache
 * under the user key so the card stack & home stay in sync.
 */
export function useGenerateDailyCards() {
  const userId = useAuthStore((s) => s.user?.id);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { mood?: string | null; need?: string | null }) =>
      generateDailyCards({ mood: input.mood, need: input.need }),
    onSuccess: (cards: ScriptureCard[]) => {
      qc.setQueryData(queryKeys.dailyCards(userId), cards);
    },
  });
}

/** Mark today's session complete and bump the streak. */
export function useUpdateStreak() {
  const userId = useAuthStore((s) => s.user?.id);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => updateStreak(),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.profile(userId) }),
  });
}
