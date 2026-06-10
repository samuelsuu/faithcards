import { ScrollView, Text, View } from "react-native";
import { Chip } from "@/components/ui/Chip";
import { MOODS } from "@/constants/moods";

interface Props {
  value: string | null;
  onChange: (slug: string) => void;
}

export function MoodSelector({ value, onChange }: Props) {
  return (
    <View className="gap-3">
      <Text className="text-base font-semibold text-ink">
        How are you feeling?
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2.5 pr-4"
      >
        {MOODS.map((m) => (
          <Chip
            key={m.slug}
            label={m.label}
            emoji={m.emoji}
            selected={value === m.slug}
            onPress={() => onChange(m.slug)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
