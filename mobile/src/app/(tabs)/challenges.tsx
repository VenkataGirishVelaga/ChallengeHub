import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Screen from "@/components/Screen";
import AppText from "@/components/AppText";
import ChallengeCard from "../../components/challenges/ChallengeCard";

import {
  getChallenges,
  getReceivedChallengeInvites,
} from "@/services/challenges";
import { getUser } from "@/services/authStorage";
import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";

export default function ChallengesScreen() {
  const [challenges, setChallenges] = useState([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [pendingInvites, setPendingInvites] = useState(0);

  const load = useCallback(async () => {
    const user = await getUser();
    setCurrentUserId(user?.id ?? null);

    const [data, invites] = await Promise.all([
      getChallenges(),
      getReceivedChallengeInvites().catch(() => []),
    ]);

    setChallenges(data);
    setPendingInvites(invites.length);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="title">Challenges</AppText>

        <View style={styles.headerActions}>
          <Pressable
            style={styles.inviteBellButton}
            onPress={() => router.push("/challenges/invites")}
            hitSlop={8}
          >
            <Ionicons name="notifications-outline" size={20} color={COLORS.text} />
            {pendingInvites > 0 && (
              <View style={styles.badge}>
                <AppText style={styles.badgeText}>
                  {pendingInvites > 9 ? "9+" : pendingInvites}
                </AppText>
              </View>
            )}
          </Pressable>

          <Pressable
            style={styles.createButton}
            onPress={() => router.push("/challenges/create")}
          >
            <Ionicons name="add" size={20} color={COLORS.white} />
            <AppText variant="label" style={styles.createButtonText}>
              Create
            </AppText>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={challenges}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ChallengeCard
            challenge={item}
            isOwner={currentUserId === (item as any).created_by}
            onChanged={load}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },

  inviteBellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: COLORS.error,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.background,
  },

  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "800",
  },

  createButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderRadius: 999,

    shadowColor: COLORS.primary,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  createButtonText: {
    color: COLORS.white,
  },

  list: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    gap: SPACING.md,
  },
});
