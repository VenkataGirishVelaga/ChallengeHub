import { StyleSheet, View } from "react-native";

import Screen from "@/components/Screen";
import PrimaryButton from "@/components/PrimaryButton";
import AppText from "@/components/AppText";

import { router } from "expo-router";

import useRunTracker from "@/hooks/useRunTracker";

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

  return (
    <Screen>
      <View style={styles.container}>
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
                {(distance / 1000).toFixed(2)} km
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