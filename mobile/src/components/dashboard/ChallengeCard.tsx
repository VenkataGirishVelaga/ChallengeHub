import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/AppText";
import PrimaryButton from "@/components/PrimaryButton";

import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/radius";
import { SPACING } from "@/constants/spacing";

type Props = {
  challenge: string;
  buttonLabel?: string;
  onAction: () => void;
};

export default function ChallengeCard({
  challenge,
  buttonLabel = "Go Run",
  onAction,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons
          name="flash"
          size={24}
          color={COLORS.primary}
        />

        <AppText style={styles.title}>
          Today&apos;s Challenge
        </AppText>
      </View>

      <AppText style={styles.challenge}>
        {challenge}
      </AppText>

      <PrimaryButton
        title={buttonLabel}
        onPress={onAction}
      />
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },

  title: {
    marginLeft: SPACING.sm,
    fontWeight: "700",
    fontSize: 18,
  },

  challenge: {
    fontSize: 17,
    marginBottom: SPACING.lg,
  },
});