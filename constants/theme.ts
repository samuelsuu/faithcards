/**
 * Design tokens for FaithCards.
 * Soft, premium Christian-wellness palette (Calm / Headspace inspired).
 * Tailwind classes live in tailwind.config.js; this file is for places that
 * need raw values (gradients, reanimated, vector icons, status bar).
 */

export const colors = {
  brand: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
  },
  sand: {
    50: "#fbf7f0",
    100: "#f4ece0",
    200: "#e8d8c3",
  },
  ink: "#1f2233",
  inkMuted: "#6b7280",
  inkSoft: "#9ca3af",
  white: "#ffffff",
  rose: "#fb7185",
  amber: "#f59e0b",
  emerald: "#10b981",
} as const;

/** Background gradients used by GradientBackground & cards (light theme). */
export const gradients = {
  morning: ["#fbf7f0", "#e0e7ff"],
  dusk: ["#312e81", "#4f46e5"],
  card: ["#6366f1", "#8b5cf6"],
  calm: ["#a5b4fc", "#c7d2fe"],
  warm: ["#fde68a", "#fca5a5"],
} as const;

/** Dark-theme counterparts (same keys). */
export const darkGradients = {
  morning: ["#161826", "#1e1b4b"],
  dusk: ["#0d0e1c", "#312e81"],
  card: ["#4f46e5", "#7c3aed"],
  calm: ["#1b1d2e", "#312e81"],
  warm: ["#2e2230", "#4c1d24"],
} as const;

/** Raw semantic colors for JS props (icon tints, placeholders). */
export const lightPalette = {
  ink: "#1f2233",
  inkMuted: "#6b7280",
  inkSoft: "#9ca3af",
  surface: "#ffffff",
} as const;

export const darkPalette = {
  ink: "#edeef5",
  inkMuted: "#9ca3b8",
  inkSoft: "#6e758a",
  surface: "#1e2133",
} as const;

/** Soft shadow preset for elevated cards. */
export const shadow = {
  shadowColor: "#312e81",
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.12,
  shadowRadius: 24,
  elevation: 8,
} as const;

export type GradientKey = keyof typeof gradients;
