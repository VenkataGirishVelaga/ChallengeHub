import { Pressable, StyleSheet, ViewStyle } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/AppText";

import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/radius";
import { SPACING } from "@/constants/spacing";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  style?: ViewStyle;
};

export default function QuickActionCard({
  icon,
  title,
  onPress,
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
        style,
      ]}
    >
      <Ionicons name={icon} size={28} color={COLORS.primary} />

      <AppText variant="label" style={styles.title}>
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: "center",
    justifyContent: "center",

    minHeight: 112,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  cardPressed: {
    borderColor: COLORS.primary,
  },

  title: {
    marginTop: SPACING.sm,
    textAlign: "center",
  },
});
