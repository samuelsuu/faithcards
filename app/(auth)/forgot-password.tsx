import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { forgotSchema, type ForgotValues } from "@/lib/schemas";
import { useForgotPassword } from "@/hooks/useAuth";
import { colors } from "@/constants/theme";

export default function ForgotPassword() {
  const router = useRouter();
  const forgot = useForgotPassword();
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ForgotValues) {
    setServerError(null);
    forgot.mutate(values.email, {
      onSuccess: () => setSent(true),
      onError: (e) => setServerError(e.message),
    });
  }

  return (
    <GradientBackground variant="morning">
      <SafeAreaView className="flex-1">
        <View className="px-4 pt-2">
          <IconButton icon="chevron-back" onPress={() => router.back()} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-center px-6"
        >
          {sent ? (
            <Animated.View entering={FadeIn} className="items-center gap-4">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                <Ionicons name="mail-open-outline" size={36} color={colors.emerald} />
              </View>
              <Text className="text-2xl font-bold text-ink">Check your inbox</Text>
              <Text className="text-center text-base text-ink-muted">
                If an account exists, we&apos;ve sent a reset link. Follow it to
                set a new password.
              </Text>
              <View className="mt-4 w-full">
                <Button label="Back to Sign In" onPress={() => router.replace("/(auth)/login")} />
              </View>
            </Animated.View>
          ) : (
            <View className="gap-6">
              <View className="gap-1">
                <Text className="text-3xl font-bold text-ink">
                  Forgot password?
                </Text>
                <Text className="text-base text-ink-muted">
                  Enter your email and we&apos;ll send you a reset link.
                </Text>
              </View>

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value }, fieldState }) => (
                  <Input
                    label="Email"
                    icon="mail-outline"
                    placeholder="you@example.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={fieldState.error?.message}
                  />
                )}
              />

              {serverError ? (
                <Text className="text-sm text-rose-500">{serverError}</Text>
              ) : null}

              <Button
                label="Send Reset Link"
                loading={forgot.isPending}
                onPress={handleSubmit(onSubmit)}
              />

              <Pressable onPress={() => router.replace("/(auth)/login")}>
                <Text className="text-center text-sm text-ink-muted">
                  Remembered it?{" "}
                  <Text className="font-semibold text-brand-600">Sign in</Text>
                </Text>
              </Pressable>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}
