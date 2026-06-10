import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProfile, updateProfile } from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";
import { useAuthStore } from "@/stores/authStore";
import type { PersonalityType, Profile } from "@/types";

export function useProfile() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: queryKeys.profile(userId),
    queryFn: () => fetchProfile(userId!),
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const userId = useAuthStore((s) => s.user?.id);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      patch: Partial<
        Pick<Profile, "full_name" | "gender"> & {
          personality_type: PersonalityType;
        }
      >,
    ) => updateProfile(userId!, patch),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.profile(userId) }),
  });
}
