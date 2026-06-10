import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/StatCard";
import { MoodSelector } from "@/components/MoodSelector";
import { NeedSelector } from "@/components/NeedSelector";
import { useProfile } from "@/hooks/useProfile";
import { useGenerateDailyCards } from "@/hooks/useDailyCards";
import { useVerseOfTheDay } from "@/hooks/useScriptures";
import {
  useDailyQuote,
  useQuoteFavorites,
  useToggleQuoteFavorite,
} from "@/hooks/useQuotes";
import { QuoteCard } from "@/components/QuoteCard";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { useDailyStore, DAILY_MAX_CARDS } from "@/stores/dailyStore";
import { personaFromDbValue } from "@/constants/personality";
import { firstName, greeting } from "@/lib/utils";
import { colors } from "@/constants/theme";

export default function Home() {
  const router = useRouter();
  const { data: profile } = useProfile();
  const generate = useGenerateDailyCards();
  const { verse } = useVerseOfTheDay();
  const { data: dailyQuote } = useDailyQuote();
  const { data: quoteFavorites } = useQuoteFavorites();
  const toggleQuoteFavorite = useToggleQuoteFavorite();
  const quoteIsFavorite = !!(
    dailyQuote && quoteFavorites?.includes(dailyQuote.quote_id)
  );

  const { lastMood, lastNeeds, setLastSelection } = usePreferencesStore();
  const { ensureToday, markGenerated, generated, remaining } = useDailyStore();

  const [mood, setMood] = useState<string | null>(lastMood);
  const [needs, setNeeds] = useState<string[]>(lastNeeds);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ensureToday();
  }, [ensureToday]);

  const persona = personaFromDbValue(profile?.personality_type);
  const cardsLeft = remaining();

  function onGenerate() {
    setError(null);
    setLastSelection(mood, needs);
    generate.mutate(
      // The RPC takes one need; send the primary (first-selected) one.
      { mood, need: needs[0] ?? null },
      {
        onSuccess: (cards) => {
          markGenerated();
          if (!cards.length) {
            setError("No cards available right now. Please try again later.");
            return;
          }
          router.push("/cards");
        },
        onError: (e) => setError(e.message),
      },
    );
  }

  return (
    <GradientBackground variant="morning">
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView
          contentContainerClassName="px-6 pb-32 pt-2"
          showsVerticalScrollIndicator={false}
        >
          {/* Greeting */}
          <Animated.View entering={FadeInDown.duration(400)}>
            <Text className="text-base text-ink-muted">{greeting()},</Text>
            <Text className="text-3xl font-bold text-ink">
              {firstName(profile?.full_name)} 👋
            </Text>
            {persona ? (
              <View className="mt-2 flex-row items-center gap-1.5 self-start rounded-full bg-surface/70 px-3 py-1">
                <Text>{persona.emoji}</Text>
                <Text className="text-xs font-medium text-ink-muted">
                  {persona.title}
                </Text>
              </View>
            ) : null}
          </Animated.View>

          {/* Stats */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            className="mt-6 flex-row gap-3"
          >
            <StatCard
              icon="flame"
              tint={colors.amber}
              value={profile?.streak_count ?? 0}
              label="Day streak"
            />
            <StatCard
              icon="albums"
              value={`${cardsLeft}/${DAILY_MAX_CARDS}`}
              label="Cards left today"
            />
            <StatCard
              icon="book"
              tint={colors.emerald}
              value={profile?.total_cards_viewed ?? 0}
              label="Verses read"
            />
          </Animated.View>

          {/* Verse of calm */}
          <Animated.View
            entering={FadeInDown.delay(450).duration(400)}
            className="mt-7"
          >
            <View className="rounded-3xl bg-brand-600/10 p-5">
              <Text className="text-sm font-medium italic text-brand-700 dark:text-brand-200">
                “{verse?.text ?? "Be still, and know that I am God."}”
              </Text>
              <Text className="mt-1 text-xs text-ink-muted">
                {verse?.reference ?? "Psalm 46:10"}
              </Text>
            </View>
          </Animated.View>

          {/* Selectors */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(400)}
            className="mt-7"
          >
            <Card className="gap-6">
              <MoodSelector value={mood} onChange={setMood} />
              <View className="h-px bg-line" />
              <NeedSelector values={needs} onChange={setNeeds} max={3} />
            </Card>
          </Animated.View>

          {/* Generate */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(400)}
            className="mt-7 gap-3"
          >
            {error ? (
              <Text className="text-center text-sm text-rose-500">{error}</Text>
            ) : null}
            <Button
              label={generated ? "Open Today's Cards" : "Generate My Daily Cards"}
              icon="sparkles"
              loading={generate.isPending}
              onPress={onGenerate}
            />
            {generated && cardsLeft === 0 ? (
              <View className="flex-row items-center justify-center gap-1.5">
                <Ionicons name="checkmark-circle" size={16} color={colors.emerald} />
                <Text className="text-sm text-ink-muted">
                  You&apos;ve finished today&apos;s cards. See you tomorrow!
                </Text>
              </View>
            ) : null}
          </Animated.View>

          {/* Quote of the Day */}
          {dailyQuote ? (
            <Animated.View
              entering={FadeInDown.delay(350).duration(400)}
              className="mt-7 gap-3"
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-semibold text-ink">
                  Quote of the Day
                </Text>
                <Pressable
                  onPress={() => router.push("/quotes")}
                  className="flex-row items-center gap-1"
                  hitSlop={8}
                >
                  <Text className="text-sm font-medium text-brand-600 dark:text-brand-300">
                    Browse all
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={14}
                    color={colors.brand[500]}
                  />
                </Pressable>
              </View>
              <QuoteCard
                quote={dailyQuote}
                variant="feature"
                isFavorite={quoteIsFavorite}
                onToggleFavorite={() =>
                  toggleQuoteFavorite.mutate({
                    quoteId: dailyQuote.quote_id,
                    isFavorite: quoteIsFavorite,
                  })
                }
              />
            </Animated.View>
          ) : null}

          
          
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}
