import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon, title, subtitle }: Props) {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-10 py-16">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-brand-100">
        <Ionicons name={icon} size={34} color={colors.brand[500]} />
      </View>
      <Text className="text-center text-lg font-semibold text-ink">
        {title}
      </Text>
      {subtitle ? (
        <Text className="text-center text-sm text-ink-muted">{subtitle}</Text>
      ) : null}
    </View>
  );
}
