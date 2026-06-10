import { useColorScheme } from "nativewind";
import { darkPalette, lightPalette } from "@/constants/theme";

/**
 * Theme helper built on NativeWind's color scheme. `c` provides raw colors for
 * props that can't take className (icon tints, placeholderTextColor, gradients).
 * className-based colors flip automatically via the CSS variables in global.css.
 */
export function useTheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  return {
    isDark,
    colorScheme,
    setColorScheme,
    toggleColorScheme,
    c: isDark ? darkPalette : lightPalette,
  };
}
