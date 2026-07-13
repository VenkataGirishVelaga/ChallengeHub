import { View, StyleSheet } from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Alert } from "react-native";
import { saveRun } from "@/services/running";
import Screen from "@/components/Screen";
import AppText from "@/components/AppText";
import PrimaryButton from "@/components/PrimaryButton";

const BADGE_TITLES: Record<string, string> = {
  first_run: "🏃 First Steps",
  runs_5: "🔥 Getting Started",
  runs_25: "💪 Committed",
  distance_10k: "🎯 10K Club",
  distance_50k: "🏅 50K Club",
  distance_100k: "🏆 Centurion",
};

export default function RunSummaryScreen() {
  const [saving, setSaving] = useState(false);
  const {
    distance,
    seconds,
    calories,
    pace,
  } = useLocalSearchParams();

  return (
    <Screen>
      <View style={styles.container}>
        <AppText style={styles.title}>
          🎉 Run Complete
        </AppText>

        <AppText style={styles.item}>
          Distance
        </AppText>

        <AppText style={styles.value}>
          {distance} km
        </AppText>

        <AppText style={styles.item}>
          Time
        </AppText>

        <AppText style={styles.value}>
          {Math.floor(Number(seconds) / 60)}:
          {(Number(seconds) % 60)
            .toString()
            .padStart(2, "0")}
        </AppText>

        <AppText style={styles.item}>
          Pace
        </AppText>

        <AppText style={styles.value}>
          {pace}
        </AppText>

        <AppText style={styles.item}>
          Calories
        </AppText>

        <AppText style={styles.value}>
          {calories} kcal
        </AppText>

        <PrimaryButton
          title={saving ? "Saving..." : "Save Run"}
          disabled={saving}
          onPress={async () => {
            if (saving) return;

            setSaving(true);

            try {
              const result = await saveRun(
                Number(distance),
                Number(seconds),
                Number(calories)
              );

              const messages: string[] = [];

              if (result?.challenge_completed) {
                messages.push("🎉 Challenge completed! XP awarded.");
              }

              if (result?.new_badges?.length) {
                const names = result.new_badges
                  .map((code: string) => BADGE_TITLES[code] ?? code)
                  .join("\n");
                messages.push(`New badge${result.new_badges.length > 1 ? "s" : ""} unlocked:\n${names}`);
              }

              if (messages.length) {
                Alert.alert(
                  "Nice work!",
                  messages.join("\n\n"),
                  [
                    {
                      text: "Continue",
                      onPress: () => router.replace("/(tabs)/home"),
                    },
                  ]
                );
              } else {
                router.replace("/(tabs)/home");
              }
            } catch (error) {
              console.log(error);
              setSaving(false);
            }
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 34,
    fontWeight: "700",
    marginBottom: 40,
    textAlign: "center",
  },

  item: {
    opacity: 0.6,
    marginTop: 20,
  },

  value: {
    fontSize: 30,
    fontWeight: "700",
  },
});