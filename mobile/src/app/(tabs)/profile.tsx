import { useState, useCallback } from "react";
import { StyleSheet, View, Pressable, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";

import ScrollScreen from "@/components/ScrollScreen";
import AppText from "@/components/AppText";
import { getUser, removeToken } from "@/services/authStorage";
import { getRunStats } from "@/services/runs";
import { getMyBadges } from "@/services/badges";

import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";
import { RADIUS } from "@/constants/radius";

function formatPace(secondsPerKm: number | null) {
  if (!secondsPerKm) return "--:--";

  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}/km`;
}

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        const currentUser = await getUser();
        setUser(currentUser);

        try {
          const statsData = await getRunStats();
          setStats(statsData);
        } catch (error) {
          console.log(error);
        }

        try {
          const badgeData = await getMyBadges();
          setBadges(badgeData);
        } catch (error) {
          console.log(error);
        }
      }

      loadData();
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await removeToken();
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  const earnedBadges = badges.filter((badge) => badge.earned);

  return (
    <ScrollScreen>
      <View style={styles.container}>
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <AppText style={styles.avatarText}>
              {(user?.name ?? "P").charAt(0).toUpperCase()}
            </AppText>
          </View>

          <AppText variant="title">{user?.name ?? "Player"}</AppText>
          <AppText variant="caption">{user?.email ?? ""}</AppText>

          <View style={styles.levelRow}>
            <View style={styles.levelPill}>
              <AppText style={styles.levelText}>
                Level {user?.level ?? 1}
              </AppText>
            </View>
            <AppText style={styles.xpText}>
              {user?.xp ?? 0} XP
            </AppText>
          </View>
        </View>

        <AppText variant="body" style={styles.sectionTitle}>
          Your Stats
        </AppText>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <AppText style={styles.statValue}>
              {stats?.total_runs ?? 0}
            </AppText>
            <AppText variant="caption">Total Runs</AppText>
          </View>

          <View style={styles.statCard}>
            <AppText style={styles.statValue}>
              {stats ? stats.total_distance.toFixed(1) : "0.0"}
            </AppText>
            <AppText variant="caption">km Run</AppText>
          </View>

          <View style={styles.statCard}>
            <AppText style={styles.statValue}>
              {formatPace(stats?.avg_pace_seconds_per_km ?? null)}
            </AppText>
            <AppText variant="caption">Avg Pace</AppText>
          </View>

          <View style={styles.statCard}>
            <AppText style={styles.statValue}>
              {stats?.total_calories ?? 0}
            </AppText>
            <AppText variant="caption">Calories</AppText>
          </View>
        </View>

        <AppText variant="body" style={styles.sectionTitle}>
          Badges ({earnedBadges.length}/{badges.length})
        </AppText>

        <View style={styles.badgesGrid}>
          {badges.map((badge) => (
            <View
              key={badge.code}
              style={[
                styles.badgeCard,
                !badge.earned && styles.badgeCardLocked,
              ]}
            >
              <AppText style={styles.badgeIcon}>
                {badge.icon}
              </AppText>
              <AppText style={styles.badgeTitle} numberOfLines={1}>
                {badge.title}
              </AppText>
              <AppText variant="caption" numberOfLines={2}>
                {badge.description}
              </AppText>
            </View>
          ))}
        </View>

        <Pressable
          style={styles.historyButton}
          onPress={() => router.push("/friends")}
        >
          <AppText style={styles.historyText}>
            Friends
          </AppText>
        </Pressable>

        <Pressable
          style={styles.historyButton}
          onPress={() => router.push("/running/history")}
        >
          <AppText style={styles.historyText}>
            View Run History
          </AppText>
        </Pressable>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <AppText style={styles.logoutText}>Logout</AppText>
        </Pressable>
      </View>
    </ScrollScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
  },

  headerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: "center",
    marginBottom: SPACING.lg,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },

  avatarText: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "800",
  },

  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },

  levelPill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.lg,
  },

  levelText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 12,
  },

  xpText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
  },

  sectionTitle: {
    marginBottom: SPACING.md,
    fontWeight: "700",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },

  statCard: {
    width: "47%",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: "center",
  },

  statValue: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
  },

  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },

  badgeCard: {
    width: "47%",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: "center",
  },

  badgeCardLocked: {
    opacity: 0.35,
  },

  badgeIcon: {
    fontSize: 28,
    marginBottom: 4,
  },

  badgeTitle: {
    fontWeight: "700",
    marginBottom: 2,
    textAlign: "center",
  },

  historyButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: 16,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    marginBottom: SPACING.md,
  },

  historyText: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 16,
  },

  logoutButton: {
    backgroundColor: COLORS.error,
    paddingVertical: 16,
    borderRadius: RADIUS.lg,
    alignItems: "center",
  },

  logoutText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
  },
});
