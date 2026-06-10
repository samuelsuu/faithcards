import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { shadow } from "@/constants/theme";
import type { Scripture } from "@/types";

/** Rotating gradient palettes so the feed feels varied & premium. */
const VERSE_GRADIENTS: string[][] = [
  ["#4f46e5", "#7c3aed", "#9333ea"],
  ["#0ea5e9", "#6366f1"],
  ["#f59e0b", "#ef4444"],
  ["#059669", "#0d9488"],
  ["#ec4899", "#8b5cf6"],
  ["#3b82f6", "#2563eb"],
  ["#8b5cf6", "#6366f1"],
];

interface Props {
  scripture: Scripture;
  index: number;
  isFavorite: boolean;
  speaking?: boolean;
  onToggleFavorite: () => void;
  onListen: () => void;
  onShare: () => void;
}

export function VerseCard({
  scripture,
  index,
  isFavorite,
  speaking,
  onToggleFavorite,
  onListen,
  onShare,
}: Props) {
  const palette = VERSE_GRADIENTS[index % VERSE_GRADIENTS.length];

  return (
    <View style={shadow} className="overflow-hidden rounded-4xl">
      <LinearGradient
        colors={palette as unknown as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View className="p-6">
          {/* Theme + translation */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
              <Ionicons name="pricetag" size={12} color="#fff" />
              <Text className="text-xs font-medium text-white/90">
                {scripture.theme ?? "Scripture"}
              </Text>
            </View>
            <Text className="text-xs font-medium text-white/60">
              {scripture.translation}
            </Text>
          </View>

          {/* Verse */}
          <Ionicons
            name="bookmark"
            size={22}
            color="rgba(255,255,255,0.35)"
            style={{ marginTop: 18 }}
          />
          <Text className="mt-3 text-xl font-semibold leading-8 text-white">
            “{scripture.text}”
          </Text>
          <Text className="mt-3 text-sm font-medium text-white/80">
            — {scripture.reference}
          </Text>

          {/* Actions */}
          <View className="mt-5 h-px bg-white/15" />
          <View className="mt-4 flex-row items-center justify-between">
            <CardAction
              icon={speaking ? "stop" : "volume-medium"}
              label={speaking ? "Stop" : "Listen"}
              onPress={onListen}
            />
            <CardAction
              icon={isFavorite ? "heart" : "heart-outline"}
              label={isFavorite ? "Saved" : "Save"}
              tint={isFavorite ? "#fb7185" : "#fff"}
              onPress={onToggleFavorite}
            />
            <CardAction icon="share-social-outline" label="Share" onPress={onShare} />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

function CardAction({
  icon,
  label,
  tint = "#fff",
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  tint?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress();
      }}
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      className="flex-row items-center gap-1.5 rounded-full bg-white/10 px-4 py-2"
    >
      <Ionicons name={icon} size={16} color={tint} />
      <Text className="text-xs font-semibold" style={{ color: tint }}>
        {label}
      </Text>
    </Pressable>
  );
}
