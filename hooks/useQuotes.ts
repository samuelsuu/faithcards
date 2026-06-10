import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addQuoteFavorite,
  fetchQuoteFavorites,
  fetchQuotes,
  generateDailyQuote,
  removeQuoteFavorite,
} from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

const quoteKeys = {
  daily: (userId?: string) => ["daily-quote", userId] as const,
  list: () => ["quotes"] as const,
  favorites: () => ["quote-favorites"] as const,
};

/** Quote of the day — same all day, changes tomorrow (idempotent RPC). */
export function useDailyQuote() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: quoteKeys.daily(userId),
    queryFn: generateDailyQuote,
    enabled: !!userId,
  });
}

/** All quotes (public). Filtering happens in the screen. */
export function useQuotes() {
  return useQuery({
    queryKey: quoteKeys.list(),
    queryFn: fetchQuotes,
    staleTime: 1000 * 60 * 10,
  });
}

/** The current user's favourited quote ids. */
export function useQuoteFavorites() {
  const enabled = useAuthStore((s) => !!s.user?.id);
  return useQuery({
    queryKey: quoteKeys.favorites(),
    queryFn: fetchQuoteFavorites,
    enabled,
  });
}

export function useToggleQuoteFavorite() {
  const userId = useAuthStore((s) => s.user?.id);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { quoteId: string; isFavorite: boolean }) =>
      input.isFavorite
        ? removeQuoteFavorite(input.quoteId)
        : addQuoteFavorite(userId!, input.quoteId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: quoteKeys.favorites() }),
  });
}
