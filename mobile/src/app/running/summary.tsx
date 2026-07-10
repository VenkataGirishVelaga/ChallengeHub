import { View, StyleSheet } from "react-native";
import{ useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { saveRun } from "@/services/running";
import Screen from "@/components/Screen";
import AppText from "@/components/AppText";
import PrimaryButton from "@/components/PrimaryButton";

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
              await saveRun(
                Number(distance),
                Number(seconds),
                Number(calories)
              );

              router.replace("/(tabs)/home");
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