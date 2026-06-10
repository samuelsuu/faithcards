import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { cn } from "@/lib/utils";
import { colors, shadow } from "@/constants/theme";

/** Accepts both the RPC shape (quote_text) and the table shape (text). */
export interface QuoteLike {
  text?: string;
  quote_text?: string;
  author?: string | null;
  source?: string | null;
  reflection_question?: string | null;
  contributor?: string | null;
  is_original?: boolean;
}

interface Props {
  quote: QuoteLike | null | undefined;
  variant?: "feature" | "list";
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function QuoteCard({
  quote,
  variant = "list",
  isFavorite,
  onToggleFavorite,
}: Props) {
  if (!quote) return null;

  const text = quote.text ?? quote.quote_text ?? "";
  const attribution = quote.is_original
    ? (quote.contributor ?? "SamuelSU")
    : (quote.author ?? "Unknown");

  if (variant === "feature") {
    return (
      <View style={shadow} className="overflow-hidden rounded-4xl">
        <LinearGradient
          colors={["#0f172a", "#3730a3", "#6d28d9"] as unknown as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View className="p-6">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
                <Ionicons name="chatbubble-ellipses" size={12} color="#fff" />
                <Text className="text-xs font-medium text-white/90">
                  Quote of the Day
                </Text>
              </View>
              {onToggleFavorite ? (
                <HeartButton isFavorite={!!isFavorite} onPress={onToggleFavorite} light />
              ) : null}
            </View>

            <Text className="mt-5 text-2xl font-bold text-white/15">“</Text>
            <Text className="-mt-3 text-xl font-semibold leading-8 text-white">
              {text}
            </Text>

            <View className="mt-4 flex-row flex-wrap items-center gap-2">
              <Text className="text-sm font-semibold text-white/85">
                — {attribution}
              </Text>
              {quote.is_original ? (
                <View className="rounded-full bg-amber-400/90 px-2 py-0.5">
                  <Text className="text-[10px] font-bold uppercase tracking-wide text-amber-950">
                    Original
                  </Text>
                </View>
              ) : null}
              {quote.source ? (
                <Text className="text-xs text-white/55">· {quote.source}</Text>
              ) : null}
            </View>

            {quote.reflection_question ? (
              <View className="mt-4 rounded-2xl bg-white/10 p-3">
                <Text className="text-xs text-white/80">
                  {quote.reflection_question}
                </Text>
              </View>
            ) : null}
          </View>
        </LinearGradient>
      </View>
    );
  }

  // ---- list variant (surface card) ----
  return (
    <View style={shadow} className="rounded-3xl bg-surface p-5">
      <View className="flex-row items-start justify-between gap-3">
        <Ionicons
          name="chatbubbles-outline"
          size={20}
          color={colors.brand[400]}
        />
        {onToggleFavorite ? (
          <HeartButton isFavorite={!!isFavorite} onPress={onToggleFavorite} />
        ) : null}
      </View>

      <Text className="mt-2 text-base italic leading-7 text-ink">“{text}”</Text>

      <View className="mt-3 flex-row flex-wrap items-center gap-2">
        <Text className="text-sm font-bold text-brand-700 dark:text-brand-300">
          {attribution}
        </Text>
        {quote.is_original ? (
          <View className="rounded-full bg-amber-100 px-2 py-0.5">
            <Text className="text-[10px] font-bold uppercase tracking-wide text-amber-700">
              Original
            </Text>
          </View>
        ) : null}
        {quote.source ? (
          <Text className="text-xs text-ink-soft">· {quote.source}</Text>
        ) : null}
      </View>
    </View>
  );
}

function HeartButton({
  isFavorite,
  onPress,
  light,
}: {
  isFavorite: boolean;
  onPress: () => void;
  light?: boolean;
}) {
  return (
    <Pressable
      hitSlop={8}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress();
      }}
      className={cn(
        "h-9 w-9 items-center justify-center rounded-full",
        light ? "bg-white/15" : "bg-brand-500/10",
      )}
    >
      <Ionicons
        name={isFavorite ? "heart" : "heart-outline"}
        size={18}
        color={isFavorite ? colors.rose : light ? "#fff" : colors.brand[500]}
      />
    </Pressable>
  );
}
