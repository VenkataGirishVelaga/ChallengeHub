import { useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/AppText";
import PrimaryButton from "@/components/PrimaryButton";
import RivalsBar from "@/components/challenges/RivalsBar";

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
  const isCheckin = entry.challenge_type === "checkin";
  const isWalking = entry.activity_type === "walking";
  const accentColor = isCheckin ? COLORS.accent : COLORS.primary;

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

  return (
    <View style={[styles.card, { borderColor: `${accentColor}33` }]}>
      <View style={styles.header}>
        <View style={[styles.iconChip, { backgroundColor: `${accentColor}22` }]}>
          <Ionicons
            name={isCheckin ? "flame" : isWalking ? "footsteps" : "flash"}
            size={18}
            color={accentColor}
          />
        </View>

        <AppText style={styles.title} numberOfLines={1}>
          {entry.title}
        </AppText>

        <Pressable onPress={confirmLeave} hitSlop={10}>
          <Ionicons
            name="trash-outline"
            size={20}
            color={COLORS.textMuted}
          />
        </Pressable>
      </View>

      {isCheckin ? (
        <>
          <View style={styles.streakRow}>
            <AppText variant="stat" color={COLORS.accent}>
              {entry.current_streak}
            </AppText>
            <AppText variant="label" style={styles.streakLabel}>
              / {entry.target_days} DAY STREAK
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
          />
        </>
      ) : (
        <>
          <View style={styles.streakRow}>
            <AppText variant="stat" color={COLORS.primary}>
              {entry.progress}
            </AppText>
            <AppText variant="label" style={styles.streakLabel}>
              / {entry.target} {entry.unit?.toUpperCase()}
            </AppText>
          </View>

          <PrimaryButton
            title={entry.activity_type === "walking" ? "Go Walk" : "Go Run"}
            onPress={() =>
              router.push(
                entry.activity_type === "walking"
                  ? "/walking/start"
                  : "/running/start"
              )
            }
          />

          <RivalsBar challengeId={entry.challenge_id} />
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
    borderWidth: 1.5,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },

  iconChip: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    flex: 1,
    fontWeight: "700",
    fontSize: 16,
  },

  streakRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: SPACING.lg,
  },

  streakLabel: {
    textTransform: "none",
    letterSpacing: 0.4,
  },
});
