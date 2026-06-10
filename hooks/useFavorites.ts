import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFavorite,
  fetchFavorites,
  removeFavorite,
} from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";
import { useAuthStore } from "@/stores/authStore";

export function useFavorites() {
  const enabled = useAuthStore((s) => !!s.user?.id);
  return useQuery({
    queryKey: queryKeys.favorites(),
    queryFn: fetchFavorites,
    enabled,
  });
}

export function useAddFavorite() {
  const userId = useAuthStore((s) => s.user?.id);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (scriptureId: string) => addFavorite(userId!, scriptureId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.favorites() }),
  });
}

export function useRemoveFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (scriptureId: string) => removeFavorite(scriptureId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.favorites() }),
  });
}
