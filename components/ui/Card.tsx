import { View, type ViewProps } from "react-native";
import { cn } from "@/lib/utils";
import { shadow } from "@/constants/theme";

interface Props extends ViewProps {
  /** Apply the soft elevated shadow preset. */
  elevated?: boolean;
}

/** Rounded white surface used for list rows, panels, etc. */
export function Card({ elevated = true, className, style, ...rest }: Props) {
  return (
    <View
      style={[elevated ? shadow : undefined, style]}
      className={cn("rounded-3xl bg-surface p-5", className)}
      {...rest}
    />
  );
}
