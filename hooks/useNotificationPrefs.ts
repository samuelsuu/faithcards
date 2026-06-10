import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotificationPrefs,
  updateNotificationPrefs,
} from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";
import { useAuthStore } from "@/stores/authStore";
import type { NotificationPreferences } from "@/types";

export function useNotificationPrefs() {
  const enabled = useAuthStore((s) => !!s.user?.id);
  return useQuery({
    queryKey: queryKeys.notificationPrefs(),
    queryFn: fetchNotificationPrefs,
    enabled,
  });
}

export function useUpdateNotificationPrefs() {
  const userId = useAuthStore((s) => s.user?.id);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<Omit<NotificationPreferences, "user_id">>) =>
      updateNotificationPrefs(userId!, patch),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.notificationPrefs() }),
  });
}
