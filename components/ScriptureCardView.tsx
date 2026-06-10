import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { shadow } from "@/constants/theme";

interface CardLike {
  reference: string;
  text: string;
  theme?: string | null;
  category?: string | null;
}

interface Props {
  card: CardLike;
  /** Index shown as a soft badge, e.g. "2 / 5". */
  badge?: string;
}

/**
 * The premium gradient verse card. Purely presentational so it can be reused by
 * the swipe deck, favorites preview and reflection screen.
 */
export function ScriptureCardView({ card, badge }: Props) {
  return (
    <View style={shadow} className="flex-1 overflow-hidden rounded-4xl">
      <LinearGradient
        colors={["#4f46e5", "#7c3aed", "#9333ea"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <View className="flex-1 justify-between p-7">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2 rounded-full bg-white/15 px-3 py-1.5">
              <Ionicons name="book-outline" size={14} color="#fff" />
              <Text className="text-xs font-medium text-white/90">
                {card.theme ?? card.category ?? "Scripture"}
              </Text>
            </View>
            {badge ? (
              <View className="rounded-full bg-white/15 px-3 py-1.5">
                <Text className="text-xs font-medium text-white/90">
                  {badge}
                </Text>
              </View>
            ) : null}
          </View>

          <View className="gap-4">
            <Ionicons name="bookmark" size={26} color="rgba(255,255,255,0.4)" />
            <Text className="text-2xl font-semibold leading-9 text-white">
              “{card.text}”
            </Text>
            <Text className="text-base font-medium text-white/80">
              — {card.reference}
            </Text>
          </View>

          <View className="h-1 w-16 rounded-full bg-white/20" />
        </View>
      </LinearGradient>
    </View>
  );
}
