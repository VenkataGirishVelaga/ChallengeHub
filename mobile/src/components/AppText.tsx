import { Text, TextProps, StyleSheet } from "react-native";

import { COLORS } from "@/constants/colors";
import { TYPOGRAPHY } from "@/constants/typography";

type Variant = "title" | "body" | "caption";

interface AppTextProps extends TextProps {
  variant?: Variant;
}

export default function AppText({
  variant = "body",
  style,
  children,
  ...props
}: AppTextProps) {
  return (
    <Text
      {...props}
      style={[
        styles.base,
        variant === "title" && styles.title,
        variant === "body" && styles.body,
        variant === "caption" && styles.caption,
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

  title: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: "700",
  },

  body: {
    fontSize: TYPOGRAPHY.body,
  },

  caption: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
});