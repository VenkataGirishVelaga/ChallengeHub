import { Alert, StyleSheet, View } from "react-native";

import AppText from "@/components/AppText";
import PrimaryButton from "@/components/PrimaryButton";

import { joinChallenge } from "@/services/challenges";

import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";

export default function ChallengeCard({
  challenge,
}: {
  challenge: any;
}) {
  async function handleJoin() {
    try {
      await joinChallenge(challenge.id);

      Alert.alert(
        "Success",
        "Challenge Joined!"
      );
    } catch {
      Alert.alert(
        "Error",
        "Could not join challenge"
      );
    }
  }

  return (
    <View style={styles.card}>
      <AppText variant="title">
        {challenge.title}
      </AppText>

      <AppText style={styles.description}>
        {challenge.description}
      </AppText>

      <AppText>
        🎯 {challenge.target} {challenge.unit}
      </AppText>

      <AppText>
        ⭐ {challenge.xp_reward} XP
      </AppText>

      <PrimaryButton
        title="Join"
        onPress={handleJoin}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.lg,
  },

  description: {
    marginVertical: SPACING.sm,
  },
});