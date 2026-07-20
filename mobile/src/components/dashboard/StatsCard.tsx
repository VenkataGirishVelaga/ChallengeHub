import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/AppText";

import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/radius";
import { SPACING } from "@/constants/spacing";

type StatsCardProps = {
  streak: number;
};

export default function StatsCard({ streak }: StatsCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconRing}>
        <Ionicons name="flame" size={30} color={COLORS.primary} />
      </View>

      <AppText variant="display" color={COLORS.primary} style={styles.number}>
        {streak}
      </AppText>

      <AppText variant="label">Day Streak</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: "center",
    marginBottom: SPACING.lg,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  iconRing: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
  },

  number: {
    marginVertical: SPACING.xs,
  },
});
