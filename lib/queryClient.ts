import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

/** Centralised query keys so hooks & invalidations stay in sync. */
export const queryKeys = {
  profile: (userId?: string) => ["profile", userId] as const,
  dailyCards: (userId?: string) => ["daily-cards", userId] as const,
  favorites: () => ["favorites"] as const,
  reflections: () => ["reflections"] as const,
  scripture: (id: string) => ["scripture", id] as const,
  moods: () => ["moods"] as const,
  needs: () => ["needs"] as const,
  notificationPrefs: () => ["notification-prefs"] as const,
};
