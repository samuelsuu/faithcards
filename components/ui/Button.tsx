import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  type PressableProps,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";
import { colors, gradients, shadow } from "@/constants/theme";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface Props extends Omit<PressableProps, "children"> {
  label: string;
  variant?: Variant;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
}

export function Button({
  label,
  variant = "primary",
  loading = false,
  icon,
  fullWidth = true,
  disabled,
  onPress,
  ...rest
}: Props) {
  const isDisabled = disabled || loading;

  const handlePress: PressableProps["onPress"] = (e) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.(e);
  };

  const content = (
    <View className="flex-row items-center justify-center gap-2">
      {loading ? (
        <ActivityIndicator
          color={variant === "secondary" || variant === "ghost" ? colors.brand[600] : "#fff"}
        />
      ) : (
        <>
          {icon ? (
            <Ionicons
              name={icon}
              size={18}
              color={
                variant === "secondary" || variant === "ghost"
                  ? colors.brand[600]
                  : "#fff"
              }
            />
          ) : null}
          <Text
            className={cn(
              "text-base font-semibold",
              variant === "secondary" || variant === "ghost"
                ? "text-brand-600"
                : "text-white",
            )}
          >
            {label}
          </Text>
        </>
      )}
    </View>
  );

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => [
        variant === "primary" ? shadow : undefined,
        {
          opacity: isDisabled ? 0.55 : pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          width: fullWidth ? "100%" : undefined,
        },
      ]}
      {...rest}
    >
      {variant === "primary" || variant === "danger" ? (
        <LinearGradient
          colors={
            (variant === "danger"
              ? ["#fb7185", "#ef4444"]
              : gradients.card) as unknown as [string, string]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl px-6 py-4"
        >
          {content}
        </LinearGradient>
      ) : (
        <View
          className={cn(
            "rounded-2xl px-6 py-4",
            variant === "secondary"
              ? "bg-surface border border-line"
              : "bg-transparent",
          )}
        >
          {content}
        </View>
      )}
    </Pressable>
  );
}
