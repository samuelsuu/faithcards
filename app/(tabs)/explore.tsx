import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Share,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Input } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
import { Loader } from "@/components/ui/Loader";
import { EmptyState } from "@/components/ui/EmptyState";
import { VerseCard } from "@/components/VerseCard";
import { useScripturesInfinite } from "@/hooks/useScriptures";
import { useFavorites, useAddFavorite, useRemoveFavorite } from "@/hooks/useFavorites";
import { useRecordHistory } from "@/hooks/useHistory";
import { speak, stopSpeaking } from "@/lib/speech";
import { colors } from "@/constants/theme";
import type { Scripture } from "@/types";

export default function Explore() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [theme, setTheme] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  // Theme chips accumulate as you browse so they persist when a filter is active.
  const [knownThemes, setKnownThemes] = useState<string[]>([]);

  // Debounce search so we don't hit the server on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useScripturesInfinite({ search: debouncedQuery, theme });

  const { data: favorites } = useFavorites();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const recordHistory = useRecordHistory();

  const verses = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data],
  );
  const favoriteIds = useMemo(
    () => new Set((favorites ?? []).map((f) => f.scripture_id)),
    [favorites],
  );

  // Grow the known-themes set from whatever has loaded (never shrinks).
  useEffect(() => {
    const found = verses.map((v) => v.theme).filter(Boolean) as string[];
    if (found.length === 0) return;
    setKnownThemes((prev) => {
      const set = new Set(prev);
      found.forEach((t) => set.add(t));
      return set.size === prev.length ? prev : Array.from(set).sort();
    });
  }, [verses]);

  function onListen(s: Scripture) {
    if (speakingId === s.id) {
      stopSpeaking();
      setSpeakingId(null);
      return;
    }
    setSpeakingId(s.id);
    recordHistory.mutate(s.id);
    speak(`${s.reference}. ${s.text}`, { onDone: () => setSpeakingId(null) });
  }

  function onToggleFavorite(s: Scripture) {
    if (favoriteIds.has(s.id)) removeFavorite.mutate(s.id);
    else addFavorite.mutate(s.id);
  }

  async function onShare(s: Scripture) {
    await Share.share({
      message: `"${s.text}" — ${s.reference}\n\nShared from FaithCards 🕊️`,
    });
  }

  return (
    <GradientBackground variant="calm">
      <SafeAreaView className="flex-1" edges={["top"]}>
        <View className="px-6 pb-3 pt-2">
          <Text className="text-3xl font-bold text-ink">Verses</Text>
          <Text className="text-sm text-ink-muted">
            Browse the Word, one card at a time
          </Text>
        </View>

        <View className="px-6 pb-2">
          <Input
            icon="search-outline"
            placeholder="Search by word or reference"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
          />
        </View>

        {knownThemes.length > 0 ? (
          <View className="max-h-12">
            <FlatList
              horizontal
              data={["All", ...knownThemes]}
              keyExtractor={(t) => t}
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-2 px-6 pb-1"
              renderItem={({ item }) => (
                <Chip
                  label={item}
                  selected={item === "All" ? theme === null : theme === item}
                  onPress={() =>
                    setTheme(item === "All" ? null : item === theme ? null : item)
                  }
                />
              )}
            />
          </View>
        ) : null}

        {isLoading ? (
          <Loader label="Gathering verses…" />
        ) : isError ? (
          <EmptyState
            icon="cloud-offline-outline"
            title="Couldn't load verses"
            subtitle="Pull to refresh and try again."
          />
        ) : verses.length === 0 ? (
          <EmptyState
            icon="search-outline"
            title="No verses found"
            subtitle="Try a different search or theme."
          />
        ) : (
          <FlatList
            data={verses}
            keyExtractor={(s) => s.id}
            contentContainerClassName="px-6 pb-32 gap-4 pt-2"
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.6}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                tintColor={colors.brand[500]}
              />
            }
            ListFooterComponent={
              isFetchingNextPage ? (
                <View className="py-6">
                  <ActivityIndicator color={colors.brand[500]} />
                </View>
              ) : !hasNextPage ? (
                <Text className="py-6 text-center text-xs text-ink-soft">
                  That&apos;s every verse — well done 🙏
                </Text>
              ) : null
            }
            renderItem={({ item, index }) => (
              <Animated.View
                entering={FadeInDown.delay(Math.min(index % 12, 8) * 50).duration(380)}
              >
                <VerseCard
                  scripture={item}
                  index={index}
                  isFavorite={favoriteIds.has(item.id)}
                  speaking={speakingId === item.id}
                  onListen={() => onListen(item)}
                  onToggleFavorite={() => onToggleFavorite(item)}
                  onShare={() => onShare(item)}
                />
              </Animated.View>
            )}
          />
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}
