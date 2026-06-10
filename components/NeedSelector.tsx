import { Text, View } from "react-native";
import { Chip } from "@/components/ui/Chip";
import { NEEDS } from "@/constants/needs";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  /** Selected need slugs (multi-select). */
  values: string[];
  onChange: (slugs: string[]) => void;
  /** Maximum selectable needs. */
  max?: number;
}

export function NeedSelector({ values, onChange, max = 3 }: Props) {
  const atLimit = values.length >= max;

  function toggle(slug: string) {
    if (values.includes(slug)) {
      onChange(values.filter((s) => s !== slug));
    } else if (!atLimit) {
      onChange([...values, slug]);
    }
    // At the limit, taps on unselected chips are ignored.
  }

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-ink">
          What do you need today?
        </Text>
        <Text className="text-xs text-ink-soft">
          {values.length}/{max}
        </Text>
      </View>
      <View className="flex-row flex-wrap gap-2.5">
        {NEEDS.map((n) => {
          const selected = values.includes(n.slug);
          return (
            <Chip
              key={n.slug}
              label={n.label}
              icon={n.icon as keyof typeof Ionicons.glyphMap}
              selected={selected}
              dimmed={!selected && atLimit}
              onPress={() => toggle(n.slug)}
            />
          );
        })}
      </View>
    </View>
  );
}
