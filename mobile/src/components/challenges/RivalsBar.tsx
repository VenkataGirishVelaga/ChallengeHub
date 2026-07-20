import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import AppText from "@/components/AppText";

import { getChallengeRivals } from "@/services/challenges";

import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/radius";
import { SPACING } from "@/constants/spacing";

/**
 * Head-to-head progress for a challenge: you plus anyone you've
 * challenged (or been challenged by) via an accepted invite. Only
 * renders once there's actually someone to compare against — a solo
 * challenge with no rivals shows nothing here.
 */
export default function RivalsBar({ challengeId }: { challengeId: number }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;

    getChallengeRivals(challengeId)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {
        // Silent — this is a nice-to-have strip, not core content.
      });

    return () => {
      cancelled = true;
    };
  }, [challengeId]);

  if (!data || data.entries.length < 2) {
    return null;
  }

  const leaderProgress = Math.max(
    ...data.entries.map((entry: any) => entry.progress),
    1
  );

  return (
    <View style={styles.container}>
      <AppText variant="label" style={styles.heading}>
        🥊 HEAD-TO-HEAD
      </AppText>

      {data.entries.map((entry: any, index: number) => {
        const fillPercent = Math.min(
          100,
          Math.round((entry.progress / leaderProgress) * 100)
        );

        return (
          <View key={entry.user_id} style={styles.row}>
            <View style={styles.nameRow}>
              <AppText
                style={[styles.name, entry.is_you && styles.nameYou]}
                numberOfLines={1}
              >
                {index === 0 ? "👑 " : ""}
                {entry.is_you ? "You" : entry.name}
              </AppText>
              <AppText variant="caption" style={styles.progressLabel}>
                {entry.progress % 1 === 0
                  ? entry.progress
                  : entry.progress.toFixed(1)}{" "}
                {data.unit}
              </AppText>
            </View>

            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${fillPercent}%`,
                    backgroundColor: entry.is_you
                      ? COLORS.primary
                      : COLORS.textMuted,
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  heading: {
    marginBottom: SPACING.sm,
    color: COLORS.textSecondary,
  },

  row: {
    marginBottom: SPACING.sm,
  },

  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  name: {
    fontWeight: "600",
    flexShrink: 1,
    marginRight: SPACING.sm,
  },

  nameYou: {
    fontWeight: "800",
    color: COLORS.primary,
  },

  progressLabel: {
    flexShrink: 0,
  },

  track: {
    height: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceAlt,
    overflow: "hidden",
  },

  fill: {
    height: "100%",
    borderRadius: RADIUS.full,
  },
});
