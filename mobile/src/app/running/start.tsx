import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import Screen from "@/components/Screen";
import PrimaryButton from "@/components/PrimaryButton";
import AppText from "@/components/AppText";

import { router } from "expo-router";

import useRunTracker from "@/hooks/useRunTracker";
import { getActiveProgress } from "@/services/challenges";

import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";
import { RADIUS } from "@/constants/radius";

export default function StartRunScreen() {
  const {
    location,
    running,
    distance,
    seconds,
    pace,
    calories,
    startRun,
    finishRun,
  } = useRunTracker();

  const [challengeProgress, setChallengeProgress] = useState<any>(null);

  useEffect(() => {
    async function loadProgress() {
      try {
        const data = await getActiveProgress();
        setChallengeProgress(data);
      } catch (error) {
        console.log(error);
      }
    }

    loadProgress();
  }, []);

  // distance from the tracker is in meters mid-run; challengeProgress
  // fields (progress/target) come from the backend in km, matching
  // what actually gets saved (see summary.tsx's km conversion).
  const sessionKm = distance / 1000;
  const remainingBeforeRun = challengeProgress
    ? Math.max(0, challengeProgress.target - challengeProgress.progress)
    : null;
  const remainingNow = challengeProgress
    ? Math.max(0, remainingBeforeRun! - sessionKm)
    : null;

  return (
    <Screen>
      <View style={styles.container}>
        {challengeProgress && (
          <View style={styles.challengeCard}>
            <AppText style={styles.challengeTitle}>
              🎯 {challengeProgress.title}
            </AppText>
            <AppText style={styles.challengeRemaining}>
              {remainingNow! > 0
                ? `${remainingNow!.toFixed(2)} km to go`
                : "Target reached this run! 🎉"}
            </AppText>
          </View>
        )}

        {!running ? (
          <PrimaryButton
            title="Start Run"
            onPress={startRun}
          />
        ) : (
          <>
            <AppText style={styles.title}>
              🏃 Morning Run
            </AppText>

            <View style={styles.stats}>
              <AppText style={styles.label}>⏱ Time</AppText>
              <AppText style={styles.value}>
                {Math.floor(seconds / 60)}:
                {(seconds % 60)
                  .toString()
                  .padStart(2, "0")}
              </AppText>

              <AppText style={styles.label}>📍 Distance</AppText>
              <AppText style={styles.value}>
                {sessionKm.toFixed(2)} km
              </AppText>

              <AppText style={styles.label}>⚡ Pace</AppText>
              <AppText style={styles.value}>
                {pace}
              </AppText>

              <AppText style={styles.label}>🔥 Calories</AppText>
              <AppText style={styles.value}>
                {calories} kcal
              </AppText>

              <AppText style={styles.gps}>
                🟢 GPS Connected
              </AppText>
            </View>

            <PrimaryButton
              title="Finish Run"
            onPress={() => {
                finishRun();

                router.push({
                  pathname: "/running/summary",
                  params: {
                    distance: (distance / 1000).toFixed(2),
                    seconds: seconds.toString(),
                    pace,
                    calories,
                  },
                });
              }}
            />
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  challengeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },

  challengeTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
  },

  challengeRemaining: {
    color: COLORS.textSecondary,
    fontWeight: "600",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 40,
  },

  label: {
    fontSize: 16,
    opacity: 0.6,
    marginTop: 20,
  },

  value: {
    fontSize: 36,
    fontWeight: "700",
  },

  gps: {
    marginTop: 40,
    textAlign: "center",
    color: "green",
    fontWeight: "700",
  },

  stats: {
    flex: 1,
    justifyContent: "center",
  },
});
