import { useMutation } from "@tanstack/react-query";
import { recordHistory } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

/** Record that a scripture was viewed (feeds the recommender). Best-effort. */
export function useRecordHistory() {
  const userId = useAuthStore((s) => s.user?.id);
  return useMutation({
    mutationFn: (scriptureId: string) => recordHistory(userId!, scriptureId),
  });
}
