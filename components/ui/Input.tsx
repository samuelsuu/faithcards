import { forwardRef, useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  /** Render a show/hide toggle (for passwords). */
  secure?: boolean;
}

export const Input = forwardRef<TextInput, Props>(function Input(
  { label, error, icon, secure, ...rest },
  ref,
) {
  const [hidden, setHidden] = useState(!!secure);
  const [focused, setFocused] = useState(false);
  const { c } = useTheme();

  return (
    <View className="w-full gap-1.5">
      {label ? (
        <Text className="text-sm font-medium text-ink-muted ml-1">{label}</Text>
      ) : null}
      <View
        className={cn(
          "flex-row items-center rounded-2xl border bg-surface px-4",
          error
            ? "border-rose-300"
            : focused
              ? "border-brand-400"
              : "border-line",
        )}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={20}
            color={c.inkSoft}
            style={{ marginRight: 8 }}
          />
        ) : null}
        <TextInput
          ref={ref}
          className="flex-1 py-4 text-base text-ink"
          placeholderTextColor={c.inkSoft}
          secureTextEntry={hidden}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {secure ? (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8}>
            <Ionicons
              name={hidden ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={c.inkSoft}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text className="text-xs text-rose-500 ml-1">{error}</Text>
      ) : null}
    </View>
  );
});
