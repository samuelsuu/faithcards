import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { useProfile } from "@/hooks/useProfile";

/**
 * Central navigation guard. Decides where the user belongs based on auth +
 * onboarding state, and redirects when they're in the wrong place.
 *
 * Route groups:
 *   (auth)        — intro, login, register, forgot, verify
 *   (onboarding)  — name / gender / personality quiz
 *   (tabs)        — the main app
 *   cards / reflection — full-screen modals (only when onboarded)
 *
 * Returns whether the guard is still resolving (used to keep the splash up).
 */
export function useAuthRedirect(): { resolving: boolean } {
  const router = useRouter();
  const segments = useSegments();
  const initializing = useAuthStore((s) => s.initializing);
  const session = useAuthStore((s) => s.session);
  const introSeen = useOnboardingStore((s) => s.introSeen);
  const localPersona = useOnboardingStore((s) => s.persona);
  const { data: profile, isLoading: profileLoading } = useProfile();

  const profilePending = !!session && profileLoading;
  const resolving = initializing || profilePending;

  useEffect(() => {
    if (resolving) return;

    const segs = segments as unknown as string[];
    const group = segs[0] as string | undefined;
    const inAuth = group === "(auth)";
    const inOnboarding = group === "(onboarding)";
    const atRoot = segs.length === 0;

    if (!session) {
      if (!inAuth) {
        router.replace(introSeen ? "/(auth)/login" : "/(auth)/onboarding");
      }
      return;
    }

    const onboarded = !!(profile?.personality_type || localPersona);
    if (!onboarded) {
      if (!inOnboarding) router.replace("/(onboarding)");
      return;
    }

    if (inAuth || inOnboarding || atRoot) {
      router.replace("/(tabs)/home");
    }
  }, [
    resolving,
    session,
    profile?.personality_type,
    localPersona,
    introSeen,
    segments,
    router,
  ]);

  return { resolving };
}
