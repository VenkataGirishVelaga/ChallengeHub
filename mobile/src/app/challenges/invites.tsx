import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ScrollScreen from "@/components/ScrollScreen";
import AppText from "@/components/AppText";

import {
  acceptChallengeInvite,
  declineChallengeInvite,
  getReceivedChallengeInvites,
} from "@/services/challenges";

import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/radius";
import { SPACING } from "@/constants/spacing";

export default function ChallengeInvitesScreen() {
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getReceivedChallengeInvites();
      setInvites(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function handleAccept(inviteId: number) {
    setRespondingTo(inviteId);
    try {
      await acceptChallengeInvite(inviteId);
      await load();
    } catch (error) {
      console.log(error);
    } finally {
      setRespondingTo(null);
    }
  }

  async function handleDecline(inviteId: number) {
    setRespondingTo(inviteId);
    try {
      await declineChallengeInvite(inviteId);
      await load();
    } catch (error) {
      console.log(error);
    } finally {
      setRespondingTo(null);
    }
  }

  return (
    <ScrollScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </Pressable>
          <AppText variant="title">Challenge Invites</AppText>
          <View style={{ width: 24 }} />
        </View>

        {loading && (
          <ActivityIndicator color={COLORS.primary} style={styles.loader} />
        )}

        {!loading && invites.length === 0 && (
          <AppText variant="caption" style={styles.emptyText}>
            No one&apos;s challenged you yet. Nudge a friend from a challenge&apos;s
            &quot;Challenge a Friend&quot; button.
          </AppText>
        )}

        {!loading &&
          invites.map((invite) => {
            const isResponding = respondingTo === invite.id;

            return (
              <View key={invite.id} style={styles.card}>
                <View style={styles.avatar}>
                  <AppText style={styles.avatarText}>
                    {invite.sender_name.charAt(0).toUpperCase()}
                  </AppText>
                </View>

                <View style={styles.cardInfo}>
                  <AppText style={styles.cardTitle}>
                    <AppText style={styles.senderName}>
                      {invite.sender_name}
                    </AppText>{" "}
                    challenged you to
                  </AppText>
                  <AppText variant="heading" numberOfLines={2}>
                    {invite.challenge_title}
                  </AppText>
                </View>

                <View style={styles.actions}>
                  <Pressable
                    style={[styles.smallButton, styles.acceptButton]}
                    disabled={isResponding}
                    onPress={() => handleAccept(invite.id)}
                  >
                    {isResponding ? (
                      <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                      <Ionicons name="checkmark" size={18} color={COLORS.white} />
                    )}
                  </Pressable>
                  <Pressable
                    style={[styles.smallButton, styles.declineButton]}
                    disabled={isResponding}
                    onPress={() => handleDecline(invite.id)}
                  >
                    <Ionicons name="close" size={18} color={COLORS.white} />
                  </Pressable>
                </View>
              </View>
            );
          })}
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

  loader: {
    marginTop: SPACING.xl,
  },

  emptyText: {
    textAlign: "center",
    marginTop: SPACING.xl,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },

  avatarText: {
    color: COLORS.background,
    fontWeight: "800",
    fontSize: 16,
  },

  cardInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },

  cardTitle: {
    marginBottom: 2,
    color: COLORS.textSecondary,
  },

  senderName: {
    fontWeight: "700",
    color: COLORS.text,
  },

  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
  },

  smallButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },

  acceptButton: {
    backgroundColor: COLORS.success,
  },

  declineButton: {
    backgroundColor: COLORS.error,
  },
});
