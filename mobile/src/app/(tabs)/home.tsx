import { StyleSheet, View } from "react-native";
import { router } from "expo-router";

import ScrollScreen from "@/components/ScrollScreen";
import AppText from "@/components/AppText";

import GreetingCard from "@/components/dashboard/GreetingCard";
import StatsCard from "@/components/dashboard/StatsCard";
import ChallengeCard from "@/components/dashboard/ChallengeCard";
import ProgressCard from "@/components/dashboard/ProgressCard";
import QuickActionCard from "@/components/dashboard/QuickActionCard";

import { DASHBOARD_DATA } from "@/data/dashboard";
import { SPACING } from "@/constants/spacing";

export default function HomeScreen() {
  return (
    <ScrollScreen>
      <View style={styles.container}>
        {/* Greeting */}
        <GreetingCard name={DASHBOARD_DATA.name} />

        {/* Current Streak */}
        <StatsCard streak={DASHBOARD_DATA.streak} />

        {/* Today's Challenge */}
        <ChallengeCard
          challenge={DASHBOARD_DATA.todayChallenge}
          onComplete={() =>
            console.log("Challenge Completed")
          }
        />

        {/* Weekly Progress */}
        <ProgressCard progress={DASHBOARD_DATA.progress} />

        {/* Quick Actions */}
        <AppText variant="body" style={styles.quickTitle}>
          Quick Actions
        </AppText>

        <View style={styles.actionsRow}>
          <QuickActionCard
            icon="add-circle"
            title="Create"
            onPress={() => {}}
          />

          <QuickActionCard
            icon="trophy"
            title="Leaderboard"
            onPress={() =>
              router.push("/(tabs)/leaderboard")
            }
          />
        </View>

        <View style={styles.actionsRow}>
          <QuickActionCard
            icon="person"
            title="Profile"
            onPress={() =>
              router.push("/(tabs)/profile")
            }
          />

          <QuickActionCard
            icon="list"
            title="Challenges"
            onPress={() =>
              router.push("/(tabs)/challenges")
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