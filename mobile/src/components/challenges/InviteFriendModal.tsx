import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/AppText";

import { getFriends } from "@/services/friends";
import { inviteFriendToChallenge } from "@/services/challenges";

import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/radius";
import { SPACING } from "@/constants/spacing";

export default function InviteFriendModal({
  visible,
  challengeId,
  challengeTitle,
  onClose,
}: {
  visible: boolean;
  challengeId: number;
  challengeTitle: string;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          {/* Mounting only while visible means each open is a fresh
              instance — initial state values do the "reset" for us,
              instead of an effect setState-ing on every open. */}
          {visible && (
            <InviteFriendModalContent
              challengeId={challengeId}
              challengeTitle={challengeTitle}
              onClose={onClose}
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function InviteFriendModalContent({
  challengeId,
  challengeTitle,
  onClose,
}: {
  challengeId: number;
  challengeTitle: string;
  onClose: () => void;
}) {
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingTo, setSendingTo] = useState<number | null>(null);
  const [sentTo, setSentTo] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getFriends()
      .then((data) => {
        if (!cancelled) setFriends(data);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load your friends.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleInvite(friendId: number) {
    setSendingTo(friendId);
    setError(null);

    try {
      await inviteFriendToChallenge(challengeId, friendId);
      setSentTo((prev) => [...prev, friendId]);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail || "Couldn't send that challenge."
      );
    } finally {
      setSendingTo(null);
    }
  }

  return (
    <>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <AppText variant="heading">Challenge a friend</AppText>
          <AppText variant="caption" numberOfLines={1}>
            {challengeTitle}
          </AppText>
        </View>

        <Pressable onPress={onClose} hitSlop={12}>
          <Ionicons name="close" size={24} color={COLORS.textSecondary} />
        </Pressable>
      </View>

      {error && (
        <AppText color={COLORS.error} style={styles.errorText}>
          {error}
        </AppText>
      )}

      {loading && (
        <ActivityIndicator color={COLORS.primary} style={styles.loader} />
      )}

      {!loading && friends.length === 0 && (
        <AppText variant="caption" style={styles.emptyText}>
          Add some friends first, then challenge them to join in.
        </AppText>
      )}

      <View style={styles.list}>
        {!loading &&
          friends.map((friend) => {
            const isSent = sentTo.includes(friend.id);
            const isSending = sendingTo === friend.id;

            return (
              <View key={friend.id} style={styles.row}>
                <View style={styles.avatar}>
                  <AppText style={styles.avatarText}>
                    {friend.name.charAt(0).toUpperCase()}
                  </AppText>
                </View>

                <View style={styles.rowInfo}>
                  <AppText style={styles.rowName}>{friend.name}</AppText>
                  <AppText variant="caption">
                    Level {friend.level} · {friend.xp} XP
                  </AppText>
                </View>

                <Pressable
                  style={[
                    styles.inviteButton,
                    isSent && styles.inviteButtonSent,
                  ]}
                  disabled={isSent || isSending}
                  onPress={() => handleInvite(friend.id)}
                >
                  {isSending ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <AppText style={styles.inviteButtonText}>
                      {isSent ? "Sent 🔥" : "Challenge"}
                    </AppText>
                  )}
                </Pressable>
              </View>
            );
          })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    maxHeight: "75%",
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },

  errorText: {
    marginBottom: SPACING.sm,
  },

  loader: {
    marginVertical: SPACING.xl,
  },

  emptyText: {
    textAlign: "center",
    marginVertical: SPACING.xl,
  },

  list: {
    gap: SPACING.sm,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
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

  inviteButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    minWidth: 84,
    alignItems: "center",
    justifyContent: "center",
  },

  inviteButtonSent: {
    backgroundColor: COLORS.border,
  },

  inviteButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 13,
  },
});
