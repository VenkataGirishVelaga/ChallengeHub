import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import Screen from "@/components/Screen";
import PrimaryButton from "@/components/PrimaryButton";
import AppText from "@/components/AppText";

import { router } from "expo-router";

import useStepTracker from "@/hooks/useStepTracker";
import { api } from "@/lib/api";

import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";
import { RADIUS } from "@/constants/radius";

export default function StartWalkScreen() {
  const {
    available,
    walking,
    steps,
    seconds,
    calories,
    startWalk,
    finishWalk,
  } = useStepTracker();

  const [challengeProgress, setChallengeProgress] = useState<any>(null);

  useEffect(() => {
    async function loadProgress() {
      try {
        const response = await api.get("/challenges/progress/walking");
        setChallengeProgress(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    loadProgress();
  }, []);

  const remainingBefore = challengeProgress
    ? Math.max(0, challengeProgress.target - challengeProgress.progress)
    : null;
  const remainingNow = challengeProgress
    ? Math.max(0, remainingBefore! - steps)
    : null;

  return (
    <Screen>
      <View style={styles.container}>
        {available === false && (
          <View style={styles.challengeCard}>
            <AppText style={styles.challengeRemaining}>
              Step counting isn't available on this device.
            </AppText>
          </View>
        )}

        {challengeProgress && (
          <View style={styles.challengeCard}>
            <AppText style={styles.challengeTitle}>
              🎯 {challengeProgress.title}
            </AppText>
            <AppText style={styles.challengeRemaining}>
              {remainingNow! > 0
                ? `${Math.round(remainingNow!)} steps to go`
                : "Target reached this walk! 🎉"}
            </AppText>
          </View>
        )}

        {!walking ? (
          <PrimaryButton
            title="Start Walk"
            onPress={startWalk}
          />
        ) : (
          <>
            <AppText style={styles.title}>
              🚶 Walk Session
            </AppText>

            <View style={styles.stats}>
              <AppText style={styles.label}>⏱ Time</AppText>
              <AppText style={styles.value}>
                {Math.floor(seconds / 60)}:
                {(seconds % 60)
                  .toString()
                  .padStart(2, "0")}
              </AppText>

              <AppText style={styles.label}>👣 Steps</AppText>
              <AppText style={styles.value}>
                {steps}
              </AppText>

              <AppText style={styles.label}>🔥 Calories</AppText>
              <AppText style={styles.value}>
                {calories} kcal
              </AppText>
            </View>

            <PrimaryButton
              title="Finish Walk"
              onPress={() => {
                finishWalk();

                router.push({
                  pathname: "/walking/summary",
                  params: {
                    steps: steps.toString(),
                    seconds: seconds.toString(),
                    calories: calories.toString(),
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

  stats: {
    flex: 1,
    justifyContent: "center",
  },
});
