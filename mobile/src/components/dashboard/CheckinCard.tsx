import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/AppText";
import PrimaryButton from "@/components/PrimaryButton";

import { checkIn } from "@/services/challenges";

import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/radius";
import { SPACING } from "@/constants/spacing";

type Props = {
  challengeId: number;
  title: string;
  currentStreak: number;
  targetDays: number;
  checkedInToday: boolean;
  onCheckedIn: () => void;
};

export default function CheckinCard({
  challengeId,
  title,
  currentStreak,
  targetDays,
  checkedInToday,
  onCheckedIn,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(checkedInToday);

  async function handleCheckIn() {
    setLoading(true);

    try {
      const result = await checkIn(challengeId);
      setDone(true);

      if (result.challenge_completed) {
        Alert.alert(
          "🎉 Streak complete!",
          `You hit ${result.current_streak} days and finished "${title}". XP awarded!`
        );
      }

      onCheckedIn();
    } catch (error: any) {
      Alert.alert(
        "Couldn't check in",
        error?.response?.data?.detail ?? "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons
          name="flame"
          size={24}
          color={COLORS.primary}
        />

        <AppText style={styles.title}>{title}</AppText>
      </View>

      <View style={styles.streakRow}>
        <AppText style={styles.streakNumber}>
          {currentStreak}
        </AppText>
        <AppText variant="caption">
          / {targetDays} day streak
        </AppText>
      </View>

      <PrimaryButton
        title={done ? "✓ Checked in today" : "Check In"}
        disabled={done || loading}
        onPress={handleCheckIn}
        style={done ? styles.doneButton : undefined}
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

  streakRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginBottom: SPACING.lg,
  },

  streakNumber: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.primary,
  },

  doneButton: {
    opacity: 0.6,
  },
});
