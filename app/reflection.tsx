import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { useSaveReflection } from "@/hooks/useReflections";
import { colors } from "@/constants/theme";

export default function ReflectionScreen() {
  const router = useRouter();
  const { scriptureId, reference, text, question } = useLocalSearchParams<{
    scriptureId: string;
    reference: string;
    text: string;
    question?: string;
  }>();
  const save = useSaveReflection();
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSave() {
    if (note.trim().length === 0) {
      setError("Write something before saving.");
      return;
    }
    setError(null);
    save.mutate(
      { scriptureId, note: note.trim() },
      { onSuccess: () => router.back() },
    );
  }

  return (
    <GradientBackground variant="morning">
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center justify-between px-5 pt-1">
          <IconButton icon="chevron-down" onPress={() => router.back()} />
          <Text className="text-base font-semibold text-ink">Reflection</Text>
          <View className="h-12 w-12" />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <ScrollView
            contentContainerClassName="px-6 pb-10 pt-4"
            keyboardShouldPersistTaps="handled"
          >
            {/* Verse */}
            <Animated.View
              entering={FadeInDown.duration(400)}
              className="rounded-3xl bg-brand-600/10 p-5"
            >
              <Text className="text-sm font-bold text-brand-700">{reference}</Text>
              <Text className="mt-2 text-base italic leading-6 text-ink">
                “{text}”
              </Text>
            </Animated.View>

            {/* Prompt */}
            <Animated.View
              entering={FadeInDown.delay(100).duration(400)}
              className="mt-6 flex-row items-center gap-2"
            >
              <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.brand[500]} />
              <Text className="flex-1 text-lg font-semibold text-ink">
                {question?.trim() ? question : "What is God saying to you today?"}
              </Text>
            </Animated.View>

            {/* Note */}
            <Animated.View
              entering={FadeInDown.delay(200).duration(400)}
              className="mt-4"
            >
              <TextInput
                className="min-h-[180px] rounded-3xl border border-line bg-surface p-5 text-base leading-6 text-ink"
                placeholder="Write your heart here…"
                placeholderTextColor={colors.inkSoft}
                multiline
                textAlignVertical="top"
                value={note}
                onChangeText={setNote}
                autoFocus
              />
              {error ? (
                <Text className="ml-1 mt-2 text-sm text-rose-500">{error}</Text>
              ) : null}
            </Animated.View>
          </ScrollView>

          <View className="px-6 pb-6">
            <Button
              label="Save Reflection"
              icon="checkmark"
              loading={save.isPending}
              onPress={onSave}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}
