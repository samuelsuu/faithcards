import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { cn } from "@/lib/utils";

interface Props {
  count: number;
  index: number;
}

/** Animated step indicator for carousels / wizards. */
export function ProgressDots({ count, index }: Props) {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Dot key={i} active={i === index} done={i < index} />
      ))}
    </View>
  );
}

function Dot({ active, done }: { active: boolean; done: boolean }) {
  const style = useAnimatedStyle(() => ({
    width: withTiming(active ? 24 : 8, { duration: 250 }),
  }));
  return (
    <Animated.View
      style={style}
      className={cn(
        "h-2 rounded-full",
        active ? "bg-brand-600" : done ? "bg-brand-300" : "bg-brand-100",
      )}
    />
  );
}
