import { useMemo, useState } from "react";
import { FlatList, RefreshControl, Share, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Input } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
import { Loader } from "@/components/ui/Loader";
import { EmptyState } from "@/components/ui/EmptyState";
import { VerseCard } from "@/components/VerseCard";
import { useScripturesPool } from "@/hooks/useScriptures";
import { useFavorites, useAddFavorite, useRemoveFavorite } from "@/hooks/useFavorites";
import { useRecordHistory } from "@/hooks/useHistory";
import { speak, stopSpeaking } from "@/lib/speech";
import { colors } from "@/constants/theme";
import type { Scripture } from "@/types";

export default function Explore() {
  const { data, isLoading, isError, refetch, isRefetching } = useScripturesPool();
  const { data: favorites } = useFavorites();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const recordHistory = useRecordHistory();

  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const scriptures = useMemo(() => data ?? [], [data]);
  const favoriteIds = useMemo(
    () => new Set((favorites ?? []).map((f) => f.scripture_id)),
    [favorites],
  );

  const themes = useMemo(() => {
    const set = new Set<string>();
    scriptures.forEach((s) => s.theme && set.add(s.theme));
    return Array.from(set).sort();
  }, [scriptures]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scriptures.filter((s) => {
      if (theme && s.theme !== theme) return false;
      if (!q) return true;
      return (
        s.reference.toLowerCase().includes(q) ||
        s.text.toLowerCase().includes(q) ||
        (s.theme ?? "").toLowerCase().includes(q)
      );
    });
  }, [scriptures, query, theme]);

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
            placeholder="Search by word, reference or theme"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
          />
        </View>

        {themes.length > 0 ? (
          <View className="max-h-12">
            <FlatList
              horizontal
              data={["All", ...themes]}
              keyExtractor={(t) => t}
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-2 px-6 pb-1"
              renderItem={({ item }) => (
                <Chip
                  label={item}
                  selected={item === "All" ? theme === null : theme === item}
                  onPress={() => setTheme(item === "All" ? null : item === theme ? null : item)}
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
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="search-outline"
            title="No verses found"
            subtitle="Try a different search or theme."
          />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(s) => s.id}
            contentContainerClassName="px-6 pb-32 gap-4 pt-2"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                tintColor={colors.brand[500]}
              />
            }
            renderItem={({ item, index }) => (
              <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 60).duration(400)}>
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
