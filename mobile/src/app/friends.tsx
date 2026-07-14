import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ScrollScreen from "@/components/ScrollScreen";
import AppText from "@/components/AppText";

import {
  acceptFriendRequest,
  getFriends,
  getPendingRequests,
  rejectFriendRequest,
  removeFriend,
  searchUsers,
  sendFriendRequest,
} from "@/services/friends";

import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";
import { RADIUS } from "@/constants/radius";

type Tab = "friends" | "requests" | "search";

export default function FriendsScreen() {
  const [tab, setTab] = useState<Tab>("friends");

  const [friends, setFriends] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [sentTo, setSentTo] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [friendsData, pendingData] = await Promise.all([
        getFriends(),
        getPendingRequests(),
      ]);
      setFriends(friendsData);
      setPending(pendingData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAll();
    }, [loadAll])
  );

  const handleSearch = async (text: string) => {
    setQuery(text);

    if (text.trim().length === 0) {
      setResults([]);
      return;
    }

    setSearching(true);
    try {
      const data = await searchUsers(text.trim());
      setResults(data);
    } catch (error) {
      console.log(error);
    } finally {
      setSearching(false);
    }
  };

  const handleSendRequest = async (userId: number) => {
    try {
      await sendFriendRequest(userId);
      setSentTo((prev) => [...prev, userId]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccept = async (friendshipId: number) => {
    try {
      await acceptFriendRequest(friendshipId);
      await loadAll();
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async (friendshipId: number) => {
    try {
      await rejectFriendRequest(friendshipId);
      await loadAll();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (friendId: number) => {
    try {
      await removeFriend(friendId);
      await loadAll();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </Pressable>
          <AppText variant="title">Friends</AppText>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.tabRow}>
          {(
            [
              { key: "friends", label: "Friends" },
              {
                key: "requests",
                label: `Requests${pending.length ? ` (${pending.length})` : ""}`,
              },
              { key: "search", label: "Find People" },
            ] as { key: Tab; label: string }[]
          ).map((t) => (
            <Pressable
              key={t.key}
              style={[styles.tab, tab === t.key && styles.tabActive]}
              onPress={() => setTab(t.key)}
            >
              <AppText
                style={[
                  styles.tabText,
                  tab === t.key && styles.tabTextActive,
                ]}
              >
                {t.label}
              </AppText>
            </Pressable>
          ))}
        </View>

        {tab === "search" && (
          <View style={styles.searchBox}>
            <Ionicons
              name="search"
              size={18}
              color={COLORS.textSecondary}
            />
            <TextInput
              value={query}
              onChangeText={handleSearch}
              placeholder="Search by name or email"
              placeholderTextColor={COLORS.textSecondary}
              style={styles.searchInput}
              autoCapitalize="none"
            />
          </View>
        )}

        {tab === "friends" && loading && (
          <ActivityIndicator color={COLORS.primary} style={styles.loader} />
        )}

        {tab === "friends" && !loading && friends.length === 0 && (
          <AppText variant="caption" style={styles.emptyText}>
            No friends yet. Head to &quot;Find People&quot; to send your first
            request.
          </AppText>
        )}

        {tab === "friends" &&
          !loading &&
          friends.map((friend) => (
            <View key={friend.friendship_id} style={styles.row}>
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
                style={styles.iconButton}
                onPress={() => handleRemove(friend.id)}
              >
                <Ionicons
                  name="person-remove-outline"
                  size={20}
                  color={COLORS.error}
                />
              </Pressable>
            </View>
          ))}

        {tab === "requests" && !loading && pending.length === 0 && (
          <AppText variant="caption" style={styles.emptyText}>
            No pending friend requests.
          </AppText>
        )}

        {tab === "requests" &&
          pending.map((req) => (
            <View key={req.friendship_id} style={styles.row}>
              <View style={styles.avatar}>
                <AppText style={styles.avatarText}>
                  {req.name.charAt(0).toUpperCase()}
                </AppText>
              </View>

              <View style={styles.rowInfo}>
                <AppText style={styles.rowName}>{req.name}</AppText>
                <AppText variant="caption">Level {req.level}</AppText>
              </View>

              <View style={styles.requestActions}>
                <Pressable
                  style={[styles.smallButton, styles.acceptButton]}
                  onPress={() => handleAccept(req.friendship_id)}
                >
                  <Ionicons name="checkmark" size={18} color={COLORS.white} />
                </Pressable>
                <Pressable
                  style={[styles.smallButton, styles.rejectButton]}
                  onPress={() => handleReject(req.friendship_id)}
                >
                  <Ionicons name="close" size={18} color={COLORS.white} />
                </Pressable>
              </View>
            </View>
          ))}

        {tab === "search" && searching && (
          <ActivityIndicator color={COLORS.primary} style={styles.loader} />
        )}

        {tab === "search" &&
          !searching &&
          results.map((user) => (
            <View key={user.id} style={styles.row}>
              <View style={styles.avatar}>
                <AppText style={styles.avatarText}>
                  {user.name.charAt(0).toUpperCase()}
                </AppText>
              </View>

              <View style={styles.rowInfo}>
                <AppText style={styles.rowName}>{user.name}</AppText>
                <AppText variant="caption">
                  Level {user.level} · {user.xp} XP
                </AppText>
              </View>

              <Pressable
                style={[
                  styles.smallButton,
                  styles.requestButton,
                  sentTo.includes(user.id) && styles.requestButtonSent,
                ]}
                disabled={sentTo.includes(user.id)}
                onPress={() => handleSendRequest(user.id)}
              >
                <AppText style={styles.requestButtonText}>
                  {sentTo.includes(user.id) ? "Sent" : "Add"}
                </AppText>
              </Pressable>
            </View>
          ))}
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

  tabRow: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 4,
    marginBottom: SPACING.lg,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },

  tabActive: {
    backgroundColor: COLORS.primary,
  },

  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  tabTextActive: {
    color: COLORS.white,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchInput: {
    flex: 1,
    color: COLORS.text,
    paddingVertical: 14,
    paddingLeft: SPACING.sm,
    fontSize: 15,
  },

  loader: {
    marginTop: SPACING.xl,
  },

  emptyText: {
    textAlign: "center",
    marginTop: SPACING.xl,
  },

  row: {
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
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },

  avatarText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 16,
  },

  rowInfo: {
    flex: 1,
  },

  rowName: {
    fontWeight: "700",
    marginBottom: 2,
  },

  iconButton: {
    padding: SPACING.sm,
  },

  requestActions: {
    flexDirection: "row",
    gap: SPACING.sm,
  },

  smallButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },

  acceptButton: {
    backgroundColor: COLORS.success,
  },

  rejectButton: {
    backgroundColor: COLORS.error,
  },

  requestButton: {
    backgroundColor: COLORS.primary,
  },

  requestButtonSent: {
    backgroundColor: COLORS.border,
  },

  requestButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 13,
  },
});
