import { useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Input } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
import { Loader } from "@/components/ui/Loader";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconButton } from "@/components/ui/IconButton";
import { useFavorites, useRemoveFavorite } from "@/hooks/useFavorites";
import { speak } from "@/lib/speech";
import { colors, shadow } from "@/constants/theme";
import type { Favorite } from "@/types";

export default function Favorites() {
  const { data, isLoading } = useFavorites();
  const removeFav = useRemoveFavorite();
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<string | null>(null);

  const favorites = useMemo(() => data ?? [], [data]);

  const themes = useMemo(() => {
    const set = new Set<string>();
    favorites.forEach((f) => f.scriptures?.theme && set.add(f.scriptures.theme));
    return Array.from(set);
  }, [favorites]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return favorites.filter((f) => {
      const s = f.scriptures;
      if (!s) return false;
      if (theme && s.theme !== theme) return false;
      if (!q) return true;
      return (
        s.reference.toLowerCase().includes(q) ||
        s.text.toLowerCase().includes(q)
      );
    });
  }, [favorites, query, theme]);

  return (
    <GradientBackground variant="calm">
      <SafeAreaView className="flex-1" edges={["top"]}>
        <View className="px-6 pb-3 pt-2">
          <Text className="text-3xl font-bold text-ink">Favorites</Text>
          <Text className="text-sm text-ink-muted">
            Verses you&apos;re holding close
          </Text>
        </View>

        <View className="px-6 pb-2">
          <Input
            icon="search-outline"
            placeholder="Search favorites"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
          />
        </View>

        {themes.length > 0 ? (
          <View className="flex-row flex-wrap gap-2 px-6 pb-2">
            <Chip label="All" selected={theme === null} onPress={() => setTheme(null)} />
            {themes.map((t) => (
              <Chip
                key={t}
                label={t}
                selected={theme === t}
                onPress={() => setTheme(theme === t ? null : t)}
              />
            ))}
          </View>
        ) : null}

        {isLoading ? (
          <Loader label="Loading favorites…" />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="heart-outline"
            title={favorites.length === 0 ? "No favorites yet" : "No matches"}
            subtitle={
              favorites.length === 0
                ? "Tap the heart on any card to save it here."
                : "Try a different search or filter."
            }
          />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(f) => f.id}
            contentContainerClassName="px-6 pb-32 gap-3 pt-1"
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <FavoriteRow
                favorite={item}
                onRemove={() =>
                  item.scriptures &&
                  removeFav.mutate(item.scripture_id)
                }
              />
            )}
          />
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}

function FavoriteRow({
  favorite,
  onRemove,
}: {
  favorite: Favorite;
  onRemove: () => void;
}) {
  const s = favorite.scriptures;
  if (!s) return null;
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      layout={LinearTransition.springify()}
      style={shadow}
      className="rounded-3xl bg-surface p-5"
    >
      <View className="flex-row items-start justify-between">
        <Text className="text-base font-bold text-brand-700">{s.reference}</Text>
        <View className="flex-row gap-1">
          <IconButton
            icon="volume-medium-outline"
            surface={false}
            size={20}
            color={colors.brand[500]}
            onPress={() => speak(`${s.reference}. ${s.text}`)}
            accessibilityLabel="Listen"
          />
          <IconButton
            icon="heart"
            surface={false}
            size={20}
            color={colors.rose}
            onPress={onRemove}
            accessibilityLabel="Remove favorite"
          />
        </View>
      </View>
      <Text className="mt-2 text-base leading-6 text-ink">{s.text}</Text>
      {s.theme ? (
        <View className="mt-3 flex-row">
          <View className="flex-row items-center gap-1 rounded-full bg-brand-500/10 px-3 py-1">
            <Ionicons name="pricetag-outline" size={12} color={colors.brand[500]} />
            <Text className="text-xs font-medium text-brand-600">{s.theme}</Text>
          </View>
        </View>
      ) : null}
    </Animated.View>
  );
}
