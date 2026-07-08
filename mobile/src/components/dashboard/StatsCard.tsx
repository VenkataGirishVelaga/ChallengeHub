import { StyleSheet, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/AppText";

import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/radius";
import { SPACING } from "@/constants/spacing";

type StatsCardProps = {
  streak: number;
};

export default function StatsCard({
  streak,
}: StatsCardProps) {
  return (
    <View style={styles.card}>
      <Ionicons
        name="flame"
        size={34}
        color="#F97316"
      />

      <AppText style={styles.number}>
        {streak}
      </AppText>

      <AppText variant="caption">
        Day Streak
      </AppText>
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

   number: {
    fontSize: 42,
    fontWeight: "900",
    color: COLORS.primary,
    marginVertical: SPACING.sm,
   },
});