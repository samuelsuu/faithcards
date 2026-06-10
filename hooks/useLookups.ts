import { useQuery } from "@tanstack/react-query";
import { fetchMoods, fetchNeeds } from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";

/**
 * Moods/needs from the backend. We ship local fallbacks (constants/) so the UI
 * always renders even offline; these hooks let the server be the source of truth
 * when reachable.
 */
export function useMoods() {
  return useQuery({
    queryKey: queryKeys.moods(),
    queryFn: fetchMoods,
    staleTime: Infinity,
  });
}

export function useNeeds() {
  return useQuery({
    queryKey: queryKeys.needs(),
    queryFn: fetchNeeds,
    staleTime: Infinity,
  });
}
