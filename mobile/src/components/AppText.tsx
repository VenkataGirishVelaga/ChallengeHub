import { Text, TextProps, StyleSheet } from "react-native";

import { COLORS } from "@/constants/colors";
import { TYPOGRAPHY } from "@/constants/typography";

type Variant =
  | "display"
  | "stat"
  | "title"
  | "heading"
  | "body"
  | "caption"
  | "label";

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: string;
}

export default function AppText({
  variant = "body",
  color,
  style,
  children,
  ...props
}: AppTextProps) {
  return (
    <Text
      {...props}
      style={[
        styles.base,
        variant === "display" && styles.display,
        variant === "stat" && styles.stat,
        variant === "title" && styles.title,
        variant === "heading" && styles.heading,
        variant === "body" && styles.body,
        variant === "caption" && styles.caption,
        variant === "label" && styles.label,
        color ? { color } : null,
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: COLORS.text,
  },

  display: {
    fontSize: TYPOGRAPHY.display,
    fontWeight: "900",
    letterSpacing: -1.5,
  },

  stat: {
    fontSize: TYPOGRAPHY.stat,
    fontWeight: "900",
    letterSpacing: -1,
  },

  title: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  heading: {
    fontSize: TYPOGRAPHY.heading,
    fontWeight: "800",
    letterSpacing: -0.2,
  },

  body: {
    fontSize: TYPOGRAPHY.body,
  },

  caption: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },

  label: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: COLORS.textSecondary,
  },
});
