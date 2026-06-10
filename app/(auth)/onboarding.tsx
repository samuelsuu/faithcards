import { useRef, useState } from "react";
import { Dimensions, FlatList, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Button } from "@/components/ui/Button";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { colors } from "@/constants/theme";

const { width } = Dimensions.get("window");

interface Slide {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
}

const SLIDES: Slide[] = [
  {
    icon: "sparkles",
    title: "Scripture, made personal",
    body: "Up to 5 verses a day chosen for your mood, needs and personality.",
  },
  {
    icon: "heart-circle",
    title: "Reflect & remember",
    body: "Journal what God is saying, favourite verses, and revisit them anytime.",
  },
  {
    icon: "flame",
    title: "Build a daily rhythm",
    body: "Keep your streak alive and let His Word renew your mind each morning.",
  },
];

export default function OnboardingIntro() {
  const router = useRouter();
  const setIntroSeen = useOnboardingStore((s) => s.setIntroSeen);
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);

  const isLast = index === SLIDES.length - 1;

  function finish() {
    setIntroSeen(true);
    router.replace("/(auth)/register");
  }

  function next() {
    if (isLast) return finish();
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  }

  return (
    <GradientBackground variant="morning">
      <SafeAreaView className="flex-1">
        <View className="flex-row justify-end px-6 pt-2">
          <Pressable onPress={finish} hitSlop={10}>
            <Text className="text-base font-medium text-ink-muted">Skip</Text>
          </Pressable>
        </View>

        <FlatList
          ref={listRef}
          data={SLIDES}
          keyExtractor={(s) => s.title}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) =>
            setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
          }
          renderItem={({ item }) => (
            <View style={{ width }} className="items-center justify-center px-10">
              <Animated.View
                entering={FadeIn.duration(400)}
                className="h-40 w-40 items-center justify-center rounded-full bg-surface/70"
              >
                <Ionicons name={item.icon} size={68} color={colors.brand[500]} />
              </Animated.View>
              <Text className="mt-10 text-center text-3xl font-bold text-ink">
                {item.title}
              </Text>
              <Text className="mt-4 text-center text-base leading-6 text-ink-muted">
                {item.body}
              </Text>
            </View>
          )}
        />

        <View className="gap-6 px-6 pb-6">
          <ProgressDots count={SLIDES.length} index={index} />
          <Button label={isLast ? "Get Started" : "Next"} onPress={next} />
          <Pressable onPress={() => router.replace("/(auth)/login")}>
            <Text className="text-center text-sm text-ink-muted">
              Already have an account?{" "}
              <Text className="font-semibold text-brand-600">Sign in</Text>
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}
