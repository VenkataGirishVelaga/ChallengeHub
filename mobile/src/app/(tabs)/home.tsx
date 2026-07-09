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
import { DASHBOARD_DATA } from "@/data/dashboard";
import { getChallenges } from "@/services/challenges";
import { SPACING } from "@/constants/spacing";

export default function HomeScreen() {
  const [challenge, setChallenge] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const currentUser = await getUser();
      setUser(currentUser);

      try {
        const data = await getChallenges();

        if (data.length > 0) {
          setChallenge(data[0]);
        }
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
              ? `${challenge.title} (${challenge.target} ${challenge.unit})`
              : "No Challenge Available"
          }
          onComplete={() => console.log("Complete")}
        />

        <ProgressCard progress={DASHBOARD_DATA.progress} />

        <AppText variant="body" style={styles.quickTitle}>
          Quick Actions
        </AppText>

        <View style={styles.actionsRow}>
          <QuickActionCard
            icon="add-circle"
            title="Create"
            onPress={() =>
              router.push("/create-challenge" as never)
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
            onPress={() => router.push("/(tabs)/challenges")}
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