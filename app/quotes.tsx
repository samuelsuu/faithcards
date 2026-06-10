import { useMemo, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Input } from "@/components/ui/Input";
import { IconButton } from "@/components/ui/IconButton";
import { Loader } from "@/components/ui/Loader";
import { EmptyState } from "@/components/ui/EmptyState";
import { QuoteCard } from "@/components/QuoteCard";
import {
  useQuotes,
  useQuoteFavorites,
  useToggleQuoteFavorite,
} from "@/hooks/useQuotes";
import { cn } from "@/lib/utils";
import type { Quote } from "@/types";

type FilterKey = "all" | "great" | "samuelsu" | "saved";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "great", label: "Great Men of God" },
  { key: "samuelsu", label: "SamuelSU" },
  { key: "saved", label: "Saved" },
];

export default function QuotesScreen() {
  const router = useRouter();
  const { data, isLoading, isError, refetch, isRefetching } = useQuotes();
  const { data: favorites } = useQuoteFavorites();
  const toggleFavorite = useToggleQuoteFavorite();

  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  const quotes = useMemo(() => data ?? [], [data]);
  const favoriteIds = useMemo(() => new Set(favorites ?? []), [favorites]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return quotes.filter((quote) => {
      if (filter === "great" && quote.is_original) return false;
      if (filter === "samuelsu" && quote.contributor !== "SamuelSU") return false;
      if (filter === "saved" && !favoriteIds.has(quote.id)) return false;
      if (!q) return true;
      return (
        quote.text.toLowerCase().includes(q) ||
        (quote.author ?? "").toLowerCase().includes(q) ||
        (quote.source ?? "").toLowerCase().includes(q)
      );
    });
  }, [quotes, filter, query, favoriteIds]);

  return (
    <GradientBackground variant="dusk">
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="flex-row items-center gap-2 px-4 pt-1">
          <IconButton
            icon="chevron-back"
            color="#fff"
            surface={false}
            onPress={() => router.back()}
          />
          <View>
            <Text className="text-2xl font-bold text-white">Quotes</Text>
            <Text className="text-xs text-white/60">
              Great men of God & SamuelSU originals
            </Text>
          </View>
        </View>

        <View className="px-6 pt-3">
          <Input
            icon="search-outline"
            placeholder="Search quotes or authors"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
          />
        </View>

        {/* Filter tabs */}
        <View className="max-h-12 pt-3">
          <FlatList
            horizontal
            data={FILTERS}
            keyExtractor={(f) => f.key}
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 px-6"
            renderItem={({ item }) => {
              const active = filter === item.key;
              return (
                <Pressable onPress={() => setFilter(item.key)}>
                  <View
                    className={cn(
                      "rounded-full border px-4 py-2",
                      active
                        ? "border-white bg-white"
                        : "border-white/30 bg-white/10",
                    )}
                  >
                    <Text
                      className={cn(
                        "text-sm font-semibold",
                        active ? "text-brand-700" : "text-white",
                      )}
                    >
                      {item.label}
                    </Text>
                  </View>
                </Pressable>
              );
            }}
          />
        </View>

        {isLoading ? (
          <Loader label="Loading quotes…" />
        ) : isError ? (
          <EmptyState
            icon="cloud-offline-outline"
            title="Couldn't load quotes"
            subtitle="Pull to refresh and try again."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={filter === "saved" ? "heart-outline" : "search-outline"}
            title={filter === "saved" ? "No saved quotes yet" : "No quotes found"}
            subtitle={
              filter === "saved"
                ? "Tap the heart on any quote to save it here."
                : "Try a different filter or search."
            }
          />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(q) => q.id}
            contentContainerClassName="px-6 pb-32 gap-3 pt-3"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                tintColor="#fff"
              />
            }
            renderItem={({ item, index }: { item: Quote; index: number }) => {
              const isFav = favoriteIds.has(item.id);
              return (
                <Animated.View
                  entering={FadeInDown.delay(Math.min(index, 8) * 50).duration(380)}
                >
                  <QuoteCard
                    quote={item}
                    variant="list"
                    isFavorite={isFav}
                    onToggleFavorite={() =>
                      toggleFavorite.mutate({
                        quoteId: item.id,
                        isFavorite: isFav,
                      })
                    }
                  />
                </Animated.View>
              );
            }}
          />
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}
