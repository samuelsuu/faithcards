import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import type { ReactNode } from "react";
import { darkGradients, gradients, type GradientKey } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  variant?: GradientKey;
  children?: ReactNode;
  /** Extra className applied to the inner content View. */
  className?: string;
}

/** Full-bleed soft gradient background used across the app (theme-aware). */
export function GradientBackground({
  variant = "morning",
  children,
  className,
}: Props) {
  const { isDark } = useTheme();
  const palette = (isDark ? darkGradients : gradients)[variant];
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={palette as unknown as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View className={className} style={{ flex: 1 }}>
        {children}
      </View>
    </View>
  );
}
