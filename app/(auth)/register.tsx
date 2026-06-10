import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Animated, { FadeInDown } from "react-native-reanimated";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/Logo";
import { registerSchema, type RegisterValues } from "@/lib/schemas";
import { useSignUp } from "@/hooks/useAuth";
import { useOnboardingStore } from "@/stores/onboardingStore";

export default function Register() {
  const router = useRouter();
  const signUp = useSignUp();
  const setName = useOnboardingStore((s) => s.setName);
  const [serverError, setServerError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  function onSubmit(values: RegisterValues) {
    setServerError(null);
    signUp.mutate(
      { email: values.email, password: values.password, fullName: values.fullName },
      {
        onSuccess: (data) => {
          setName(values.fullName);
          if (data.session) {
            // Auto sign-in (email confirmation disabled) → guard sends to onboarding.
            return;
          }
          // Confirmation required.
          router.replace({
            pathname: "/(auth)/verify-email",
            params: { email: values.email },
          });
        },
        onError: (e) => setServerError(e.message),
      },
    );
  }

  return (
    <GradientBackground variant="morning">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <ScrollView
            contentContainerClassName="flex-grow justify-center px-6 py-10"
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View entering={FadeInDown.duration(500)} className="items-center mb-8">
              <Logo size={64} />
              <Text className="mt-5 text-3xl font-bold text-ink">
                Create your account
              </Text>
              <Text className="mt-1 text-base text-ink-muted">
                Begin your daily walk in the Word
              </Text>
            </Animated.View>

            <View className="gap-4">
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, onBlur, value }, fieldState }) => (
                  <Input
                    label="Full name"
                    icon="person-outline"
                    placeholder="Samuel Grace"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={fieldState.error?.message}
                  />
                )}
              />
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
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value }, fieldState }) => (
                  <Input
                    label="Password"
                    icon="lock-closed-outline"
                    placeholder="At least 6 characters"
                    secure
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value }, fieldState }) => (
                  <Input
                    label="Confirm password"
                    icon="lock-closed-outline"
                    placeholder="Re-enter password"
                    secure
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
                label="Create Account"
                loading={signUp.isPending}
                onPress={handleSubmit(onSubmit)}
              />
            </View>

            <Pressable className="mt-8" onPress={() => router.replace("/(auth)/login")}>
              <Text className="text-center text-sm text-ink-muted">
                Already have an account?{" "}
                <Text className="font-semibold text-brand-600">Sign in</Text>
              </Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}
