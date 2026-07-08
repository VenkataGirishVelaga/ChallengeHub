import { StyleSheet, View } from "react-native";

import AppText from "@/components/AppText";

import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/radius";
import { SPACING } from "@/constants/spacing";

type ProgressCardProps = {
  progress: number;
};

export default function ProgressCard({
  progress,
}: ProgressCardProps) {
  return (
    <View style={styles.card}>
      <AppText variant="body">
        Weekly Progress
      </AppText>

      <View style={styles.bar}>
        <View
          style={[
            styles.fill,
            {
              width: `${progress}%`,
            },
          ]}
        />
      </View>

      <AppText variant="caption">
        {progress}% Completed
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },

  bar: {
    height: 14,
    backgroundColor: COLORS.border,
    borderRadius: 100,
    marginVertical: SPACING.md,
    overflow: "hidden",
  },

  fill: {
    backgroundColor: COLORS.primary,
    borderRadius: 100,
  },
});