import { useEffect, useRef, useState } from "react";
import { Share, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Loader } from "@/components/ui/Loader";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  CardStack,
  type CardStackHandle,
  type SwipeDirection,
} from "@/components/CardStack";
import { ScriptureCardView } from "@/components/ScriptureCardView";
import { useDailyCardsQuery, useUpdateStreak } from "@/hooks/useDailyCards";
import { useFavorites, useAddFavorite, useRemoveFavorite } from "@/hooks/useFavorites";
import { useRecordHistory } from "@/hooks/useHistory";
import { useDailyStore } from "@/stores/dailyStore";
import { speak, stopSpeaking } from "@/lib/speech";
import { colors } from "@/constants/theme";
import type { ScriptureCard } from "@/types";

export default function CardsScreen() {
  const router = useRouter();
  const { data: cards, isLoading, isError, error, refetch } = useDailyCardsQuery();
  const { data: favorites } = useFavorites();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const recordHistory = useRecordHistory();
  const updateStreak = useUpdateStreak();
  const markViewed = useDailyStore((s) => s.markViewed);

  const stackRef = useRef<CardStackHandle>(null);
  const [index, setIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);

  const deck = cards ?? [];
  const current: ScriptureCard | undefined = deck[index];
  const finished = deck.length > 0 && index >= deck.length;

  const favoriteIds = new Set((favorites ?? []).map((f) => f.scripture_id));
  const isFavorite = current ? favoriteIds.has(current.scriptureId) : false;

  // Record the verse as viewed when it becomes the top card.
  useEffect(() => {
    if (!current) return;
    markViewed(current.scriptureId);
    recordHistory.mutate(current.scriptureId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.scriptureId]);

  // Update streak once when the user finishes the deck.
  useEffect(() => {
    if (finished) updateStreak.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  useEffect(() => () => stopSpeaking(), []);

  function handleSwipe(_item: ScriptureCard, _dir: SwipeDirection, i: number) {
    stopSpeaking();
    setSpeaking(false);
    setIndex(i + 1);
  }

  function toggleFavorite() {
    if (!current) return;
    if (isFavorite) removeFavorite.mutate(current.scriptureId);
    else addFavorite.mutate(current.scriptureId);
  }

  function onListen() {
    if (!current) return;
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    speak(`${current.reference}. ${current.text}`, {
      onDone: () => setSpeaking(false),
    });
  }

  async function onShare() {
    if (!current) return;
    await Share.share({
      message: `"${current.text}" — ${current.reference}\n\nShared from FaithCards 🕊️`,
    });
  }

  function onReflect() {
    if (!current) return;
    stopSpeaking();
    router.push({
      pathname: "/reflection",
      params: {
        scriptureId: current.scriptureId,
        reference: current.reference,
        text: current.text,
        question: current.reflectionQuestion ?? "",
      },
    });
  }

  return (
    <GradientBackground variant="dusk">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-1">
          <IconButton
            icon="close"
            color="#fff"
            surface={false}
            onPress={() => router.back()}
          />
          <Text className="text-base font-semibold text-white/90">
            {deck.length > 0 && !finished
              ? `${Math.min(index + 1, deck.length)} of ${deck.length}`
              : "Daily Cards"}
          </Text>
          <View className="h-12 w-12" />
        </View>

        {isLoading ? (
          <Loader label="Preparing your cards…" />
        ) : isError ? (
          <View className="flex-1 items-center justify-center px-8">
            <EmptyState
              icon="cloud-offline-outline"
              title="Couldn't load cards"
              subtitle={(error as Error)?.message ?? "Please try again."}
            />
            <View className="w-full px-6">
              <Button label="Retry" onPress={() => refetch()} />
            </View>
          </View>
        ) : deck.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8">
            <EmptyState
              icon="moon-outline"
              title="No cards available"
              subtitle="Check back later for fresh Scripture."
            />
          </View>
        ) : finished ? (
          <CompletionView
            onJournal={() => router.replace("/(tabs)/journal")}
            onHome={() => router.back()}
          />
        ) : (
          <View className="flex-1">
            {/* Deck */}
            <View className="flex-1 px-6 pb-2 pt-4">
              <CardStack
                ref={stackRef}
                data={deck}
                index={index}
                onSwipe={handleSwipe}
                renderCard={(card) => (
                  <ScriptureCardView
                    card={card}
                    badge={card.theme ?? undefined}
                  />
                )}
              />
            </View>

            {/* Reflection question */}
            {current?.reflectionQuestion ? (
              <Animated.View
                key={current.scriptureId}
                entering={FadeIn.duration(400)}
                className="mx-6 mb-2 rounded-2xl bg-white/10 p-4"
              >
                <Text className="text-xs font-medium uppercase tracking-wider text-white/50">
                  Reflect
                </Text>
                <Text className="mt-1 text-sm text-white/90">
                  {current.reflectionQuestion}
                </Text>
              </Animated.View>
            ) : null}

            {/* Action bar */}
            <View className="flex-row items-center justify-between px-8 py-3">
              <IconButton
                icon={speaking ? "stop" : "volume-medium"}
                active={speaking}
                onPress={onListen}
                accessibilityLabel="Listen"
              />
              <IconButton
                icon={isFavorite ? "heart" : "heart-outline"}
                color={isFavorite ? colors.rose : colors.ink}
                onPress={toggleFavorite}
                accessibilityLabel="Favorite"
              />
              <IconButton
                icon="share-social-outline"
                onPress={onShare}
                accessibilityLabel="Share"
              />
              <IconButton
                icon="create-outline"
                onPress={onReflect}
                accessibilityLabel="Reflect"
              />
            </View>

            {/* Swipe hint + Next */}
            <View className="px-6 pb-4">
              <Button
                label="Next Card"
                icon="arrow-forward"
                onPress={() => stackRef.current?.swipe("left")}
              />
              <View className="mt-3 flex-row items-center justify-center gap-1.5">
                <Ionicons name="swap-horizontal" size={14} color="rgba(255,255,255,0.5)" />
                <Text className="text-xs text-white/50">
                  Swipe right to keep, left for next
                </Text>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}

function CompletionView({
  onJournal,
  onHome,
}: {
  onJournal: () => void;
  onHome: () => void;
}) {
  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      className="flex-1 items-center justify-center px-8"
    >
      <View className="h-24 w-24 items-center justify-center rounded-full bg-white/15">
        <Ionicons name="checkmark-done" size={48} color="#fff" />
      </View>
      <Text className="mt-6 text-center text-3xl font-bold text-white">
        Well done 🙌
      </Text>
      <Text className="mt-2 text-center text-base text-white/70">
        You&apos;ve meditated on today&apos;s Scripture. Your streak is counted.
      </Text>
      <View className="mt-8 w-full gap-3">
        <Button label="Write a Reflection" icon="create-outline" onPress={onJournal} />
        <Button label="Back to Home" variant="ghost" onPress={onHome} />
      </View>
    </Animated.View>
  );
}
