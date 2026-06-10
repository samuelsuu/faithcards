import {
  forwardRef,
  useImperativeHandle,
  useState,
  type ReactNode,
} from "react";
import { Dimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

const { width: SCREEN_W } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_W * 0.28;

export type SwipeDirection = "left" | "right";

export interface CardStackHandle {
  swipe: (dir: SwipeDirection) => void;
}

interface Props<T> {
  data: T[];
  /** Index of the current top card (controlled by the parent). */
  index: number;
  renderCard: (item: T) => ReactNode;
  onSwipe: (item: T, dir: SwipeDirection, index: number) => void;
}

function triggerHaptic() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}

/**
 * Tinder-style swipe deck built on Gesture Handler + Reanimated.
 * The parent owns `index`; the deck animates the top card off-screen, then
 * calls `onSwipe` so the parent can advance. Up to 3 cards render for depth.
 */
function CardStackInner<T>(
  { data, index, renderCard, onSwipe }: Props<T>,
  ref: React.Ref<CardStackHandle>,
) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  // Re-mount key so the leaving card's offsets reset cleanly per index.
  const [, force] = useState(0);

  const current = data[index];

  function commit(dir: SwipeDirection) {
    if (!current) return;
    onSwipe(current, dir, index);
    translateX.value = 0;
    translateY.value = 0;
    force((n) => n + 1);
  }

  function flyOut(dir: SwipeDirection) {
    const to = dir === "right" ? SCREEN_W * 1.5 : -SCREEN_W * 1.5;
    triggerHaptic();
    translateX.value = withTiming(to, { duration: 280 }, (finished) => {
      if (finished) runOnJS(commit)(dir);
    });
  }

  useImperativeHandle(ref, () => ({
    swipe: (dir) => flyOut(dir),
  }));

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY * 0.25;
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > SWIPE_THRESHOLD) {
        const dir: SwipeDirection = e.translationX > 0 ? "right" : "left";
        const to = dir === "right" ? SCREEN_W * 1.5 : -SCREEN_W * 1.5;
        runOnJS(triggerHaptic)();
        translateX.value = withTiming(to, { duration: 240 }, (finished) => {
          if (finished) runOnJS(commit)(dir);
        });
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const topStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_W, 0, SCREEN_W],
      [-12, 0, 12],
    );
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotateZ: `${rotate}deg` },
      ],
    };
  });

  const likeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1]),
  }));
  const nopeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0]),
  }));

  // Render the next two cards behind for depth.
  const behind = [data[index + 2], data[index + 1]].filter(Boolean) as T[];

  return (
    <View className="flex-1">
      {behind.map((item, i) => {
        // i=0 -> index+2 (further), i=1 -> index+1 (closer)
        const depth = behind.length - i; // 2 or 1
        const scale = 1 - depth * 0.05;
        const offsetY = depth * 14;
        return (
          <View
            key={`behind-${index}-${i}`}
            style={{
              position: "absolute",
              top: offsetY,
              left: 0,
              right: 0,
              bottom: -offsetY,
              transform: [{ scale }],
              opacity: 0.6,
            }}
          >
            {renderCard(item)}
          </View>
        );
      })}

      {current ? (
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[{ position: "absolute", inset: 0 }, topStyle]}
          >
            {renderCard(current)}

            <Animated.View
              pointerEvents="none"
              style={likeStyle}
              className="absolute left-6 top-8 -rotate-12 rounded-xl border-4 border-emerald-400 px-3 py-1"
            >
              <Animated.Text className="text-2xl font-extrabold text-emerald-400">
                AMEN
              </Animated.Text>
            </Animated.View>
            <Animated.View
              pointerEvents="none"
              style={nopeStyle}
              className="absolute right-6 top-8 rotate-12 rounded-xl border-4 border-rose-400 px-3 py-1"
            >
              <Animated.Text className="text-2xl font-extrabold text-rose-400">
                SKIP
              </Animated.Text>
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      ) : null}
    </View>
  );
}

export const CardStack = forwardRef(CardStackInner) as <T>(
  props: Props<T> & { ref?: React.Ref<CardStackHandle> },
) => ReturnType<typeof CardStackInner>;
