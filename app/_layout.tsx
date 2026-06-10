import "../global.css";
import "react-native-reanimated";

import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/stores/authStore";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    const unsubscribe = init();
    return unsubscribe;
  }, [init]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <RootNavigator />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

/**
 * Always-mounted navigator. Runs the auth/onboarding redirect guard so a
 * session change from ANY screen (e.g. signing in on /login) routes the user to
 * the right place, and hides the native splash once the first decision lands.
 */
function RootNavigator() {
  const { resolving } = useAuthRedirect();
  const darkMode = usePreferencesStore((s) => s.darkMode);
  const { setColorScheme } = useColorScheme();

  // Drive NativeWind's color scheme from the persisted preference.
  useEffect(() => {
    setColorScheme(darkMode ? "dark" : "light");
  }, [darkMode, setColorScheme]);

  useEffect(() => {
    if (!resolving) SplashScreen.hideAsync().catch(() => {});
  }, [resolving]);

  return (
    <>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="cards"
        options={{ presentation: "card", animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name="reflection"
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name="quotes"
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      </Stack>
    </>
  );
}
