import { Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  size?: number;
  /** Defaults to the theme's primary ink color when omitted. */
  color?: string;
  /** Circular surface behind the icon. */
  surface?: boolean;
  active?: boolean;
  className?: string;
  accessibilityLabel?: string;
}

export function IconButton({
  icon,
  onPress,
  size = 22,
  color,
  surface = true,
  active = false,
  className,
  accessibilityLabel,
}: Props) {
  const { c } = useTheme();
  const iconColor = active ? "#fff" : (color ?? c.ink);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress?.();
      }}
      style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.9 : 1 }] })}
    >
      <View
        className={cn(
          surface && "h-12 w-12 items-center justify-center rounded-full",
          surface && (active ? "bg-brand-600" : "bg-surface/90"),
          className,
        )}
      >
        <Ionicons name={icon} size={size} color={iconColor} />
      </View>
    </Pressable>
  );
}
