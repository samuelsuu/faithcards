import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { cn } from "@/lib/utils";

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
  tint?: string;
  className?: string;
}

export function StatCard({ icon, value, label, tint = colors.brand[500], className }: Props) {
  return (
    <View
      className={cn(
        "flex-1 items-center gap-1 rounded-3xl bg-surface/90 px-3 py-4",
        className,
      )}
    >
      <Ionicons name={icon} size={22} color={tint} />
      <Text className="text-2xl font-bold text-ink">{value}</Text>
      <Text className="text-xs text-ink-muted text-center">{label}</Text>
    </View>
  );
}
