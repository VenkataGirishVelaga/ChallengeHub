import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Screen from "@/components/Screen";
import AppText from "@/components/AppText";
import ChallengeCard from "../../components/challenges/ChallengeCard";

import { getChallenges } from "@/services/challenges";
import { getUser } from "@/services/authStorage";
import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";

export default function ChallengesScreen() {
  const [challenges, setChallenges] = useState([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const load = useCallback(async () => {
    const user = await getUser();
    setCurrentUserId(user?.id ?? null);

    const data = await getChallenges();
    setChallenges(data);
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

        <Pressable
          style={styles.createButton}
          onPress={() => router.push("/challenges/create")}
        >
          <Ionicons name="add" size={20} color={COLORS.white} />
          <AppText style={styles.createButtonText}>Create</AppText>
        </Pressable>
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

  createButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: 999,
  },

  createButtonText: {
    color: COLORS.white,
    fontWeight: "700",
  },

  list: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    gap: SPACING.md,
  },
});
