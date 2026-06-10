import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Button } from "@/components/ui/Button";
import { useResendVerification } from "@/hooks/useAuth";
import { colors } from "@/constants/theme";

export default function VerifyEmail() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const resend = useResendVerification();
  const [resent, setResent] = useState(false);

  return (
    <GradientBackground variant="morning">
      <SafeAreaView className="flex-1 justify-center px-6">
        <Animated.View entering={FadeInDown.duration(500)} className="items-center gap-5">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-brand-100">
            <Ionicons name="mail-unread-outline" size={44} color={colors.brand[500]} />
          </View>
          <Text className="text-center text-3xl font-bold text-ink">
            Verify your email
          </Text>
          <Text className="text-center text-base leading-6 text-ink-muted">
            We sent a confirmation link to{"\n"}
            <Text className="font-semibold text-ink">{email ?? "your email"}</Text>.
            {"\n"}Tap it, then come back and sign in.
          </Text>

          <View className="mt-4 w-full gap-3">
            <Button label="I&apos;ve verified — Sign In" onPress={() => router.replace("/(auth)/login")} />
            <Button
              label={resent ? "Email re-sent" : "Resend email"}
              variant="secondary"
              loading={resend.isPending}
              disabled={!email || resent}
              onPress={() =>
                email &&
                resend.mutate(email, { onSuccess: () => setResent(true) })
              }
            />
          </View>

          <Pressable onPress={() => router.replace("/(auth)/register")}>
            <Text className="mt-2 text-sm text-ink-muted">
              Wrong email?{" "}
              <Text className="font-semibold text-brand-600">Go back</Text>
            </Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </GradientBackground>
  );
}
