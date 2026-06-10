import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";
import { colors } from "@/constants/theme";

interface Props {
  label: string;
  selected?: boolean;
  /** Visually de-emphasise an unselectable option (e.g. selection limit hit). */
  dimmed?: boolean;
  emoji?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

/** Selectable pill used by mood & need selectors. */
export function Chip({ label, selected, dimmed, emoji, icon, onPress }: Props) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.96 : 1 }],
        opacity: dimmed ? 0.4 : 1,
      })}
    >
      <View
        className={cn(
          "flex-row items-center gap-1.5 rounded-full border px-4 py-2.5",
          selected
            ? "bg-brand-600 border-brand-600"
            : "bg-surface/80 border-line",
        )}
      >
        {emoji ? <Text className="text-base">{emoji}</Text> : null}
        {icon ? (
          <Ionicons
            name={icon}
            size={16}
            color={selected ? "#fff" : colors.brand[500]}
          />
        ) : null}
        <Text
          className={cn(
            "text-sm font-medium",
            selected ? "text-white" : "text-ink",
          )}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
