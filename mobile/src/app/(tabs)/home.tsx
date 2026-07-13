import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";

import ScrollScreen from "@/components/ScrollScreen";
import AppText from "@/components/AppText";

import GreetingCard from "@/components/dashboard/GreetingCard";
import StatsCard from "@/components/dashboard/StatsCard";
import ChallengeCard from "@/components/dashboard/ChallengeCard";
import ProgressCard from "@/components/dashboard/ProgressCard";
import QuickActionCard from "@/components/dashboard/QuickActionCard";

import { getUser } from "@/services/authStorage";
import { getActiveChallenge, getActiveProgress } from "@/services/challenges";
import { SPACING } from "@/constants/spacing";

export default function HomeScreen() {
  const [challenge, setChallenge] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    async function loadData() {
      const currentUser = await getUser();
      setUser(currentUser);

      try {
        const data = await getActiveChallenge();
        setChallenge(data);
      } catch (error) {
        console.log(error);
      }

      try {
        const progressData = await getActiveProgress();
        setProgress(progressData?.percent ?? 0);
      } catch (error) {
        console.log(error);
      }
    }

    loadData();
  }, []);

  return (
    <ScrollScreen>
      <View style={styles.container}>
        <GreetingCard
          name={user?.name ?? "Player"}
        />

        <StatsCard
          streak={user?.streak ?? 0}
        />

        <ChallengeCard
            challenge={
              challenge
                ? `${challenge.title}
          🎯 ${challenge.target} ${challenge.unit}`
                : "No Active Challenge"
            }
            buttonLabel={challenge ? "Go Run" : "Browse Challenges"}
            onAction={() =>
              challenge
                ? router.push("/running/start")
                : router.push("/challenges")
            }
        />

        <ProgressCard progress={progress} />

        <AppText variant="body" style={styles.quickTitle}>
          Quick Actions
        </AppText>

        <View style={styles.actionsRow}>
          <QuickActionCard
            icon="add-circle"
            title="Create"
            onPress={() =>
              router.push("/running/start")
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