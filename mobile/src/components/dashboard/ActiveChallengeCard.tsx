import { useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/AppText";
import PrimaryButton from "@/components/PrimaryButton";

import { checkIn, leaveChallenge } from "@/services/challenges";

import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/radius";
import { SPACING } from "@/constants/spacing";

type Props = {
  entry: any;
  onChanged: () => void;
};

export default function ActiveChallengeCard({ entry, onChanged }: Props) {
  const [loading, setLoading] = useState(false);

  function confirmLeave() {
    Alert.alert(
      "Leave challenge?",
      `You'll lose your progress on "${entry.title}".`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: async () => {
            try {
              await leaveChallenge(entry.challenge_id);
              onChanged();
            } catch (error) {
              console.log(error);
              Alert.alert("Error", "Couldn't leave this challenge.");
            }
          },
        },
      ]
    );
  }

  async function handleCheckIn() {
    setLoading(true);

    try {
      const result = await checkIn(entry.challenge_id);

      if (result.challenge_completed) {
        Alert.alert(
          "🎉 Streak complete!",
          `You hit ${result.current_streak} days and finished "${entry.title}". XP awarded!`
        );
      }

      onChanged();
    } catch (error: any) {
      Alert.alert(
        "Couldn't check in",
        error?.response?.data?.detail ?? "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  const isCheckin = entry.challenge_type === "checkin";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons
          name={isCheckin ? "flame" : "flash"}
          size={22}
          color={COLORS.primary}
        />

        <AppText style={styles.title} numberOfLines={1}>
          {entry.title}
        </AppText>

        <Pressable onPress={confirmLeave} hitSlop={10}>
          <Ionicons
            name="trash-outline"
            size={20}
            color={COLORS.textSecondary}
          />
        </Pressable>
      </View>

      {isCheckin ? (
        <>
          <View style={styles.streakRow}>
            <AppText style={styles.streakNumber}>
              {entry.current_streak}
            </AppText>
            <AppText variant="caption">
              / {entry.target_days} day streak
            </AppText>
          </View>

          <PrimaryButton
            title={
              entry.checked_in_today
                ? "✓ Checked in today"
                : "Check In"
            }
            disabled={entry.checked_in_today || loading}
            onPress={handleCheckIn}
            style={entry.checked_in_today ? styles.doneButton : undefined}
          />
        </>
      ) : (
        <>
          <AppText variant="caption" style={styles.targetLine}>
            🎯 {entry.progress} / {entry.target} {entry.unit}
          </AppText>

          <PrimaryButton
            title="Start"
            onPress={() => router.push("/running/start")}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },

  title: {
    flex: 1,
    fontWeight: "700",
    fontSize: 16,
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

  targetLine: {
    marginBottom: SPACING.lg,
  },

  doneButton: {
    opacity: 0.6,
  },
});
