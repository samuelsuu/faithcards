import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProgressDots } from "@/components/ProgressDots";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/utils";
import { colors } from "@/constants/theme";
import { QUIZ, scoreQuiz } from "@/constants/quiz";
import { PERSONAS } from "@/constants/personality";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { useUpdateProfile } from "@/hooks/useProfile";

const GENDERS = ["Male", "Female", "Prefer not to say"];

type Step =
  | { kind: "name" }
  | { kind: "gender" }
  | { kind: "quiz"; quizIndex: number }
  | { kind: "result" };

export default function OnboardingWizard() {
  const {
    name,
    gender,
    answers,
    setName,
    setGender,
    setAnswer,
    setPersona,
  } = useOnboardingStore();
  const updateProfile = useUpdateProfile();

  const steps = useMemo<Step[]>(
    () => [
      { kind: "name" },
      { kind: "gender" },
      ...QUIZ.map((_, i) => ({ kind: "quiz", quizIndex: i }) as Step),
      { kind: "result" },
    ],
    [],
  );

  const [stepIdx, setStepIdx] = useState(0);
  const [nameDraft, setNameDraft] = useState(name);
  const [saving, setSaving] = useState(false);
  const step = steps[stepIdx];

  const persona = useMemo(() => {
    const ordered = QUIZ.map((q) => answers[q.id]).filter(
      (v): v is number => v !== undefined,
    );
    return PERSONAS[scoreQuiz(ordered)];
  }, [answers]);

  const canAdvance = (() => {
    if (step.kind === "name") return nameDraft.trim().length >= 2;
    if (step.kind === "gender") return true; // optional
    if (step.kind === "quiz") return answers[QUIZ[step.quizIndex].id] !== undefined;
    return true;
  })();

  function back() {
    if (stepIdx === 0) return;
    setStepIdx((i) => i - 1);
  }

  async function advance() {
    if (step.kind === "name") setName(nameDraft.trim());

    if (step.kind === "result") {
      setSaving(true);
      setPersona(persona.key);
      updateProfile.mutate(
        {
          full_name: name || nameDraft.trim(),
          personality_type: persona.dbValue,
        },
        {
          // The auth guard sends the user to the tabs once persona is set.
          onSettled: () => setSaving(false),
        },
      );
      return;
    }
    setStepIdx((i) => i + 1);
  }

  return (
    <GradientBackground variant="morning">
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center justify-between px-4 pt-2">
          {stepIdx > 0 ? (
            <IconButton icon="chevron-back" onPress={back} />
          ) : (
            <View className="h-12 w-12" />
          )}
          <ProgressDots count={steps.length} index={stepIdx} />
          <View className="h-12 w-12" />
        </View>

        <ScrollView
          contentContainerClassName="flex-grow px-6 pt-6 pb-8"
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            key={stepIdx}
            entering={FadeInRight.duration(280)}
            exiting={FadeOutLeft.duration(160)}
            className="flex-1"
          >
            {step.kind === "name" && (
              <View className="gap-6">
                <Header
                  title="What should we call you?"
                  subtitle="We'll use your name to make each day personal."
                />
                <Input
                  label="Your name"
                  icon="person-outline"
                  placeholder="Samuel"
                  value={nameDraft}
                  onChangeText={setNameDraft}
                  autoFocus
                />
              </View>
            )}

            {step.kind === "gender" && (
              <View className="gap-6">
                <Header
                  title="How do you identify?"
                  subtitle="Optional — it helps us tailor encouragement."
                />
                <View className="gap-3">
                  {GENDERS.map((g) => {
                    const selected = gender === g;
                    return (
                      <Pressable key={g} onPress={() => setGender(selected ? null : g)}>
                        <View
                          className={cn(
                            "flex-row items-center justify-between rounded-2xl border bg-surface px-5 py-4",
                            selected ? "border-brand-500" : "border-line",
                          )}
                        >
                          <Text className="text-base font-medium text-ink">{g}</Text>
                          <Ionicons
                            name={selected ? "checkmark-circle" : "ellipse-outline"}
                            size={22}
                            color={selected ? colors.brand[500] : colors.inkSoft}
                          />
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            {step.kind === "quiz" && (
              <QuizStep
                quizIndex={step.quizIndex}
                selected={answers[QUIZ[step.quizIndex].id]}
                onSelect={(ans) => setAnswer(QUIZ[step.quizIndex].id, ans)}
              />
            )}

            {step.kind === "result" && (
              <Animated.View entering={FadeIn.duration(500)} className="flex-1 items-center justify-center gap-4">
                <Text className="text-sm font-medium uppercase tracking-widest text-brand-500">
                  Your persona
                </Text>
                <Text className="text-7xl">{persona.emoji}</Text>
                <Text className="text-3xl font-bold text-ink">{persona.title}</Text>
                <Text className="text-center text-base leading-6 text-ink-muted">
                  {persona.blurb}
                </Text>
              </Animated.View>
            )}
          </Animated.View>
        </ScrollView>

        <View className="px-6 pb-6">
          <Button
            label={step.kind === "result" ? "Enter FaithCards" : "Continue"}
            disabled={!canAdvance}
            loading={saving}
            onPress={advance}
          />
          {step.kind === "gender" ? (
            <Pressable className="mt-3" onPress={() => setStepIdx((i) => i + 1)}>
              <Text className="text-center text-sm text-ink-muted">Skip</Text>
            </Pressable>
          ) : null}
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View className="gap-2">
      <Text className="text-3xl font-bold text-ink">{title}</Text>
      <Text className="text-base text-ink-muted">{subtitle}</Text>
    </View>
  );
}

function QuizStep({
  quizIndex,
  selected,
  onSelect,
}: {
  quizIndex: number;
  selected?: number;
  onSelect: (answerIndex: number) => void;
}) {
  const q = QUIZ[quizIndex];
  return (
    <View className="gap-6">
      <Header title={q.question} subtitle="Choose what feels most true." />
      <View className="gap-3">
        {q.answers.map((a, i) => {
          const isSel = selected === i;
          return (
            <Pressable key={a.label} onPress={() => onSelect(i)}>
              <View
                className={cn(
                  "flex-row items-center justify-between rounded-2xl border px-5 py-4",
                  isSel ? "bg-brand-600 border-brand-600" : "bg-surface border-line",
                )}
              >
                <Text
                  className={cn(
                    "text-base font-medium",
                    isSel ? "text-white" : "text-ink",
                  )}
                >
                  {a.label}
                </Text>
                <Ionicons
                  name={isSel ? "checkmark-circle" : "ellipse-outline"}
                  size={22}
                  color={isSel ? "#fff" : colors.inkSoft}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
