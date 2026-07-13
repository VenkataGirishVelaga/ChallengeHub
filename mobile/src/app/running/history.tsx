import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useFocusEffect } from "expo-router";

import ScrollScreen from "@/components/ScrollScreen";
import AppText from "@/components/AppText";
import { getRunHistory } from "@/services/runs";

import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";
import { RADIUS } from "@/constants/radius";

function formatDate(iso: string) {
  const date = new Date(iso);

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function RunHistoryScreen() {
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function loadRuns() {
        setLoading(true);

        try {
          const data = await getRunHistory();
          setRuns(data);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }

      loadRuns();
    }, [])
  );

  return (
    <ScrollScreen>
      <View style={styles.container}>
        <AppText variant="title" style={styles.title}>
          Run History
        </AppText>

        {!loading && runs.length === 0 && (
          <AppText variant="caption">
            No runs saved yet. Go log your first one!
          </AppText>
        )}

        {runs.map((run) => (
          <View key={run.id} style={styles.card}>
            <View style={styles.row}>
              <AppText style={styles.distance}>
                {run.distance.toFixed(2)} km
              </AppText>
              <AppText variant="caption">
                {formatDate(run.created_at)}
              </AppText>
            </View>

            <View style={styles.row}>
              <AppText variant="caption">
                ⏱ {Math.floor(run.duration / 60)}:
                {(run.duration % 60).toString().padStart(2, "0")}
              </AppText>
              <AppText variant="caption">
                🔥 {run.calories} kcal
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </ScrollScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
  },

  title: {
    marginBottom: SPACING.lg,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  distance: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
  },
});
