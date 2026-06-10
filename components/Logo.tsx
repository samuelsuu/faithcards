import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { gradients, shadow } from "@/constants/theme";
import { cn } from "@/lib/utils";

interface Props {
  size?: number;
  withWordmark?: boolean;
  tone?: "light" | "dark";
}

/** FaithCards mark — a stacked-cards glyph in a soft gradient tile. */
export function Logo({ size = 64, withWordmark = false, tone = "dark" }: Props) {
  return (
    <View className="items-center gap-3">
      <LinearGradient
        colors={gradients.card as unknown as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          shadow,
          {
            width: size,
            height: size,
            borderRadius: size * 0.3,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <Ionicons name="layers" size={size * 0.5} color="#fff" />
      </LinearGradient>
      {withWordmark ? (
        <Text
          className={cn(
            "text-2xl font-bold tracking-tight",
            tone === "light" ? "text-white" : "text-ink",
          )}
        >
          Faith<Text className="text-brand-500">Cards</Text>
        </Text>
      ) : null}
    </View>
  );
}
