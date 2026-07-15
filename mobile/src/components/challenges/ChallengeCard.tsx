import { Alert, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/AppText";
import PrimaryButton from "@/components/PrimaryButton";

import {
  deleteChallenge,
  joinChallenge,
  leaveChallenge,
} from "@/services/challenges";

import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";

export default function ChallengeCard({
  challenge,
  isOwner = false,
  onChanged,
}: {
  challenge: any;
  isOwner?: boolean;
  onChanged?: () => void;
}) {
  async function handleJoin() {
    try {
      await joinChallenge(challenge.id);

      Alert.alert(
        "Success",
        "Challenge Joined!"
      );

      onChanged?.();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.detail ?? "Could not join challenge"
      );
    }
  }

  function handleLeave() {
    Alert.alert(
      "Leave challenge?",
      `You'll lose your progress on "${challenge.title}".`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: async () => {
            try {
              await leaveChallenge(challenge.id);
              onChanged?.();
            } catch {
              Alert.alert("Error", "Could not leave challenge");
            }
          },
        },
      ]
    );
  }

  function handleDelete() {
    Alert.alert(
      "Delete challenge?",
      `This removes "${challenge.title}" for everyone who joined it. This can't be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteChallenge(challenge.id);
              onChanged?.();
            } catch {
              Alert.alert("Error", "Could not delete challenge");
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <AppText variant="title" style={styles.titleText}>
          {challenge.title}
        </AppText>

        {isOwner && (
          <Pressable onPress={handleDelete} hitSlop={10}>
            <Ionicons
              name="trash-outline"
              size={20}
              color={COLORS.error}
            />
          </Pressable>
        )}
      </View>

      <AppText style={styles.description}>
        {challenge.description}
      </AppText>

      <AppText>
        🎯 {challenge.target} {challenge.unit}
      </AppText>

      <AppText>
        ⭐ {challenge.xp_reward} XP
      </AppText>

      <View style={styles.actions}>
        <PrimaryButton
          title="Join"
          onPress={handleJoin}
        />

        <AppText
          style={styles.leaveLink}
          onPress={handleLeave}
        >
          Already joined? Leave
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.lg,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  titleText: {
    flex: 1,
  },

  description: {
    marginVertical: SPACING.sm,
  },

  actions: {
    marginTop: SPACING.md,
  },

  leaveLink: {
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.sm,
    fontSize: 13,
  },
});