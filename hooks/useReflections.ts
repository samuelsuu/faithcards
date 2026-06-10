import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteReflection,
  fetchReflections,
  saveReflection,
  updateReflection,
} from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";
import { useAuthStore } from "@/stores/authStore";

export function useReflections() {
  const enabled = useAuthStore((s) => !!s.user?.id);
  return useQuery({
    queryKey: queryKeys.reflections(),
    queryFn: fetchReflections,
    enabled,
  });
}

export function useSaveReflection() {
  const userId = useAuthStore((s) => s.user?.id);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { scriptureId: string; note: string }) =>
      saveReflection(userId!, input.scriptureId, input.note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.reflections() });
      qc.invalidateQueries({ queryKey: queryKeys.profile(userId) });
    },
  });
}

export function useUpdateReflection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; note: string }) =>
      updateReflection(input.id, input.note),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.reflections() }),
  });
}

export function useDeleteReflection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReflection(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.reflections() }),
  });
}
