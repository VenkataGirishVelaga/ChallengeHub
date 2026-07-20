import { useCallback, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { router, useFocusEffect } from "expo-router";

import ScrollScreen from "@/components/ScrollScreen";
import AppText from "@/components/AppText";

import GreetingCard from "@/components/dashboard/GreetingCard";
import StatsCard from "@/components/dashboard/StatsCard";
import ActiveChallengeCard from "@/components/dashboard/ActiveChallengeCard";
import QuickActionCard from "@/components/dashboard/QuickActionCard";

import { getUser } from "@/services/authStorage";
import {
  getAllActiveChallenges,
  getUnseenAcceptedInvites,
  markInviteSeen,
} from "@/services/challenges";
import { SPACING } from "@/constants/spacing";
import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/radius";

export default function HomeScreen() {
  const [user, setUser] = useState<any>(null);
  const [activeChallenges, setActiveChallenges] = useState<any[]>([]);

  const loadData = useCallback(async () => {
    const currentUser = await getUser();
    setUser(currentUser);

    try {
      const data = await getAllActiveChallenges();
      setActiveChallenges(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const checkAcceptedInvites = useCallback(async () => {
    try {
      const invites = await getUnseenAcceptedInvites();

      // Shown one at a time (rather than batched into one Alert) so
      // each still reads naturally if there happen to be several.
      for (const invite of invites) {
        Alert.alert(
          "🎉 Challenge accepted!",
          `${invite.receiver_name} accepted your challenge to "${invite.challenge_title}". Good luck!`
        );

        await markInviteSeen(invite.id);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
      checkAcceptedInvites();
    }, [loadData, checkAcceptedInvites])
  );

  return (
    <ScrollScreen>
      <View style={styles.container}>
        <GreetingCard
          name={user?.name ?? "Player"}
        />

        <StatsCard
          streak={user?.streak ?? 0}
        />

        <AppText variant="heading" style={styles.sectionTitle}>
          Today's Challenges
        </AppText>

        {activeChallenges.length === 0 ? (
          <View style={styles.emptyCard}>
            <AppText variant="caption" style={styles.emptyText}>
              You haven't joined any challenges yet.
            </AppText>

            <QuickActionCard
              icon="add-circle"
              title="Browse Challenges"
              onPress={() => router.push("/challenges")}
            />
          </View>
        ) : (
          activeChallenges.map((entry) => (
            <ActiveChallengeCard
              key={`${entry.challenge_type}-${entry.challenge_id}`}
              entry={entry}
              onChanged={loadData}
            />
          ))
        )}

        <AppText variant="heading" style={styles.quickTitle}>
          Quick Actions
        </AppText>

        <View style={styles.actionsRow}>
          <QuickActionCard
            icon="add-circle"
            title="Create"
            onPress={() =>
              router.push("/challenges/create")
            }
          />

          <QuickActionCard
            icon="trophy"
            title="Leaderboard"
            onPress={() => router.push("/(tabs)/leaderboard")}
          />
        </View>

        <View style={styles.actionsRow}>
          <QuickActionCard
            icon="person"
            title="Profile"
            onPress={() => router.push("/(tabs)/profile")}
          />

          <QuickActionCard
            icon="list"
            title="Challenges"
            onPress={() =>
              router.push("/challenges")
            }
          />
        </View>
      </View>
    </ScrollScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
  },

  sectionTitle: {
    marginBottom: SPACING.md,
    fontWeight: "700",
  },

  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },

  emptyText: {
    marginBottom: SPACING.md,
    textAlign: "center",
  },

  quickTitle: {
    marginBottom: SPACING.md,
    fontWeight: "700",
  },

  actionsRow: {
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
});
