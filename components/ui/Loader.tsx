import { ActivityIndicator, Text, View } from "react-native";
import { colors } from "@/constants/theme";

export function Loader({ label }: { label?: string }) {
  return (
    <View className="flex-1 items-center justify-center gap-3">
      <ActivityIndicator size="large" color={colors.brand[500]} />
      {label ? <Text className="text-sm text-ink-muted">{label}</Text> : null}
    </View>
  );
}
