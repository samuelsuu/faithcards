import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Animated, { FadeInDown } from "react-native-reanimated";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/Logo";
import { loginSchema, type LoginValues } from "@/lib/schemas";
import { useSignIn } from "@/hooks/useAuth";

export default function Login() {
  const router = useRouter();
  const signIn = useSignIn();
  const [serverError, setServerError] = useState<string | null>(null);

  const { control, handleSubmit, formState } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginValues) {
    setServerError(null);
    signIn.mutate(values, {
      onError: (e) => setServerError(e.message),
      // On success the auth guard redirects automatically.
    });
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
              <Logo size={72} />
              <Text className="mt-5 text-3xl font-bold text-ink center">Welcome back</Text>
              <Text className="mt-1 text-base text-ink-muted">
                Sign in to continue your journey
              </Text>
            </Animated.View>

            <View className="gap-4">
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
                    placeholder="••••••••"
                    secure
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Link href="/(auth)/forgot-password" asChild>
                <Pressable className="self-end">
                  <Text className="text-sm font-medium text-brand-600">
                    Forgot password?
                  </Text>
                </Pressable>
              </Link>

              {serverError ? (
                <Text className="text-sm text-rose-500">{serverError}</Text>
              ) : null}

              <Button
                label="Sign In"
                loading={signIn.isPending || formState.isSubmitting}
                onPress={handleSubmit(onSubmit)}
              />
            </View>

            <Pressable
              className="mt-8"
              onPress={() => router.replace("/(auth)/register")}
            >
              <Text className="text-center text-sm text-ink-muted">
                New here?{" "}
                <Text className="font-semibold text-brand-600">
                  Create an account
                </Text>
              </Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}
