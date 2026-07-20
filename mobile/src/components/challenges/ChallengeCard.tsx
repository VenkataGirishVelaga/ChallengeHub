import { useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/AppText";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import InviteFriendModal from "@/components/challenges/InviteFriendModal";

import {
  deleteChallenge,
  joinChallenge,
  leaveChallenge,
} from "@/services/challenges";
import { getActivityMeta } from "@/utils/activity";

import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/radius";
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
  const isCheckin = challenge.type === "CHECKIN";
  const accentColor = isCheckin ? COLORS.accent : COLORS.primary;
  const activity = getActivityMeta(challenge.type);

  const [inviteModalVisible, setInviteModalVisible] = useState(false);

  async function handleJoin() {
    try {
      await joinChallenge(challenge.id);

      Alert.alert(
        "Success",
        "Challenge Joined!"
      );

      onChanged?.();
    } catch {
      Alert.alert(
        "Error",
        "Could not join challenge"
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
    <View style={[styles.card, { borderColor: `${accentColor}33` }]}>
      <View style={styles.titleRow}>
        <View style={[styles.badge, { backgroundColor: `${accentColor}22` }]}>
          <AppText variant="label" color={accentColor}>
            {isCheckin
              ? "🔥 Daily Check-In"
              : `${activity.emoji} ${activity.noun}`}
          </AppText>
        </View>

        {isOwner && (
          <View style={styles.ownerActions}>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/challenges/edit/[id]",
                  params: {
                    id: String(challenge.id),
                    title: challenge.title,
                    description: challenge.description,
                    target: String(challenge.target),
                    difficulty: challenge.difficulty,
                    xp_reward: String(challenge.xp_reward),
                    is_public: String(challenge.is_public),
                    unit: challenge.unit,
                    isCheckin: String(isCheckin),
                  },
                })
              }
              hitSlop={10}
            >
              <Ionicons
                name="pencil-outline"
                size={20}
                color={COLORS.textSecondary}
              />
            </Pressable>

            <Pressable onPress={handleDelete} hitSlop={10}>
              <Ionicons
                name="trash-outline"
                size={20}
                color={COLORS.error}
              />
            </Pressable>
          </View>
        )}
      </View>

      <AppText variant="heading" style={styles.titleText}>
        {challenge.title}
      </AppText>

      <AppText color={COLORS.textSecondary} style={styles.description}>
        {challenge.description}
      </AppText>

      <View style={styles.metaRow}>
        <AppText variant="body" style={styles.metaItem}>
          🎯 {challenge.target} {isCheckin ? "days" : challenge.unit}
        </AppText>

        <AppText variant="body" color={COLORS.accent} style={styles.metaItem}>
          ⭐ {challenge.xp_reward} XP
        </AppText>
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          title="Join"
          onPress={handleJoin}
        />

        <SecondaryButton
          title="🔥 Challenge a Friend"
          style={styles.challengeFriendButton}
          onPress={() => setInviteModalVisible(true)}
        />

        <AppText
          variant="caption"
          style={styles.leaveLink}
          onPress={handleLeave}
        >
          Already joined? Leave
        </AppText>
      </View>

      <InviteFriendModal
        visible={inviteModalVisible}
        challengeId={challenge.id}
        challengeTitle={challenge.title}
        onClose={() => setInviteModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1.5,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },

  badge: {
    borderRadius: RADIUS.full,
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
  },

  ownerActions: {
    flexDirection: "row",
    gap: SPACING.md,
  },

  titleText: {
    marginBottom: SPACING.xs,
  },

  description: {
    marginBottom: SPACING.md,
  },

  metaRow: {
    flexDirection: "row",
    gap: SPACING.lg,
    marginBottom: SPACING.md,
  },

  metaItem: {
    fontWeight: "700",
  },

  actions: {
    marginTop: SPACING.sm,
  },

  challengeFriendButton: {
    marginTop: SPACING.sm,
  },

  leaveLink: {
    textAlign: "center",
    marginTop: SPACING.sm,
  },
});
