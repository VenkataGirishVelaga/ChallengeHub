import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ScrollScreen from "@/components/ScrollScreen";
import AppText from "@/components/AppText";

import {
  getFriendsLeaderboard,
  getGlobalLeaderboard,
} from "@/services/leaderboard";

import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";
import { RADIUS } from "@/constants/radius";

type Tab = "global" | "friends";

export default function LeaderboardScreen() {
  const [tab, setTab] = useState<Tab>("global");
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (activeTab: Tab) => {
    setLoading(true);

    try {
      const data =
        activeTab === "global"
          ? await getGlobalLeaderboard()
          : await getFriendsLeaderboard();

      setEntries(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load(tab);
    }, [tab, load])
  );

  return (
    <ScrollScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <AppText variant="title">Leaderboard</AppText>

          <Pressable onPress={() => router.push("/friends")}>
            <Ionicons
              name="people-outline"
              size={24}
              color={COLORS.text}
            />
          </Pressable>
        </View>

        <View style={styles.tabRow}>
          {(
            [
              { key: "global", label: "Global" },
              { key: "friends", label: "Friends" },
            ] as { key: Tab; label: string }[]
          ).map((t) => (
            <Pressable
              key={t.key}
              style={[styles.tab, tab === t.key && styles.tabActive]}
              onPress={() => setTab(t.key)}
            >
              <AppText
                style={[
                  styles.tabText,
                  tab === t.key && styles.tabTextActive,
                ]}
              >
                {t.label}
              </AppText>
            </Pressable>
          ))}
        </View>

        {loading && (
          <ActivityIndicator color={COLORS.primary} style={styles.loader} />
        )}

        {!loading && entries.length === 0 && (
          <AppText variant="caption" style={styles.emptyText}>
            {tab === "friends"
              ? "Add some friends to see how you stack up!"
              : "No runners on the leaderboard yet."}
          </AppText>
        )}

        {!loading &&
          entries.map((entry) => (
            <View
              key={entry.id}
              style={[styles.row, entry.is_you && styles.rowYou]}
            >
              <AppText style={styles.rank}>#{entry.rank}</AppText>

              <View style={styles.avatar}>
                <AppText style={styles.avatarText}>
                  {entry.name.charAt(0).toUpperCase()}
                </AppText>
              </View>

              <View style={styles.rowInfo}>
                <AppText style={styles.rowName}>
                  {entry.name}
                  {entry.is_you ? " (You)" : ""}
                </AppText>
                <AppText variant="caption">Level {entry.level}</AppText>
              </View>

              <AppText style={styles.xp}>{entry.xp} XP</AppText>
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.lg,
  },

  tabRow: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 4,
    marginBottom: SPACING.lg,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },

  tabActive: {
    backgroundColor: COLORS.primary,
  },

  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  tabTextActive: {
    color: COLORS.white,
  },

  loader: {
    marginTop: SPACING.xl,
  },

  emptyText: {
    textAlign: "center",
    marginTop: SPACING.xl,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },

  rowYou: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  rank: {
    width: 32,
    fontWeight: "800",
    fontSize: 14,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },

  avatarText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 15,
  },

  rowInfo: {
    flex: 1,
  },

  rowName: {
    fontWeight: "700",
    marginBottom: 2,
  },

  xp: {
    fontWeight: "800",
    color: COLORS.primary,
  },
});
