import { Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Logo } from "@/components/Logo";

/**
 * "/" — animated splash. The auth guard in the root layout decides where to
 * send the user; this branded screen shows while that resolves.
 */
export default function SplashRoute() {
  return (
    <GradientBackground variant="dusk" className="items-center justify-center">
      <Animated.View entering={FadeIn.duration(600)} className="items-center">
        <Logo size={88} />
        <Animated.Text
          entering={FadeInDown.delay(200).duration(700)}
          className="mt-6 text-3xl font-bold text-white"
        >
          Faith<Text className="text-brand-200">Cards</Text>
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(400).duration(700)}
          className="mt-2 text-base text-white/70"
        >
          Daily Scripture for your soul
        </Animated.Text>
      </Animated.View>

      <View className="absolute bottom-16">
        <Text className="text-sm text-white/50">Be still and know.</Text>
      </View>
    </GradientBackground>
  );
}
